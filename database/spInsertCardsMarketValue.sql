-- ================================================
-- Template generated from Template Explorer using:
-- Create Procedure (New Menu).SQL
--
-- Use the Specify Values for Template Parameters 
-- command (Ctrl-Shift-M) to fill in the parameter 
-- values below.
--
-- This block of comments will not be included in
-- the definition of the procedure.
-- ================================================
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE [dbo].[spInsertCardsMarketValue]
AS
BEGIN
	
	if object_id('tempdb..#CardMarketValueToInsert') IS NULL begin
		DECLARE @StringVariable NVARCHAR(50);
		SET @StringVariable = N'CardMarketValueToInsert does not exist';

		RAISERROR (@StringVariable,18, 1);
		return

	end

	declare @CurDate datetime = getdate()

	if not exists (
		select *
		from dbo.CardMarketValue 
		where convert(date,@CurDate) = convert(date,Timestamp)
	) begin

	insert into dbo.CardMarketValue (PtCardID,[BuyOrderHigh],[SellOrderLow],[Last10Price],[BuyOrderHigh(CC)],[SellOrderLow(CC)],[Last10Price(CC)],[Timestamp])
	SELECT PtCardID,[BuyOrderHigh],[SellOrderLow],[Last10Price],[BuyOrderHigh(CC)],[SellOrderLow(CC)],[Last10Price(CC)],@CurDate
	FROM #CardMarketValueToInsert

	end

END
GO
