import { OotpDataExportStats } from ".";
import { PrimaryKey } from '../../types'

export class OotpDataPtCardListExportStats extends OotpDataExportStats {

    getPtCardListWriteScript () {

        const primaryKey: PrimaryKey = {
            column: "CardID",
            autoincrement: false
        };
        const constraints = undefined;

        return `
    ${this.generateLoadExportedDataScript(undefined, 'Cards', primaryKey, constraints)}
    ${this.generatePtCardListInsertCardsScript()}
        `
    }

    getCheckLiveUpdateScript () {

        const columnNames = this.expectedHeaders.map(h => h.databaseColumnName);
        const cardIdIndex = columnNames.indexOf('CardID');
        const cardValueIndex = columnNames.indexOf('CardValue');

        if (cardIdIndex == -1) {
            throw new Error("CardID not present in PtCardListExportStats expected headers");
        }

        if (cardValueIndex == -1) {
            throw new Error("CardValue not present in PtCardListExportStats expected headers");
        }

        const liveUpdateCardValuesScript = this.stats.map(statsRow => {
            return `(${statsRow[cardIdIndex].getValue()}, ${statsRow[cardValueIndex].getValue()})`
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

    private generatePtCardListInsertCardsScript () {
        
        const cardMarketColumnSpan = this.getCardMarketColumnSpan();
        const databaseColumnNames = [...this.expectedHeaders.slice(0, cardMarketColumnSpan.startIndex), ...this.expectedHeaders.slice(cardMarketColumnSpan.endIndex+1)].map(h => `[${h.databaseColumnName}]`).join(',');

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
    FROM temp.Cards tc
    JOIN temp.CurrentLiveUpdate lu on 1=1
    LEFT JOIN PtCard c ON c.CardID = tc.CardID AND c.LiveUpdateID = lu.LiveUpdateID
    WHERE c.PtCardID IS NULL AND tc.CardType = 1;

    INSERT INTO temp.CardInserts 
    SELECT tc.*, 0 as LiveUpdateID
    FROM temp.Cards tc 
    LEFT JOIN PtCard c on tc.CardID = c.CardID
    WHERE c.CardID IS NULL and tc.CardType != 1;

    INSERT INTO PtCard (${databaseColumnNames})
    SELECT ${databaseColumnNames}
    FROM temp.CardInserts
    ORDER BY CardID ASC;
        `

    }

    private checkIfLiveUpdateOccuredPart (recordsToCheck: string) {
        return `
    WITH 
    cteLiveUpdate AS (
        SELECT LiveUpdateID FROM LiveUpdate ORDER BY EffectiveDate DESC LIMIT 1
    ),
    cteCardOverall(CardID,CardValue) AS (
        VALUES ${recordsToCheck}
    )
    SELECT CASE WHEN t.CardValue != c.CardValue THEN 1 ELSE 0 END LiveUpdateOccured, c.CardID
    FROM cteCardOverall t
    JOIN PtCard c ON t.CardID = c.CardID
    JOIN cteLiveUpdate u ON c.LiveUpdateID = u.LiveUpdateID;     
        `
    }

    private getCardMarketColumnSpan () {
        
        const buyOrderHighIndex = this.expectedHeaders.map(h => h.nameInSource).indexOf('Buy Order High');
        const last10PriceVarIndex = this.expectedHeaders.map(h => h.nameInSource).indexOf('Last 10 Price(VAR)');

        if (buyOrderHighIndex === -1) {
            throw new Error("Buy Order High is not present in the PtCardListExport expected headers");
        }

        return {
            startIndex: buyOrderHighIndex,
            endIndex: last10PriceVarIndex,
        };

    }

}