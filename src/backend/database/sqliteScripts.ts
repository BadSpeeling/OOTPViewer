import { CsvDataColumn,CsvRecord,Constraint } from "../types"
import {PtPlayerStats} from "../../types"
import {parseCsvDataColumnToDatatype} from "../../utilities"
import {CsvDataToTempTable} from "./Datatable"

import { statsExport } from "../../../json/csvColumns.json"

export const ptCardListLoadScript = (records: CsvRecord[], columns: CsvDataColumn[]) => {

    const primaryKey = 'CardID';
    const constraints = undefined;

    return `
${rawDataLoadPart('Cards', records, columns, primaryKey, constraints)}
${ptCardListInsertCardsPart()}
`
}

const rawDataLoadPart = (tableName: string, records: CsvRecord[], columns: CsvDataColumn[], primaryKey: string, constraints?: Constraint[]) => {

    const datatable = CsvDataToTempTable(tableName, columns, primaryKey, constraints);

    const insertHeadersPart = columns.map((column) => `[${column.databaseColumnName}]`).join(', ');
    const recordsPart = records.map((record) => {
        return "(" + columns.map((column) => {
            
            const value = record[column.nameInSource];

            if (value) {
                switch (column.type) {
                    case "TEXT":
                        return `"${value}"`;
                    case "DATETIME":
                        return Date.parse(value.toString())/1000
                    default:
                        return value;
                }
            }
            else {
                switch (column.type) {
                    case "TEXT":
                        return "\"\"";
                    case "INTEGER":
                    case "REAL":
                    default:
                        return 0;
                }
            }

        }).join(', ') + ")";
    }).join(',\n');

    return `
DROP TABLE IF EXISTS temp.${tableName};
${datatable.createTableString()}

INSERT INTO temp.${tableName} (${insertHeadersPart})
VALUES 
${recordsPart};
    `;

}

const ptCardListInsertCardsPart = () => {

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

INSERT INTO PtCard ("CardID","CardTitle","CardValue","CardType","CardSubType","Year","Peak","Team","FirstName","LastName","NickName","UniformNumber","DayOB","MonthOB","YearOB","Bats","Throws","Position","PitcherRole","Contact","Gap","Power","Eye","AvoidKs","BABIP","ContactvL","GapvL","PowervL","EyevL","AvoidKvL","BABIPvL","ContactvR","GapvR","PowervR","EyevR","AvoidKvR","BABIPvR","GBHitterType","FBHitterType","BattedBallType","Speed","StealRate","Stealing","Baserunning","Sacbunt","Buntforhit","Stuff","Movement","Control","pHR","pBABIP","StuffvL","MovementvL","ControlvL","pHRvL","pBABIPvL","StuffvR","MovementvR","ControlvR","pHRvR","pBABIPvR","Fastball","Slider","Curveball","Changeup","Cutter","Sinker","Splitter","Forkball","Screwball","Circlechange","Knucklecurve","Knuckleball","Stamina","Hold","GB","Velocity","ArmSlot","Height","InfieldRange","InfieldError","InfieldArm","DP","CatcherAbil","CatcherFrame","CatcherArm","OFRange","OFError","OFArm","PosRatingP","PosRatingC","PosRating1B","PosRating2B","PosRating3B","PosRatingSS","PosRatingLF","PosRatingCF","PosRatingRF","LearnC","Learn1B","Learn2B","Learn3B","LearnSS","LearnLF","LearnCF","LearnRF","era","MissionValue","limit","owned","brefid","date","LiveUpdateID","CardBadge","CardSeries","Franchise")
SELECT "CardID","CardTitle","CardValue","CardType","CardSubType","Year","Peak","Team","FirstName","LastName","NickName","UniformNumber","DayOB","MonthOB","YearOB","Bats","Throws","Position","PitcherRole","Contact","Gap","Power","Eye","AvoidKs","BABIP","ContactvL","GapvL","PowervL","EyevL","AvoidKvL","BABIPvL","ContactvR","GapvR","PowervR","EyevR","AvoidKvR","BABIPvR","GBHitterType","FBHitterType","BattedBallType","Speed","StealRate","Stealing","Baserunning","Sacbunt","Buntforhit","Stuff","Movement","Control","pHR","pBABIP","StuffvL","MovementvL","ControlvL","pHRvL","pBABIPvL","StuffvR","MovementvR","ControlvR","pHRvR","pBABIPvR","Fastball","Slider","Curveball","Changeup","Cutter","Sinker","Splitter","Forkball","Screwball","Circlechange","Knucklecurve","Knuckleball","Stamina","Hold","GB","Velocity","ArmSlot","Height","InfieldRange","InfieldError","InfieldArm","DP","CatcherAbil","CatcherFrame","CatcherArm","OFRange","OFError","OFArm","PosRatingP","PosRatingC","PosRating1B","PosRating2B","PosRating3B","PosRatingSS","PosRatingLF","PosRatingCF","PosRatingRF","LearnC","Learn1B","Learn2B","Learn3B","LearnSS","LearnLF","LearnCF","LearnRF","era","MissionValue","limit","owned","brefid","date","LiveUpdateID","CardBadge","CardSeries","Franchise"
FROM temp.CardInserts
ORDER BY CardID ASC;
    `

}

export const tournamentBattingStatsWriteScript = (records: PtPlayerStats[], liveUpdateID: number, tournamentID: number) => {

    const primaryKey = undefined;
    const constraint: Constraint = {
        type: "UNIQUE",
        fields: ["CardID","LiveUpdateID"],
        name: "ucCardLiveUpdate",
    };

    const battingRecords = records.map((record) => {
        return {
            ...record.generalStats,
            ...record.battingStats,
            LiveUpdateID: liveUpdateID,
        }
    })
    const columns = [...statsExport.general,...statsExport.batting];

    const battingRawData = rawDataLoadPart('BattingStats', battingRecords, columns, primaryKey, [constraint]);

    return `
${battingRawData}
${tournamentBattingStatsWriteLogicPart(tournamentID)}
`

}

const tournamentBattingStatsWriteLogicPart = (tournamentID: number) => {

    return `
CREATE TABLE temp.Cards("CardID" INTEGER, "LiveUpdateID" INTEGER, "PtCardID" INTEGER);
CREATE INDEX temp.iCards ON Cards("CardID","LiveUpdateID");

UPDATE temp.BattingStats
SET LiveUpdateID = 0
FROM PtCard pt
WHERE temp.BattingStats.CardID = pt.CardID AND pt.CardType != 1;

INSERT INTO temp.Cards ("CardID", "LiveUpdateID", "PtCardID")
SELECT pt.CardID,pt.LiveUpdateID,pt.PtCardID
FROM temp.BattingStats t
JOIN PtCard pt ON t.CardID = pt.CardID AND t.LiveUpdateID = pt.LiveUpdateID
WHERE pt.CardType = 1;

INSERT INTO temp.Cards ("CardID", "LiveUpdateID", "PtCardID")
SELECT pt.CardID,pt.LiveUpdateID,pt.PtCardID
FROM temp.BattingStats t
JOIN PtCard pt ON t.CardID = pt.CardID AND pt.LiveUpdateID = 0
WHERE pt.CardType != 1;

INSERT INTO main.BattingStats (PtCardID, TournamentStatsID, [G], [GS], [PA], [AB], [H], [1B], [2B], [3B], [HR], [RBI], [R], [BB], [BB%], [IBB], [HP], [SH], [SF], [CI], [SO], [SO%], [GIDP], [EBH], [TB], [AVG], [OBP], [SLG], [RC], [RC/27], [ISO], [wOBA], [OPS], [OPS+], [BABIP], [WPA], [wRC], [wRC+], [wRAA], [WAR], [PI/PA], [SB], [CS], [SB%], [BatR], [wSB], [UBR], [BsR])
SELECT c.PtCardID, ${tournamentID}, [G], [GS], [PA], [AB], [H], [1B], [2B], [3B], [HR], [RBI], [R], [BB], [BB%], [IBB], [HP], [SH], [SF], [CI], [SO], [SO%], [GIDP], [EBH], [TB], [AVG], [OBP], [SLG], [RC], [RC/27], [ISO], [wOBA], [OPS], [OPS+], [BABIP], [WPA], [wRC], [wRC+], [wRAA], [WAR], [PI/PA], [SB], [CS], [SB%], [BatR], [wSB], [UBR], [BsR]
FROM temp.BattingStats bs
JOIN temp.Cards c ON bs.CardID = c.CardID AND bs.LiveUpdateID = c.LiveUpdateID
GROUP BY c.PtCardID;
    `
}