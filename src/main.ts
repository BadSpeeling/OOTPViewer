import { app, BrowserWindow, ipcMain } from 'electron';

import * as path from 'node:path';
import * as fs from 'node:fs';

import {getTournamentStats} from './backend/readTournamentStats'
import {HtmlStatsTool,PtFolderSearcher} from './backend/readHtmlStatsExport';
import {readPtCardList} from "./backend/ptCardOperations";

import { getDatabase } from "./backend/database/Database";
import { DatabaseRecord } from "./backend/types"

import * as csvColumns from '../json/csvColumns.json';

import * as settings from '../settings.json';
import { PtDataExportFile, PtDataStatsFile, TournamentStatsQuery, TournamentMetaData, SeasonStatsQuery, StatsType, TournamentType } from './types'
import {Bats,Throws,Position} from "./backend/types"

declare global {
  interface Window {
    electronAPI: TournamentExporterAPI;
  }

  interface TournamentExporterAPI {
    findTournamentExports: () => Promise<PtDataExportFile[]>,
    writeHtmlTournamentStats: (tournamentTypeID: number, exportFile: PtDataStatsFile) => Promise<boolean>,
    getTournamentTypes: () => Promise<TournamentType[]>,
    getTournamentStats: (query: TournamentStatsQuery) => Promise<DatabaseRecord[]>,
    getSeasonStats: (query: TournamentStatsQuery) => Promise<DatabaseRecord[]>,
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
  ipcMain.handle('writeHtmlTournamentStats', async (_event, tournamentTypeID, value) => {
    console.log(value)
    
    const writer = new HtmlStatsTool(settings.databasePath);
    const liveUpdateID = null;

    const writeResults = await writer.handleTournamentStatsWrite(value, tournamentTypeID, liveUpdateID);

    if (writeResults) {
      await clearPtFolderHtmlFiles(value.path)
    }

    return writeResults;

  })

  ipcMain.handle('getTournamentStats', async (_event, value: TournamentStatsQuery) => {
    console.log(value)

    if (value.statsType === StatsType.Batting) {
      return await getTournamentStats(path.join(...settings.databasePath), value);
      
    }
    else if (value.statsType === StatsType.Pitching) {
      return await getTournamentStats(path.join(...settings.databasePath), value);
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
  
  const data = await getDatabase().getAll("SELECT * FROM TournamentType ORDER BY IsQuick DESC,IsCap DESC,IsLive DESC,[Name] ASC")
  return data.map((row) => {
    return {
      TournamentTypeID: parseInt(row["TournamentTypeID"].toString()),
      Name: row["Name"].toString()
    } as TournamentType
  });

}

async function lookupData (e, args) {
  let arr = await getDatabase().getAll("SELECT TOP 5 * FROM ootp_data.dbo.pt_card_list_20240404");
  return arr;
}

async function getRecentTournaments (e, args) {

  let dataScript = getRecentTournamentsScript;
  const recentTournaments: DatabaseRecord[] = await getDatabase().getAll(dataScript)

  return recentTournaments.map((tournament: DatabaseRecord) => {
    return {
      W: tournament['W'],
      L: tournament['L'],
      TournamentName: tournament['Name'],
      StatsBatchID: tournament['StatsBatchID'],
      Description: tournament['Description'],
      Timestamp: tournament['Timestamp']
    }
  })

}

async function getSeasonStats (e, args: TournamentStatsQuery) {

  const seasonStats = await getTournamentStats(path.join(...settings.databasePath), args);

  return seasonStats.map((stat) => {
    if (args.statsType === StatsType.Batting) {
      return {
        "Perfect Team Season": stat['LeagueYear'],
        "Perfect Team Level": stat['Perfect Team Level'],
        "CardTitle": stat['CardTitle'],
        "POS": Position[stat['Position']].toString(),
        "Bats": Bats[stat['Bats']].toString(),
        "PA": stat['PA'],
        "AVG": stat['AVG'],
        "OBP": stat['OBP'],
        "SLG": stat['SLG'],
        "OPS": stat['OPS'],
      }
    }
    else if (args.statsType === StatsType.Pitching) {
      return {
        "Perfect Team Season": stat['LeagueYear'],
        "Perfect Team Level": stat['Perfect Team Level'],
        "CardTitle": stat['CardTitle'],
        "Throws": Throws[stat['Throws']].toString(),
        "G": stat['G'],
        "GS": stat['GS'],
        "K/9": stat['K/9'],
        "BB/9": stat['BB/9'],
        "HR/9": stat['HR/9'],
        "ERA": stat['ERA'],
        "Stamina": stat['Stamina'],
      }
    }
    else {
      throw Error(StatsType[args.statsType].toString() + " is not a valid type")
    }
  })

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