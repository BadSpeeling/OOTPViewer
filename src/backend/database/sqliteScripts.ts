import { LiveUpdate } from "../types"
import {TournamentStatsQuery} from "../../types"



export const getTournamentPitchingStatsScript = (query: TournamentStatsQuery) => {

    return ` 
select ps.PtCardID,SUM([G]) [G], SUM([GS]) [GS], SUM([W]) [W], SUM([L]) [L], SUM([WIN%]) [WIN%], SUM([SVO]) [SVO], SUM([SV]) [SV], SUM([SV%]) [SV%], SUM([BS]) [BS], SUM([BS%]) [BS%], SUM([HLD]) [HLD], SUM([SD]) [SD], SUM([MD]) [MD], SUM([BF]) [BF], SUM([AB]) [AB], SUM([HA]) [HA], SUM([1B]) [1B], SUM([2B]) [2B], SUM([3B]) [3B], SUM([HR]) [HR], SUM([TB]) [TB], SUM([R]) [R], SUM([ER]) [ER], SUM([BB]) [BB], SUM([IBB]) [IBB], SUM([K]) [K], SUM([HP]) [HP], SUM(ps.[ERA]) [ERA], SUM([AVG]) [AVG], SUM([OBP]) [OBP], SUM([SLG]) [SLG], SUM([OPS]) [OPS], SUM(ps.[BABIP]) [BABIP], SUM([WHIP]) [WHIP], SUM([BRA/9]) [BRA/9], SUM([HR/9]) [HR/9], SUM([H/9]) [H/9], SUM([BB/9]) [BB/9], SUM([K/9]) [K/9], SUM([K/BB]) [K/BB], SUM([K%]) [K%], SUM([BB%]) [BB%], SUM([SH]) [SH], SUM([SF]) [SF], SUM([WP]) [WP], SUM([BK]) [BK], SUM([CI]) [CI], SUM(ps.[DP]) [DP], SUM([RA]) [RA], SUM([GF]) [GF], SUM([IR]) [IR], SUM([IRS]) [IRS], SUM([IRS%]) [IRS%], SUM([LOB%]) [LOB%], SUM([pLi]) [pLi], SUM([GF%]) [GF%], SUM([QS]) [QS], SUM([QS%]) [QS%], SUM([CG]) [CG], SUM([CG%]) [CG%], SUM([SHO]) [SHO], SUM([PPG]) [PPG], SUM([RS]) [RS], SUM([RSG]) [RSG], SUM([PI]) [PI], SUM(ps.[GB]) [GB], SUM([FB]) [FB], SUM([GO%]) [GO%], SUM([SB]) [SB], SUM([CS]) [CS], SUM([ERA+]) [ERA+], SUM([FIP]) [FIP], ROUND(SUM([WPA]),3) [WPA], ROUND(SUM([WAR]),1) [WAR], ROUND(SUM([rWAR]),1) [rWAR], ROUND(SUM([SIERA])) [SIERA], SUM(round([IP],0) * 3 + (case when instr(cast([IP] as text),'.') = 0 then 0 else substr(cast([IP] as text), instr(cast([IP] as text),'.')+1) end)) Outs
from PitchingStats ps
join StatsBatch sb on ps.StatsBatchID = sb.StatsBatchID
where TournamentTypeID = ${query.tournamentTypeID}
${query.tourneyTimeframe ? `AND (UNIXEPOCH(TournamentStartDate) >= UNIXEPOCH('${query.tourneyTimeframe.startDate}') AND UNIXEPOCH(TournamentStartDate) <= UNIXEPOCH('${query.tourneyTimeframe.endDate}'))` : ""}
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

export const getRecentTournaments = (teamName: string, limitAmt: number) => {

    return `
SELECT sb.StatsBatchID, DATE(Timestamp, 'unixepoch') [Import Date], tr.W, tr.L, tt.Name [Tournament Name], sb.Description
FROM StatsBatch sb
JOIN ( 
	SELECT SUM(W) W, SUM(L) L, StatsBatchID
	FROM PitchingStats ps
	WHERE TeamName = '${teamName}'
	GROUP BY ps.StatsBatchID
) tr ON sb.StatsBatchID = tr.StatsBatchID 
JOIN TournamentType tt ON sb.TournamentTypeID = tt.TournamentTypeID
ORDER BY Timestamp DESC
LIMIT ${limitAmt}
`

}

export const getLiveUpdatesScript = () => {
    return `
SELECT LiveUpdateID,DATE(EffectiveDate,'unixepoch') EffectiveDate
FROM LiveUpdate
    `
}

export const insertLiveUpdateScript = (liveUpdate: LiveUpdate) => {
    return `
INSERT INTO LiveUpdate (EffectiveDate) VALUES (UNIXEPOCH('${liveUpdate.EffectiveDate}'))    
    `
}

export const updateLiveUpdateScript = (liveUpdate: LiveUpdate) => {
    return `
UPDATE LiveUpdate
SET EffectiveDate = UNIXEPOCH('${liveUpdate.EffectiveDate}')
WHERE LiveUpdateID = ${liveUpdate.LiveUpdateID}
    `
}

