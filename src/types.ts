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
    tournamentTypeID: number,
    statsType: StatsType,
    qualifierValue: string,
    positions: string[],
    years?: number[],
}

export enum StatsType {
    Batting,Pitching,Fielding
}

export type SeasonStatsQuery = {
    statsTypeID: number
}

export type PtStats = {
    [key:string]: string|number,
}

export interface PtDataStatsFile extends PtDataExportFile {
    description: string,
    tournamentTypeID: number,
    isCumulativeFlag: boolean,
    dataSaveSuccessful: boolean,
}

export interface TournamentMetaData {
    W: number,
    L: number,
    TournamentName: string,
    StatsBatchID: number,
    Description: string,
    Timestamp: Date,
}

export interface TournamentType {
    TournamentTypeID: number,
    Name: string,
}