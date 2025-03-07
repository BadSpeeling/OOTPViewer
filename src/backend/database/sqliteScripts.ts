import { CsvDataColumn,CsvRecord,Constraint } from "../types"
import {parseCsvDataColumnToDatatype} from "../../utilities"
import {CsvDataToTempTable} from "./Datatable"

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

            switch (column.type) {
                case "TEXT":
                    return `"${value}"`;
                default:
                    return value;
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
LEFT JOIN PtCard c ON c.CardID = tc.CardID
LEFT JOIN temp.CurrentLiveUpdate u ON c.LiveUpdateID = u.LiveUpdateID
WHERE u.LiveUpdateID IS NULL AND tc.CardType = 1;

INSERT INTO temp.CardInserts 
SELECT tc.*, 0 as LiveUpdateID
FROM temp.Cards tc 
LEFT JOIN PtCard c on tc.CardID = c.CardID
WHERE c.CardID IS NULL and tc.CardType != 1;

INSERT INTO PtCard ("CardID","CardTitle","CardValue","CardType","CardSubType","Year","Peak","Team","FirstName","LastName","NickName","UniformNumber","DayOB","MonthOB","YearOB","Bats","Throws","Position","PitcherRole","Contact","Gap","Power","Eye","AvoidKs","BABIP","ContactvL","GapvL","PowervL","EyevL","AvoidKvL","BABIPvL","ContactvR","GapvR","PowervR","EyevR","AvoidKvR","BABIPvR","GBHitterType","FBHitterType","BattedBallType","Speed","StealRate","Stealing","Baserunning","Sacbunt","Buntforhit","Stuff","Movement","Control","pHR","pBABIP","StuffvL","MovementvL","ControlvL","pHRvL","pBABIPvL","StuffvR","MovementvR","ControlvR","pHRvR","pBABIPvR","Fastball","Slider","Curveball","Changeup","Cutter","Sinker","Splitter","Forkball","Screwball","Circlechange","Knucklecurve","Knuckleball","Stamina","Hold","GB","Velocity","ArmSlot","Height","InfieldRange","InfieldError","InfieldArm","DP","CatcherAbil","CatcherFrame","CatcherArm","OFRange","OFError","OFArm","PosRatingP","PosRatingC","PosRating1B","PosRating2B","PosRating3B","PosRatingSS","PosRatingLF","PosRatingCF","PosRatingRF","LearnC","Learn1B","Learn2B","Learn3B","LearnSS","LearnLF","LearnCF","LearnRF","era","MissionValue","limit","owned","brefid","date","LiveUpdateID")
SELECT "CardID","CardTitle","CardValue","CardType","CardSubType","Year","Peak","Team","FirstName","LastName","NickName","UniformNumber","DayOB","MonthOB","YearOB","Bats","Throws","Position","PitcherRole","Contact","Gap","Power","Eye","AvoidKs","BABIP","ContactvL","GapvL","PowervL","EyevL","AvoidKvL","BABIPvL","ContactvR","GapvR","PowervR","EyevR","AvoidKvR","BABIPvR","GBHitterType","FBHitterType","BattedBallType","Speed","StealRate","Stealing","Baserunning","Sacbunt","Buntforhit","Stuff","Movement","Control","pHR","pBABIP","StuffvL","MovementvL","ControlvL","pHRvL","pBABIPvL","StuffvR","MovementvR","ControlvR","pHRvR","pBABIPvR","Fastball","Slider","Curveball","Changeup","Cutter","Sinker","Splitter","Forkball","Screwball","Circlechange","Knucklecurve","Knuckleball","Stamina","Hold","GB","Velocity","ArmSlot","Height","InfieldRange","InfieldError","InfieldArm","DP","CatcherAbil","CatcherFrame","CatcherArm","OFRange","OFError","OFArm","PosRatingP","PosRatingC","PosRating1B","PosRating2B","PosRating3B","PosRatingSS","PosRatingLF","PosRatingCF","PosRatingRF","LearnC","Learn1B","Learn2B","Learn3B","LearnSS","LearnLF","LearnCF","LearnRF","era","MissionValue","limit","owned","brefid","date","LiveUpdateID"
FROM temp.CardInserts;
    `

}

export const tournamentStatsWriteScript = (records: CsvRecord[], columns: CsvDataColumn[]) => {

    const primaryKey = undefined;
    const constraint: Constraint = {
        fields: ["CardID","LiveUpdateID"],
        name: "ucCardLiveUpdate",
    };

    const tournamentRawData = rawDataLoadPart('Stats', records, columns, primaryKey, [constraint]);

}

