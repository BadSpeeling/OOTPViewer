var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _a = require('electron'), app = _a.app, BrowserWindow = _a.BrowserWindow, ipcMain = _a.ipcMain;
var path = require('node:path');
var queryDatabase = require('./backend/database/DatabaseRecord').queryDatabase;
var sqlServerScript = require('./backend/database/sqlServerScript');
var readHtmlStatsExport = require('./backend/readHtmlStatsExport');
var loadSettings = require('./settings').loadSettings;
var createWindow = function () {
    var win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    });
    win.loadFile('views/index.html');
};
var openPtLeagueExporter = function () {
    var win = new BrowserWindow({
        width: 400,
        height: 300,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    });
    win.loadFile(path.join('views', 'ptLeagueExporter.html'));
};
var openTournamentStats = function () {
    var win = new BrowserWindow({
        width: 400,
        height: 300,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    });
    win.loadFile(path.join('views', 'tournamentStats.html'));
};
app.whenReady().then(function () {
    ipcMain.handle('counter-value', function (_event, value) {
        console.log(value);
        var writeResults = readHtmlStatsExport.writeHtmlOutput(value);
        return writeResults;
    });
    ipcMain.handle('getTournamentStats', function (_event, value) {
        console.log(value);
        var dataScript;
        var statsTypeID = value.statsTypeID;
        var tournamentTypeID = value.tournamentTypeID.replace('-', '');
        var qualifierValue = value.qualifierValue.replace('-', '');
        if (statsTypeID === '0') {
            dataScript = sqlServerScript.battingDataScript;
        }
        else if (statsTypeID === '1') {
            dataScript = sqlServerScript.pitchingDataScript;
        }
        else {
            throw Error(statsTypeID + ' is not a valid statsTypeID value');
        }
        dataScript = dataScript.replace('{{tournamentTypeID}}', tournamentTypeID);
        dataScript = dataScript.replace('{{qualifierValue}}', qualifierValue);
        return queryDatabase(dataScript);
    });
    ipcMain.handle('openFile', lookupData);
    ipcMain.handle('getRecentTournaments', getRecentTournaments);
    ipcMain.handle('getTournamentTypes', getTournamentTypes);
    ipcMain.handle('findTournamentExports', findTournamentExports);
    ipcMain.handle('openPtLeagueExporter', openPtLeagueExporter);
    ipcMain.handle('openTournamentStats', openTournamentStats);
    createWindow();
});
app.on('window-all-closed', function () {
    if (process.platform !== 'darwin')
        app.quit();
});
function getTournamentTypes(e, args) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, queryDatabase("SELECT * FROM ootp_data.dbo.TournamentType ORDER BY IsQuick DESC,IsCap DESC,IsLive DESC,[Name] ASC")];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
function lookupData(e, args) {
    return __awaiter(this, void 0, void 0, function () {
        var arr;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, queryDatabase("SELECT TOP 5 * FROM ootp_data.dbo.pt_card_list_20240404")];
                case 1:
                    arr = _a.sent();
                    return [2 /*return*/, arr];
            }
        });
    });
}
function getRecentTournaments(e, args) {
    return __awaiter(this, void 0, void 0, function () {
        var sql;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    sql = "select TOP 10 [batch].StatsBatchID,[batch].TournamentTypeID, [batch].[Timestamp] [Entry Date], [batch].[Description], t.[Name] "
                        + "from dbo.StatsBatch [batch] "
                        + "join dbo.TournamentType [t] on [batch].TournamentTypeID = t.TournamentTypeID "
                        + "order by [batch].[Timestamp] desc ";
                    return [4 /*yield*/, queryDatabase(sql)];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
function findTournamentExports() {
    return __awaiter(this, void 0, void 0, function () {
        var settings, ptFolders, htmlFiles, htmlFilesToReturn, curKey, _i, htmlFiles_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, loadSettings()];
                case 1:
                    settings = _a.sent();
                    return [4 /*yield*/, readHtmlStatsExport.getAllPtFolders(settings.ootpRoot)];
                case 2:
                    ptFolders = _a.sent();
                    return [4 /*yield*/, readHtmlStatsExport.locateHtmlFiles(ptFolders)];
                case 3:
                    htmlFiles = _a.sent();
                    htmlFilesToReturn = [];
                    curKey = 10;
                    for (_i = 0, htmlFiles_1 = htmlFiles; _i < htmlFiles_1.length; _i++) {
                        htmlFile = htmlFiles_1[_i];
                        if (htmlFile.isSuccess) {
                            htmlFilesToReturn.push(__assign(__assign({}, htmlFile), { key: curKey }));
                            curKey++;
                        }
                    }
                    return [2 /*return*/, htmlFilesToReturn];
            }
        });
    });
}
//# sourceMappingURL=main.js.map