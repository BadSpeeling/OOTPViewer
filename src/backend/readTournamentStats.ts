import { getTournamentBattingStatsScript, getTournamentPitchingStatsScript } from "./database/sqliteScripts"
import { Database } from "../backend/database/Database"
import { BattingStats,PitchingStats,PtCard,Bats,Throws,Position } from "./types"

import * as path from "node:path"
import * as setttings from "../../settings.json"

export const getTournamentBattingStats = async (databasePath: string, tournamentTypeID: number) => {
    
    const db = new Database(databasePath);

    const battingStatsScript = getTournamentBattingStatsScript(tournamentTypeID);
    const summedBattingStats = await db.getAllMapped<BattingStats>(battingStatsScript);

    return summedBattingStats;
}

export const getTournamentPitchingStats = async (databasePath: string, tournamentTypeID: number) => {
    
    const db = new Database(databasePath);

    const pitchingStatsScript = getTournamentPitchingStatsScript(tournamentTypeID)
    const summedPitchingStats = await db.getAllMapped<PitchingStats>(pitchingStatsScript)
    
    const summedAndComputedStats = summedPitchingStats.map((summedStats) => {
        return {
            ...summedStats,
            "K/9": (summedStats.K / (summedStats.Outs / 3)) * 9,
            "BB/9": (summedStats.BB / (summedStats.Outs / 3)) * 9,
            "HR/9": (summedStats.HR / (summedStats.Outs / 3)) * 9,
            "H/9": (summedStats.HA / (summedStats.Outs / 3)) * 9,
            "IP": parseFloat(Math.floor(summedStats.Outs / 3) + '.' + summedStats.Outs % 3)
        }
    })

    return summedAndComputedStats;
}

const joinPtCardValues = (stats: BattingStats[] | PitchingStats[], cards: PtCard[]) => {

    let statsIndex = 0;
    let cardsIndex = 0;

    const joinedStats = [];

    while (cardsIndex < cards.length) {

        while (stats[statsIndex].PtCardID === cards[cardsIndex].PtCardID) {
            
            const curCard = cards[cardsIndex];
            
            joinedStats.push({
                ...stats[statsIndex],
                CardTitle: curCard.CardTitle,
                Bats: Bats[curCard.Bats],
                Throws: Throws[curCard.Throws],
                Position: Position[curCard.Position],
            })

            statsIndex += 1;

        }

        cardsIndex += 1;

    }

    return stats.map((stats) => {
        const card = cards.find((card) => card.PtCardID === stats.PtCardID)
    })

}