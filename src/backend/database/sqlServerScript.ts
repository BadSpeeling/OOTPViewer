export const battingDataScript = `
declare @LiveUpdateID int;

select top 1 @LiveUpdateID = LiveUpdateID from dbo.LiveUpdate order by EffectiveDate desc

select [stats].CardID,
[stats].TournamentTypeID,
LiveUpdateID,
PA,
case when AB != 0 then ([1b]+[2b]+[3b]+[hr])/convert(decimal,AB) else 0.000 end as [AVG], 
case when PA != 0 then (([1b]+[2b]+[3b]+[hr])+BB+IBB+HP)/CONVERT(DECIMAL,PA) else 0.000 end OBP, 
case when AB != 0 then ([1B]+2*[2B]+3*[3B]+4*HR)/CONVERT(DECIMAL,AB) else 0.000 end SLG
into #Hitters
from (
	select case when cards.CardType = 1 then sb.LiveUpdateID else 0 end LiveUpdateID,sb.TournamentTypeID,cards.CardID,SUM(G) G,SUM(GS) GS,SUM(PA) PA,SUM(AB) AB,SUM([1b]) [1B],SUM([2b]) [2B],SUM([3b]) [3B],SUM([hr]) [HR],SUM(RBI) RBI,SUM(R) R,SUM(BB) BB,SUM(IBB) IBB,SUM(HP) HP,SUM(SH) SH,SUM(SF) SF,SUM(SO) SO 
	from BattingStats
	join Card cards on cards.CardID = BattingStats.CardID
	join StatsBatch sb on BattingStats.StatsBatchID = sb.StatsBatchID
	join TournamentType [type] on sb.TournamentTypeID = [type].TournamentTypeID
	where 1=1
	and (cards.CardType != 1 or @LiveUpdateID = sb.LiveUpdateID)
	and [type].[TournamentTypeID] = {{tournamentTypeID}}
	and G > 0 
	group by cards.CardType,sb.LiveUpdateID,cards.CardID,sb.TournamentTypeID
) [stats]
where PA > {{qualifierValue}}

select CardTitle,[type].[Name],[stats].CardID,CardValue,dbo.GetPositionStr(Position) POS, case when cards.Bats = 1 then 'R' else 'L' end [Bats], [stats].PA,
SUBSTRING(CONVERT(VARCHAR, ROUND([AVG],3)),2,4) as [AVG], 
SUBSTRING(CONVERT(VARCHAR, ROUND([OBP],3)),2,4) as [OBP],  
SUBSTRING(CONVERT(VARCHAR, ROUND([SLG],3)),2,4) as [SLG],
CONCAT(CASE WHEN CONVERT(INT,(SUBSTRING(CONVERT(VARCHAR,[OBP]+[SLG]),1,1))) > 0 THEN SUBSTRING(CONVERT(VARCHAR,[OBP]+[SLG]),1,1) ELSE '' END, SUBSTRING(CONVERT(VARCHAR, ROUND([OBP]+[SLG],3)),2,4)) as [OPS],
cards.InfieldRange,cards.InfieldError, cards.InfieldArm,
cards.OFRange,cards.OFError, cards.OFArm,
cards.CatcherAbil, cards.CatcherArm, cards.CatcherFrame
from #Hitters [stats]
join dbo.Card cards on [stats].CardID = cards.CardID and isnull([stats].LiveUpdateID,0) = isnull(cards.LiveUpdateID,0)
join TournamentType [type] on [stats].TournamentTypeID = [type].TournamentTypeID
where 1=1
order by 
[stats].PA desc
`
export const pitchingDataScript = `
declare @LiveUpdateID int;

select top 1 @LiveUpdateID = LiveUpdateID from dbo.LiveUpdate order by EffectiveDate desc

select [stats].CardID,
[stats].TournamentTypeID,
LiveUpdateID,
G,
GS,
(K / (OUTS / 3.0) ) * 9 as [K/9],
((BB+IBB) / (OUTS / 3.0) ) * 9 as [BB/9],
(HR / (OUTS / 3.0) ) * 9 as [HR/9],
(ER / (OUTS / 3.0)) * 9 as [ERA]
into #current_pitchers
from
(
	select case when cards.CardType = 1 then sb.LiveUpdateID else 0 end LiveUpdateID,cards.CardID,sb.TournamentTypeID,sum(G) G, sum(GS) GS, sum(OUTS) OUTS, sum(BB) BB, sum(IBB) IBB, sum(K) K, sum(HR) HR, sum(ER) ER
	from PitchingStats
	join Card cards on cards.CardID = PitchingStats.CardID
	join StatsBatch sb on PitchingStats.StatsBatchID = sb.StatsBatchID
	join TournamentType [type] on sb.TournamentTypeID = [type].TournamentTypeID
	where 1=1
	and (cards.CardType != 1 or @LiveUpdateID = sb.LiveUpdateID)
	and OUTS > 0
	and [type].[TournamentTypeID] = {{tournamentTypeID}}
	group by cards.CardType,sb.LiveUpdateID,cards.CardID,sb.TournamentTypeID
) [stats]
where G > {{qualifierValue}}

order by ERA asc

select
CardTitle,[type].Name,CardValue, dbo.GetPositionStr(Position) [POS], case when Throws = 1 then 'R' else 'L' end [Throws],
G,
GS,
case when CHARINDEX('.',CONVERT(VARCHAR,[K/9])) = 2 THEN SUBSTRING(CONVERT(VARCHAR, ROUND([K/9],3)),1,4) ELSE SUBSTRING(CONVERT(VARCHAR, ROUND([K/9],3)),1,5) END as [K/9], 
SUBSTRING(CONVERT(VARCHAR, ROUND([BB/9],3)),1,4) as [BB/9],  
SUBSTRING(CONVERT(VARCHAR, ROUND([HR/9],3)),1,4) as [HR/9],
SUBSTRING(CONVERT(VARCHAR, ROUND([stats].[ERA],3)),1,4) as [ERA],
cards.[Stuff],cards.[pHR],cards.[pBABIP],cards.[Control],cards.[Stamina]
from #current_pitchers [stats]
join dbo.Card cards on [stats].CardID = cards.CardID and isnull([stats].LiveUpdateID,0) = isnull(cards.LiveUpdateID,0)
join TournamentType [type] on [stats].TournamentTypeID = [type].TournamentTypeID
where 1=1
order by 
[stats].G desc
`

export const getRecentTournamentsScript = `
declare @RowCount int = 10
declare @SearchTournamentTypeID int = null
declare @TeamName varchar(200) = 'Lil Dicky'

drop table if exists #SearchTournaments
select TOP (@RowCount) StatsBatchID,TournamentTypeID
into #SearchTournaments
from dbo.StatsBatch [sb]
where (@SearchTournamentTypeID is null or @SearchTournamentTypeID = [sb].TournamentTypeID)
and (exists (select null from dbo.PitchingStats ps where ps.StatsBatchID = sb.StatsBatchID and TeamName = @TeamName))
order by [sb].Timestamp desc

select sum(W) W,sum(L) L,t.StatsBatchID,tt.Name
from #SearchTournaments t
join dbo.PitchingStats [ps] on t.StatsBatchID = [ps].StatsBatchID
join dbo.TournamentType [tt] on [t].TournamentTypeID = [tt].TournamentTypeID
where TeamName = @TeamName
group by t.StatsBatchID,tt.Name
`

export const getPtSeasonBattingStats = `
declare @LiveUpdateID int;

select top 1 @LiveUpdateID = LiveUpdateID from dbo.LiveUpdate order by EffectiveDate desc

drop table if exists #PerfectTeamSeason
select json_value(sb.Description,'$.Year') [Year], json_value(sb.Description,'$.Level') [Level], sb.LiveUpdateID,sb.TournamentTypeID,[type].Name,sb.StatsBatchID
into #PerfectTeamSeason
from StatsBatch sb
join TournamentType [type] on sb.TournamentTypeID = [type].TournamentTypeID
where 1=1
and [type].[TournamentTypeID] = 1032

drop table if exists #Hitters
select 
[pts].Year [Perfect Team Season],
[pts].Level [Perfect Team Level],
[stats].CardID,
[pts].TournamentTypeID,
LiveUpdateID,
PA,
case when AB != 0 then ([1b]+[2b]+[3b]+[hr])/convert(decimal,AB) else 0.000 end as [AVG], 
case when PA != 0 then (([1b]+[2b]+[3b]+[hr])+BB+IBB+HP)/CONVERT(DECIMAL,PA) else 0.000 end OBP, 
case when AB != 0 then ([1B]+2*[2B]+3*[3B]+4*HR)/CONVERT(DECIMAL,AB) else 0.000 end SLG
into #Hitters
from (
	select sb.StatsBatchID,bs.CardID,SUM(G) G,SUM(GS) GS,SUM(PA) PA,SUM(AB) AB,SUM([1b]) [1B],SUM([2b]) [2B],SUM([3b]) [3B],SUM([hr]) [HR],SUM(RBI) RBI,SUM(R) R,SUM(BB) BB,SUM(IBB) IBB,SUM(HP) HP,SUM(SH) SH,SUM(SF) SF,SUM(SO) SO 
	from BattingStats bs
	join Card cards on cards.CardID = bs.CardID and (cards.LiveUpdateID = 0 or @LiveUpdateID = cards.LiveUpdateID)
	join StatsBatch sb on bs.StatsBatchID = sb.StatsBatchID and (cards.LiveUpdateID = 0 or @LiveUpdateID = cards.LiveUpdateID)
	where 1=1
	and sb.TournamentTypeID = 1032
	and G > 0 
	group by sb.StatsBatchID,bs.CardID
) [stats]
join #PerfectTeamSeason pts on [stats].StatsBatchID = pts.StatsBatchID

select [stats].[Perfect Team Season],[stats].[Perfect Team Level],[cards].CardTitle,[stats].CardID,CardValue,dbo.GetPositionStr(Position) POS, case when cards.Bats = 1 then 'R' else 'L' end [Bats], [stats].PA,
SUBSTRING(CONVERT(VARCHAR, ROUND([AVG],3)),2,4) as [AVG], 
SUBSTRING(CONVERT(VARCHAR, ROUND([OBP],3)),2,4) as [OBP],  
SUBSTRING(CONVERT(VARCHAR, ROUND([SLG],3)),2,4) as [SLG],
CONCAT(CASE WHEN CONVERT(INT,(SUBSTRING(CONVERT(VARCHAR,[OBP]+[SLG]),1,1))) > 0 THEN SUBSTRING(CONVERT(VARCHAR,[OBP]+[SLG]),1,1) ELSE '' END, SUBSTRING(CONVERT(VARCHAR, ROUND([OBP]+[SLG],3)),2,4)) as [OPS],
cards.InfieldRange,cards.InfieldError, cards.InfieldArm,
cards.OFRange,cards.OFError, cards.OFArm,
cards.CatcherAbil, cards.CatcherArm, cards.CatcherFrame
from #Hitters [stats]
join dbo.Card cards on [stats].CardID = cards.CardID and (cards.CardType != 1 or isnull([stats].LiveUpdateID,0) = isnull(cards.LiveUpdateID,0))
join TournamentType [type] on [stats].TournamentTypeID = [type].TournamentTypeID
where 1=1
order by 
OPS desc
`

export const getPtSeasonPitchingStats = `
declare @LiveUpdateID int;

select top 1 @LiveUpdateID = LiveUpdateID from dbo.LiveUpdate order by EffectiveDate desc

drop table if exists #PerfectTeamSeason
select json_value(sb.Description,'$.Year') [Year], json_value(sb.Description,'$.Level') [Level], sb.LiveUpdateID,sb.TournamentTypeID,[type].Name,sb.StatsBatchID
into #PerfectTeamSeason
from StatsBatch sb
join TournamentType [type] on sb.TournamentTypeID = [type].TournamentTypeID
where 1=1
and [type].[TournamentTypeID] = 1032

drop table if exists #Pitchers
select 
[pts].Year [Perfect Team Season],
[pts].Level [Perfect Team Level],
[stats].CardID,
[pts].TournamentTypeID,
pts.LiveUpdateID,
G,
GS,
(K / (OUTS / 3.0) ) * 9 as [K/9],
((BB+IBB) / (OUTS / 3.0) ) * 9 as [BB/9],
(HR / (OUTS / 3.0) ) * 9 as [HR/9],
(ER / (OUTS / 3.0)) * 9 as [ERA]
into #Pitchers
from (
	select sb.StatsBatchID,ps.CardID,sum(G) G, sum(GS) GS, sum(OUTS) OUTS, sum(BB) BB, sum(IBB) IBB, sum(K) K, sum(HR) HR, sum(ER) ER
	from PitchingStats ps
	join Card cards on cards.CardID = ps.CardID and (cards.LiveUpdateID = 0 or @LiveUpdateID = cards.LiveUpdateID)
	join StatsBatch sb on ps.StatsBatchID = sb.StatsBatchID
	join TournamentType [type] on sb.TournamentTypeID = [type].TournamentTypeID
	where 1=1
	and (cards.CardType != 1 or @LiveUpdateID = sb.LiveUpdateID)
	and OUTS > 0
	and [type].[TournamentTypeID] = 1032
	group by sb.StatsBatchID,ps.CardID
) [stats]
join #PerfectTeamSeason pts on [stats].StatsBatchID = pts.StatsBatchID

select [stats].[Perfect Team Season],[stats].[Perfect Team Level],
CardTitle,[type].Name,CardValue, dbo.GetPositionStr(Position) [POS], case when Throws = 1 then 'R' else 'L' end [Throws],
G,
GS,
case when CHARINDEX('.',CONVERT(VARCHAR,[K/9])) = 2 THEN SUBSTRING(CONVERT(VARCHAR, ROUND([K/9],3)),1,4) ELSE SUBSTRING(CONVERT(VARCHAR, ROUND([K/9],3)),1,5) END as [K/9], 
SUBSTRING(CONVERT(VARCHAR, ROUND([BB/9],3)),1,4) as [BB/9],  
SUBSTRING(CONVERT(VARCHAR, ROUND([HR/9],3)),1,4) as [HR/9],
SUBSTRING(CONVERT(VARCHAR, ROUND([stats].[ERA],3)),1,4) as [ERA],
cards.[Stuff],cards.[pHR],cards.[pBABIP],cards.[Control],cards.[Stamina]
from #Pitchers [stats]
join dbo.Card cards on [stats].CardID = cards.CardID and (cards.CardType != 1 or isnull([stats].LiveUpdateID,0) = isnull(cards.LiveUpdateID,0))
join TournamentType [type] on [stats].TournamentTypeID = [type].TournamentTypeID
where 1=1
order by 
G desc
`