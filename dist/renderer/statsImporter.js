/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/renderer/statsImporter.ts":
/*!***************************************!*\
  !*** ./src/renderer/statsImporter.ts ***!
  \***************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


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
Object.defineProperty(exports, "__esModule", ({ value: true }));
var tournamentTypePicker_1 = __webpack_require__(/*! ./tournamentTypePicker */ "./src/renderer/tournamentTypePicker.ts");
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


/***/ }),

/***/ "./src/renderer/tournamentTypePicker.ts":
/*!**********************************************!*\
  !*** ./src/renderer/tournamentTypePicker.ts ***!
  \**********************************************/
/***/ (function(__unused_webpack_module, exports) {


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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.tournamentTypePicker = tournamentTypePicker;
function tournamentTypePicker(parentID) {
    return __awaiter(this, void 0, void 0, function () {
        var tournamentTypes;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getTournamentOptions()];
                case 1:
                    tournamentTypes = _a.sent();
                    $("#".concat(parentID)).append(buildHtml(tournamentTypes));
                    return [2 /*return*/];
            }
        });
    });
}
function getTournamentOptions() {
    return __awaiter(this, void 0, void 0, function () {
        var tournamentTypes;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, window.electronAPI.getTournamentTypes()];
                case 1:
                    tournamentTypes = _a.sent();
                    return [2 /*return*/, tournamentTypes];
            }
        });
    });
}
function buildHtml(tournamentTypes) {
    var optionElements = ["<option id=defaultTournament value>Select an option</option>"];
    var tournamentOptions = tournamentTypes.map(function (value) {
        return "<option value=".concat(value['TournamentTypeID'], ">").concat(value['Name'], "</option>");
    });
    optionElements = optionElements.concat(tournamentOptions);
    return "\n        <select id=tournamentType>\n            ".concat(optionElements.join(''), "\n        </select>\n    ");
}


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./src/renderer/statsImporter.ts");
/******/ 	
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUFHLFNBQTRCO29CQUNsRCxDQUFDLENBQUMsV0FBSSxRQUFRLENBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsZUFBZSxDQUFDLENBQUM7Ozs7O0NBRXZEO0FBRUQsU0FBZSxvQkFBb0I7Ozs7O3dCQUNULHFCQUFNLE1BQU0sQ0FBQyxXQUFXLENBQUMsa0JBQWtCLEVBQUU7O29CQUEvRCxlQUFlLEdBQUcsU0FBNkM7b0JBQ25FLHNCQUFPLGVBQWU7Ozs7Q0FDekI7QUFFRCxTQUFTLFNBQVMsQ0FBQyxlQUFlO0lBRTlCLElBQUksY0FBYyxHQUFHLENBQUMsOERBQThELENBQUM7SUFDckYsSUFBSSxpQkFBaUIsR0FBRyxlQUFlLENBQUMsR0FBRyxDQUFDLFVBQUMsS0FBSztRQUM5QyxPQUFPLHdCQUFpQixLQUFLLENBQUMsa0JBQWtCLENBQUMsY0FBSSxLQUFLLENBQUMsTUFBTSxDQUFDLGNBQVc7SUFDakYsQ0FBQyxDQUFDO0lBRUYsY0FBYyxHQUFHLGNBQWMsQ0FBQyxNQUFNLENBQUMsaUJBQWlCLENBQUM7SUFFekQsT0FBTyw0REFFRyxjQUFjLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyw4QkFFaEM7QUFFTCxDQUFDOzs7Ozs7O1VDM0JEO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7VUV0QkE7VUFDQTtVQUNBO1VBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9qcy1vb3Rwdmlld2VyLy4vc3JjL3JlbmRlcmVyL3N0YXRzSW1wb3J0ZXIudHMiLCJ3ZWJwYWNrOi8vanMtb290cHZpZXdlci8uL3NyYy9yZW5kZXJlci90b3VybmFtZW50VHlwZVBpY2tlci50cyIsIndlYnBhY2s6Ly9qcy1vb3Rwdmlld2VyL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2pzLW9vdHB2aWV3ZXIvd2VicGFjay9iZWZvcmUtc3RhcnR1cCIsIndlYnBhY2s6Ly9qcy1vb3Rwdmlld2VyL3dlYnBhY2svc3RhcnR1cCIsIndlYnBhY2s6Ly9qcy1vb3Rwdmlld2VyL3dlYnBhY2svYWZ0ZXItc3RhcnR1cCJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBQdERhdGFFeHBvcnRGaWxlLCBQdERhdGFTdGF0c0ZpbGUgfSBmcm9tICcuLi90eXBlcydcclxuaW1wb3J0IHt0b3VybmFtZW50VHlwZVBpY2tlcn0gZnJvbSBcIi4vdG91cm5hbWVudFR5cGVQaWNrZXJcIlxyXG5cclxuY29uc3QgbW9kZWwgPSB7fVxyXG5cclxuJChkb2N1bWVudCkucmVhZHkoYXN5bmMgZnVuY3Rpb24oZSkge1xyXG4gICAgXHJcbiAgICB0b3VybmFtZW50VHlwZVBpY2tlcigndG91cm5hbWVudFR5cGVXcmFwcGVyJyk7XHJcbiAgICBwcmVwYXJlUGFnZSgpO1xyXG4gICAgJCgnI2NvbGxlY3RUb3VybmFtZW50c1RvSW5zZXJ0JykuY2xpY2soaGFuZGxlU3VibWl0KTtcclxuICAgICQoJyNyZWxvYWRQYWdlJykuY2xpY2socmVsb2FkUGFnZSk7XHJcblxyXG59KVxyXG5cclxuYXN5bmMgZnVuY3Rpb24gcHJlcGFyZVBhZ2UgKCkge1xyXG4gICAgbW9kZWxbJ2h0bWxGaWxlcyddID0gYXdhaXQgd2luZG93LmVsZWN0cm9uQVBJLmZpbmRUb3VybmFtZW50RXhwb3J0cygpXHJcbiAgICAgICAgXHJcbiAgICAvL2J1aWxkIHRhYmxlIHJvd3Mgd2l0aCBjb250ZW50XHJcbiAgICBsZXQgdGFibGVFbGVtZW50ID0gbW9kZWxbJ2h0bWxGaWxlcyddLm1hcCgoaHRtbEZpbGUpID0+IHtcclxuICAgICAgICByZXR1cm4gYDx0ciBrZXk9JHtodG1sRmlsZVsna2V5J119Pjx0ZD48aW5wdXQgdHlwZT0nY2hlY2tib3gnLz48L3RkPjx0ZD4ke2h0bWxGaWxlLmZpbGVOYW1lfTwvdGQ+PHRkPjxpbnB1dCBuYW1lPSdEZXNjcmlwdGlvbicvPjwvdGQ+PHRkIG5hbWU9J1N0YXR1cyc+PC90ZD48L3RyPmBcclxuICAgICAgICAvLyByZXR1cm4gXCIgIDxkaXYgY2xhc3M9J1RvdXJuYW1lbnRXcml0ZVNlbGVjdG9yJz5cIlxyXG4gICAgICAgIC8vICAgICAgICAgKyAgIGA8ZGl2PiR7aHRtbEZpbGUuZmlsZU5hbWV9PC9kaXY+PGRpdj48aW5wdXQgbmFtZT0nRGVzY3JpcHRpb24nLz48L2Rpdj48ZGl2PjxpbnB1dCB0eXBlPSdjaGVja2JveCcvPjwvZGl2PmBcclxuICAgICAgICAvLyAgICAgICAgICtcIjwvZGl2PlwiXHJcbiAgICB9KS5qb2luKCcnKVxyXG5cclxuICAgIC8vaW5zZXJ0IHRhYmxlIGludG8gVUlcclxuICAgICAgICAkKCcjdG91cm5hbWVudE9wdGlvbnMnKS5hcHBlbmQoXCI8dGFibGU+XCJcclxuICAgICsgICBcIjx0cj48dGg+SW5jbHVkZT88L3RoPjx0aD5GaWxlPC90aD48dGg+RGVzY3JpcHRpb248L3RoPjx0aD5TdGF0dXM8L3RoPjwvdHI+XCJcclxuICAgICsgICB0YWJsZUVsZW1lbnRcclxuICAgICsgICBcIjwvdGFibGU+XCIpXHJcblxyXG4gICAgJCgnI3RvdXJuYW1lbnRMaXN0Jykuc2hvdygpXHJcbn1cclxuXHJcbmZ1bmN0aW9uIHJlbG9hZFBhZ2UoKSB7XHJcbiAgICAkKCdvcHRpb24jZGVmYXVsdFRvdXJuYW1lbnQnKS52YWwoJycpXHJcbiAgICAkKCcjdG91cm5hbWVudE9wdGlvbnMnKS5lbXB0eSgpXHJcbiAgICAkKCcjcmVsb2FkVGFibGUnKS5oaWRlKClcclxuICAgICQoJyNjb2xsZWN0VG91cm5hbWVudHNUb0luc2VydCcpLnNob3coKVxyXG59XHJcblxyXG5mdW5jdGlvbiBoYW5kbGVTdWJtaXQgKCkge1xyXG4gICAgXHJcbiAgICBsZXQgaHRtbFRvdXJuYW1lbnRGaWxlc1RvV3JpdGU6IFB0RGF0YUV4cG9ydEZpbGVbXSA9IGNvbGxlY3RUb3VybmFtZW50c1RvSW5zZXJ0KClcclxuICAgIHN1Ym1pdFRvdXJuYW1lbnRzKGh0bWxUb3VybmFtZW50RmlsZXNUb1dyaXRlKVxyXG5cclxufVxyXG5cclxuZnVuY3Rpb24gY29sbGVjdFRvdXJuYW1lbnRzVG9JbnNlcnQoKSB7XHJcblxyXG4gICAgbGV0IHRvdXJuYW1lbnRLZXlzID0gJCgnaW5wdXQ6Y2hlY2tlZCcpLnBhcmVudHMoJ3RyJykudG9BcnJheSgpLm1hcCgodmFsKSA9PiBwYXJzZUludCh2YWwuZ2V0QXR0cmlidXRlKCdrZXknKSkpXHJcblxyXG4gICAgbGV0IGxvb2t1cE1vZGVsVmFsdWUgPSAoa2V5KSA9PiB7XHJcbiAgICAgICAgZm9yIChsZXQgY3VyTW9kZWxWYWx1ZSBvZiBtb2RlbFsnaHRtbEZpbGVzJ10pIHtcclxuICAgICAgICAgICAgaWYgKGN1ck1vZGVsVmFsdWVbJ2tleSddID09PSBrZXkpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBjdXJNb2RlbFZhbHVlXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgbGV0IGh0bWxUb3VybmFtZW50RmlsZXNUb1dyaXRlOiBQdERhdGFFeHBvcnRGaWxlW10gPSBbXVxyXG5cclxuICAgIGZvciAobGV0IGN1clRvdXJuYW1lbnRLZXkgb2YgdG91cm5hbWVudEtleXMpIHtcclxuICAgICAgICBsZXQgY3VyVG91cm5hbWVudEZpbGUgPSBsb29rdXBNb2RlbFZhbHVlKGN1clRvdXJuYW1lbnRLZXkpXHJcbiAgICAgICAgaWYgKGN1clRvdXJuYW1lbnRGaWxlKSB7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBodG1sVG91cm5hbWVudEZpbGVzVG9Xcml0ZS5wdXNoKHtcclxuICAgICAgICAgICAgICAgIC4uLmN1clRvdXJuYW1lbnRGaWxlLFxyXG4gICAgICAgICAgICAgICAgZGVzY3JpcHRpb246JChgI3RvdXJuYW1lbnRMaXN0IHRyW2tleT0ke2N1clRvdXJuYW1lbnRLZXl9XSBpbnB1dFtuYW1lPURlc2NyaXB0aW9uXWApLnZhbCgpLFxyXG4gICAgICAgICAgICAgICAgdG91cm5hbWVudFR5cGVJRDokKCcjdG91cm5hbWVudFR5cGUnKS52YWwoKSxcclxuICAgICAgICAgICAgICAgIGlzQ3VtdWxhdGl2ZUZsYWc6IDBcclxuICAgICAgICAgICAgfSlcclxuXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBodG1sVG91cm5hbWVudEZpbGVzVG9Xcml0ZVxyXG5cclxufVxyXG5cclxuYXN5bmMgZnVuY3Rpb24gc3VibWl0VG91cm5hbWVudHMgKGh0bWxUb3VybmFtZW50RmlsZXNUb1dyaXRlKSB7XHJcblxyXG4gICAgZm9yIChsZXQgY3VySHRtbFRvdXJuYW1lbnRGaWxlIG9mIGh0bWxUb3VybmFtZW50RmlsZXNUb1dyaXRlKSB7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdXhUb3VybmFtZW50Um93U3RhdHVzKGN1ckh0bWxUb3VybmFtZW50RmlsZS5rZXksICdQZW5kaW5nJylcclxuICAgICAgICBjb25zdCByZXMgPSBhd2FpdCB3aW5kb3cuZWxlY3Ryb25BUEkud3JpdGVIdG1sVG91cm5hbWVudFN0YXRzKGN1ckh0bWxUb3VybmFtZW50RmlsZSlcclxuXHJcbiAgICAgICAgY29uc29sZS5sb2coY3VySHRtbFRvdXJuYW1lbnRGaWxlLnB0Rm9sZGVyICsgXCIgOiBcIiArIHJlcy5pc1N1Y2Nlc3MpXHJcbiAgICAgICAgXHJcbiAgICAgICAgaWYgKHJlcy5pc1N1Y2Nlc3MpIHtcclxuICAgICAgICAgICAgdXhUb3VybmFtZW50Um93U3RhdHVzKGN1ckh0bWxUb3VybmFtZW50RmlsZS5rZXksICdTdWNjZXNzJylcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHV4VG91cm5hbWVudFJvd1N0YXR1cyhjdXJIdG1sVG91cm5hbWVudEZpbGUua2V5LCAnRmFpbHVyZScpXHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHJlcy5tc2cpXHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgfVxyXG5cclxuICAgICQoJyNyZWxvYWRUYWJsZScpLnNob3coKVxyXG5cclxufVxyXG5cclxuYXN5bmMgZnVuY3Rpb24gZ2V0UmVjZW50VG91cm5hbWVudHMgKCkge1xyXG4gICAgbGV0IHJlY2VudFRvdXJuYW1lbnRzID0gYXdhaXQgd2luZG93LmVsZWN0cm9uQVBJLmdldFJlY2VudFRvdXJuYW1lbnRzKClcclxuICAgIFxyXG4gICAgJC5lYWNoKHJlY2VudFRvdXJuYW1lbnRzLCAoXyx0b3VybmV5KSA9PiB7XHJcbiAgICAgICAgbGV0IHRpbWVzdGFtcCA9IHRvdXJuZXlbJ0VudHJ5IERhdGUnXVxyXG4gICAgICAgIGxldCBjdXJEYXRlID0gYCR7dGltZXN0YW1wLmdldE1vbnRoKCkrMX0vJHt0aW1lc3RhbXAuZ2V0RGF0ZSgpfS8ke3RpbWVzdGFtcC5nZXRGdWxsWWVhcigpfSAke3RpbWVzdGFtcC5nZXRIb3VycygpfToke3RpbWVzdGFtcC5nZXRNaW51dGVzKCl9YFxyXG4gICAgICAgICQoJyNyZWNlbnRUb3VybmFtZW50cycpLmFwcGVuZChgPHRyPjx0ZD4ke2N1ckRhdGV9PC90ZD48dGQ+JHt0b3VybmV5WydEZXNjcmlwdGlvbiddfTwvdGQ+PHRkPiR7dG91cm5leVsnTmFtZSddfTwvdGQ+PC90cj5gKVxyXG4gICAgfSlcclxufVxyXG5cclxuZnVuY3Rpb24gdXhUb3VybmFtZW50Um93U3RhdHVzIChrZXksIHN0YXR1cykge1xyXG5cclxuICAgIGNvbnN0IHN0YXR1c0NlbGwgPSAkKGB0cltrZXk9JHtrZXl9XSB0ZFtuYW1lPVN0YXR1c11gKVxyXG4gICAgbGV0IGh0bWxUb0luc2VydCA9IG51bGxcclxuXHJcbiAgICBpZiAoc3RhdHVzID09PSAnUGVuZGluZycpIHtcclxuICAgICAgICBodG1sVG9JbnNlcnQgPSAnPGRpdiBjbGFzcz1cImxvYWRlclwiPjwvZGl2PidcclxuICAgIH1cclxuICAgIGVsc2UgaWYgKHN0YXR1cyA9PT0gJ1N1Y2Nlc3MnKSB7XHJcbiAgICAgICAgaHRtbFRvSW5zZXJ0ID0gJzxkaXY+JiN4MjcwNTs8L2Rpdj4nXHJcbiAgICB9XHJcbiAgICBlbHNlIGlmIChzdGF0dXMgPT09ICdGYWlsdXJlJykge1xyXG4gICAgICAgIGh0bWxUb0luc2VydCA9ICc8ZGl2PiYjeDI3NEM7PC9kaXY+J1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXR1c0NlbGwuaHRtbChodG1sVG9JbnNlcnQpXHJcblxyXG59IiwiZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHRvdXJuYW1lbnRUeXBlUGlja2VyIChwYXJlbnRJRCkge1xyXG4gICAgXHJcbiAgICBsZXQgdG91cm5hbWVudFR5cGVzID0gYXdhaXQgZ2V0VG91cm5hbWVudE9wdGlvbnMoKVxyXG4gICAgJChgIyR7cGFyZW50SUR9YCkuYXBwZW5kKGJ1aWxkSHRtbCh0b3VybmFtZW50VHlwZXMpKVxyXG5cclxufVxyXG5cclxuYXN5bmMgZnVuY3Rpb24gZ2V0VG91cm5hbWVudE9wdGlvbnMoKSB7XHJcbiAgICBsZXQgdG91cm5hbWVudFR5cGVzID0gYXdhaXQgd2luZG93LmVsZWN0cm9uQVBJLmdldFRvdXJuYW1lbnRUeXBlcygpXHJcbiAgICByZXR1cm4gdG91cm5hbWVudFR5cGVzXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGJ1aWxkSHRtbCh0b3VybmFtZW50VHlwZXMpIHtcclxuXHJcbiAgICBsZXQgb3B0aW9uRWxlbWVudHMgPSBbYDxvcHRpb24gaWQ9ZGVmYXVsdFRvdXJuYW1lbnQgdmFsdWU+U2VsZWN0IGFuIG9wdGlvbjwvb3B0aW9uPmBdXHJcbiAgICBsZXQgdG91cm5hbWVudE9wdGlvbnMgPSB0b3VybmFtZW50VHlwZXMubWFwKCh2YWx1ZSkgPT4ge1xyXG4gICAgICAgIHJldHVybiBgPG9wdGlvbiB2YWx1ZT0ke3ZhbHVlWydUb3VybmFtZW50VHlwZUlEJ119PiR7dmFsdWVbJ05hbWUnXX08L29wdGlvbj5gXHJcbiAgICB9KVxyXG5cclxuICAgIG9wdGlvbkVsZW1lbnRzID0gb3B0aW9uRWxlbWVudHMuY29uY2F0KHRvdXJuYW1lbnRPcHRpb25zKVxyXG5cclxuICAgIHJldHVybiBgXHJcbiAgICAgICAgPHNlbGVjdCBpZD10b3VybmFtZW50VHlwZT5cclxuICAgICAgICAgICAgJHtvcHRpb25FbGVtZW50cy5qb2luKCcnKX1cclxuICAgICAgICA8L3NlbGVjdD5cclxuICAgIGBcclxuXHJcbn0iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiIiwiLy8gc3RhcnR1cFxuLy8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4vLyBUaGlzIGVudHJ5IG1vZHVsZSBpcyByZWZlcmVuY2VkIGJ5IG90aGVyIG1vZHVsZXMgc28gaXQgY2FuJ3QgYmUgaW5saW5lZFxudmFyIF9fd2VicGFja19leHBvcnRzX18gPSBfX3dlYnBhY2tfcmVxdWlyZV9fKFwiLi9zcmMvcmVuZGVyZXIvc3RhdHNJbXBvcnRlci50c1wiKTtcbiIsIiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==