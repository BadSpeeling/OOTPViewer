import { OotpDataExport } from ".";

export class BattingExportScriptGenerator {

    private cardData: OotpDataExport;
    private statsBatchID: number;

    constructor (cardData: OotpDataExport, statsBatchID: number) {
        this.cardData = cardData;
        this.statsBatchID = statsBatchID;
    }

    getExportWriteScript() {
        
        const gamesIndex = this.cardData.getColumnIndex('G');
        const dataFilter = (stats: string[][]) => stats.filter((r => r[gamesIndex] !== '' && r[gamesIndex] !== '0'))

        const script = `
${this.cardData.generateLoadExportedDataScript(dataFilter, 'BattingStats')}
${this.getTournamentBattingStatsWriteScript()}
        `

        return script;

    }

    private getTournamentBattingStatsWriteScript () {
        
        const databaseColumnNames = this.cardData.sliceColumns('G').map(h => `[${h.databaseColumnName}]`).join(',');

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
SELECT c.PtCardID, bs.TeamName, ${this.statsBatchID}, ${databaseColumnNames}
FROM temp.BattingStats bs
JOIN temp.Cards c ON bs.CardID = c.CardID
        `

    }    

}