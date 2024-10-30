USE [ootp_data]
GO

/****** Object:  Table [dbo].[CardMarketValue]    Script Date: 9/4/2024 7:36:11 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[CardMarketValue](
	[CardMarketValueID] [int] IDENTITY(1,1), 
	[PtCardID] [int] NOT NULL,
	[BuyOrderHigh] [int],
	[SellOrderLow] [int],
	[Last10Price] [int],
	[BuyOrderHigh(CC)] [int],
	[SellOrderLow(CC)] [int],
	[Last10Price(CC)] [int],
	[Timestamp] [datetime] NOT NULL,
	CONSTRAINT FK_CardMarketValue_CardID_Card_CardID FOREIGN KEY (PtCardID) REFERENCES Card(PtCardID)
) ON [PRIMARY]
GO


