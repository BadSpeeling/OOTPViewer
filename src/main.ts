import { app, BrowserWindow, ipcMain } from 'electron';

import * as path from 'node:path';
import * as fs from 'node:fs';

import {getTournmentStats} from './backend/readTournamentStats'
import {HtmlStatsTool,PtFolderSearcher} from './backend/readHtmlStatsExport';
import {readPtCardList} from "./backend/ptCardOperations";

import { getDatabase } from "./backend/database/Database";
import { DatabaseRecord } from "./backend/types"

import * as csvColumns from '../json/csvColumns.json';

import * as settings from '../settings.json';
import { PtDataExportFile, PtDataStatsFile, TournamentStatsQuery, TournamentMetaData, SeasonStatsQuery, StatsType } from './types'

declare global {
  interface Window {
    electronAPI: TournamentExporterAPI;
  }

  interface TournamentExporterAPI {
    findTournamentExports: () => Promise<PtDataExportFile[]>,
    writeHtmlTournamentStats: (exportFile: PtDataStatsFile) => Promise<PtDataExportFile>,
    getTournamentTypes: () => Promise<{TournamentTypeID:string,Name:string}>,
    getTournamentStats: (query: TournamentStatsQuery) => Promise<DatabaseRecord[]>,
    getSeasonStats: (query: SeasonStatsQuery) => Promise<DatabaseRecord[]>,
    getRecentTournaments: () => Promise<TournamentMetaData[]>
    openPtLeagueExporter: () => void,
    openTournamentStats: () => void,
    openStatsImporter: () => void,
    loadPtCards: () => void,
  }

}

const openLanding = () => {

  const win = new BrowserWindow({
    width: 400,
    height: 300,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    } 
  })

  win.loadFile(path.join(__dirname, '..', 'views', 'landing.html'))
}

const openStatsImporter = () => {
    const win = new BrowserWindow({
      width: 800,
      height: 600,
      webPreferences: {
        preload: path.join(__dirname, 'preload.js')
      } 
    })
  
    win.loadFile(path.join(__dirname, '..', 'views', 'statsImporter.html'))
};

const openPtLeagueExporter = () => {
  const win = new BrowserWindow({
    width: 400,
    height: 300,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    } 
  })

  win.loadFile(path.join(__dirname, '..', 'views', 'index.html'))
}

const openTournamentStats = () => {
  const win = new BrowserWindow({
    width: 400,
    height: 300,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    } 
  })

  win.loadFile(path.join('views','tournamentStats.html'))
}

const openSeasonStats = () => {
  const win = new BrowserWindow({
    width: 400,
    height: 300,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    } 
  })

  win.loadFile(path.join('views','seasonStats.html'))
}

app.whenReady().then(() => {
  ipcMain.handle('writeHtmlTournamentStats', async (_event, value) => {
    console.log(value)
    
    const writer = new HtmlStatsTool(settings.databasePath);
    const liveUpdateID = null;

    const writeResults = await writer.handleTournamentStatsWrite(value, liveUpdateID);

    if (writeResults) {
      await clearPtFolderHtmlFiles(value.path)
    }

    return writeResults;

  })

  ipcMain.handle('getTournamentStats', async (_event, value: TournamentStatsQuery) => {
    console.log(value)

    if (value.statsType === StatsType.Batting) {
      return await getTournmentStats(value, path.join(...settings.databasePath));
      
    }
    else if (value.statsType === StatsType.Pitching) {
      return await getTournmentStats(value, path.join(...settings.databasePath));
    }
    else {
      throw Error(StatsType[value.statsType] + ' is not a valid statsTypeID value');
    }

  })

  ipcMain.handle('openFile', lookupData)
  ipcMain.handle('getRecentTournaments', getRecentTournaments)
  ipcMain.handle('getTournamentTypes', getTournamentTypes)
  ipcMain.handle('findTournamentExports', findTournamentExports)
  ipcMain.handle('getSeasonStats', getSeasonStats);
  ipcMain.handle('writePtCards', writePtCards);

  ipcMain.handle('openStatsImporter', openStatsImporter)
  ipcMain.handle('openPtLeagueExporter', openPtLeagueExporter)
  ipcMain.handle('openTournamentStats', openTournamentStats)
  ipcMain.handle('openSeasonStats', openSeasonStats)

  openLanding()
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
});

async function writePtCards (e, args) {

  try {
    const filePath = path.join(...settings.ootpRoot.concat(settings.ptCardFile));
    //const ptCards = await readPtCardList();
  }
  catch (e) {
    console.log(e.reason);
  }

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
    
    const deletedFilesStatus = await Promise.all<{isSuccess: boolean}>(files.map((file) => {
        return new Promise((resolve,reject) => {
            fs.unlink(path.join(htmlStatsFolder, file), (err) => {
                if (err) reject({isSuccess: false, err});
                resolve({isSuccess: true})
            });
        })
    }))

    return deletedFilesStatus

}

async function getTournamentTypes (e, args) {
  return await getDatabase().getAll("SELECT * FROM TournamentType ORDER BY IsQuick DESC,IsCap DESC,IsLive DESC,[Name] ASC")
}

async function lookupData (e, args) {
  let arr = await getDatabase().getAll("SELECT TOP 5 * FROM ootp_data.dbo.pt_card_list_20240404");
  return arr;
}

async function getRecentTournaments (e, args) {

  // let dataScript = getRecentTournamentsScript;
  // const recentTournaments: DatabaseRecord[] = await getDatabase().getAll(dataScript)

  // return recentTournaments.map((tournament: DatabaseRecord) => {
  //   return {
  //     W: tournament['W'],
  //     L: tournament['L'],
  //     TournamentName: tournament['Name'],
  //     StatsBatchID: tournament['StatsBatchID'],
  //     Description: tournament['Description'],
  //     Timestamp: tournament['Timestamp']
  //   }
  // })

}

async function getSeasonStats (e, args: SeasonStatsQuery) {

  // let dataScript = args.statsTypeID === 0 ? getPtSeasonBattingStats : getPtSeasonPitchingStats;
  // const seasonStats: DatabaseRecord[] = await getDatabase().getAll(dataScript)

  // return seasonStats.map((tournament: DatabaseRecord) => {
  //   if (args.statsTypeID === 0) {
  //     return {
  //       "Perfect Team Season": tournament['Perfect Team Season'],
  //       "Perfect Team Level": tournament['Perfect Team Level'],
  //       "CardTitle": tournament['CardTitle'],
  //       "POS": tournament['POS'],
  //       "Bats": tournament['Bats'],
  //       "PA": tournament['PA'],
  //       "AVG": tournament['AVG'],
  //       "OBP": tournament['OBP'],
  //       "SLG": tournament['SLG'],
  //       "OPS": tournament['OPS'],
  //     }
  //   }
  //   else {
  //     return {
  //       "Perfect Team Season": tournament['Perfect Team Season'],
  //       "Perfect Team Level": tournament['Perfect Team Level'],
  //       "CardTitle": tournament['CardTitle'],
  //       "G": tournament['G'],
  //       "GS": tournament['GS'],
  //       "K/9": tournament['K/9'],
  //       "BB/9": tournament['BB/9'],
  //       "HR/9": tournament['HR/9'],
  //       "ERA": tournament['ERA'],
  //       "Stamina": tournament['Stamina'],
  //     }
  //   }
  // })

}

async function findTournamentExports () : Promise<PtDataExportFile[]> {

  const folderSearch = new PtFolderSearcher(settings.ootpRoot);
  let ptFolders = await folderSearch.getAllPtFolders();
  let htmlFiles = await folderSearch.locateHtmlFiles(ptFolders)

  let htmlFilesToReturn: PtDataExportFile[] = []
  let curKey = 0

  for (const htmlFile of htmlFiles) {
    if (htmlFile.isSuccess) {
      htmlFilesToReturn.push({...htmlFile, key:curKey})
      curKey++
    }
  }

  return htmlFilesToReturn

}