USE [ootp_data]
GO

/****** Object:  Table [dbo].[BattingStats]    Script Date: 7/13/2024 4:37:31 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

DROP TABLE IF EXISTS [dbo].[BattingStats]

CREATE TABLE [dbo].[BattingStats](
	[CardID] [int] NOT NULL,
	[TeamName] [varchar](200) NULL,
	[G] [int] NOT NULL,
	[GS] [int] NULL,
	[PA] [int] NULL,
	[AB] [int] NULL,
	[1B] [int] NULL,
	[2B] [int] NULL,
	[3B] [int] NULL,
	[HR] [int] NULL,
	[RBI] [int] NULL,
	[R] [int] NULL,
	[BB] [int] NULL,
	[IBB] [int] NULL,
	[HP] [int] NULL,
	[SH] [int] NULL,
	[SF] [int] NULL,
	[SO] [int] NULL,
	[GIDP] [int] NULL,
	[RC] [float] NULL,
	[WPA] [float] NULL,
	[wRC] [int] NULL,
	[wRAA] [float] NULL,
	[WAR] [float] NULL,
	[SB] [int] NULL,
	[CS] [int] NULL,
	[BatR] [float] NULL,
	[wSB] [float] NULL,
	[UBR] [float] NULL,
	[BsR] [float] NULL,
	[StatsBatchID] [int] NULL
) ON [PRIMARY]
GO


