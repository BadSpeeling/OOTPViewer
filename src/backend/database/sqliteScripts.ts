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

export const tournamentBattingStatsWriteScript = (records: PtPlayerStats[], liveUpdateID: number, statsBatchID: number) => {

    const primaryKey = undefined;

    const battingRecords = records.map((record) => {
        return {
            ...record.generalStats,
            ...record.battingStats,
            LiveUpdateID: liveUpdateID,
        }
    })
    const columns = [...statsExport.general,...statsExport.batting];

    const battingRawData = rawDataLoadPart('BattingStats', battingRecords, columns, primaryKey);

    return `
${battingRawData}
${tournamentBattingStatsWriteLogicPart(statsBatchID)}
`

}

const tournamentBattingStatsWriteLogicPart = (statsBatchID: number) => {

    return `
CREATE TABLE temp.Cards("CardID" INTEGER, "LiveUpdateID" INTEGER, "PtCardID" INTEGER);
CREATE INDEX temp.iCards ON Cards("CardID","LiveUpdateID");

UPDATE temp.BattingStats
SET LiveUpdateID = 0
FROM PtCard pt
WHERE temp.BattingStats.CardID = pt.CardID AND pt.CardType != 1;

INSERT INTO temp.Cards ("CardID", "LiveUpdateID", "PtCardID")
SELECT DISTINCT pt.CardID,pt.LiveUpdateID,pt.PtCardID
FROM temp.BattingStats t
JOIN PtCard pt ON t.CardID = pt.CardID AND t.LiveUpdateID = pt.LiveUpdateID
WHERE pt.CardType = 1;

INSERT INTO temp.Cards ("CardID", "LiveUpdateID", "PtCardID")
SELECT DISTINCT pt.CardID,pt.LiveUpdateID,pt.PtCardID
FROM temp.BattingStats t
JOIN PtCard pt ON t.CardID = pt.CardID AND pt.LiveUpdateID = 0
WHERE pt.CardType != 1;

INSERT INTO main.BattingStats (PtCardID, TeamName, StatsBatchID, [G], [GS], [PA], [AB], [H], [1B], [2B], [3B], [HR], [RBI], [R], [BB], [BB%], [IBB], [HP], [SH], [SF], [CI], [SO], [SO%], [GIDP], [EBH], [TB], [AVG], [OBP], [SLG], [RC], [RC/27], [ISO], [wOBA], [OPS], [OPS+], [BABIP], [WPA], [wRC], [wRC+], [wRAA], [WAR], [PI/PA], [SB], [CS], [SB%], [BatR], [wSB], [UBR], [BsR])
SELECT c.PtCardID, bs.TeamName, ${statsBatchID}, [G], [GS], [PA], [AB], [H], [1B], [2B], [3B], [HR], [RBI], [R], [BB], [BB%], [IBB], [HP], [SH], [SF], [CI], [SO], [SO%], [GIDP], [EBH], [TB], [AVG], [OBP], [SLG], [RC], [RC/27], [ISO], [wOBA], [OPS], [OPS+], [BABIP], [WPA], [wRC], [wRC+], [wRAA], [WAR], [PI/PA], [SB], [CS], [SB%], [BatR], [wSB], [UBR], [BsR]
FROM temp.BattingStats bs
JOIN temp.Cards c ON bs.CardID = c.CardID AND bs.LiveUpdateID = c.LiveUpdateID
    `
}

export const tournamentPitchingStatsWriteScript = (records: PtPlayerStats[], liveUpdateID: number, statsBatchID: number) => {

    const primaryKey = undefined;

    const pitchingRecords = records.map((record) => {
        return {
            ...record.generalStats,
            ...record.pitchingStats,
            LiveUpdateID: liveUpdateID,
        }
    })
    const columns = [...statsExport.general,...statsExport.pitching];

    const pitchingRawData = rawDataLoadPart('PitchingStats', pitchingRecords, columns, primaryKey);

    return `
${pitchingRawData}
${tournamentPitchingStatsWriteLogicPart(statsBatchID)}
`

}

const tournamentPitchingStatsWriteLogicPart = (statsBatchID: number) => {

    return `
CREATE TABLE temp.Cards("CardID" INTEGER, "LiveUpdateID" INTEGER, "PtCardID" INTEGER);
CREATE INDEX temp.iCards ON Cards("CardID","LiveUpdateID");

UPDATE temp.PitchingStats
SET LiveUpdateID = 0
FROM PtCard pt
WHERE temp.PitchingStats.CardID = pt.CardID AND pt.CardType != 1;

INSERT INTO temp.Cards ("CardID", "LiveUpdateID", "PtCardID")
SELECT DISTINCT pt.CardID,pt.LiveUpdateID,pt.PtCardID
FROM temp.PitchingStats t
JOIN PtCard pt ON t.CardID = pt.CardID AND t.LiveUpdateID = pt.LiveUpdateID
WHERE pt.CardType = 1;

INSERT INTO temp.Cards ("CardID", "LiveUpdateID", "PtCardID")
SELECT DISTINCT pt.CardID,pt.LiveUpdateID,pt.PtCardID
FROM temp.PitchingStats t
JOIN PtCard pt ON t.CardID = pt.CardID AND pt.LiveUpdateID = 0
WHERE pt.CardType != 1;

INSERT INTO main.PitchingStats (PtCardID, TeamName, StatsBatchID, [G],[GS],[W],[L],[WIN%],[SVO],[SV],[SV%],[BS],[BS%],[HLD],[SD],[MD],[IP],[BF],[AB],[HA],[1B],[2B],[3B],[HR],[TB],[R],[ER],[BB],[IBB],[K],[HP],[ERA],[AVG],[OBP],[SLG],[OPS],[BABIP],[WHIP],[BRA/9],[HR/9],[H/9],[BB/9],[K/9],[K/BB],[K%],[BB%],[K%-BB%],[SH],[SF],[WP],[BK],[CI],[DP],[RA],[GF],[IR],[IRS],[IRS%],[LOB%],[pLi],[GF%],[QS],[QS%],[CG],[CG%],[SHO],[PPG],[RS],[RSG],[PI],[GB],[FB],[GO%],[SB],[CS],[ERA+],[FIP],[FIP-],[WPA],[WAR],[rWAR],[SIERA])
SELECT c.PtCardID, bs.TeamName, ${statsBatchID}, [G],[GS],[W],[L],[WIN%],[SVO],[SV],[SV%],[BS],[BS%],[HLD],[SD],[MD],[IP],[BF],[AB],[HA],[1B],[2B],[3B],[HR],[TB],[R],[ER],[BB],[IBB],[K],[HP],[ERA],[AVG],[OBP],[SLG],[OPS],[BABIP],[WHIP],[BRA/9],[HR/9],[H/9],[BB/9],[K/9],[K/BB],[K%],[BB%],[K%-BB%],[SH],[SF],[WP],[BK],[CI],[DP],[RA],[GF],[IR],[IRS],[IRS%],[LOB%],[pLi],[GF%],[QS],[QS%],[CG],[CG%],[SHO],[PPG],[RS],[RSG],[PI],[GB],[FB],[GO%],[SB],[CS],[ERA+],[FIP],[FIP-],[WPA],[WAR],[rWAR],[SIERA]
FROM temp.PitchingStats bs
JOIN temp.Cards c ON bs.CardID = c.CardID AND bs.LiveUpdateID = c.LiveUpdateID
    `
}

export const getTournamentBattingStatsScript = (tournamentTypeID: number) => {
    return `
select bs.PtCardID,SUM([G]) [G], SUM([GS]) [GS], SUM([PA]) [PA], SUM([AB]) [AB], SUM([H]) [H], SUM([1B]) [1B], SUM([2B]) [2B], SUM([3B]) [3B], SUM([HR]) [HR], SUM([RBI]) [RBI], SUM([R]) [R], SUM([BB]) [BB], SUM([IBB]) [IBB], SUM([HP]) [HP], SUM([SH]) [SH], SUM([SF]) [SF], SUM([CI]) [CI], SUM([SO]) [SO], SUM([GIDP]) [GIDP], SUM([EBH]) [EBH], SUM([TB]) [TB], SUM([RC]) [RC], SUM([WPA]) [WPA], SUM([wRC]) [wRC], ROUND(SUM([wRAA]),1) [wRAA], ROUND(SUM([WAR]),1) [WAR], SUM([SB]) [SB], SUM([CS]) [CS], SUM([BatR]) [BatR], SUM([wSB]) [wSB], SUM([UBR]) [UBR], SUM([BsR]) [BsR]
from BattingStats bs
join StatsBatch sb on bs.StatsBatchID = sb.StatsBatchID
where TournamentTypeID = ${tournamentTypeID}
group by bs.PtCardID
order by bs.PtCardID ASC;
`
}

export const getTournamentPitchingStatsScript = (tournamentTypeID: number) => {

    return ` 
select ps.PtCardID,SUM([G]) [G], SUM([GS]) [GS], SUM([W]) [W], SUM([L]) [L], SUM([WIN%]) [WIN%], SUM([SVO]) [SVO], SUM([SV]) [SV], SUM([SV%]) [SV%], SUM([BS]) [BS], SUM([BS%]) [BS%], SUM([HLD]) [HLD], SUM([SD]) [SD], SUM([MD]) [MD], SUM([BF]) [BF], SUM([AB]) [AB], SUM([HA]) [HA], SUM([1B]) [1B], SUM([2B]) [2B], SUM([3B]) [3B], SUM([HR]) [HR], SUM([TB]) [TB], SUM([R]) [R], SUM([ER]) [ER], SUM([BB]) [BB], SUM([IBB]) [IBB], SUM([K]) [K], SUM([HP]) [HP], SUM(ps.[ERA]) [ERA], SUM([AVG]) [AVG], SUM([OBP]) [OBP], SUM([SLG]) [SLG], SUM([OPS]) [OPS], SUM(ps.[BABIP]) [BABIP], SUM([WHIP]) [WHIP], SUM([BRA/9]) [BRA/9], SUM([HR/9]) [HR/9], SUM([H/9]) [H/9], SUM([BB/9]) [BB/9], SUM([K/9]) [K/9], SUM([K/BB]) [K/BB], SUM([K%]) [K%], SUM([BB%]) [BB%], SUM([SH]) [SH], SUM([SF]) [SF], SUM([WP]) [WP], SUM([BK]) [BK], SUM([CI]) [CI], SUM(ps.[DP]) [DP], SUM([RA]) [RA], SUM([GF]) [GF], SUM([IR]) [IR], SUM([IRS]) [IRS], SUM([IRS%]) [IRS%], SUM([LOB%]) [LOB%], SUM([pLi]) [pLi], SUM([GF%]) [GF%], SUM([QS]) [QS], SUM([QS%]) [QS%], SUM([CG]) [CG], SUM([CG%]) [CG%], SUM([SHO]) [SHO], SUM([PPG]) [PPG], SUM([RS]) [RS], SUM([RSG]) [RSG], SUM([PI]) [PI], SUM(ps.[GB]) [GB], SUM([FB]) [FB], SUM([GO%]) [GO%], SUM([SB]) [SB], SUM([CS]) [CS], SUM([ERA+]) [ERA+], SUM([FIP]) [FIP], ROUND(SUM([WPA]),3) [WPA], ROUND(SUM([WAR]),1) [WAR], ROUND(SUM([rWAR]),1) [rWAR], ROUND(SUM([SIERA])) [SIERA], SUM(round([IP],0) * 3 + (case when instr(cast([IP] as text),'.') = 0 then 0 else substr(cast([IP] as text), instr(cast([IP] as text),'.')+1) end)) Outs
from PitchingStats ps
join StatsBatch sb on ps.StatsBatchID = sb.StatsBatchID
where TournamentTypeID = ${tournamentTypeID}
group by ps.PtCardID
order by ps.PtCardID ASC;
`
}

export const getLeagueBattingStatsScript = (statsBatchID: number[]) => {
    return `
select bs.PtCardID,json_extract([Description], '$.Year') [LeagueYear],SUM([G]) [G], SUM([GS]) [GS], SUM([PA]) [PA], SUM([AB]) [AB], SUM([H]) [H], SUM([1B]) [1B], SUM([2B]) [2B], SUM([3B]) [3B], SUM([HR]) [HR], SUM([RBI]) [RBI], SUM([R]) [R], SUM([BB]) [BB], SUM([IBB]) [IBB], SUM([HP]) [HP], SUM([SH]) [SH], SUM([SF]) [SF], SUM([CI]) [CI], SUM([SO]) [SO], SUM([GIDP]) [GIDP], SUM([EBH]) [EBH], SUM([TB]) [TB], SUM([RC]) [RC], SUM([WPA]) [WPA], SUM([wRC]) [wRC], ROUND(SUM([wRAA]),1) [wRAA], ROUND(SUM([WAR]),1) [WAR], SUM([SB]) [SB], SUM([CS]) [CS], SUM([BatR]) [BatR], SUM([wSB]) [wSB], SUM([UBR]) [UBR], SUM([BsR]) [BsR]
from BattingStats bs
join StatsBatch sb on bs.StatsBatchID = sb.StatsBatchID
where sb.StatsBatchID in (${statsBatchID.join(',')})
group by bs.PtCardID,sb.StatsBatchID,json_extract([Description], '$.Year')
order by bs.PtCardID ASC;
`
}

export const getLeaguePitchingStatsScript = (statsBatchID: number[]) => {

    return ` 
select ps.PtCardID,json_extract([Description], '$.Year') [LeagueYear],SUM([G]) [G], SUM([GS]) [GS], SUM([W]) [W], SUM([L]) [L], SUM([WIN%]) [WIN%], SUM([SVO]) [SVO], SUM([SV]) [SV], SUM([SV%]) [SV%], SUM([BS]) [BS], SUM([BS%]) [BS%], SUM([HLD]) [HLD], SUM([SD]) [SD], SUM([MD]) [MD], SUM([BF]) [BF], SUM([AB]) [AB], SUM([HA]) [HA], SUM([1B]) [1B], SUM([2B]) [2B], SUM([3B]) [3B], SUM([HR]) [HR], SUM([TB]) [TB], SUM([R]) [R], SUM([ER]) [ER], SUM([BB]) [BB], SUM([IBB]) [IBB], SUM([K]) [K], SUM([HP]) [HP], SUM(ps.[ERA]) [ERA], SUM([AVG]) [AVG], SUM([OBP]) [OBP], SUM([SLG]) [SLG], SUM([OPS]) [OPS], SUM(ps.[BABIP]) [BABIP], SUM([WHIP]) [WHIP], SUM([BRA/9]) [BRA/9], SUM([HR/9]) [HR/9], SUM([H/9]) [H/9], SUM([BB/9]) [BB/9], SUM([K/9]) [K/9], SUM([K/BB]) [K/BB], SUM([K%]) [K%], SUM([BB%]) [BB%], SUM([SH]) [SH], SUM([SF]) [SF], SUM([WP]) [WP], SUM([BK]) [BK], SUM([CI]) [CI], SUM(ps.[DP]) [DP], SUM([RA]) [RA], SUM([GF]) [GF], SUM([IR]) [IR], SUM([IRS]) [IRS], SUM([IRS%]) [IRS%], SUM([LOB%]) [LOB%], SUM([pLi]) [pLi], SUM([GF%]) [GF%], SUM([QS]) [QS], SUM([QS%]) [QS%], SUM([CG]) [CG], SUM([CG%]) [CG%], SUM([SHO]) [SHO], SUM([PPG]) [PPG], SUM([RS]) [RS], SUM([RSG]) [RSG], SUM([PI]) [PI], SUM(ps.[GB]) [GB], SUM([FB]) [FB], SUM([GO%]) [GO%], SUM([SB]) [SB], SUM([CS]) [CS], SUM([ERA+]) [ERA+], SUM([FIP]) [FIP], ROUND(SUM([WPA]),3) [WPA], ROUND(SUM([WAR]),1) [WAR], ROUND(SUM([rWAR]),1) [rWAR], ROUND(SUM([SIERA])) [SIERA], SUM(round([IP],0) * 3 + (case when instr(cast([IP] as text),'.') = 0 then 0 else substr(cast([IP] as text), instr(cast([IP] as text),'.')+1) end)) Outs
from PitchingStats ps
join StatsBatch sb on ps.StatsBatchID = sb.StatsBatchID
where sb.StatsBatchID in (${statsBatchID.join(',')})
group by ps.PtCardID,sb.StatsBatchID,json_extract([Description], '$.Year')
order by ps.PtCardID ASC;
`
}

export const getStatsBatchesForLeaguePlayYears = (tournamentTypeID: number, years: number[]) => {
    return `
select StatsBatchID
from StatsBatch
where TournamentTypeID = ${tournamentTypeID}
and json_extract([Description], '$.Year') in (${years.join(',')});
`
}