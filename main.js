const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('node:path')
const {queryDatabase} = require('./backend/DatabaseRecord')

const readHtmlStatsExport = require('./backend/statsreader/readHtmlStatsExport')

const createWindow = () => {
    const win = new BrowserWindow({
      width: 800,
      height: 600,
      webPreferences: {
        preload: path.join(__dirname, 'preload.js')
      } 
    })
  
    win.loadFile('index.html')
};

app.whenReady().then(() => {
  ipcMain.handle('counter-value', (_event, value) => {
    console.log(value)
    return readHtmlStatsExport.writeHtmlOutput(value) // will print value to Node console
  })
  ipcMain.handle('home:openFile', lookupData)
  ipcMain.handle('home:getRecentTournaments', getRecentTournaments)
  ipcMain.handle('home:getTournamentTypes', getTournamentTypes)
  ipcMain.handle('home:findTournamentExports', findTournamentExports)
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

  let ptFolders = await readHtmlStatsExport.getAllPtFolders('C:\\Users\\ericf\\OneDrive\\Documents\\Out of the Park Developments\\OOTP Baseball 25\\')
    
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