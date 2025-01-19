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
  writeHtmlTournamentStats: (value) => ipcRenderer.invoke('writeHtmlTournamentStats', value),
  
  openFile: () => ipcRenderer.invoke('openFile'),
  getRecentTournaments: () => ipcRenderer.invoke('getRecentTournaments'),
  getTournamentTypes: () => ipcRenderer.invoke('getTournamentTypes'),
  findTournamentExports: () => ipcRenderer.invoke('findTournamentExports'),
  
  openPtLeagueExporter: () => ipcRenderer.invoke('openPtLeagueExporter'),
  openTournamentStats: () => ipcRenderer.invoke('openTournamentStats'),
  openStatsImporter: () => ipcRenderer.invoke('openStatsImporter'),

  getTournamentStats: (value) => ipcRenderer.invoke('getTournamentStats', value)

})