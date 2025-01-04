"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
var tournamentTypePicker_1 = require("./tournamentTypePicker");
var model = {};
$(document).ready(function (e) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            (0, tournamentTypePicker_1.tournamentTypePicker)('tournamentTypeWrapper');
            preparePage();
            $('#collectTournamentsToInsert').click(handleSubmit);
            $('#reloadPage').click(reloadPage);
            return [2 /*return*/];
        });
    });
});
function preparePage() {
    return __awaiter(this, void 0, void 0, function () {
        var _a, _b, tableElement;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _a = model;
                    _b = 'htmlFiles';
                    return [4 /*yield*/, window.electronAPI.findTournamentExports()
                        //build table rows with content
                    ];
                case 1:
                    _a[_b] = _c.sent();
                    tableElement = model['htmlFiles'].map(function (htmlFile) {
                        return "<tr key=".concat(htmlFile['key'], "><td><input type='checkbox'/></td><td>").concat(htmlFile.fileName, "</td><td><input name='Description'/></td><td name='Status'></td></tr>");
                        // return "  <div class='TournamentWriteSelector'>"
                        //         +   `<div>${htmlFile.fileName}</div><div><input name='Description'/></div><div><input type='checkbox'/></div>`
                        //         +"</div>"
                    }).join('');
                    //insert table into UI
                    $('#tournamentOptions').append("<table>"
                        + "<tr><th>Include?</th><th>File</th><th>Description</th><th>Status</th></tr>"
                        + tableElement
                        + "</table>");
                    $('#tournamentList').show();
                    return [2 /*return*/];
            }
        });
    });
}
function reloadPage() {
    $('option#defaultTournament').val('');
    $('#tournamentOptions').empty();
    $('#reloadTable').hide();
    $('#collectTournamentsToInsert').show();
}
function handleSubmit() {
    var htmlTournamentFilesToWrite = collectTournamentsToInsert();
    submitTournaments(htmlTournamentFilesToWrite);
}
function collectTournamentsToInsert() {
    var tournamentKeys = $('input:checked').parents('tr').toArray().map(function (val) { return parseInt(val.getAttribute('key')); });
    var lookupModelValue = function (key) {
        for (var _i = 0, _a = model['htmlFiles']; _i < _a.length; _i++) {
            var curModelValue = _a[_i];
            if (curModelValue['key'] === key) {
                return curModelValue;
            }
        }
    };
    var htmlTournamentFilesToWrite = [];
    for (var _i = 0, tournamentKeys_1 = tournamentKeys; _i < tournamentKeys_1.length; _i++) {
        var curTournamentKey = tournamentKeys_1[_i];
        var curTournamentFile = lookupModelValue(curTournamentKey);
        if (curTournamentFile) {
            htmlTournamentFilesToWrite.push(__assign(__assign({}, curTournamentFile), { description: $("#tournamentList tr[key=".concat(curTournamentKey, "] input[name=Description]")).val(), tournamentTypeID: $('#tournamentType').val(), isCumulativeFlag: 0 }));
        }
    }
    return htmlTournamentFilesToWrite;
}
function submitTournaments(htmlTournamentFilesToWrite) {
    return __awaiter(this, void 0, void 0, function () {
        var _i, htmlTournamentFilesToWrite_1, curHtmlTournamentFile, res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _i = 0, htmlTournamentFilesToWrite_1 = htmlTournamentFilesToWrite;
                    _a.label = 1;
                case 1:
                    if (!(_i < htmlTournamentFilesToWrite_1.length)) return [3 /*break*/, 4];
                    curHtmlTournamentFile = htmlTournamentFilesToWrite_1[_i];
                    uxTournamentRowStatus(curHtmlTournamentFile.key, 'Pending');
                    return [4 /*yield*/, window.electronAPI.writeHtmlTournamentStats(curHtmlTournamentFile)];
                case 2:
                    res = _a.sent();
                    console.log(curHtmlTournamentFile.ptFolder + " : " + res.isSuccess);
                    if (res.isSuccess) {
                        uxTournamentRowStatus(curHtmlTournamentFile.key, 'Success');
                    }
                    else {
                        uxTournamentRowStatus(curHtmlTournamentFile.key, 'Failure');
                        console.log(res.msg);
                    }
                    _a.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4:
                    $('#reloadTable').show();
                    return [2 /*return*/];
            }
        });
    });
}
function getRecentTournaments() {
    return __awaiter(this, void 0, void 0, function () {
        var recentTournaments;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, window.electronAPI.getRecentTournaments()];
                case 1:
                    recentTournaments = _a.sent();
                    $.each(recentTournaments, function (_, tourney) {
                        var timestamp = tourney['Entry Date'];
                        var curDate = "".concat(timestamp.getMonth() + 1, "/").concat(timestamp.getDate(), "/").concat(timestamp.getFullYear(), " ").concat(timestamp.getHours(), ":").concat(timestamp.getMinutes());
                        $('#recentTournaments').append("<tr><td>".concat(curDate, "</td><td>").concat(tourney['Description'], "</td><td>").concat(tourney['Name'], "</td></tr>"));
                    });
                    return [2 /*return*/];
            }
        });
    });
}
function uxTournamentRowStatus(key, status) {
    var statusCell = $("tr[key=".concat(key, "] td[name=Status]"));
    var htmlToInsert = null;
    if (status === 'Pending') {
        htmlToInsert = '<div class="loader"></div>';
    }
    else if (status === 'Success') {
        htmlToInsert = '<div>&#x2705;</div>';
    }
    else if (status === 'Failure') {
        htmlToInsert = '<div>&#x274C;</div>';
    }
    statusCell.html(htmlToInsert);
}
//# sourceMappingURL=renderer.js.map