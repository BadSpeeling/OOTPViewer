import { getTournamentBattingStatsScript, getTournamentPitchingStatsScript } from "./database/sqliteScripts"
import { Database } from "../backend/database/Database"
import { PitchingStats } from "./types"

import * as path from "node:path"
import * as setttings from "../../settings.json"

export const getTournamentBattingStats = (tournamentTypeID: number) => {
    return getTournamentBattingStatsScript(tournamentTypeID);
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