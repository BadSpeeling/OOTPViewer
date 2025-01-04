headings=[
    'CardTitle',
    'CardID',
    'CardValue',
    'CardType',
    'CardSubType',
    'Year',
    'Peak',
    'Team',
    'LastName',
    'FirstName',
    'NickName',
    'UniformNumber',
    'DayOB',
    'MonthOB',
    'YearOB',
    'Bats',
    'Throws',
    'Position',
    'PitcherRole',
    'Contact',
    'Gap',
    'Power',
    'Eye',
    'AvoidKs',
    'BABIP',
    'ContactvL',
    'GapvL',
    'PowervL',
    'EyevL',
    'AvoidKvL',
    'BABIPvL',
    'ContactvR',
    'GapvR',
    'PowervR',
    'EyevR',
    'AvoidKvR',
    'BABIPvR',
    'GBHitterType',
    'FBHitterType',
    'BattedBallType',
    'Speed',
    'StealRate',
    'Stealing',
    'Baserunning',
    'Sacbunt',
    'Buntforhit',
    'Stuff',
    'Movement',
    'Control',
    'pHR',
    'pBABIP',
    'StuffvL',
    'MovementvL',
    'ControlvL',
    'pHRvL',
    'pBABIPvL',
    'StuffvR',
    'MovementvR',
    'ControlvR',
    'pHRvR',
    'pBABIPvR',
    'Fastball',
    'Slider',
    'Curveball',
    'Changeup',
    'Cutter',
    'Sinker',
    'Splitter',
    'Forkball',
    'Screwball',
    'Circlechange',
    'Knucklecurve',
    'Knuckleball',
    'Stamina',
    'Hold',
    'GB',
    'Velocity',
    'ArmSlot',
    'Height',
    'InfieldRange',
    'InfieldError',
    'InfieldArm',
    'DP',
    'CatcherAbil',
    'CatcherFrame',
    'CatcherArm',
    'OFRange',
    'OFError',
    'OFArm',
    'PosRatingP',
    'PosRatingC',
    'PosRating1B',
    'PosRating2B',
    'PosRating3B',
    'PosRatingSS',
    'PosRatingLF',
    'PosRatingCF',
    'PosRatingRF',
    'LearnC',
    'Learn1B',
    'Learn2B',
    'Learn3B',
    'LearnSS',
    'LearnLF',
    'LearnCF',
    'LearnRF',
    'era',
    'tier',
    'MissionValue',
    'limit',
    'owned',
    'brefid',
    'BuyOrderHigh',
    'SellOrderLow',
    'Last10Price',
    'BuyOrderHigh(CC)',
    'SellOrderLow(CC)',
    'Last10Price(CC)',
    'date'
]

function uttColumns () {
    let headingLines=[]

    for(let headingIndex=0;headingIndex<headings.length;headingIndex++){
        headingLines.push(`{name:'${headings[headingIndex]}'}`)
    }

    console.log(`[${headingLines.join(',\n')}]`)
}

function uttColumnLoading () {



}