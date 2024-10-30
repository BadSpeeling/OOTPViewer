SELECT TOP (1000) [LiveUpdateID]
      ,[EffectiveDate]
  FROM [ootp_data].[dbo].[LiveUpdate]

insert into ootp_testdata.dbo.Card (CardTitle,CardID,CardType,CardSubType,LiveUpdateID)
select Card_Title CardTitle,Card_ID CardID, Card_Type CardType, Card_Sub_Type CardSubType, case when Card_Type = 1 then 4 else null end as LiveUpdateID
from ootp_data.dbo.pt_card_list_20240608

select *
from ootp_data.dbo.Card

select *
into dbo.CardBackup
from dbo.Card

select *
from dbo.Card
where CardType = 1 and LiveUpdateID is null
