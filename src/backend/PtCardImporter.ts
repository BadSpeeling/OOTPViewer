import { ProcessCardsStatus } from "../types";
import { IOotpExportReader } from "./card-loading/export-reader";
import { OotpDataExport, PtCardListExportScriptGenerator } from "./card-loading/export-stats";
import { Database } from "./database/Database";

export class PtCardImporter {

    private database: Database;
    private cards: Promise<OotpDataExport>;

    constructor (database: Database, exportReader: IOotpExportReader) {
        this.database = database;
        this.cards = exportReader.readExport();
    }

    private didLiveUpdateOccurFlagAsync = async (generator: PtCardListExportScriptGenerator) => {

        const script  = generator.getCheckLiveUpdateScript();
        const cardsInLiveUpdate = await this.database.getAllMapped<{LiveUpdateOccured: boolean, CardID: number}>(script);
        return cardsInLiveUpdate.find(card => card.LiveUpdateOccured);

    }

    importPtCardsAsync = async () => {

        const scriptGenerator: PtCardListExportScriptGenerator = new PtCardListExportScriptGenerator(await this.cards);
        const liveUpdateOccuredFlag = await this.didLiveUpdateOccurFlagAsync(scriptGenerator);

        if (!liveUpdateOccuredFlag) {
            const ptCardListExportScript = scriptGenerator.getImportScript();
            await this.database.execute(ptCardListExportScript);
            return ProcessCardsStatus.SUCCESS;
        }
        else {
            return ProcessCardsStatus.LIVE_UPDATE_NEEDED;
        }

    }

}