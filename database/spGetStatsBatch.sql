USE [ootp_data]
GO

/****** Object:  StoredProcedure [dbo].[spGetStatsBatch]    Script Date: 7/13/2024 6:23:01 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
create PROCEDURE [dbo].[spGetStatsBatch]
(@pIsCumulativeFlag bit,@pDescription varchar(100),@pTournamentTypeID int, @pLiveUpdateID int = NULL OUT, @pStatsBatchID int OUT)
AS
BEGIN

	DECLARE @ErrMsg VARCHAR(200) = ''
	DECLARE @TournamentName VARCHAR(40) = NULL
	SELECT @TournamentName = [Name] FROM dbo.TournamentType WHERE TournamentTypeID = @pTournamentTypeID

	IF @pLiveUpdateID IS NULL BEGIN
		SELECT TOP 1 @pLiveUpdateID = LiveUpdateID FROM dbo.LiveUpdate ORDER BY EffectiveDate DESC
	END

	IF @TournamentName IS NULL BEGIN
		SELECT @ErrMsg = 'TournamentID ' + CONVERT(varchar,@pTournamentTypeID) + ' does not exist';
		THROW 51000,  @ErrMsg, 1;
	END

	if @pIsCumulativeFlag = 1 BEGIN
		
		IF NOT EXISTS (
			select NULL
			from dbo.StatsBatch
			where IsCumulativeFlag = 1 and TournamentTypeID = @pTournamentTypeID
		)BEGIN
			SELECT @ErrMsg = 'Cumulative StatsBatch for ' + @TournamentName + ' DNE';
			THROW 51000,  @ErrMsg, 1;
		END

		select @pStatsBatchID = StatsBatchID
		from dbo.StatsBatch
		where IsCumulativeFlag = 1 and TournamentTypeID = @pTournamentTypeID

		update dbo.StatsBatch
		set Timestamp = getdate()
		where IsCumulativeFlag = 1 and TournamentTypeID = @pTournamentTypeID

	END
	else begin
		insert into StatsBatch ([Description],[TournamentTypeID],[Timestamp],[IsCumulativeFlag],[LiveUpdateID]) values (@pDescription,@pTournamentTypeID,getdate(),@pIsCumulativeFlag,@pLiveUpdateID);
		select @pStatsBatchID = SCOPE_IDENTITY();
	end

END
GO


