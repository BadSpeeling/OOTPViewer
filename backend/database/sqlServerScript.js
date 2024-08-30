const battingDataScript = `
declare @LiveUpdateID int;

select top 1 @LiveUpdateID = LiveUpdateID from dbo.LiveUpdate order by EffectiveDate desc

select [stats].CardID,
[stats].TournamentTypeID,
case when cards.CardType = 1 then [stats].LiveUpdateID else NULL end LiveUpdateID,
PA,
case when AB != 0 then ([1b]+[2b]+[3b]+[hr])/convert(decimal,AB) else 0.000 end as [AVG], 
case when PA != 0 then (([1b]+[2b]+[3b]+[hr])+BB+IBB+HP)/CONVERT(DECIMAL,PA) else 0.000 end OBP, 
case when AB != 0 then ([1B]+2*[2B]+3*[3B]+4*HR)/CONVERT(DECIMAL,AB) else 0.000 end SLG
into #Hitters
from (
	select sb.LiveUpdateID,sb.TournamentTypeID,CardID,SUM(G) G,SUM(GS) GS,SUM(PA) PA,SUM(AB) AB,SUM([1b]) [1B],SUM([2b]) [2B],SUM([3b]) [3B],SUM([hr]) [HR],SUM(RBI) RBI,SUM(R) R,SUM(BB) BB,SUM(IBB) IBB,SUM(HP) HP,SUM(SH) SH,SUM(SF) SF,SUM(SO) SO 
	from BattingStats 
	join StatsBatch sb on BattingStats.StatsBatchID = sb.StatsBatchID
	join TournamentType [type] on sb.TournamentTypeID = [type].TournamentTypeID
	where 1=1
	and sb.LiveUpdateID = @LiveUpdateID
	and [type].[TournamentTypeID] = {{tournamentTypeID}}
	and G > 0 
	group by sb.LiveUpdateID,CardID,sb.TournamentTypeID
) [stats]
join dbo.Card cards on [stats].CardID = cards.CardID
where (cards.CardType != 1 or cards.LiveUpdateID = [stats].LiveUpdateID)
and PA > {{qualifierValue}}

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
const pitchingDataScript = `
declare @LiveUpdateID int;

select top 1 @LiveUpdateID = LiveUpdateID from dbo.LiveUpdate order by EffectiveDate desc

select [stats].CardID,
[stats].TournamentTypeID,
case when cards.CardType = 1 then [stats].LiveUpdateID else NULL end LiveUpdateID,
G,
GS,
(K / (OUTS / 3.0) ) * 9 as [K/9],
((BB+IBB) / (OUTS / 3.0) ) * 9 as [BB/9],
(HR / (OUTS / 3.0) ) * 9 as [HR/9],
(ER / (OUTS / 3.0)) * 9 as [ERA]
into #current_pitchers
from
(
	select sb.LiveUpdateID,CardID,[sb].TournamentTypeID,sum(G) G, sum(GS) GS, sum(OUTS) OUTS, sum(BB) BB, sum(IBB) IBB, sum(K) K, sum(HR) HR, sum(ER) ER
	from PitchingStats 
	join StatsBatch sb on PitchingStats.StatsBatchID = sb.StatsBatchID
	join TournamentType [type] on sb.TournamentTypeID = [type].TournamentTypeID
	where 1=1
	and sb.LiveUpdateID = @LiveUpdateID
	and OUTS > 0
	and [type].[TournamentTypeID] = {{tournamentTypeID}}
	group by sb.LiveUpdateID,CardID,sb.TournamentTypeID
) [stats]
join dbo.Card cards on [stats].CardID = cards.CardID
where (cards.CardType != 1 or cards.LiveUpdateID = [stats].LiveUpdateID)
and G > {{qualifierValue}}

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

module.exports.battingDataScript = battingDataScript;
module.exports.pitchingDataScript = pitchingDataScript;