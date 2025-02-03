export interface PtDataExportFile {
    key:number,
    isSuccess:boolean,
    ptFolder:string,
    path:string,
    msg?:string,
    fileName?:string,
}

export type PtPlayerStats = {
    generalStats: PtStats,
    battingStats: PtStats,
    pitchingStats: PtStats,
    fieldingStats: PtStats,
}

export type TournamentStatsQuery = {
    tournamentTypeID: string,statsTypeID: string,qualifierValue: string
}

export type PtStats = {
    [key:string]: string|number,
}

export interface PtDataStatsFile extends PtDataExportFile {
    description: string,
    tournamentTypeID: number,
    isCumulativeFlag: boolean,
}

export interface TournamentMetaData {
    W: number,
    L: number,
    TournamentName: string,
    StatsBatchID: number,
}