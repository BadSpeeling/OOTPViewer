USE [ootp_data]
GO

/****** Object:  Table [dbo].[FieldingStats]    Script Date: 7/14/2024 9:26:23 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[FieldingStats](
	[CardID] [int] NOT NULL,
	[TeamName] [varchar](200) NULL,
	[G] [int] NOT NULL,
	[GS] [int] NULL,
	[TC] [int] NULL,
	[A] [int] NULL,
	[PO] [int] NULL,
	[E] [int] NULL,
	[DP] [int] NULL,
	[TP] [int] NULL,
	[ZR] [float] NULL,
	[SBA] [int] NULL,
	[RTO] [int] NULL,
	[IP] [float] NULL,
	[PB] [int] NULL,
	[CER] [int] NULL,
	[BIZ-R] [int] NULL,
	[BIZ-Rm] [int] NULL,
	[BIZ-L] [int] NULL,
	[BIZ-Lm] [int] NULL,
	[BIZ-E] [int] NULL,
	[BIZ-Em] [int] NULL,
	[BIZ-U] [int] NULL,
	[BIZ-Um] [int] NULL,
	[BIZ-Z] [int] NULL,
	[BIZ-Zm] [int] NULL,
	[BIZ-I] [int] NULL,
	[StatsBatchID] [int] NOT NULL
) ON [PRIMARY]
GO


