USE [ootp_data]
GO

/****** Object:  Table [dbo].[PitchingStats]    Script Date: 7/14/2024 8:31:58 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[PitchingStats](
	[CardID] [int] NOT NULL,
	[TeamName] [varchar](200) NULL,
	[G] [int] NOT NULL,
	[GS] [int] NULL,
	[W] [int] NULL,
	[L] [int] NULL,
	[SVO] [int] NULL,
	[SV] [int] NULL,
	[HLD] [int] NULL,
	[SD] [int] NULL,
	[MD] [int] NULL,
	[IP] [float] NULL,
	[OUTS] [int] NULL,
	[BF] [int] NULL,
	[AB] [int] NULL,
	[HA] [int] NULL,
	[1B] [int] NULL,
	[2B] [int] NULL,
	[3B] [int] NULL,
	[HR] [int] NULL,
	[R] [int] NULL,
	[ER] [int] NULL,
	[BB] [int] NULL,
	[IBB] [int] NULL,
	[K] [int] NULL,
	[HP] [int] NULL,
	[SH] [int] NULL,
	[SF] [int] NULL,
	[WP] [int] NULL,
	[BK] [int] NULL,
	[CI] [int] NULL,
	[DP] [int] NULL,
	[RA] [int] NULL,
	[GF] [int] NULL,
	[IR] [int] NULL,
	[IRS] [int] NULL,
	[pLi] [float] NULL,
	[QS] [int] NULL,
	[CG] [int] NULL,
	[SHO] [int] NULL,
	[RS] [int] NULL,
	[PI] [int] NULL,
	[GB] [int] NULL,
	[FB] [int] NULL,
	[SB] [int] NULL,
	[CS] [int] NULL,
	[WPA] [float] NULL,
	[WAR] [float] NULL,
	[rWAR] [float] NULL,
	[SIERA] [float] NULL,
	[StatsBatchID] [int] NOT NULL
) ON [PRIMARY]
GO


