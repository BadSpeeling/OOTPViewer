USE [ootp_data]
GO

/****** Object:  Table [dbo].[StatsBatch]    Script Date: 6/9/2024 9:48:40 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[StatsBatch](
	[StatsBatchID] [int] IDENTITY(1,1) NOT NULL,
	[Timestamp] [datetime] NOT NULL,
	[Description] [varchar](100) NOT NULL,
	[TournamentTypeID] [int] NOT NULL,
	[LiveUpdateID] [int] NOT NULL,
	[IsCumulativeFlag] bit
	CONSTRAINT [PK_StatsBatch] PRIMARY KEY (StatsBatchID),
	CONSTRAINT [FK_StatsBatch_TournamentType] FOREIGN KEY([TournamentTypeID]) REFERENCES [dbo].[TournamentType] ([TournamentTypeID])
)
GO
