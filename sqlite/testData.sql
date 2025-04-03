insert into LiveUpdate (EffectiveDate)
values
(unixepoch('2025-03-14'));

insert into TournamentType (Name,CardRestriction,MaxOverall,IsQuick,IsCap,IsLive,CapAmount)
values
("Test","None",100,1,0,0,0),
('League', 'None', 100, 0, 0, 0, 0),
('Daily Rise and Shine', 'None', 100, 0,0,0,0)