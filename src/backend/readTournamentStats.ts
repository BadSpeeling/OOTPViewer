import { getTournamentBattingStatsScript, getTournamentPitchingStatsScript } from "./database/sqliteScripts"
import { Database } from "../backend/database/Database"
import { BattingStats,PitchingStats,PtCard,Bats,Throws,Position,BattingStatsExpanded,PitchingStatsExpanded } from "./types"

import { getPtCards } from './ptCardOperations'

import * as path from "node:path"
import * as setttings from "../../settings.json"

export const getTournamentBattingStats = async (databasePath: string, tournamentTypeID: number) => {
    
    const db = new Database(databasePath);

    const battingStatsScript = getTournamentBattingStatsScript(tournamentTypeID);
    const summedBattingStats = await db.getAllMapped<BattingStats>(battingStatsScript);

    const ptCardIds = getPtCardIDs(summedBattingStats);
    const whereClause = `WHERE PtCardID IN (${ptCardIds.join(',')})`
    const cards = await getPtCards(db, ["PtCardID","CardValue","CardTitle","Bats","Throws","Position"], whereClause);

    const statsAndRatings = joinBattingPtCardValues(summedBattingStats, cards);

    const summedAndComputedStats = statsAndRatings.map((summedStats) => {
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
    })

    return summedAndComputedStats;

}

export const getTournamentPitchingStats = async (databasePath: string, tournamentTypeID: number) => {
    
    const db = new Database(databasePath);

    const pitchingStatsScript = getTournamentPitchingStatsScript(tournamentTypeID)
    const summedPitchingStats = await db.getAllMapped<PitchingStats>(pitchingStatsScript)
    
    const ptCardIds = getPtCardIDs(summedPitchingStats);
    const whereClause = `WHERE PtCardID IN (${ptCardIds.join(',')})`
    const cards = await getPtCards(db, ["PtCardID","CardTitle","CardValue","Bats","Throws","Position"], whereClause);

    const statsAndRatings = joinPitchingPtCardValues(summedPitchingStats, cards);

    const summedAndComputedStats = statsAndRatings.map((summedStats) => {
        return {
            ...summedStats,
            "K/9": (summedStats.K / (summedStats.Outs / 3)) * 9,
            "BB/9": (summedStats.BB / (summedStats.Outs / 3)) * 9,
            "HR/9": (summedStats.HR / (summedStats.Outs / 3)) * 9,
            "H/9": (summedStats.HA / (summedStats.Outs / 3)) * 9,
            "ERA": (summedStats.ER / (summedStats.Outs / 3)) * 9, 
            "IP": parseFloat(Math.floor(summedStats.Outs / 3) + '.' + summedStats.Outs % 3)
        }
    })

    return summedAndComputedStats;
}

const getPtCardIDs = (stats: BattingStats[] | PitchingStats[]) => {
    return stats.map((stat: BattingStats | PitchingStats) => stat.PtCardID)
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