export const simpleCardInsert = `INSERT INTO "PtCard" (
    "CardID", "CardTitle", "CardValue", "CardType", "CardSubType", "CardBadge", "CardSeries", "Year", "Peak", "Team", 
    "Franchise", "FirstName", "LastName", "NickName", "UniformNumber", "DayOB", "MonthOB", "YearOB", "Bats", "Throws", 
    "Position", "PitcherRole", "Contact", "Gap", "Power", "Eye", "AvoidKs", "BABIP", "ContactvL", "GapvL", 
    "PowervL", "EyevL", "AvoidKvL", "BABIPvL", "ContactvR", "GapvR", "PowervR", "EyevR", "AvoidKvR", "BABIPvR", 
    "GBHitterType", "FBHitterType", "BattedBallType", "Speed", "StealRate", "Stealing", "Baserunning", "Sacbunt", "Buntforhit", "Stuff", 
    "Movement", "Control", "pHR", "pBABIP", "StuffvL", "MovementvL", "ControlvL", "pHRvL", "pBABIPvL", "StuffvR", 
    "MovementvR", "ControlvR", "pHRvR", "pBABIPvR", "Fastball", "Slider", "Curveball", "Changeup", "Cutter", "Sinker", 
    "Splitter", "Forkball", "Screwball", "Circlechange", "Knucklecurve", "Knuckleball", "Stamina", "Hold", "GB", "Velocity", 
    "ArmSlot", "Height", "InfieldRange", "InfieldError", "InfieldArm", "DP", "CatcherAbil", "CatcherFrame", "CatcherArm", "OFRange", 
    "OFError", "OFArm", "PosRatingP", "PosRatingC", "PosRating1B", "PosRating2B", "PosRating3B", "PosRatingSS", "PosRatingLF", "PosRatingCF", 
    "PosRatingRF", "LearnC", "Learn1B", "Learn2B", "Learn3B", "LearnSS", "LearnLF", "LearnCF", "LearnRF", "era", 
    "MissionValue", "limit", "owned", "brefid", "date", "LiveUpdateID", "Nation", "tier", "packs"
) VALUES 
(
    1, 'Live Bryce Harper', 100, 1, 'Historical', 'Gold', 'All-Time Greats', 1927, 'Peak', 'New York',
    'Yankees', 'George', 'Ruth', 'The Bambino', 3, 6, 2, 1895, 1, 1, 
    7, 0, 95, 85, 100, 100, 75, 90, 85, 80, 
    90, 95, 70, 85, 99, 90, 100, 100, 80, 95, 
    1, 3, 2, 55, 60, 50, 65, 30, 20, 0, 
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
    0, 74, 45, 50, 45, 40, 0, 0, 0, 55, 
    55, 60, 0, 0, 60, 0, 0, 0, 50, 30, 
    45, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
    5000, 0, 1, 'ruthba01', '2026-06-30', 1, 'USA', 5, 1
),
(
    2, 'Live Chris Sanchez', 100, 1, 'Historical', 'Diamond', 'Award Winners', 1999, 'Peak', 'Boston',
    'Red Sox', 'Pedro', 'Martinez', 'El Grande', 45, 25, 10, 1971, 2, 2, 
    1, 1, 30, 30, 25, 20, 35, 30, 30, 30, 
    20, 20, 30, 30, 30, 30, 25, 20, 35, 30, 
    2, 2, 2, 40, 30, 25, 35, 65, 30, 100, 
    90, 95, 95, 90, 95, 90, 90, 90, 90, 100, 
    95, 99, 99, 95, 98, 85, 90, 95, 0, 0, 
    0, 0, 0, 0, 0, 0, 85, 75, 45, 97, 
    2, 71, 65, 70, 65, 70, 0, 0, 0, 0, 
    0, 0, 75, 0, 0, 0, 0, 0, 0, 0, 
    0, 0, 0, 0, 0, 0, 0, 0, 0, 138, 
    7500, 0, 0, 'martipe02', '2026-06-30', 1, 'Dominican Republic', 5, 1
);
`

export const liveUpdateTestCardsInsertScript = `INSERT INTO "PtCard" (
    "CardID", "CardTitle", "CardValue", "CardType", "CardSubType", "CardBadge", "CardSeries", "Year", "Peak", "Team", 
    "Franchise", "FirstName", "LastName", "NickName", "UniformNumber", "DayOB", "MonthOB", "YearOB", "Bats", "Throws", 
    "Position", "PitcherRole", "Contact", "Gap", "Power", "Eye", "AvoidKs", "BABIP", "ContactvL", "GapvL", 
    "PowervL", "EyevL", "AvoidKvL", "BABIPvL", "ContactvR", "GapvR", "PowervR", "EyevR", "AvoidKvR", "BABIPvR", 
    "GBHitterType", "FBHitterType", "BattedBallType", "Speed", "StealRate", "Stealing", "Baserunning", "Sacbunt", "Buntforhit", "Stuff", 
    "Movement", "Control", "pHR", "pBABIP", "StuffvL", "MovementvL", "ControlvL", "pHRvL", "pBABIPvL", "StuffvR", 
    "MovementvR", "ControlvR", "pHRvR", "pBABIPvR", "Fastball", "Slider", "Curveball", "Changeup", "Cutter", "Sinker", 
    "Splitter", "Forkball", "Screwball", "Circlechange", "Knucklecurve", "Knuckleball", "Stamina", "Hold", "GB", "Velocity", 
    "ArmSlot", "Height", "InfieldRange", "InfieldError", "InfieldArm", "DP", "CatcherAbil", "CatcherFrame", "CatcherArm", "OFRange", 
    "OFError", "OFArm", "PosRatingP", "PosRatingC", "PosRating1B", "PosRating2B", "PosRating3B", "PosRatingSS", "PosRatingLF", "PosRatingCF", 
    "PosRatingRF", "LearnC", "Learn1B", "Learn2B", "Learn3B", "LearnSS", "LearnLF", "LearnCF", "LearnRF", "era", 
    "MissionValue", "limit", "owned", "brefid", "date", "LiveUpdateID", "Nation", "tier", "packs"
) VALUES 
(
    1, 'Batter 1', 100, 1, 'Historical', 'Gold', 'All-Time Greats', 1927, 'Peak', 'New York',
    'Yankees', 'George', 'Ruth', 'The Bambino', 3, 6, 2, 1895, 1, 1, 
    7, 0, 95, 85, 100, 100, 75, 90, 85, 80, 
    90, 95, 70, 85, 99, 90, 100, 100, 80, 95, 
    1, 3, 2, 55, 60, 50, 65, 30, 20, 0, 
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
    0, 74, 45, 50, 45, 40, 0, 0, 0, 55, 
    55, 60, 0, 0, 60, 0, 0, 0, 50, 30, 
    45, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
    5000, 0, 1, 'ruthba01', '2026-06-30', 1, 'USA', 5, 1
),
(
    1, 'Batter 1', 95, 1, 'Historical', 'Gold', 'All-Time Greats', 1927, 'Peak', 'New York',
    'Yankees', 'George', 'Ruth', 'The Bambino', 3, 6, 2, 1895, 1, 1, 
    7, 0, 95, 85, 100, 100, 75, 90, 85, 80, 
    90, 95, 70, 85, 99, 90, 100, 100, 80, 95, 
    1, 3, 2, 55, 60, 50, 65, 30, 20, 0, 
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
    0, 74, 45, 50, 45, 40, 0, 0, 0, 55, 
    55, 60, 0, 0, 60, 0, 0, 0, 50, 30, 
    45, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
    5000, 0, 1, 'ruthba01', '2026-06-30', 2, 'USA', 5, 1
),
(
    2, 'Batter 2', 78, 1, 'Historical', 'Gold', 'All-Time Greats', 1927, 'Peak', 'New York',
    'Yankees', 'George', 'Ruth', 'The Bambino', 3, 6, 2, 1895, 1, 1, 
    7, 0, 95, 85, 100, 100, 75, 90, 85, 80, 
    90, 95, 70, 85, 99, 90, 100, 100, 80, 95, 
    1, 3, 2, 55, 60, 50, 65, 30, 20, 0, 
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
    0, 74, 45, 50, 45, 40, 0, 0, 0, 55, 
    55, 60, 0, 0, 60, 0, 0, 0, 50, 30, 
    45, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
    5000, 0, 1, 'ruthba01', '2026-06-30', 1, 'USA', 5, 1
),
(
    2, 'Batter 2', 85, 1, 'Historical', 'Gold', 'All-Time Greats', 1927, 'Peak', 'New York',
    'Yankees', 'George', 'Ruth', 'The Bambino', 3, 6, 2, 1895, 1, 1, 
    7, 0, 95, 85, 100, 100, 75, 90, 85, 80, 
    90, 95, 70, 85, 99, 90, 100, 100, 80, 95, 
    1, 3, 2, 55, 60, 50, 65, 30, 20, 0, 
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
    0, 74, 45, 50, 45, 40, 0, 0, 0, 55, 
    55, 60, 0, 0, 60, 0, 0, 0, 50, 30, 
    45, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
    5000, 0, 1, 'ruthba01', '2026-06-30', 2, 'USA', 5, 1
),
(
    3, 'Historical Batter', 65, 1, 'Historical', 'Gold', 'All-Time Greats', 1927, 'Peak', 'New York',
    'Yankees', 'George', 'Ruth', 'The Bambino', 3, 6, 2, 1895, 1, 1, 
    7, 0, 95, 85, 100, 100, 75, 90, 85, 80, 
    90, 95, 70, 85, 99, 90, 100, 100, 80, 95, 
    1, 3, 2, 55, 60, 50, 65, 30, 20, 0, 
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
    0, 74, 45, 50, 45, 40, 0, 0, 0, 55, 
    55, 60, 0, 0, 60, 0, 0, 0, 50, 30, 
    45, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
    5000, 0, 1, 'ruthba01', '2026-06-30', 1, 'USA', 5, 1
)
;
`