import { CsvDataColumn,CsvRecord } from "../types"
import {parseCsvDataColumnToDatatype} from "../../utilities"

export const ptCardListLoadScript = (records: CsvRecord[], columns: CsvDataColumn[]) => {
    return `
${ptCardListRawDataLoadPart(records, columns)}
${ptCardListInsertCardsPart()}
`
}

const ptCardListRawDataLoadPart = (records: CsvRecord[], columns: CsvDataColumn[]) => {

    const createHeadersPart = columns.map((column) => `[${column.databaseColumnName}] ${parseCsvDataColumnToDatatype(column.type)}`).join(', ');
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
DROP TABLE IF EXISTS temp.Cards;
CREATE TABLE temp.Cards (${createHeadersPart});

CREATE INDEX temp.pkPtCards ON Cards (CardID);

INSERT INTO temp.Cards (${insertHeadersPart})
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
LEFT JOIN Card c ON c.CardID = tc.CardID
LEFT JOIN temp.CurrentLiveUpdate u ON c.LiveUpdateID = u.LiveUpdateID
WHERE u.LiveUpdateID IS NULL AND tc.CardType = 1;

INSERT INTO temp.CardInserts 
SELECT tc.*, 0 as LiveUpdateID
FROM temp.Cards tc 
LEFT JOIN Card c on tc.CardID = c.CardID
WHERE c.CardID IS NULL and tc.CardType != 1;

INSERT INTO Card ("CardID","CardTitle","CardValue","CardType","CardSubType","Year","Peak","Team","FirstName","LastName","NickName","UniformNumber","DayOB","MonthOB","YearOB","Bats","Throws","Position","PitcherRole","Contact","Gap","Power","Eye","AvoidKs","BABIP","ContactvL","GapvL","PowervL","EyevL","AvoidKvL","BABIPvL","ContactvR","GapvR","PowervR","EyevR","AvoidKvR","BABIPvR","GBHitterType","FBHitterType","BattedBallType","Speed","StealRate","Stealing","Baserunning","Sacbunt","Buntforhit","Stuff","Movement","Control","pHR","pBABIP","StuffvL","MovementvL","ControlvL","pHRvL","pBABIPvL","StuffvR","MovementvR","ControlvR","pHRvR","pBABIPvR","Fastball","Slider","Curveball","Changeup","Cutter","Sinker","Splitter","Forkball","Screwball","Circlechange","Knucklecurve","Knuckleball","Stamina","Hold","GB","Velocity","ArmSlot","Height","InfieldRange","InfieldError","InfieldArm","DP","CatcherAbil","CatcherFrame","CatcherArm","OFRange","OFError","OFArm","PosRatingP","PosRatingC","PosRating1B","PosRating2B","PosRating3B","PosRatingSS","PosRatingLF","PosRatingCF","PosRatingRF","LearnC","Learn1B","Learn2B","Learn3B","LearnSS","LearnLF","LearnCF","LearnRF","era","MissionValue","limit","owned","brefid","date","LiveUpdateID")
SELECT "CardID","CardTitle","CardValue","CardType","CardSubType","Year","Peak","Team","FirstName","LastName","NickName","UniformNumber","DayOB","MonthOB","YearOB","Bats","Throws","Position","PitcherRole","Contact","Gap","Power","Eye","AvoidKs","BABIP","ContactvL","GapvL","PowervL","EyevL","AvoidKvL","BABIPvL","ContactvR","GapvR","PowervR","EyevR","AvoidKvR","BABIPvR","GBHitterType","FBHitterType","BattedBallType","Speed","StealRate","Stealing","Baserunning","Sacbunt","Buntforhit","Stuff","Movement","Control","pHR","pBABIP","StuffvL","MovementvL","ControlvL","pHRvL","pBABIPvL","StuffvR","MovementvR","ControlvR","pHRvR","pBABIPvR","Fastball","Slider","Curveball","Changeup","Cutter","Sinker","Splitter","Forkball","Screwball","Circlechange","Knucklecurve","Knuckleball","Stamina","Hold","GB","Velocity","ArmSlot","Height","InfieldRange","InfieldError","InfieldArm","DP","CatcherAbil","CatcherFrame","CatcherArm","OFRange","OFError","OFArm","PosRatingP","PosRatingC","PosRating1B","PosRating2B","PosRating3B","PosRatingSS","PosRatingLF","PosRatingCF","PosRatingRF","LearnC","Learn1B","Learn2B","Learn3B","LearnSS","LearnLF","LearnCF","LearnRF","era","MissionValue","limit","owned","brefid","date","LiveUpdateID"
FROM temp.CardInserts;
    `

}
