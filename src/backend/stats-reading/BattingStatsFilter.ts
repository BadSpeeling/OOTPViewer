import { Position } from "../types";

export interface BattingStatsFilter {
    TournamentTypeID: number,
    Positions: 'ANY'| Position[],
    TournamentTimeRange?: {
        StartDate: string,
        EndDate: string,
    } 
}