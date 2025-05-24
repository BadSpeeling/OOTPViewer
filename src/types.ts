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
    qualifierValue: number,
    positions: string[],
    years?: number[],
    tourneyTimeframe?: {
        startDate: string,
        endDate: string,
    } 
}

export enum StatsType {
    Batting = 0,Pitching = 1,Fielding = 2
}

export type SeasonStatsQuery = {
    statsTypeID: number
}

export type PtStats = {
    [key:string]: string|number,
}

export interface PtDataStatsFile extends PtDataExportFile {
    description: string,
    isCumulativeFlag: boolean,
    isIncludedFlag: boolean,
    dataSaveStatus: DataSaveStatus,
    onlyMyTeamFlag: boolean,
    myTeamName?: string,    
}

export enum DataSaveStatus {
    None,
    Pending,
    Successful,
    Failure,
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

export interface PtTeam {
    PtTeamID: number,
    TeamName: string,
}