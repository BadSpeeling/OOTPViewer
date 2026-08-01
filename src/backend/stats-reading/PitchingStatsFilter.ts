export interface PitchingStatsFilter {
    TournamentTypeID: number,
    TournamentTimeRange?: {
        StartDate: string,
        EndDate: string,
    } 
}