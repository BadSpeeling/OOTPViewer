import { parse } from 'node-html-parser';
import * as fs  from 'fs';
import * as path from 'path';

import { PtConnection } from './database/PtConnection';
import { statsExport } from "../../json/csvColumns.json"
import {uttGeneralColumns,uttBattingColumns,uttPitchingColumns, uttFieldingColumns, TediousParams} from './database/uttColumns';

import { Request } from 'tedious';
import { TYPES } from 'tedious';

import * as data from '../../settings.json';
import { PtDataExportFile, PtStats, PtDataStatsFile, PtPlayerStats } from '../types';
import { } from "./types"

//let ptFolderRoot = savedGames + '\\' + file + 'news\\html\\temp\\'

const headerTypes = ["generalStats","battingStats","pitchingStats","fieldingStats"];

export async function writeHtmlOutput (htmlOutput: PtDataStatsFile) {

    let tournamentOutput = await convertHtmlFileToTournamentOutput(htmlOutput)
    //return await writeTournamentStats(tournamentOutput, htmlOutput)

    let writeResults = await writeTournamentStats(tournamentOutput, htmlOutput)

    if (writeResults.isSuccess) {
        let fileDeleteResults = await clearPtFolderHtmlFiles(htmlOutput.path)
        return fileDeleteResults[0]
    }
    else {
        return writeResults
    }


}

class UttParameter {

    uttColumns: TediousParams[]
    uttRows: (string|number)[][]

    constructor (columns) {
        this.uttColumns = columns
        this.uttRows = []
    }

    handleUttRow (generalValues: (string|number)[],tournamentStatRow: (string|number)[]) {

        if (tournamentStatRow['G'] > 0) {

            let curUttRow: (string|number)[] = [generalValues['CID'],generalValues['TM']]

            for (let uttColumn of this.uttColumns) {

                let curValue = tournamentStatRow[uttColumn.name]
                curUttRow.push(curValue ? curValue : 0)

            }
        
            this.uttRows.push(curUttRow)

        }

    }

    getSpParameter () {
        return {
            columns: uttGeneralColumns.concat(this.uttColumns),
            rows: this.uttRows
        };
    }

}

function writeTournamentStats (tournamentOutput: { stats: PtPlayerStats[]; headers: string[]; }, htmlOutput: PtDataStatsFile) : Promise<{isSuccess: boolean, msg: string}> {

     return new Promise (async (resolve,reject) => {

    //     let ptConnection = new PtConnection();
    //     let connection = await ptConnection.connect();

    //     let tournamentStats = tournamentOutput.stats

    //     const battingParam = new UttParameter(uttBattingColumns)
    //     const pitchingParam = new UttParameter(uttPitchingColumns)
    //     const fieldingParam = new UttParameter(uttFieldingColumns)

    //     for (const tournamentStatRow of tournamentStats) {

    //         battingParam.handleUttRow(tournamentStatRow['generalStats'],tournamentStatRow['battingStats'])
    //         pitchingParam.handleUttRow(tournamentStatRow['generalStats'],tournamentStatRow['pitchingStats'])
    //         fieldingParam.handleUttRow(tournamentStatRow['generalStats'],tournamentStatRow['fieldingStats'])

    //     }

    //     var request = new Request("spInsertStats", function(err) {
    //         if (!err) {
    //             resolve({isSuccess: true,msg:'spInsertStats execute without error'});
    //         }
    //         else {
    //             reject({isSuccess: false,msg:err});
    //         }
    //     });
    
    //     //console.log(uttRows);
    //     request.addParameter('pBattingStats', TYPES.TVP, battingParam.getSpParameter());
    //     request.addParameter('pPitchingStats', TYPES.TVP, pitchingParam.getSpParameter());
    //     request.addParameter('pFieldingStats', TYPES.TVP, fieldingParam.getSpParameter());
    //     request.addParameter('pDescription', TYPES.VarChar, htmlOutput.description);
    //     request.addParameter('pTournamentTypeID', TYPES.Int, htmlOutput.tournamentTypeID)
    //     request.addParameter('pIsCumulativeFlag', TYPES.Bit, htmlOutput.isCumulativeFlag)

    //     let result = connection.callProcedure(request);

     })

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

//await these 
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