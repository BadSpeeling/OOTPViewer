-- ================================
-- Create User-defined Table Type
-- ================================
USE [ootp_data]
GO

-- Create the data type
CREATE TYPE [dbo].[uttBattingStats] AS TABLE
(
	[CID] INT NOT NULL,
	[TM] VARCHAR(200) NULL,
	[G] INT NOT NULL,
	[GS] INT NULL,
	[PA] INT NULL,
	[AB] INT NULL,
	[H] INT NULL,
	[1B] INT NULL,
	[2B] INT NULL,
	[3B] INT NULL,
	[HR] INT NULL,
	[RBI] INT NULL,
	[R] INT NULL,
	[BB] INT NULL,
	[BB%] FLOAT NULL,
	[IBB] INT NULL,
	[HP] INT NULL,
	[SH] INT NULL,
	[SF] INT NULL,
	[CI] INT NULL,
	[SO] INT NULL,
	[SO%] FLOAT NULL,
	[GIDP] INT NULL,
	[EBH] INT NULL,
	[TB] INT NULL,
	[AVG] FLOAT NULL,
	[OBP] FLOAT NULL,
	[SLG] FLOAT NULL,
	[RC] FLOAT NULL,
	[RC/27] FLOAT NULL,
	[ISO] FLOAT NULL,
	[wOBA] FLOAT NULL,
	[OPS] FLOAT NULL,
	[OPS+] INT NULL,
	[BABIP] FLOAT NULL,
	[WPA] FLOAT NULL,
	[wRC] INT NULL,
	[wRC+] INT NULL,
	[wRAA] FLOAT NULL,
	[WAR] FLOAT NULL,
	[PI/PA] FLOAT NULL,
	[SB] INT NULL,
	[CS] INT NULL,
	[SB%] FLOAT NULL,
	[BatR] FLOAT NULL,
	[wSB] FLOAT NULL,
	[UBR] FLOAT NULL,
	[BsR] FLOAT NULL
)
GO
