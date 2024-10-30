USE [ootp_data]
GO

/****** Object:  Table [dbo].[CardType]    Script Date: 6/8/2024 10:15:16 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

DROP TABLE IF EXISTS [dbo].[CardType]
CREATE TABLE [dbo].[CardType](
	[CardTypeID] int IDENTITY(1,1), 
	[CardTitle] [varchar](200) NOT NULL,
	[CardType] [tinyint] NOT NULL,
	[CardSubType] [tinyint] NOT NULL
)
GO


