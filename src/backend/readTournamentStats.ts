import {  getTournamentBattingStatsScript, getTournamentPitchingStatsScript, getStatsBatchesForLeaguePlayYears, getLeagueBattingStatsScript, getLeaguePitchingStatsScript, getRecentTournaments } from "./database/sqliteScripts"
import { Database } from "../backend/database/Database"
import { BattingStats,PitchingStats,PtCard,Bats,Throws,Position,BattingStatsExpanded,PitchingStatsExpanded } from "./types"
import { TournamentStatsQuery,StatsType,TournamentMetaData } from "../types"

import { getPtCards } from './ptCardOperations'

import * as path from "node:path"
import * as setttings from "../../settings.json"

export const getTournamentStats = async (databasePath: string, query: TournamentStatsQuery) => {
    
    const db = new Database(databasePath);
    let summedStats = await readTournamentStats(query, db);

    const ptCardIds = getPtCardIDs(summedStats);
    let whereClause = `WHERE PtCardID IN (${ptCardIds.join(',')})`

    if (query.positions.length > 0) {
        whereClause += ` AND Position IN (${query.positions.join(',')})`
    }

    const cards = await getPtCards(db, ["PtCardID","CardValue","CardTitle","Bats","Throws","Position"], whereClause);

    if (query.positions.length > 0) {
        summedStats = summedStats.filter((statRow) => cards.find((card) => card.PtCardID === statRow.PtCardID)) as BattingStatsExpanded[] | PitchingStatsExpanded[]
    }

    if (query.qualifierValue) {
        const qualifierStat = query.statsType === StatsType.Batting ? "PA" : query.statsType == StatsType.Pitching ? "G" : "";
        summedStats = summedStats.filter((summedStatsRow) => summedStatsRow[qualifierStat] >= query.qualifierValue) as BattingStatsExpanded[] | PitchingStatsExpanded[]
    }   

    const statsAndRatings = joinStatsCards(query.statsType, summedStats, cards);

    const summedAndComputedStats = computeRateStats(query.statsType, statsAndRatings);
    return summedAndComputedStats;

}

const readTournamentStats = async (query: TournamentStatsQuery, db: Database) => {

    const statsBatch = query.years ? ((await db.getAll(getStatsBatchesForLeaguePlayYears(query.tournamentTypeID, query.years))).map(s => s.StatsBatchID as number)) : undefined;

    if (query.statsType === StatsType.Batting) {
        const battingStatsScript = !statsBatch ? getTournamentBattingStatsScript(query) : getLeagueBattingStatsScript(statsBatch);
        return await db.getAllMapped<BattingStatsExpanded>(battingStatsScript);
    }
    else if (query.statsType === StatsType.Pitching) {
        const pitchingStatsScript = !statsBatch ? getTournamentPitchingStatsScript(query) : getLeaguePitchingStatsScript(statsBatch);
        return await db.getAllMapped<PitchingStatsExpanded>(pitchingStatsScript);
    }
    else {
        throw Error(StatsType[query.statsType].toString() + " is not a valid stats type")
    }

}

export const computeRateStats = (statsType: StatsType, stats: BattingStats[] | PitchingStats[]) => {

    if (statsType === StatsType.Batting) {
        const battingStats = stats as BattingStats[];
        return battingStats.map((summedStats) => {
            let computedStats = {
                ...summedStats,
                "AVG": parseFloat(((summedStats.H) / (summedStats.AB)).toFixed(3)),
                "OBP": parseFloat(((summedStats.H + summedStats.BB + summedStats.IBB + summedStats.HP) / (summedStats.AB + summedStats.BB + summedStats.IBB + summedStats.HP + summedStats.SF)).toFixed(3)),
                "SLG": parseFloat(((summedStats.TB) / (summedStats.AB)).toFixed(3)),
            }
    
            return {
                ...computedStats,
                "ISO": parseFloat((computedStats.SLG - computedStats.AVG).toFixed(3)),
                "OPS": parseFloat((computedStats.SLG + computedStats.OBP).toFixed(3)), 
            }
        }) as BattingStatsExpanded[];
    }
    else if (statsType === StatsType.Pitching) {
        const pitchingStats = stats as PitchingStats[];
        return pitchingStats.map((summedStats) => {
            return {
                ...summedStats,
                "K/9": (summedStats.K / (summedStats.Outs / 3)) * 9,
                "BB/9": (summedStats.BB / (summedStats.Outs / 3)) * 9,
                "HR/9": (summedStats.HR / (summedStats.Outs / 3)) * 9,
                "H/9": (summedStats.HA / (summedStats.Outs / 3)) * 9,
                "ERA": (summedStats.ER / (summedStats.Outs / 3)) * 9, 
                "IP": parseFloat(Math.floor(summedStats.Outs / 3) + '.' + summedStats.Outs % 3)
            }
        }) as PitchingStatsExpanded[];
    }
    else {
        throw Error(StatsType[statsType].toString() + " is not a valid stats type")
    }

}

const getPtCardIDs = (stats: BattingStats[] | PitchingStats[]) => {
    return stats.map((stat: BattingStats | PitchingStats) => stat.PtCardID)
}

const joinStatsCards = (statsType: StatsType, stats: BattingStats[] | PitchingStats[], cards: PtCard[]) => {

    if (statsType === StatsType.Batting) {
        const battingStats = stats as BattingStats[];
        return joinBattingPtCardValues(battingStats, cards);
    }
    else if (statsType === StatsType.Pitching) {
        const pitchingStats = stats as PitchingStats[];
        return joinPitchingPtCardValues(pitchingStats, cards);
    }
    else {
        throw Error(StatsType[statsType].toString() + " is not a valid stats type")
    }

}

const joinBattingPtCardValues = (stats: BattingStats[], cards: PtCard[]) => {

    let statsIndex = 0;
    let cardsIndex = 0;

    const joinedStats = [] as BattingStatsExpanded[]

    while (cardsIndex < cards.length) {

        while (statsIndex < stats.length && stats[statsIndex].PtCardID === cards[cardsIndex].PtCardID) {
            
            const curCard = cards[cardsIndex];
            const battingStats = stats[statsIndex]

            joinedStats.push({
                ...battingStats,
                CardTitle: curCard.CardTitle,
                CardValue: curCard.CardValue,
                Bats: curCard.Bats,
                Throws: curCard.Throws,
                Position: curCard.Position,
            })

            statsIndex += 1;
        }

        cardsIndex += 1;
    }

    return joinedStats;

}

const joinPitchingPtCardValues = (stats: PitchingStats[], cards: PtCard[]) => {

    let statsIndex = 0;
    let cardsIndex = 0;

    const joinedStats = [] as PitchingStatsExpanded[]

    while (cardsIndex < cards.length) {

        while (statsIndex < stats.length && stats[statsIndex].PtCardID === cards[cardsIndex].PtCardID) {
            
            const curCard = cards[cardsIndex];            
            joinedStats.push({
                ...stats[statsIndex],
                CardTitle: curCard.CardTitle,
                CardValue: curCard.CardValue,
                Bats: curCard.Bats,
                Throws: curCard.Throws,
                Position: curCard.Position,
            })

            statsIndex += 1;
        }

        cardsIndex += 1;
    }

    return joinedStats;

}

export const getRecentTournamentsHandler = async (databasePath: string, teamName: string, limitAmt: number) => {
    
    const db = new Database(databasePath);
    return await db.getAllMapped<TournamentMetaData>(getRecentTournaments(teamName, limitAmt));

}