const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('node:path')
const {queryDatabase} = require('./backend/DatabaseRecord')

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
  ipcMain.handle('home:openFile', lookupData)
  ipcMain.handle('home:getRecentTournaments', getRecentTournaments)
  createWindow()
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
});

async function lookupData (e, args) {
  let arr = await queryDatabase("SELECT TOP 5 * FROM ootp_data.dbo.pt_card_list_20240404");
  return arr;
}

async function getRecentTournaments (e, args) {

  let sql = 
   "select TOP 10 [batch].BatchID,[batch].TournamentTypeID, [batch].[Timestamp] [Entry Date], [batch].[Description], t.[Name] "
  +"from dbo.stats_batch [batch] "
  +"join dbo.tournament_type [t] on [batch].TournamentTypeID = t.ID "
  +"order by [batch].[Timestamp] desc "

  return await queryDatabase(sql)

}