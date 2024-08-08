const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('node:path')

const {queryDatabase} = require('./backend/database/DatabaseRecord')
const sqlServerScript = require('./backend/database/sqlServerScript')

const readHtmlStatsExport = require('./backend/statsreader/readHtmlStatsExport')

const loadSettings = require('./settings').loadSettings

const createWindow = () => {
    const win = new BrowserWindow({
      width: 800,
      height: 600,
      webPreferences: {
        preload: path.join(__dirname, 'preload.js')
      } 
    })
  
    win.loadFile('views/index.html')
};

const openPtLeagueExporter = () => {
  const win = new BrowserWindow({
    width: 400,
    height: 300,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    } 
  })

  win.loadFile(path.join('views','ptLeagueExporter.html'))
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
  ipcMain.handle('counter-value', (_event, value) => {
    console.log(value)
    
    let writeResults = readHtmlStatsExport.writeHtmlOutput(value)
    return writeResults // will print value to Node console
    
  })

  ipcMain.handle('getTournamentStats', (_event, value) => {
    console.log(value)

    let battingDataScript = sqlServerScript.battingDataScript.replace('{{tournamentTypeID}}',value.tournamentTypeID)
    return queryDatabase(battingDataScript)

  })

  ipcMain.handle('openFile', lookupData)
  ipcMain.handle('getRecentTournaments', getRecentTournaments)
  ipcMain.handle('getTournamentTypes', getTournamentTypes)
  ipcMain.handle('findTournamentExports', findTournamentExports)

  ipcMain.handle('openPtLeagueExporter', openPtLeagueExporter)
  ipcMain.handle('openTournamentStats', openTournamentStats)

  createWindow()
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

async function findTournamentExports () {

  const settings = await loadSettings()

  let ptFolders = await readHtmlStatsExport.getAllPtFolders(settings.ootpRoot)
    
  let htmlFiles = await readHtmlStatsExport.locateHtmlFiles(ptFolders)

  let htmlFilesToReturn = []
  let curKey = 10

  for (htmlFile of htmlFiles) {
    if (htmlFile.isSuccess) {
      htmlFilesToReturn.push({...htmlFile, key:curKey})
      curKey++
    }
  }

  return htmlFilesToReturn

}