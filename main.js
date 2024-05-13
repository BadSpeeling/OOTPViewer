const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('node:path')
const {initPageData} = require('./backend/card')

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
    ipcMain.handle('dialog:openFile', lookupData)
    createWindow()
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
});

async function lookupData () {
    let arr = await initPageData();
    return arr;
}
