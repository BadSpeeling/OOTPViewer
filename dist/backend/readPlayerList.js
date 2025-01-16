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
var fs = require("fs");
var PtCard_1 = require("./PtCard");
var PtConnection_1 = require("./database/PtConnection");
var Request = require('tedious').Request;
var TYPES = require('tedious').TYPES;
var uttCards = require('./database/uttColumns').uttCards;
function readFile(file) {
    return new Promise(function (resolve, reject) {
        fs.readFile(file, 'utf-8', function (err, data) {
            if (!err) {
                var lines = data.split('\r\n');
                var headers = removeTrailingComma(lines[0]).replace('//', '').replaceAll(' ', '').split(',');
                headers = headers.map(function (value) { return value.trim(); });
                var parsedData = [];
                for (var index = 1; index < lines.length; index++) {
                    //make sure the line isn't empty
                    if (lines[index] !== '') {
                        var curCardLine = removeTrailingComma(lines[index]).split(',');
                        var curPtCard = new PtCard_1.PtCard("CSV", headers, curCardLine);
                        parsedData.push(curPtCard);
                    }
                }
                resolve({ headers: headers, parsedData: parsedData });
            }
        });
    });
}
var removeTrailingComma = function (line) {
    return line.substring(0, line.length - 1);
};
function readPlayerList() {
    return __awaiter(this, void 0, void 0, function () {
        var file, csvResult, ptConnection, connection, uttRows, cards, headers, uttColumns, cardIndex, uttRow, headerIndex, uttValue, table, request, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    file = 'C:\\Users\\ericf\\OneDrive\\Documents\\Out of the Park Developments\\OOTP Baseball 25\\online_data\\pt_card_list.csv';
                    return [4 /*yield*/, readFile(file)];
                case 1:
                    csvResult = _a.sent();
                    ptConnection = new PtConnection_1.PtConnection();
                    return [4 /*yield*/, ptConnection.connect()];
                case 2:
                    connection = _a.sent();
                    uttRows = [];
                    cards = csvResult.parsedData;
                    headers = csvResult.headers;
                    uttColumns = uttCards;
                    for (cardIndex = 0; cardIndex < cards.length; cardIndex++) {
                        uttRow = [];
                        for (headerIndex = 0; headerIndex < uttColumns.length; headerIndex++) {
                            uttValue = cards[cardIndex].cardRatings[uttColumns[headerIndex].name];
                            uttRow.push(uttValue !== undefined ? uttValue : null);
                        }
                        uttRows.push(uttRow);
                    }
                    table = {
                        columns: uttColumns,
                        rows: uttRows
                    };
                    request = new Request("spInsertCards", function (err) {
                        if (!err) {
                            console.log('spInsertCards execute without error');
                        }
                        else {
                            console.log(err);
                        }
                    });
                    //console.log(uttRows);
                    request.addParameter('playerCards', TYPES.TVP, table);
                    result = connection.callProcedure(request);
                    return [2 /*return*/];
            }
        });
    });
}
readPlayerList();
//# sourceMappingURL=readPlayerList.js.map