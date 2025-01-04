"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PtCard = void 0;
var PtCard = /** @class */ (function () {
    function PtCard(loadType) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        if (loadType === 'CSV' && args.length === 2) {
            this.csvInit(args[0], args[1]);
        }
        else if (loadType === 'DB' && args.length === 1) {
            this.databaseRecordInit(args[0]);
        }
        else {
            throw Error("Invalid parameters for PtCard initialisation");
        }
    }
    PtCard.prototype.csvInit = function (headings, cardValues) {
        if (headings.length != cardValues.length) {
            throw new Error("csvInit paramters must be the same length");
        }
        var cardRatings = {};
        for (var curHeadingIndex = 0; curHeadingIndex < headings.length; curHeadingIndex++) {
            var curValue = cardValues[curHeadingIndex];
            if (isNum(curValue)) {
                curValue = parseInt(curValue);
            }
            cardRatings[headings[curHeadingIndex].replace(' ', '')] = curValue;
        }
        this.cardRatings = cardRatings;
    };
    PtCard.prototype.databaseRecordInit = function (record) {
        this.cardRatings = record;
    };
    return PtCard;
}());
exports.PtCard = PtCard;
var isNum = function (value) {
    var re = /^\d+$/;
    return re.test(value);
};
module.exports.PtCard = PtCard;
//# sourceMappingURL=PtCard.js.map