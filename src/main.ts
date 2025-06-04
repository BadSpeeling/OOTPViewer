import { app, BrowserWindow, ipcMain } from 'electron';

import * as path from 'node:path';
import * as fs from 'node:fs';

import {getTournamentStats, getRecentTournamentsHandler} from './backend/readTournamentStats'
import {HtmlStatsTool,PtFolderSearcher} from './backend/readHtmlStatsExport';
import {getLiveUpdates, readPtCardList, processPtCardList, upsertLiveUpdate} from "./backend/ptCardOperations";
import {getSetting,updateSetting} from "./backend/settings";

import { getDatabase, Database } from "./backend/database/Database";
import { DatabaseRecord, BattingStatsExpanded, PitchingStatsExpanded, LiveUpdate, Bats, Throws, Position } from "./backend/types"

import * as settings from '../settings.json';
import { PtDataExportFile, PtDataStatsFile, TournamentStatsQuery, TournamentMetaData, SeasonStatsQuery, StatsType, TournamentType, PtTeam, ProcessCardsStatus } from './types'

declare global {
  interface Window {
    electronAPI: TournamentExporterAPI;
  }

  interface TournamentExporterAPI {
    findTournamentExports: () => Promise<PtDataExportFile[]>,
    writeHtmlTournamentStats: (tournamentTypeID: number, exportFile: PtDataStatsFile) => Promise<boolean>,
    getTournamentTypes: () => Promise<TournamentType[]>,
    getTournamentStats: (query: TournamentStatsQuery) => Promise<{headers: string[], stats:BattingStatsExpanded[] | PitchingStatsExpanded[]}>,
    getSeasonStats: (query: TournamentStatsQuery) => Promise<DatabaseRecord[]>,
    getRecentTournaments: (teamName: string) => Promise<TournamentMetaData[]>,
    getLiveUpdates: () => Promise<LiveUpdate[]>,
    writePtCards: (bypassLiveUpdateOccuredCheck: boolean) => Promise<ProcessCardsStatus>,
    openPtLeagueExporter: () => void,
    openTournamentStats: () => void,
    openSeasonStats: () => void,
    openStatsImporter: () => void,
    openCardImporter: () => void,
    loadPtCards: () => void,
    getPtTeams: () => Promise<PtTeam[]>,
    upsertLiveUpdate: (liveUpdate: LiveUpdate) => Promise<boolean>,
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

const openCardImporter = () => {
  const win = new BrowserWindow({
    width: 400,
    height: 300,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    } 
  })

  win.loadFile(path.join('views','cardImporter.html'))
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
      return {headers: ['CardTitle','CardValue','Position','Bats','PA','AVG','OBP','SLG','OPS'], stats: await getTournamentStats(path.join(...settings.databasePath), value)};
    }
    else if (value.statsType === StatsType.Pitching) {
      return {headers: ['CardTitle','CardValue','Throws','G','GS','K/9','BB/9','HR/9','ERA'], stats: await getTournamentStats(path.join(...settings.databasePath), value)};
    }
    else {
      throw Error(StatsType[value.statsType] + ' is not a valid statsTypeID value');
    }

  })

  ipcMain.handle('getPtTeams', getPtTeams)

  ipcMain.handle('openFile', lookupData)
  ipcMain.handle('getRecentTournaments', getRecentTournaments)
  ipcMain.handle('getTournamentTypes', getTournamentTypes)
  ipcMain.handle('findTournamentExports', findTournamentExports)
  ipcMain.handle('getSeasonStats', getSeasonStats);
  ipcMain.handle('writePtCards', writePtCards);
  ipcMain.handle('getLiveUpdates', getLiveUpdatesHandler);
  ipcMain.handle('upsertLiveUpdate', upsertLiveUpdateHandler);

  ipcMain.handle('openStatsImporter', openStatsImporter)
  ipcMain.handle('openPtLeagueExporter', openPtLeagueExporter)
  ipcMain.handle('openTournamentStats', openTournamentStats)
  ipcMain.handle('openSeasonStats', openSeasonStats)
  ipcMain.handle('openCardImporter', openCardImporter)

  openLanding()
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
});

function getPtTeams (e) {
  return getSetting<string[]>('myTeamNames').map((team, index) => {
    return {
      PtTeamID: index,
      TeamName: team,
    }
  }) as PtTeam[];
}

async function writePtCards (e, bypassLiveUpdateOccuredCheck: boolean) {

  try {
    const databasePath = getSetting("databasePath") as string[];
    const database = new Database(path.join(...databasePath));
    const result = await processPtCardList(database, bypassLiveUpdateOccuredCheck);
    return result;
  }
  catch (e) {
    return ProcessCardsStatus.Fail;
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

async function getRecentTournaments (e, teamName) {

  const limitAmount = 10;

  const recentTournaments = await getRecentTournamentsHandler(path.join(...settings.databasePath), teamName, limitAmount);
  return recentTournaments;
  
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

async function getLiveUpdatesHandler (): Promise<LiveUpdate[]> {
  const databasePath = path.join(...settings.databasePath);
  return getLiveUpdates(databasePath);
}

async function upsertLiveUpdateHandler (e, liveUpdate: LiveUpdate): Promise<boolean> {

  const databasePath = getSetting('databasePath') as string[];
  const database = new Database(path.join(...databasePath));

  try {
    upsertLiveUpdate(database, liveUpdate);
    return true;
  }
  catch (err) {
    //Log!
    return false;
  }

}