import { OotpDataExportStats } from ".";
import { OotpExportDataColumn } from "../../types";
import { PtCardListValue } from "../export-reader";

export class OotpDataBattingExportStats extends OotpDataExportStats {

    private gamesIndex: number

    constructor (expectedHeaders: OotpExportDataColumn[]) {
        super(expectedHeaders);
        this.gamesIndex = expectedHeaders.map(h => h.nameInSource).indexOf('G');
    }

    getTournamentBattingStatsWriteScript (statsBatchID: number) {

        const primaryKey = undefined;
        const constraints = undefined;

        const filterStats = (stats: PtCardListValue[][]) => stats.filter((r => (r[this.gamesIndex].getValue() as number) > 0))

            return `
        ${this.generateLoadExportedDataScript(filterStats, 'BattingStats', primaryKey, constraints)}
        ${this.generateTournamentBattingStatsWriteScript(statsBatchID)}
        `

    }    

    private generateTournamentBattingStatsWriteScript (statsBatchID: number) {

        const databaseColumnNames = this.expectedHeaders.slice(this.gamesIndex).map(h => `[${h.databaseColumnName}]`).join(',');

        return `
CREATE TABLE temp.Cards("CardID" INTEGER, "LiveUpdateID" INTEGER, "PtCardID" INTEGER);
CREATE INDEX temp.iCards ON Cards("CardID","LiveUpdateID");

INSERT INTO temp.Cards ("CardID", "LiveUpdateID", "PtCardID")
SELECT DISTINCT pt.CardID,pt.LiveUpdateID,pt.PtCardID
FROM temp.BattingStats t
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
FROM temp.BattingStats t
JOIN PtCard pt ON t.CardID = pt.CardID AND pt.LiveUpdateID = 0
WHERE pt.CardType != 1;

INSERT INTO main.BattingStats (PtCardID, TeamName, StatsBatchID, ${databaseColumnNames})
SELECT c.PtCardID, bs.TeamName, ${statsBatchID}, ${databaseColumnNames}
FROM temp.BattingStats bs
JOIN temp.Cards c ON bs.CardID = c.CardID
        `
    }

}