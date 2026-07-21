import { OotpDataExport } from './'

export class PtCardListExportScriptGenerator {

    private cardData: OotpDataExport;

    constructor (cardData: OotpDataExport) {
        this.cardData = cardData;
    }

    getImportScript() {
        
        const filter = undefined;

        const script = `
${this.cardData.generateLoadExportedDataScript(filter, 'PtCards')}
${this.getPtCardListWriteScript()}
        `

        return script;    
    
    }

    private getPtCardListWriteScript () {

        const databaseColumnNames = [...this.cardData.sliceColumns('CardTitle', 'BuyOrderHigh'), ...this.cardData.sliceColumns('date')].map(h => `[${h.databaseColumnName}]`).join(',');

        return `
DROP TABLE IF EXISTS temp.CurrentLiveUpdate;
CREATE TABLE temp.CurrentLiveUpdate AS 
SELECT LiveUpdateID,DATETIME(EffectiveDate,'auto')
FROM LiveUpdate
ORDER BY EffectiveDate DESC
LIMIT 1;

DROP TABLE IF EXISTS temp.CardInserts;
CREATE TABLE temp.CardInserts AS
SELECT tc.*, lu.LiveUpdateID
FROM temp.PtCards tc
JOIN temp.CurrentLiveUpdate lu on 1=1
LEFT JOIN PtCard c ON c.CardID = tc.CardID AND c.LiveUpdateID = lu.LiveUpdateID
WHERE c.PtCardID IS NULL AND tc.CardType = 1;

INSERT INTO temp.CardInserts 
SELECT tc.*, 0 as LiveUpdateID
FROM temp.PtCards tc 
LEFT JOIN PtCard c on tc.CardID = c.CardID
WHERE c.CardID IS NULL and tc.CardType != 1;

INSERT INTO PtCard (${databaseColumnNames})
SELECT ${databaseColumnNames}
FROM temp.CardInserts
ORDER BY CardID ASC;
        `
    }

    getCheckLiveUpdateScript () {

        const liveUpdateCheckerValues = this.cardData.getSelectedValues(['CardID','CardValue']);

        const liveUpdateCardValuesScript = liveUpdateCheckerValues.map(liveUpdateCheckerValue => {
            return `(${liveUpdateCheckerValue.join(',')})`
        }).join(',\n')

        return `
WITH 
cteLiveUpdate AS (
    SELECT LiveUpdateID FROM LiveUpdate ORDER BY EffectiveDate DESC LIMIT 1
),
cteCardOverall(CardID,CardValue) AS (
    VALUES ${liveUpdateCardValuesScript}
)
SELECT CASE WHEN t.CardValue != c.CardValue THEN 1 ELSE 0 END LiveUpdateOccured, c.CardID
FROM cteCardOverall t
JOIN PtCard c ON t.CardID = c.CardID
JOIN cteLiveUpdate u ON c.LiveUpdateID = u.LiveUpdateID;     
        `        

    }

}