USE [ootp_data]
GO
/****** Object:  StoredProcedure [dbo].[spInsertStats]    Script Date: 7/31/2024 8:42:18 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
ALTER PROCEDURE [dbo].[spInsertStats] (@pBattingStats dbo.uttBattingStats READONLY, @pPitchingStats dbo.uttPitchingStats READONLY, @pFieldingStats dbo.uttFieldingStats READONLY, @pDescription VARCHAR(50), @pIsCumulativeFlag BIT, @pTournamentTypeID INT = NULL, @pLiveUpdateID INT = NULL)
AS
BEGIN

	
	DECLARE @StatsBatchID INT = -1;

	EXEC [dbo].[spGetStatsBatch]
		@pIsCumulativeFlag = @pIsCumulativeFlag,
		@pDescription = @pDescription,
		@pTournamentTypeID = @pTournamentTypeID, 
		@pLiveUpdateID = @pLiveUpdateID,
		@pStatsBatchID = @StatsBatchID OUT

	INSERT INTO dbo.BattingStats (	
		[CardID],
		[TeamName],
		[G],
		[GS],
		[PA],
		[AB],
		[1B],
		[2B],
		[3B],
		[HR],
		[RBI],
		[R],
		[BB],
		[IBB],
		[HP],
		[SH],
		[SF],
		[SO],
		[GIDP],
		[RC],
		[WPA],
		[wRC],
		[wRAA],
		[WAR],
		[SB],
		[CS],
		[BatR],
		[wSB],
		[UBR],
		[BsR],
		[StatsBatchID]
	)
	SELECT 	
		[CID] AS [CardID],
		[TM] TeamName,
		[G],
		[GS],
		[PA],
		[AB],
		[1B],
		[2B],
		[3B],
		[HR],
		[RBI],
		[R],
		[BB],
		[IBB],
		[HP],
		[SH],
		[SF],
		[SO],
		[GIDP],
		[RC],
		[WPA],
		[wRC],
		[wRAA],
		[WAR],
		[SB],
		[CS],
		[BatR],
		[wSB],
		[UBR],
		[BsR],
		@StatsBatchID
	FROM @pBattingStats

	INSERT INTO dbo.PitchingStats
	(CardID,TeamName,G,GS,W,L,SVO,SV,HLD,SD,MD,IP,BF,AB,HA,[1B],[2B],[3B],HR,R,ER,BB,IBB,K,HP,SH,SF,WP,BK,CI,DP,RA,GF,IR,IRS,pLi,QS,CG,SHO,RS,[PI],GB,FB,SB,CS,WPA,WAR,rWAR,SIERA,StatsBatchID,OUTS)
	SELECT 
		CID CardID,TM TeamName,G,GS,W,L,SVO,SV,HLD,SD,MD,IP,BF,AB,HA,[1B],[2B],[3B],HR,R,ER,BB,IBB,K,HP,SH,SF,WP,BK,CI,DP,RA,GF,IR,IRS,pLi,QS,CG,SHO,RS,[PI],GB,FB,SB,CS,WPA,WAR,rWAR,SIERA,
		@StatsBatchID,
			convert(int,(convert(decimal(8,1),IP) % 1 * 10) 
	+ convert(int, IP) * 3) OUTS
	FROM @pPitchingStats

	INSERT INTO dbo.FieldingStats
	(CardID,TeamName,	
	[G],
	[GS],
	[TC],
	[A],
	[PO],
	[E],
	[DP],
	[TP],
	[ZR],
	[SBA],
	[RTO],
	[IP],
	[PB],
	[CER],
	[BIZ-R],
	[BIZ-Rm],
	[BIZ-L],
	[BIZ-Lm],
	[BIZ-E],
	[BIZ-Em],
	[BIZ-U],
	[BIZ-Um],
	[BIZ-Z],
	[BIZ-Zm],
	[BIZ-I],
	[StatsBatchID]
	)
	SELECT 	
	CID CardID,
	TM TeamName,	
	[G],
	[GS],
	[TC],
	[A],
	[PO],
	[E],
	[DP],
	[TP],
	[ZR],
	[SBA],
	[RTO],
	[IP],
	[PB],
	[CER],
	[BIZ-R],
	[BIZ-Rm],
	[BIZ-L],
	[BIZ-Lm],
	[BIZ-E],
	[BIZ-Em],
	[BIZ-U],
	[BIZ-Um],
	[BIZ-Z],
	[BIZ-Zm],
	[BIZ-I],
	@StatsBatchID StatsBatchID
	from @pFieldingStats
END
