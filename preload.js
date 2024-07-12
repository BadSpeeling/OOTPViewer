const { contextBridge, ipcRenderer } = require('electron/renderer')

window.addEventListener('DOMContentLoaded', () => {
    const replaceText = (selector, text) => {
      const element = document.getElementById(selector)
      if (element) element.innerText = text
    }
  
    for (const dependency of ['chrome', 'node', 'electron']) {
      replaceText(`${dependency}-version`, process.versions[dependency])
    }
})

contextBridge.exposeInMainWorld('electronAPI', {
  counterValue: (value) => ipcRenderer.invoke('counter-value', value),
  
  openFile: () => ipcRenderer.invoke('home:openFile'),
  getRecentTournaments: () => ipcRenderer.invoke('home:getRecentTournaments'),
  getTournamentTypes: () => ipcRenderer.invoke('home:getTournamentTypes'),
  findTournamentExports: () => ipcRenderer.invoke('home:findTournamentExports')
})