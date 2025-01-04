"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.writeHtmlOutput = writeHtmlOutput;
exports.getAllPtFolders = getAllPtFolders;
exports.locateHtmlFiles = locateHtmlFiles;
var node_html_parser_1 = require("node-html-parser");
var fs = require("fs");
var path = require("path");
var PtConnection_1 = require("./database/PtConnection");
var uttColumns_1 = require("./database/uttColumns");
var tedious_1 = require("tedious");
var tedious_2 = require("tedious");
//let ptFolderRoot = savedGames + '\\' + file + 'news\\html\\temp\\'
var headerTypes = ["generalValues", "battingValues", "pitchingValues", "fieldingValues"];
function writeHtmlOutput(htmlOutput) {
    return __awaiter(this, void 0, void 0, function () {
        var tournamentOutput, writeResults, fileDeleteResults;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, convertHtmlFileToTournamentOutput(htmlOutput)
                    //return await writeTournamentStats(tournamentOutput, htmlOutput)
                ];
                case 1:
                    tournamentOutput = _a.sent();
                    return [4 /*yield*/, writeTournamentStats(tournamentOutput, htmlOutput)];
                case 2:
                    writeResults = _a.sent();
                    if (!writeResults.isSuccess) return [3 /*break*/, 4];
                    return [4 /*yield*/, clearPtFolderHtmlFiles(htmlOutput.path)];
                case 3:
                    fileDeleteResults = _a.sent();
                    return [2 /*return*/, fileDeleteResults[0]];
                case 4: return [2 /*return*/, writeResults];
            }
        });
    });
}
var UttParameter = /** @class */ (function () {
    function UttParameter(columns) {
        this.uttColumns = columns;
        this.uttRows = [];
    }
    UttParameter.prototype.handleUttRow = function (generalValues, tournamentStatRow) {
        if (tournamentStatRow['G'] > 0) {
            var curUttRow = [generalValues['CID'], generalValues['TM']];
            for (var _i = 0, _a = this.uttColumns; _i < _a.length; _i++) {
                var uttColumn = _a[_i];
                var curValue = tournamentStatRow[uttColumn.name];
                curUttRow.push(curValue ? curValue : 0);
            }
            this.uttRows.push(curUttRow);
        }
    };
    UttParameter.prototype.getSpParameter = function () {
        return {
            columns: uttColumns_1.uttGeneralColumns.concat(this.uttColumns),
            rows: this.uttRows
        };
    };
    return UttParameter;
}());
function writeTournamentStats(tournamentOutput, htmlOutput) {
    var _this = this;
    return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
        var ptConnection, connection, tournamentStats, battingParam, pitchingParam, fieldingParam, _i, tournamentStats_1, tournamentStatRow, request, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    ptConnection = new PtConnection_1.PtConnection();
                    return [4 /*yield*/, ptConnection.connect()];
                case 1:
                    connection = _a.sent();
                    tournamentStats = tournamentOutput.stats;
                    battingParam = new UttParameter(uttColumns_1.uttBattingColumns);
                    pitchingParam = new UttParameter(uttColumns_1.uttPitchingColumns);
                    fieldingParam = new UttParameter(uttColumns_1.uttFieldingColumns);
                    for (_i = 0, tournamentStats_1 = tournamentStats; _i < tournamentStats_1.length; _i++) {
                        tournamentStatRow = tournamentStats_1[_i];
                        battingParam.handleUttRow(tournamentStatRow['generalValues'], tournamentStatRow['battingValues']);
                        pitchingParam.handleUttRow(tournamentStatRow['generalValues'], tournamentStatRow['pitchingValues']);
                        fieldingParam.handleUttRow(tournamentStatRow['generalValues'], tournamentStatRow['fieldingValues']);
                    }
                    request = new tedious_1.Request("spInsertStats", function (err) {
                        if (!err) {
                            resolve({ isSuccess: true, msg: 'spInsertStats execute without error' });
                        }
                        else {
                            reject({ isSuccess: false, msg: err });
                        }
                    });
                    //console.log(uttRows);
                    request.addParameter('pBattingStats', tedious_2.TYPES.TVP, battingParam.getSpParameter());
                    request.addParameter('pPitchingStats', tedious_2.TYPES.TVP, pitchingParam.getSpParameter());
                    request.addParameter('pFieldingStats', tedious_2.TYPES.TVP, fieldingParam.getSpParameter());
                    request.addParameter('pDescription', tedious_2.TYPES.VarChar, htmlOutput.description);
                    request.addParameter('pTournamentTypeID', tedious_2.TYPES.Int, htmlOutput.tournamentTypeID);
                    request.addParameter('pIsCumulativeFlag', tedious_2.TYPES.Bit, htmlOutput.isCumulativeFlag);
                    result = connection.callProcedure(request);
                    return [2 /*return*/];
            }
        });
    }); });
}
function convertHtmlFileToTournamentOutput(htmlFile) {
    return __awaiter(this, void 0, void 0, function () {
        var res, tournamentStats, _i, _a, stats;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, parseHtmlDataExport(htmlFile)];
                case 1:
                    res = _b.sent();
                    tournamentStats = [];
                    for (_i = 0, _a = res.parsedStats; _i < _a.length; _i++) {
                        stats = _a[_i];
                        tournamentStats.push(processStatsIntoCategories(res.parsedHeaders, stats));
                    }
                    return [2 /*return*/, { "stats": tournamentStats, "headers": res.parsedHeaders }];
            }
        });
    });
}
function processStatsIntoCategories(headers, stats) {
    if (headers.length !== stats.length) {
        throw new Error("Headers and Stats are not the same length!\n" + headers + "\n" + stats);
    }
    var statsCategories = {
        generalStats: {},
        battingStats: {},
        pitchingStats: {},
        fieldingStats: {},
    };
    var curHeaderTypeIndex = 0;
    var statsTypeSeperator = 'G';
    var curStatsCategory = {};
    var setCurStatsCategory = function () {
        statsCategories[headerTypes[curHeaderTypeIndex]] = curStatsCategory;
        curStatsCategory = {};
    };
    for (var curStatIndex = 0; curStatIndex < stats.length; curStatIndex++) {
        var curHeader = headers[curStatIndex];
        if (curHeader === statsTypeSeperator) {
            setCurStatsCategory();
            curHeaderTypeIndex += 1;
        }
        curStatsCategory[curHeader] = stats[curStatIndex];
    }
    setCurStatsCategory(); //the last set of stats we built still needs to be inserted
    return statsCategories;
}
function parseHtmlDataExport(htmlFile) {
    return new Promise(function (resolve, reject) {
        fs.readFile(path.join(htmlFile.path, htmlFile.fileName), 'utf-8', function (err, data) {
            var root = (0, node_html_parser_1.parse)(data);
            var statsTable = root.querySelector('table.data.sortable');
            var headers = statsTable.querySelector('tr:first-child');
            var statsRows = statsTable.querySelectorAll('tr:not(:first-child)');
            var parsedHeaders = headers.querySelectorAll('th').map(function (curHeader) { return curHeader.text; });
            var parsedStats = [];
            for (var _i = 0, statsRows_1 = statsRows; _i < statsRows_1.length; _i++) {
                var statsRow = statsRows_1[_i];
                var curStats = statsRow.querySelectorAll('td');
                if (curStats.length === parsedHeaders.length) {
                    var curStatsTxt = curStats.map(function (value, parsedHeadersIndex) {
                        var statText = value.removeWhitespace().text !== '' ? value.text : '0';
                        var statNumber = Number(statText);
                        return parsedHeaders[parsedHeadersIndex].trim() === 'TM' || isNaN(statNumber) ? statText : statNumber;
                    });
                    parsedStats.push(curStatsTxt);
                }
                else {
                    reject({ "err": "The amount of columns in the data row did not match the amount of columns in the header" });
                }
            }
            resolve({ parsedHeaders: parsedHeaders, parsedStats: parsedStats });
        });
    });
}
//await these 
function clearPtFolderHtmlFiles(htmlStatsFolder) {
    return __awaiter(this, void 0, void 0, function () {
        var files, deletedFilesStatus;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, new Promise(function (resolve, reject) {
                        fs.readdir(htmlStatsFolder, function (err, files) {
                            if (!err) {
                                resolve(files);
                            }
                            else {
                                reject(err);
                            }
                        });
                    })];
                case 1:
                    files = _a.sent();
                    return [4 /*yield*/, Promise.all(files.map(function (file) {
                            return new Promise(function (resolve, reject) {
                                fs.unlink(path.join(htmlStatsFolder, file), function (err) {
                                    if (err)
                                        reject({ isSuccess: false, err: err });
                                    resolve({ isSuccess: true });
                                });
                            });
                        }))];
                case 2:
                    deletedFilesStatus = _a.sent();
                    return [2 /*return*/, deletedFilesStatus];
            }
        });
    });
}
function getAllPtFolders(root) {
    return new Promise(function (resolve, reject) {
        var savedGames = path.join(root, 'saved_games');
        var ptFolders = [];
        fs.readdir(savedGames, function (err, files) {
            files.forEach(function (file) {
                if (file.includes(".pt")) {
                    ptFolders.push(path.join(savedGames, file));
                }
            });
            resolve(ptFolders);
        });
    });
}
function locateHtmlFiles(ptFolders) {
    return Promise.all(ptFolders.map(function (ptFolder, index) {
        return new Promise(function (resolve, reject) {
            var htmlStatsFolder = path.join(ptFolder, 'news', 'html', 'temp');
            fs.readdir(htmlStatsFolder, function (err, files) {
                if (err) {
                    resolve({
                        isSuccess: false,
                        ptFolder: ptFolder,
                        path: htmlStatsFolder,
                        msg: ptFolder + " had an issue locating the output directory",
                        key: index,
                    });
                }
                else {
                    if (files.length === 1) {
                        resolve({
                            isSuccess: true,
                            ptFolder: ptFolder,
                            path: htmlStatsFolder,
                            fileName: files[0],
                            key: index,
                        });
                    }
                    else if (files.length > 1) {
                        console.log(htmlStatsFolder + " has more than 1 output file");
                        clearPtFolderHtmlFiles(htmlStatsFolder);
                        resolve({
                            isSuccess: false,
                            ptFolder: ptFolder,
                            path: htmlStatsFolder,
                            msg: htmlStatsFolder + " has more than 1 output file",
                            key: index,
                        });
                    }
                    else {
                        resolve({
                            isSuccess: false,
                            ptFolder: ptFolder,
                            path: htmlStatsFolder,
                            msg: htmlStatsFolder + " has no output files",
                            key: index,
                        });
                    }
                }
            });
        });
    }));
}
//# sourceMappingURL=readHtmlStatsExport.js.map