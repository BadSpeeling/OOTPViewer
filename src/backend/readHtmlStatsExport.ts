import * as fs  from 'fs';
import * as path from 'path';

import { Database } from "./database/Database"

import { PtDataExportFile } from '../types';
import { OotpExportDataColumn } from "./types"
import { BattingExportScriptGenerator, OotpDataExport, PitchingExportScriptGenerator, splitOotpStatsExport } from './card-loading/export-stats';
import { OotpHtmlExportReader } from './card-loading/export-reader';
import { ProjectJsonModelReader } from './database-creator';

//let ptFolderRoot = savedGames + '\\' + file + 'news\\html\\temp\\'

const headerTypes = ["generalStats","battingStats","pitchingStats","fieldingStats"];

    async function createStatsBatch (database: Database, description: string, tournamentTypeID: number) : Promise<number> {
    
        //description = description.replaceAll('"','""'.replaceAll("'","''"));
        const statsBatchID = await database.insertOne(`INSERT INTO StatsBatch ([Timestamp],[Description],[TournamentTypeID]) VALUES (UNIXEPOCH(),'${description}',${tournamentTypeID})`);
    
        return statsBatchID;
    
    } 
    
    // async getRecentLiveUpdate () {
    
    //     const db = this.database;
    //     const result = await db.getMapped<{LiveUpdateID: number}>("SELECT LiveUpdateID FROM LiveUpdate ORDER BY EffectiveDate DESC LIMIT 1")
        
    //     return result.LiveUpdateID;
    
    // }

export async function getStats (statsFile: string[]) {

    const exportedStatsModelReader = new ProjectJsonModelReader<OotpExportDataColumn>("exportedStatsColumns.json")
    const exportedStatsModel = await exportedStatsModelReader.getJsonModels();
    const ptCardListReader = new OotpHtmlExportReader(exportedStatsModel, statsFile);
    const exportedStats = await ptCardListReader.readExport();

    const exportedCategorizedStats = splitOotpStatsExport(exportedStatsModel, exportedStats)

    return exportedCategorizedStats;

}

export async function writeStats (stats: {
    battingSplit: OotpDataExport;
    pitchingSplit: OotpDataExport;
    fieldingSplit: OotpDataExport | undefined;
}, database: Database, description: string, tournamentTypeID: number) {

    const statsBatchID = await createStatsBatch(database, description, tournamentTypeID);
    
    const battingWriteScript =  new BattingExportScriptGenerator(stats.battingSplit, statsBatchID).getExportWriteScript();
    await database.execute(battingWriteScript);

    const pitchingWriteScript =  new PitchingExportScriptGenerator(stats.pitchingSplit, statsBatchID).getExportWriteScript();
    await database.execute(pitchingWriteScript);

    if (stats.fieldingSplit) console.log('Do the fielding write');

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
    
            let ptFolders: string[] = []
    
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