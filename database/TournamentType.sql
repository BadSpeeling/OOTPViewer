USE [ootp_data]
GO

/****** Object:  Table [dbo].[TournamentType]    Script Date: 6/9/2024 9:31:18 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[TournamentType](
	[TournamentTypeID] [int] IDENTITY(1,1034) NOT NULL,
	[Name] [varchar](80) NOT NULL,
	[CardRestriction] [varchar](80) NOT NULL,
	[MaxOverall] [int] NOT NULL,
	[IsQuick] [bit] NOT NULL,
	[IsCap] [bit] NOT NULL,
	[IsLive] [bit] NOT NULL,
	[CapAmount] [int] NOT NULL,
)
GO
	

