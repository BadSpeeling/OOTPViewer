import { OotpDataExportStats } from ".";
import { Constraint, OotpExportDataColumn, PrimaryKey } from "../../types";
import { PtCardListValue } from "../export-reader";

export class OotpDataPitchingExportStats extends OotpDataExportStats {

    private gamesIndex: number

    constructor (expectedHeaders: OotpExportDataColumn[]) {
        super(expectedHeaders);
        this.gamesIndex = expectedHeaders.map(h => h.nameInSource).indexOf('G');
    }

    getTournamentPitchingStatsWriteScript (statsBatchID: number) {

        const primaryKey = undefined;
        const constraints = undefined;

        const filterStats = (stats: PtCardListValue[][]) => stats.filter((r => (r[this.gamesIndex].getValue() as number) > 0))

        return `
    ${this.generateLoadExportedDataScript(filterStats, 'PitchingStats', primaryKey, constraints)}
    ${this.generateTournamentPitchingStatsWriteScript(statsBatchID)}
        `

    }

    private generateTournamentPitchingStatsWriteScript (statsBatchID: number) {

        const databaseColumnNames = this.expectedHeaders.slice(this.gamesIndex).map(h => `[${h.databaseColumnName}]`).join(',');

        return `
    CREATE TABLE temp.Cards("CardID" INTEGER, "LiveUpdateID" INTEGER, "PtCardID" INTEGER);
    CREATE INDEX temp.iCards ON Cards("CardID","LiveUpdateID");

    INSERT INTO temp.Cards ("CardID", "LiveUpdateID", "PtCardID")
    SELECT DISTINCT pt.CardID,pt.LiveUpdateID,pt.PtCardID
    FROM temp.PitchingStats t
    CROSS JOIN (
        SELECT LiveUpdateID
        FROM LiveUpdate
        ORDER BY EffectiveDate DESC
        LIMIT 1
    ) lu
    JOIN PtCard pt ON t.CardID = pt.CardID AND lu.LiveUpdateID = pt.LiveUpdateID
    WHERE pt.CardType = 1;

    INSERT INTO temp.Cards ("CardID", "LiveUpdateID", "PtCardID")
    SELECT DISTINCT pt.CardID,pt.LiveUpdateID,pt.PtCardID
    FROM temp.PitchingStats t
    JOIN PtCard pt ON t.CardID = pt.CardID AND pt.LiveUpdateID = 0
    WHERE pt.CardType != 1;

    INSERT INTO main.PitchingStats (PtCardID, TeamName, StatsBatchID, ${databaseColumnNames})
    SELECT c.PtCardID, bs.TeamName, ${statsBatchID}, ${databaseColumnNames}
    FROM temp.PitchingStats bs
    JOIN temp.Cards c ON bs.CardID = c.CardID
        `
    }


}