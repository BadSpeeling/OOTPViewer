import { parse } from 'node-html-parser';
import * as fs  from 'fs';
import * as path from 'path';

import { statsExport } from "../../json/csvColumns.json"
import { tournamentBattingStatsWriteScript, tournamentPitchingStatsWriteScript } from "./database/sqliteScripts"
import { Database, getDatabase } from "./database/Database"

import * as settings from '../../settings.json';
import { PtDataExportFile, PtStats, PtDataStatsFile, PtPlayerStats } from '../types';
import { } from "./types"

//let ptFolderRoot = savedGames + '\\' + file + 'news\\html\\temp\\'

const headerTypes = ["generalStats","battingStats","pitchingStats","fieldingStats"];

export class HtmlStatsTool {

    database: Database;

    constructor (databasePath: string[]) {
        this.database = new Database(path.join(...databasePath))
    }

    async handleTournamentStatsWrite (htmlOutput: PtDataStatsFile, tournamentTypeID: number, liveUpdateID: number | null) {

        try {
            const tournamentOutput = await this.#convertHtmlFileToTournamentOutput(htmlOutput)
        
            if (!liveUpdateID) {
                liveUpdateID = await this.getRecentLiveUpdate()
            }
        
            await this.#writeTournamentStats(htmlOutput.description, tournamentTypeID, tournamentOutput.stats, liveUpdateID)
            return true;

        }
        catch (error) {
            console.log(error);
        }

    }
    
    async #writeTournamentStats (description: string, tournamentTypeID: number, stats: PtPlayerStats[], liveUpdateID: number) {
    
        const database = this.database;
    
        const statsBatchID = await this.createStatsBatch(description, tournamentTypeID);

        const battingStats = stats.filter((stat) => typeof stat.battingStats.G === 'number' && stat.battingStats.G > 0);
        const pitchingStats = stats.filter((stat) => typeof stat.pitchingStats.G === 'number' && stat.pitchingStats.G > 0);

        if (battingStats.length > 0) {
            const battingScript = tournamentBattingStatsWriteScript(battingStats, liveUpdateID, statsBatchID);
            await database.execute(battingScript);
        }

        if (pitchingStats.length > 0) {
            const pitchingScript = tournamentPitchingStatsWriteScript(pitchingStats, liveUpdateID, statsBatchID);
            await database.execute(pitchingScript);
        }

    }
    
    async #convertHtmlFileToTournamentOutput (htmlFile): Promise<{stats: PtPlayerStats[], headers: string[]}> {
    
        let res = await this.#parseHtmlDataExport(htmlFile)
        let tournamentStats: PtPlayerStats[] = [] 
    
        for (const stats of res.parsedStats) {
            tournamentStats.push(this.#processStatsIntoCategories(res.parsedHeaders,stats))
        }
    
        return {"stats":tournamentStats,"headers":res.parsedHeaders}
    
    }
    
    #processStatsIntoCategories (headers: string[],stats: (string | number)[]) : PtPlayerStats {
    
        if (headers.length !== stats.length) {
            throw new Error("Headers and Stats are not the same length!\n" + headers + "\n" + stats)
        }
    
        let statsCategories : PtPlayerStats = {
            generalStats: {},
            battingStats: {},
            pitchingStats: {},
            fieldingStats: {},
        };
        let curHeaderTypeIndex = 0
        const statsTypeSeperator = 'G'
    
        let curStatsCategory: PtStats = {
    
        }
    
        let setCurStatsCategory = () => {
            statsCategories[headerTypes[curHeaderTypeIndex]] = curStatsCategory
            curStatsCategory = {}
        }
    
        for (let curStatIndex = 0; curStatIndex < stats.length; curStatIndex++) {
    
            const curHeader = headers[curStatIndex]
    
            if (curHeader === statsTypeSeperator) {
    
                setCurStatsCategory()
                curHeaderTypeIndex += 1;
    
            }
    
            curStatsCategory[curHeader] = stats[curStatIndex]
    
        }
    
        setCurStatsCategory() //the last set of stats we built still needs to be inserted
    
        return statsCategories
    
    }
    
    #parseHtmlDataExport (htmlFile: PtDataExportFile) : Promise<{parsedHeaders:string[],parsedStats:(string|number)[][]}> {
    
        return new Promise ((resolve,reject) => {
            fs.readFile(path.join(htmlFile.path, htmlFile.fileName), 'utf-8', (err,data) => {
                const root = parse(data)
    
                const statsTable = root.querySelector('table.data.sortable')
    
                const headers = statsTable.querySelector('tr:first-child')
                const statsRows = statsTable.querySelectorAll('tr:not(:first-child)')
    
                const parsedHeaders = headers.querySelectorAll('th').map((curHeader) => curHeader.text)
                const parsedStats:(string|number)[][] = []
    
                for (const statsRow of statsRows) {
    
                    const curStats = statsRow.querySelectorAll('td')
                
                    if (curStats.length === parsedHeaders.length) {
                        const curStatsTxt = curStats.map((value, parsedHeadersIndex)=> {
    
                            const statText = value.removeWhitespace().text !== '' ? value.text : '0'
                            const statNumber = Number(statText)
    
                            return parsedHeaders[parsedHeadersIndex].trim() === 'TM' || isNaN(statNumber) ? statText : statNumber
    
                        })
    
                        parsedStats.push(curStatsTxt)
    
                    }
                    else {
                        reject({"err":"The amount of columns in the data row did not match the amount of columns in the header"})
                    }
    
                }
    
                resolve({parsedHeaders,parsedStats})
    
            })
    
        })
    
    }
    
    async createStatsBatch (description: string, tournamentTypeID: number) : Promise<number> {
    
        const db = this.database;
        //description = description.replaceAll('"','""'.replaceAll("'","''"));
        const statsBatchID = await db.insertOne(`INSERT INTO StatsBatch ([Timestamp],[Description],[TournamentTypeID]) VALUES (UNIXEPOCH(),'${description}',${tournamentTypeID})`);
    
        return statsBatchID;
    
    } 
    
    async getRecentLiveUpdate () {
    
        const db = this.database;
        const result = await db.getMapped<{LiveUpdateID: number}>("SELECT LiveUpdateID FROM LiveUpdate ORDER BY EffectiveDate DESC LIMIT 1")
        
        return result.LiveUpdateID;
    
    }

}

export class PtFolderSearcher {

    ootpRoot: string[]

    constructor(ootpRoot: string[]) {
        this.ootpRoot = ootpRoot;
    }

    getAllPtFolders () : Promise<string[]> {
    
        const root = path.join(...this.ootpRoot);

        return new Promise ((resolve,reject) => {
    
            let savedGames = path.join(root, 'saved_games')
    
            let ptFolders = []
    
            fs.readdir(savedGames, (err, files) => {
                files.forEach((file) => {
                    
                    if (file.includes(".pt")) {
                        ptFolders.push(path.join(savedGames,file))
                    }                
                    
                })
    
                resolve(ptFolders)
    
            })
    
        })
    
    }
    
    locateHtmlFiles (ptFolders: string[]) : Promise<PtDataExportFile[]> {
    
        return Promise.all<PtDataExportFile>(ptFolders.map((ptFolder,index) => {
            return new Promise ((resolve,reject) => {
                let htmlStatsFolder = path.join(ptFolder, 'news', 'html', 'temp')
    
                fs.readdir(htmlStatsFolder, (err, files) => {
                    
                    if (err) {
                        resolve({
                            isSuccess: false,
                            ptFolder,
                            path: htmlStatsFolder,
                            msg: ptFolder + " had an issue locating the output directory",
                            key:index,
                        })                
                    }
                    else {
                        if (files.length === 1) {
                            resolve({
                                isSuccess: true,
                                ptFolder,
                                path: htmlStatsFolder,
                                fileName: files[0],
                                key:index,
                            })
                        }
                        else if (files.length > 1) {
                            console.log(htmlStatsFolder + " has more than 1 output file")                            
                            resolve({
                                isSuccess: false,
                                ptFolder,
                                path: htmlStatsFolder,
                                msg: htmlStatsFolder + " has more than 1 output file",
                                key:index,
                            })
                        }
                        else {
                            resolve({
                                isSuccess: false,
                                ptFolder,
                                path: htmlStatsFolder,
                                msg: htmlStatsFolder + " has no output files",
                                key:index,
                            })
                        }
                    }
                })
            })
        }))
    
    }

}