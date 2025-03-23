import { parse } from 'node-html-parser';
import * as fs  from 'fs';
import * as path from 'path';

import { statsExport } from "../../json/csvColumns.json"
import { tournamentBattingStatsWriteScript } from "./database/sqliteScripts"
import {uttGeneralColumns,uttBattingColumns,uttPitchingColumns, uttFieldingColumns, TediousParams} from './database/uttColumns';
import { getDatabase } from "./database/Database"

import * as settings from '../../settings.json';
import { PtDataExportFile, PtStats, PtDataStatsFile, PtPlayerStats } from '../types';
import { } from "./types"

//let ptFolderRoot = savedGames + '\\' + file + 'news\\html\\temp\\'

const headerTypes = ["generalStats","battingStats","pitchingStats","fieldingStats"];

export async function handleTournamentStatsWrite (htmlOutput: PtDataStatsFile, liveUpdateID: number | null) {

    let tournamentOutput = await convertHtmlFileToTournamentOutput(htmlOutput)

    if (!liveUpdateID) {
        liveUpdateID = await getRecentLiveUpdate()
    }

    await writeTournamentStats(tournamentOutput.stats, liveUpdateID, htmlOutput.tournamentTypeID)

    let fileDeleteResults = await clearPtFolderHtmlFiles(htmlOutput.path)
    return fileDeleteResults[0]

}

export async function writeTournamentStats (stats: PtPlayerStats[], liveUpdateID: number, tournamentTypeID: number) {

    const database = getDatabase();
    const battingScript = tournamentBattingStatsWriteScript(stats, liveUpdateID, tournamentTypeID);

    await database.execute(battingScript);

}

export async function convertHtmlFileToTournamentOutput (htmlFile): Promise<{stats: PtPlayerStats[], headers: string[]}> {

    let res = await parseHtmlDataExport(htmlFile)
    let tournamentStats: PtPlayerStats[] = [] 

    for (const stats of res.parsedStats) {
        tournamentStats.push(processStatsIntoCategories(res.parsedHeaders,stats))
    }

    return {"stats":tournamentStats,"headers":res.parsedHeaders}

}

function processStatsIntoCategories (headers: string[],stats: (string | number)[]) : PtPlayerStats {

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

function parseHtmlDataExport (htmlFile: PtDataExportFile) : Promise<{parsedHeaders:string[],parsedStats:(string|number)[][]}> {

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

async function clearPtFolderHtmlFiles (htmlStatsFolder: string) {

    const files: string[] = await new Promise ((resolve,reject) => {
        fs.readdir(htmlStatsFolder, (err, files) => {
            if (!err) {
                resolve(files)
            }
            else {
                reject(err)
            }
        })
    })
    
    const deletedFilesStatus = await Promise.all(files.map((file) => {
        return new Promise((resolve,reject) => {
            fs.unlink(path.join(htmlStatsFolder, file), (err) => {
                if (err) reject({isSuccess: false, err});
                resolve({isSuccess: true})
            });
        })
    }))

    return deletedFilesStatus

}

export function getAllPtFolders (root: string) : Promise<string[]> {

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

export function locateHtmlFiles (ptFolders: string[]) : Promise<PtDataExportFile[]> {

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
                        clearPtFolderHtmlFiles(htmlStatsFolder)
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

export async function createStatsBatch (htmlOutput: PtDataStatsFile) : Promise<number> {

    const db = getDatabase();
    const statsBatchID = await db.insertOne(`INSERT INTO StatsBatch ([Timestamp],[Description],[TournamentTypeID]) VALUES (UNIXEPOCH(),'${htmlOutput.description}',${htmlOutput.tournamentTypeID})`);

    return statsBatchID;

} 

export async function getRecentLiveUpdate () {

    const db = getDatabase();
    const result = await db.getMapped<{LiveUpdateID: number}>("SELECT LiveUpdateID FROM LiveUpdate ORDER BY EffectiveDate DESC LIMIT 1")
    
    return result.LiveUpdateID;

}