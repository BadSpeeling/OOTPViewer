import { TYPES } from 'tedious';  
import { DataType } from 'tedious/lib/data-type'

export type TediousParams = {
    name: string,
    type: DataType,
    length?: number,
}

export const uttCards: TediousParams[] = 
     [
        {name:'CardID', type: TYPES.Int},
        {name:'CardTitle', type: TYPES.VarChar, length: 200},
        {name:'CardValue', type: TYPES.Int},
        {name:'CardType', type: TYPES.Int},
        {name:'CardSubType', type: TYPES.Int},
        {name:'Year', type: TYPES.Int},
        {name:'Peak', type: TYPES.VarChar, length:1},
        {name:'Team', type: TYPES.VarChar, length: 100},
        {name:'LastName', type: TYPES.VarChar, length: 100},
        {name:'FirstName', type: TYPES.VarChar, length: 100},
        {name:'NickName', type: TYPES.VarChar, length: 100},
        {name:'UniformNumber', type: TYPES.Int},
        {name:'DayOB', type: TYPES.Int},
        {name:'MonthOB', type: TYPES.Int},
        {name:'YearOB', type: TYPES.Int},
        {name:'Bats', type: TYPES.Int},
        {name:'Throws', type: TYPES.Int},
        {name:'Position', type: TYPES.Int},
        {name:'PitcherRole', type: TYPES.Int},
        {name:'Contact', type: TYPES.Int},
        {name:'Gap', type: TYPES.Int},
        {name:'Power', type: TYPES.Int},
        {name:'Eye', type: TYPES.Int},
        {name:'AvoidKs', type: TYPES.Int},
        {name:'BABIP', type: TYPES.Int},
        {name:'ContactvL', type: TYPES.Int},
        {name:'GapvL', type: TYPES.Int},
        {name:'PowervL', type: TYPES.Int},
        {name:'EyevL', type: TYPES.Int},
        {name:'AvoidKvL', type: TYPES.Int},
        {name:'BABIPvL', type: TYPES.Int},
        {name:'ContactvR', type: TYPES.Int},
        {name:'GapvR', type: TYPES.Int},
        {name:'PowervR', type: TYPES.Int},
        {name:'EyevR', type: TYPES.Int},
        {name:'AvoidKvR', type: TYPES.Int},
        {name:'BABIPvR', type: TYPES.Int},
        {name:'GBHitterType', type: TYPES.Int},
        {name:'FBHitterType', type: TYPES.Int},
        {name:'BattedBallType', type: TYPES.Int},
        {name:'Speed', type: TYPES.Int},
        {name:'StealRate', type: TYPES.Int},
        {name:'Stealing', type: TYPES.Int},
        {name:'Baserunning', type: TYPES.Int},
        {name:'Sacbunt', type: TYPES.Int},
        {name:'Buntforhit', type: TYPES.Int},
        {name:'Stuff', type: TYPES.Int},
        {name:'Movement', type: TYPES.Int},
        {name:'Control', type: TYPES.Int},
        {name:'pHR', type: TYPES.Int},
        {name:'pBABIP', type: TYPES.Int},
        {name:'StuffvL', type: TYPES.Int},
        {name:'MovementvL', type: TYPES.Int},
        {name:'ControlvL', type: TYPES.Int},
        {name:'pHRvL', type: TYPES.Int},
        {name:'pBABIPvL', type: TYPES.Int},
        {name:'StuffvR', type: TYPES.Int},
        {name:'MovementvR', type: TYPES.Int},
        {name:'ControlvR', type: TYPES.Int},
        {name:'pHRvR', type: TYPES.Int},
        {name:'pBABIPvR', type: TYPES.Int},
        {name:'Fastball', type: TYPES.Int},
        {name:'Slider', type: TYPES.Int},
        {name:'Curveball', type: TYPES.Int},
        {name:'Changeup', type: TYPES.Int},
        {name:'Cutter', type: TYPES.Int},
        {name:'Sinker', type: TYPES.Int},
        {name:'Splitter', type: TYPES.Int},
        {name:'Forkball', type: TYPES.Int},
        {name:'Screwball', type: TYPES.Int},
        {name:'Circlechange', type: TYPES.Int},
        {name:'Knucklecurve', type: TYPES.Int},
        {name:'Knuckleball', type: TYPES.Int},
        {name:'Stamina', type: TYPES.Int},
        {name:'Hold', type: TYPES.Int},
        {name:'GB', type: TYPES.Int},
        {name:'Velocity', type: TYPES.VarChar, length: 10},
        {name:'ArmSlot', type: TYPES.Int},
        {name:'Height', type: TYPES.Int},
        {name:'InfieldRange', type: TYPES.Int},
        {name:'InfieldError', type: TYPES.Int},
        {name:'InfieldArm', type: TYPES.Int},
        {name:'DP', type: TYPES.Int},
        {name:'CatcherAbil', type: TYPES.Int},
        {name:'CatcherFrame', type: TYPES.Int},
        {name:'CatcherArm', type: TYPES.Int},
        {name:'OFRange', type: TYPES.Int},
        {name:'OFError', type: TYPES.Int},
        {name:'OFArm', type: TYPES.Int},
        {name:'PosRatingP', type: TYPES.Int},
        {name:'PosRatingC', type: TYPES.Int},
        {name:'PosRating1B', type: TYPES.Int},
        {name:'PosRating2B', type: TYPES.Int},
        {name:'PosRating3B', type: TYPES.Int},
        {name:'PosRatingSS', type: TYPES.Int},
        {name:'PosRatingLF', type: TYPES.Int},
        {name:'PosRatingCF', type: TYPES.Int},
        {name:'PosRatingRF', type: TYPES.Int},
        {name:'LearnC', type: TYPES.Bit},
        {name:'Learn1B', type: TYPES.Bit},
        {name:'Learn2B', type: TYPES.Bit},
        {name:'Learn3B', type: TYPES.Bit},
        {name:'LearnSS', type: TYPES.Bit},
        {name:'LearnLF', type: TYPES.Bit},
        {name:'LearnCF', type: TYPES.Int},
        {name:'LearnRF', type: TYPES.Int},
        {name:'era', type: TYPES.Int},
        {name:'tier', type: TYPES.Int},
        {name:'MissionValue', type: TYPES.Int},
        {name:'date', type: TYPES.Date},
        {name:'BuyOrderHigh', type: TYPES.Int},
        {name:'SellOrderLow', type: TYPES.Int},
        {name:'Last10Price', type: TYPES.Int},
        {name:'BuyOrderHigh(CC)', type: TYPES.Int},
        {name:'SellOrderLow(CC)', type: TYPES.Int},
        {name:'Last10Price(CC)', type: TYPES.Int},
    ]


export const uttGeneralColumns : TediousParams[] =
     [
        {name:'CID', type: TYPES.Int},
        {name:'TM', type: TYPES.VarChar, length: 200}
    ]


export const uttBattingColumns : TediousParams[] = 
     [
        {name:'G', type:  TYPES.Int},
        {name:'GS', type:  TYPES.Int},
        {name:'PA', type:  TYPES.Int},
        {name:'AB', type:  TYPES.Int},
        {name:'H', type:  TYPES.Int},
        {name:'1B', type:  TYPES.Int},
        {name:'2B', type:  TYPES.Int},
        {name:'3B', type:  TYPES.Int},
        {name:'HR', type:  TYPES.Int},
        {name:'RBI', type:  TYPES.Int},
        {name:'R', type:  TYPES.Int},
        {name:'BB', type:  TYPES.Int},
        {name:'BB%', type:  TYPES.Float},
        {name:'IBB', type:  TYPES.Int},
        {name:'HP', type:  TYPES.Int},
        {name:'SH', type:  TYPES.Int},
        {name:'SF', type:  TYPES.Int},
        {name:'CI', type:  TYPES.Int},
        {name:'SO', type:  TYPES.Int},
        {name:'SO%', type:  TYPES.Float},
        {name:'GIDP', type:  TYPES.Int},
        {name:'EBH', type:  TYPES.Int},
        {name:'TB', type:  TYPES.Int},
        {name:'AVG', type:  TYPES.Float},
        {name:'OBP', type:  TYPES.Float},
        {name:'SLG', type:  TYPES.Float},
        {name:'RC', type:  TYPES.Float},
        {name:'RC/27', type:  TYPES.Float},
        {name:'ISO', type:  TYPES.Float},
        {name:'wOBA', type:  TYPES.Float},
        {name:'OPS', type:  TYPES.Float},
        {name:'OPS+', type:  TYPES.Int},
        {name:'BABIP', type:  TYPES.Float},
        {name:'WPA', type:  TYPES.Float},
        {name:'wRC', type:  TYPES.Int},
        {name:'wRC+', type:  TYPES.Int},
        {name:'wRAA', type:  TYPES.Float},
        {name:'WAR', type:  TYPES.Float},
        {name:'PI/PA', type:  TYPES.Float},
        {name:'SB', type:  TYPES.Int},
        {name:'CS', type:  TYPES.Int},
        {name:'SB%', type:  TYPES.Float},
        {name:'BatR', type:  TYPES.Float},
        {name:'wSB', type:  TYPES.Float},
        {name:'UBR', type:  TYPES.Float},
        {name:'BsR', type:  TYPES.Float}   
    ]

export const uttPitchingColumns : TediousParams[]= [
	{name:'G', type: TYPES.Int},
	{name:'GS', type: TYPES.Int},
	{name:'W', type: TYPES.Int},
	{name:'L', type: TYPES.Int},
	{name:'WIN%', type: TYPES.Float},
	{name:'SVO', type: TYPES.Int},
	{name:'SV', type: TYPES.Int},
	{name:'SV%', type: TYPES.Float},
	{name:'HLD', type: TYPES.Int},
	{name:'SD', type: TYPES.Int},
	{name:'MD', type: TYPES.Int},
	{name:'IP', type: TYPES.Float},
	{name:'BF', type: TYPES.Int},
	{name:'AB', type: TYPES.Int},
	{name:'HA', type: TYPES.Int},
	{name:'1B', type: TYPES.Int},
	{name:'2B', type: TYPES.Int},
	{name:'3B', type: TYPES.Int},
	{name:'HR', type: TYPES.Int},
	{name:'TB', type: TYPES.Int},
	{name:'R', type: TYPES.Int},
	{name:'ER', type: TYPES.Int},
	{name:'BB', type: TYPES.Int},
	{name:'IBB', type: TYPES.Int},
	{name:'K', type: TYPES.Int},
	{name:'HP', type: TYPES.Int},
	{name:'ERA', type: TYPES.Float},
	{name:'AVG', type: TYPES.Float},
	{name:'OBP', type: TYPES.Float},
	{name:'SLG', type: TYPES.Float},
	{name:'OPS', type: TYPES.Float},
	{name:'BABIP', type: TYPES.Float},
	{name:'WHIP', type: TYPES.Float},
	{name:'RA/9', type: TYPES.Float},
	{name:'HR/9', type: TYPES.Float},
	{name:'H/9', type: TYPES.Float},
	{name:'BB/9', type: TYPES.Float},
	{name:'K/9', type: TYPES.Float},
	{name:'K/BB', type: TYPES.Float},
	{name:'K%', type: TYPES.Float},
	{name:'BB%', type: TYPES.Float},
	{name:'K%-BB%', type: TYPES.Float},
	{name:'SH', type: TYPES.Int},
	{name:'SF', type: TYPES.Int},
	{name:'WP', type: TYPES.Int},
	{name:'BK', type: TYPES.Int},
	{name:'CI', type: TYPES.Int},
	{name:'DP', type: TYPES.Int},
	{name:'RA', type: TYPES.Int},
	{name:'GF', type: TYPES.Int},
	{name:'IR', type: TYPES.Int},
	{name:'IRS', type: TYPES.Int},
	{name:'IRS%', type: TYPES.Float},
	{name:'LOB%', type: TYPES.Float},
	{name:'pLi', type: TYPES.Float},
	{name:'GF%', type: TYPES.Float},
	{name:'QS', type: TYPES.Int},
	{name:'QS%', type: TYPES.Float},
	{name:'CG', type: TYPES.Int},
	{name:'CG%', type: TYPES.Float},
	{name:'SHO', type: TYPES.Int},
	{name:'PPG', type: TYPES.Float},
	{name:'RS', type: TYPES.Int},
	{name:'RSG', type: TYPES.Float},
	{name:'PI', type: TYPES.Int},
	{name:'GB', type: TYPES.Int},
	{name:'FB', type: TYPES.Int},
	{name:'GO%', type: TYPES.Float},
	{name:'SB', type: TYPES.Int},
	{name:'CS', type: TYPES.Int},
	{name:'ERA+', type: TYPES.Float},
	{name:'FIP', type: TYPES.Float},
	{name:'FIP-', type: TYPES.Float},
	{name:'WPA', type: TYPES.Float},
	{name:'WAR', type: TYPES.Float},
	{name:'rWAR', type: TYPES.Float},
	{name:'SIERA', type: TYPES.Float}
]

export const uttFieldingColumns : TediousParams[] = [
	{ name: 'G', type: TYPES.Int },
	{ name: 'GS', type: TYPES.Int },
	{ name: 'TC', type: TYPES.Int },
	{ name: 'A', type: TYPES.Int },
	{ name: 'PO', type: TYPES.Int },
	{ name: 'E', type: TYPES.Int },
	{ name: 'DP', type: TYPES.Int },
	{ name: 'TP', type: TYPES.Int },
	{ name: 'PCT', type: TYPES.Float },
	{ name: 'RNG', type: TYPES.Float },
	{ name: 'ZR', type: TYPES.Float },
	{ name: 'EFF', type: TYPES.Float },
	{ name: 'SBA', type: TYPES.Int },
	{ name: 'RTO', type: TYPES.Int },
	{ name: 'RTO%', type: TYPES.Float },
	{ name: 'IP', type: TYPES.Float },
	{ name: 'PB', type: TYPES.Int },
	{ name: 'CER', type: TYPES.Int },
	{ name: 'CERA', type: TYPES.Float },
	{ name: 'BIZ-R%', type: TYPES.Float },
	{ name: 'BIZ-R', type: TYPES.Int },
	{ name: 'BIZ-Rm', type: TYPES.Int },
	{ name: 'BIZ-L%', type: TYPES.Float },
	{ name: 'BIZ-L', type: TYPES.Int },
	{ name: 'BIZ-Lm', type: TYPES.Int },
	{ name: 'BIZ-E%', type: TYPES.Float },
	{ name: 'BIZ-E', type: TYPES.Int },
	{ name: 'BIZ-Em', type: TYPES.Int },
	{ name: 'BIZ-U%', type: TYPES.Float },
	{ name: 'BIZ-U', type: TYPES.Int },
	{ name: 'BIZ-Um', type: TYPES.Int },
	{ name: 'BIZ-Z%', type: TYPES.Float },
	{ name: 'BIZ-Z', type: TYPES.Int },
	{ name: 'BIZ-Zm', type: TYPES.Int },
	{ name: 'BIZ-I', type: TYPES.Int }
]