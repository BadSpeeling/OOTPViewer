import { getTournamentBattingStatsScript, getTournamentPitchingStatsScript } from "./database/sqliteScripts"

export const getTournamentBattingStats = (tournamentTypeID: number) => {
    return getTournamentBattingStatsScript(tournamentTypeID);
}

export const getTournamentPitchingStats = (tournamentTypeID: number) => {
    return getTournamentPitchingStatsScript(tournamentTypeID);
}