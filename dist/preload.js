var _a = require('electron/renderer'), contextBridge = _a.contextBridge, ipcRenderer = _a.ipcRenderer;
window.addEventListener('DOMContentLoaded', function () {
    var replaceText = function (selector, text) {
        var element = document.getElementById(selector);
        if (element)
            element.innerText = text;
    };
    for (var _i = 0, _a = ['chrome', 'node', 'electron']; _i < _a.length; _i++) {
        var dependency = _a[_i];
        replaceText("".concat(dependency, "-version"), process.versions[dependency]);
    }
});
contextBridge.exposeInMainWorld('electronAPI', {
    counterValue: function (value) { return ipcRenderer.invoke('counter-value', value); },
    openFile: function () { return ipcRenderer.invoke('openFile'); },
    getRecentTournaments: function () { return ipcRenderer.invoke('getRecentTournaments'); },
    getTournamentTypes: function () { return ipcRenderer.invoke('getTournamentTypes'); },
    findTournamentExports: function () { return ipcRenderer.invoke('findTournamentExports'); },
    openPtLeagueExporter: function () { return ipcRenderer.invoke('openPtLeagueExporter'); },
    openTournamentStats: function () { return ipcRenderer.invoke('openTournamentStats'); },
    getTournamentStats: function (value) { return ipcRenderer.invoke('getTournamentStats', value); }
});
//# sourceMappingURL=preload.js.map