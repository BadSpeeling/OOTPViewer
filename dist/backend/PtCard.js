class PtCard {

    constructor (loadType, ...args) {

        if (loadType === 'CSV' && args.length === 2) {
            this.csvInit(args[0], args[1])
        }
        else if (loadType === 'DB' && args.length === 1) {
            this.databaseRecordInit(args[0])
        }
        else {
            throw Error("Invalid parameters for PtCard initialisation")
        }

    }

    csvInit (headings,cardValues) {

        if (headings.length != cardValues.length) {
            throw new Error("csvInit paramters must be the same length");
        }

        let cardRatings = {}

        for (let curHeadingIndex = 0; curHeadingIndex < headings.length; curHeadingIndex++) {

            let curValue = cardValues[curHeadingIndex];

            if (isNum(curValue)) {
                curValue = parseInt(curValue)
            }

            cardRatings[headings[curHeadingIndex].replace(' ', '')] = curValue

        }

        this.cardRatings = cardRatings

    }

    databaseRecordInit(record) {
        this.cardRatings = record;
    }


}

const isNum = (value) => {
    const re = /^\d+$/;
    return re.test(value);
}

module.exports.PtCard = PtCard;