import { app, BrowserWindow, ipcMain } from 'electron';
import * as path from 'node:path';

import {battingDataScript,pitchingDataScript,getRecentTournamentsScript,getPtSeasonBattingStats, getPtSeasonPitchingStats} from './backend/database/sqlServerScript';

import * as readHtmlStatsExport from './backend/readHtmlStatsExport';
import {readPtCardList} from "./backend/ptCardOperations";

import { getDatabase } from "./backend/database/Database";
import { DatabaseRecord } from "./backend/types"

import * as csvColumns from '../json/csvColumns.json';

import * as settings from '../settings.json';
import { PtDataExportFile, PtDataStatsFile, TournamentStatsQuery, TournamentMetaData, SeasonStatsQuery } from './types'

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
    
    const liveUpdate = await getDatabase().get("SELECT LiveUpdateID FROM LiveUpdate ORDER BY Timestamp desc LIMIT 1")

    if (typeof liveUpdate.LiveUpdateID === 'number') {
      let writeResults = readHtmlStatsExport.writeHtmlOutput(value, liveUpdate.LiveUpdateID);
      return writeResults;
    }
    else {
      throw new Error("Could not load latest LiveUpdateID");
    }

  })

  ipcMain.handle('getTournamentStats', (_event, value: TournamentStatsQuery) => {
    console.log(value)

    let dataScript;
    const statsTypeID = value.statsTypeID;
    const tournamentTypeID = value.tournamentTypeID.replace('-','');
    const qualifierValue = value.qualifierValue.replace('-','');

    if (statsTypeID === '0') {
      dataScript = battingDataScript;
      const positionQualifierString = value.positions.length > 0 ? `and [Position] in (${value.positions.join(',')})` : ""
      dataScript = dataScript.replace('{{positionQualifier}}', positionQualifierString)
    }
    else if (statsTypeID === '1') {
      dataScript = pitchingDataScript;
    }
    else {
      throw Error(statsTypeID + ' is not a valid statsTypeID value');
    }

    dataScript = dataScript.replace('{{tournamentTypeID}}',tournamentTypeID);
    dataScript = dataScript.replace('{{qualifierValue}}',qualifierValue);
    return getDatabase().getAll(dataScript);

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

async function getTournamentTypes (e, args) {
  return await getDatabase().getAll("SELECT * FROM ootp_data.dbo.TournamentType ORDER BY IsQuick DESC,IsCap DESC,IsLive DESC,[Name] ASC")
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

async function getSeasonStats (e, args: SeasonStatsQuery) {

  let dataScript = args.statsTypeID === 0 ? getPtSeasonBattingStats : getPtSeasonPitchingStats;
  const seasonStats: DatabaseRecord[] = await getDatabase().getAll(dataScript)

  return seasonStats.map((tournament: DatabaseRecord) => {
    if (args.statsTypeID === 0) {
      return {
        "Perfect Team Season": tournament['Perfect Team Season'],
        "Perfect Team Level": tournament['Perfect Team Level'],
        "CardTitle": tournament['CardTitle'],
        "POS": tournament['POS'],
        "Bats": tournament['Bats'],
        "PA": tournament['PA'],
        "AVG": tournament['AVG'],
        "OBP": tournament['OBP'],
        "SLG": tournament['SLG'],
        "OPS": tournament['OPS'],
      }
    }
    else {
      return {
        "Perfect Team Season": tournament['Perfect Team Season'],
        "Perfect Team Level": tournament['Perfect Team Level'],
        "CardTitle": tournament['CardTitle'],
        "G": tournament['G'],
        "GS": tournament['GS'],
        "K/9": tournament['K/9'],
        "BB/9": tournament['BB/9'],
        "HR/9": tournament['HR/9'],
        "ERA": tournament['ERA'],
        "Stamina": tournament['Stamina'],
      }
    }
  })

}

async function findTournamentExports () : Promise<PtDataExportFile[]> {

  let ptFolders = await readHtmlStatsExport.getAllPtFolders(path.join(...settings.ootpRoot))
  let htmlFiles = await readHtmlStatsExport.locateHtmlFiles(ptFolders)

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