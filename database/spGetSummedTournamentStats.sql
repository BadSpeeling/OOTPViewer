-- ================================================
-- Template generated from Template Explorer using:
-- Create Procedure (New Menu).SQL
--
-- Use the Specify Values for Template Parameters 
-- command (Ctrl-Shift-M) to fill in the parameter 
-- values below.
--
-- This block of comments will not be included in
-- the definition of the procedure.
-- ================================================
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE [dbo].[spGetSummedTournamentStats] (
	@pTournamentTypeID INT,
	@pStatsTypeID INT
)
AS
BEGIN
	
	IF @pStatsTypeID = 0 BEGIN
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
			and [type].[TournamentTypeID] = @pTournamentTypeID
			and G > 0 
			group by sb.LiveUpdateID,CardID,sb.TournamentTypeID
		) [stats]
		join dbo.Card cards on [stats].CardID = cards.CardID
		where cards.CardType != 1 or cards.LiveUpdateID = [stats].LiveUpdateID


		select cards.LastName
			,CardTitle,[type].[Name],[stats].CardID,CardValue,dbo.GetPositionStr(Position) POS, case when cards.Bats = 1 then 'R' else 'L' end [Bats], [stats].PA,
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
		--and Card_Title like '%Ted Lepcio%'
		--and [Position] in (6)
		--and Card_Value >= 60
		--and PA > 1000
		--and (LearnSS = 1 and Infield_Range > 70 and Infield_Arm > 70)
		--and (Learn3B = 1 and Infield_Arm > 75)
		--and (LearnLF = 1 and OF_Range > 70)
		--and (LearnRF = 1 and OF_Range > 45 and OF_Arm > 45)
		order by 
		--cards.LastName asc
		[stats].PA desc
		--OPS desc
	END
	ELSE IF @pStatsTypeID = 1 BEGIN
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
			and OUTS > 0
			and [type].[TournamentTypeID] = @pTournamentTypeID
			group by sb.LiveUpdateID,CardID,sb.TournamentTypeID
		) [stats]
		join dbo.Card cards on [stats].CardID = cards.CardID
		where cards.CardType != 1 or cards.LiveUpdateID = [stats].LiveUpdateID

		order by ERA asc

		select cards.LastName,
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
	END

END
GO
