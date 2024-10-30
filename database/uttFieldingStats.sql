-- ================================
-- Create User-defined Table Type
-- ================================
USE [ootp_data]
GO

-- Create the data type
CREATE TYPE [dbo].[uttFieldingStats] AS TABLE
(
	[CID] int NOT NULL,
	[TM] VARCHAR(200) NULL,
	[G] INT NULL,
	[GS] INT NULL,
	[TC] INT NULL,
	[A] INT NULL,
	[PO] INT NULL,
	[E] INT NULL,
	[DP] INT NULL,
	[TP] INT NULL,
	[PCT] FLOAT NULL,
	[RNG] FLOAT NULL,
	[ZR] FLOAT NULL,
	[EFF] FLOAT NULL,
	[SBA] INT NULL,
	[RTO] INT NULL,
	[RTO%] FLOAT NULL,
	[IP] FLOAT NULL,
	[PB] INT NULL,
	[CER] INT NULL,
	[CERA] FLOAT NULL,
	[BIZ-R%] FLOAT NULL,
	[BIZ-R] INT NULL,
	[BIZ-Rm] INT NULL,
	[BIZ-L%] FLOAT NULL,
	[BIZ-L] INT NULL,
	[BIZ-Lm] INT NULL,
	[BIZ-E%] FLOAT NULL,
	[BIZ-E] INT NULL,
	[BIZ-Em] INT NULL,
	[BIZ-U%] FLOAT NULL,
	[BIZ-U] INT NULL,
	[BIZ-Um] INT NULL,
	[BIZ-Z%] FLOAT NULL,
	[BIZ-Z] INT NULL,
	[BIZ-Zm] INT NULL,
	[BIZ-I] INT NULL
)