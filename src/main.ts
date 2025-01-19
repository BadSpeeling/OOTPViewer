const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('node:path')

import {DatabaseRecord, queryDatabase} from './backend/database/DatabaseRecord';
const sqlServerScript = require('./backend/database/sqlServerScript')

import * as readHtmlStatsExport from './backend/readHtmlStatsExport'

import * as data from '../settings.json';
import { PtDataExportFile, PtDataStatsFile, TournamentStatsQuery } from './types'

declare global {
  interface Window {
    electronAPI: TournamentExporterAPI;
  }


  interface TournamentExporterAPI {
    findTournamentExports: () => Promise<PtDataExportFile[]>,
    writeHtmlTournamentStats: (exportFile: PtDataStatsFile) => Promise<PtDataExportFile>,
    getRecentTournaments: () => Promise<any>,
    getTournamentTypes: () => Promise<{TournamentTypeID:string,Name:string}>,
    getTournamentStats: (query: TournamentStatsQuery) => Promise<DatabaseRecord[]>,
    openPtLeagueExporter: () => void,
    openTournamentStats: () => void,
    openStatsImporter: () => void,
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

app.whenReady().then(() => {
  ipcMain.handle('writeHtmlTournamentStats', (_event, value) => {
    console.log(value)
    
    let writeResults = readHtmlStatsExport.writeHtmlOutput(value)
    return writeResults

  })

  ipcMain.handle('getTournamentStats', (_event, value: TournamentStatsQuery) => {
    console.log(value)

    let dataScript;
    const statsTypeID = value.statsTypeID;
    const tournamentTypeID = value.tournamentTypeID.replace('-','');
    const qualifierValue = value.qualifierValue.replace('-','');

    if (statsTypeID === '0') {
      dataScript = sqlServerScript.battingDataScript;
    }
    else if (statsTypeID === '1') {
      dataScript = sqlServerScript.pitchingDataScript;
    }
    else {
      throw Error(statsTypeID + ' is not a valid statsTypeID value');
    }

    dataScript = dataScript.replace('{{tournamentTypeID}}',tournamentTypeID);
    dataScript = dataScript.replace('{{qualifierValue}}',qualifierValue);
    return queryDatabase(dataScript);

  })

  ipcMain.handle('openFile', lookupData)
  ipcMain.handle('getRecentTournaments', getRecentTournaments)
  ipcMain.handle('getTournamentTypes', getTournamentTypes)
  ipcMain.handle('findTournamentExports', findTournamentExports)

  ipcMain.handle('openStatsImporter', openStatsImporter)
  ipcMain.handle('openPtLeagueExporter', openPtLeagueExporter)
  ipcMain.handle('openTournamentStats', openTournamentStats)

  openLanding()
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
});

async function getTournamentTypes (e, args) {
  return await queryDatabase("SELECT * FROM ootp_data.dbo.TournamentType ORDER BY IsQuick DESC,IsCap DESC,IsLive DESC,[Name] ASC")
}

async function lookupData (e, args) {
  let arr = await queryDatabase("SELECT TOP 5 * FROM ootp_data.dbo.pt_card_list_20240404");
  return arr;
}

async function getRecentTournaments (e, args) {

  let sql = 
   "select TOP 10 [batch].StatsBatchID,[batch].TournamentTypeID, [batch].[Timestamp] [Entry Date], [batch].[Description], t.[Name] "
  +"from dbo.StatsBatch [batch] "
  +"join dbo.TournamentType [t] on [batch].TournamentTypeID = t.TournamentTypeID "
  +"order by [batch].[Timestamp] desc "

  return await queryDatabase(sql)

}

async function findTournamentExports () : Promise<PtDataExportFile[]> {

  const settings = data

  let ptFolders = await readHtmlStatsExport.getAllPtFolders(settings.ootpRoot)
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