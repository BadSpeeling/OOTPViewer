/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/renderer/landing.ts":
/*!*********************************!*\
  !*** ./src/renderer/landing.ts ***!
  \*********************************/
/***/ (function() {

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
$(document).ready(function (e) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            $('#openStatsImporter').click(function (e) {
                window.electronAPI.openStatsImporter();
            });
            $('#openStatsViewer').click(function (e) {
                window.electronAPI.openTournamentStats();
            });
            $('#openCardMarketManager').click(function (e) {
            });
            return [2 /*return*/];
        });
    });
});


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/renderer/landing.ts"]();
/******/ 	
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGFuZGluZy5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsS0FBSyxDQUFDLFVBQWUsQ0FBQzs7O1lBRTlCLENBQUMsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLEtBQUssQ0FBQyxVQUFDLENBQUM7Z0JBQzVCLE1BQU0sQ0FBQyxXQUFXLENBQUMsaUJBQWlCLEVBQUU7WUFDMUMsQ0FBQyxDQUFDLENBQUM7WUFFSCxDQUFDLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxLQUFLLENBQUMsVUFBQyxDQUFDO2dCQUMzQixNQUFNLENBQUMsV0FBVyxDQUFDLG1CQUFtQixFQUFFO1lBQzNDLENBQUMsQ0FBQyxDQUFDO1lBRUgsQ0FBQyxDQUFDLHdCQUF3QixDQUFDLENBQUMsS0FBSyxDQUFDLFVBQUMsQ0FBQztZQUVwQyxDQUFDLENBQUMsQ0FBQzs7OztDQUVOLENBQUMsQ0FBQzs7Ozs7Ozs7VUVkSDtVQUNBO1VBQ0E7VUFDQTtVQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vanMtb290cHZpZXdlci8uL3NyYy9yZW5kZXJlci9sYW5kaW5nLnRzIiwid2VicGFjazovL2pzLW9vdHB2aWV3ZXIvd2VicGFjay9iZWZvcmUtc3RhcnR1cCIsIndlYnBhY2s6Ly9qcy1vb3Rwdmlld2VyL3dlYnBhY2svc3RhcnR1cCIsIndlYnBhY2s6Ly9qcy1vb3Rwdmlld2VyL3dlYnBhY2svYWZ0ZXItc3RhcnR1cCJdLCJzb3VyY2VzQ29udGVudCI6WyIkKGRvY3VtZW50KS5yZWFkeShhc3luYyBmdW5jdGlvbihlKSB7XHJcblxyXG4gICAgJCgnI29wZW5TdGF0c0ltcG9ydGVyJykuY2xpY2soKGUpID0+IHtcclxuICAgICAgICB3aW5kb3cuZWxlY3Ryb25BUEkub3BlblN0YXRzSW1wb3J0ZXIoKVxyXG4gICAgfSk7XHJcblxyXG4gICAgJCgnI29wZW5TdGF0c1ZpZXdlcicpLmNsaWNrKChlKSA9PiB7XHJcbiAgICAgICB3aW5kb3cuZWxlY3Ryb25BUEkub3BlblRvdXJuYW1lbnRTdGF0cygpIFxyXG4gICAgfSk7XHJcblxyXG4gICAgJCgnI29wZW5DYXJkTWFya2V0TWFuYWdlcicpLmNsaWNrKChlKSA9PiB7XHJcbiAgICAgICAgXHJcbiAgICB9KTtcclxuXHJcbn0pOyIsIiIsIi8vIHN0YXJ0dXBcbi8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuLy8gVGhpcyBlbnRyeSBtb2R1bGUgaXMgcmVmZXJlbmNlZCBieSBvdGhlciBtb2R1bGVzIHNvIGl0IGNhbid0IGJlIGlubGluZWRcbnZhciBfX3dlYnBhY2tfZXhwb3J0c19fID0ge307XG5fX3dlYnBhY2tfbW9kdWxlc19fW1wiLi9zcmMvcmVuZGVyZXIvbGFuZGluZy50c1wiXSgpO1xuIiwiIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9