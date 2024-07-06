const parse = require('node-html-parser').parse
const fs = require('fs')

const PtConnection = require('../PtConnection').PtConnection
const {uttGeneralColumns,uttBattingColumns} = require('../uttColumns')

const Request = require('tedious').Request;  
const TYPES = require('tedious').TYPES;  

//let ptFolderRoot = savedGames + '\\' + file + 'news\\html\\temp\\'

const headerTypes = ["generalValues","battingValues","pitchingValues","fieldingValues"];

async function run () {

    let settings = await loadSettings()    
    let ptFolders = await getAllPtFolders(settings.ootpRoot)
    
    let htmlFiles = await locateHtmlFiles(ptFolders)
    let htmlFilesToProcess = []

    for (htmlFile of htmlFiles) {
        if (htmlFile.isSuccess) htmlFilesToProcess.push(htmlFile)
    }
    
    let tournamentOutput = await convertHtmlFileToTournamentOutput(htmlFilesToProcess[0])
    writeTournamentStats(tournamentOutput)

}

class UttParameter {

    constructor (columns) {
        this.uttColumns = columns
        this.uttRows = []
    }

    handleUttRow (generalValues,tournamentStatRow) {

        if (tournamentStatRow['G'] > 0) {

            let curUttRow = [generalValues['CID'],generalValues['TM']]

            for (let uttColumn of this.uttColumns) {

                let curValue = tournamentStatRow[uttColumn.name]
                curUttRow.push(curValue ? curValue : null)

            }
        
            this.uttRows.push(curUttRow)

        }

    }

    getSpParameter () {
        return {
            columns: uttGeneralColumns.concat(this.uttColumns),
            rows: this.uttRows
        };
    }

}

function writeTournamentStats (tournamentOutput) {

    return new Promise (async (resolve,reject) => {

        let ptConnection = new PtConnection();
        let connection = await ptConnection.connect();

        let tournamentStats = tournamentOutput.stats

        battingParam = new UttParameter(uttBattingColumns)
        //pitchingParam = new UttParameter(uttPitchingColumns)
        //fieldingParam = new UttParameter(uttFieldingColumns)

        for (tournamentStatRow of tournamentStats) {

            battingParam.handleUttRow(tournamentStatRow['generalValues'],tournamentStatRow['battingValues'])

        }

        var request = new Request("spInsertStats", function(err) {
            if (!err) {
                console.log('spInsertStats execute without error');
            }
            else {
                console.log(err);
            }
        });
    
        //console.log(uttRows);
        request.addParameter('pBattingStats', TYPES.TVP, battingParam.getSpParameter());
        
        let result = connection.callProcedure(request);

    })

}



//lookup what uttColumns are present in the headers built from the output
function buildUttColumns (headers, allUttColumns) {

    let searchUttColumns = (uttColumn) => {
        for (header of headers) {
            if (uttColumn.name === header) {
                return uttColumn
            }
        }
    }

    let uttColumnsInHeaders = []

    for (uttColumn of allUttColumns) {
        let foundUttColumn = searchUttColumns(uttColumn)
        if (foundUttColumn) uttColumnsInHeaders.push(foundUttColumn)
    }

    return uttColumnsInHeaders

}

function setUttRow (curUttRow, values, uttColumns) {

    if (values['G'] === 0) {
        return null;
    }

}

async function convertHtmlFileToTournamentOutput (htmlFile) {

    let res = await parseHtmlDataExport(htmlFile)
    let tournamentStats = [] 

    for (stats of res.parsedStats) {
        tournamentStats.push(processStatsIntoCategories(res.parsedHeaders,stats))
    }

    return {"stats":tournamentStats,"headers":res.parsedHeaders}

}

function processStatsIntoCategories (headers,stats) {

    if (headers.length !== stats.length) {
        throw new Error("Headers and Stats are not the same length!\n" + headers + "\n" + stats)
    }

    let statsCategories = {}
    let curHeaderTypeIndex = 0
    const statsTypeSeperator = 'G'

    let curStatsCategory = {}

    let setCurStatsCategory = () => {
        statsCategories[headerTypes[curHeaderTypeIndex]] = curStatsCategory
        curStatsCategory = {}
    }

    for (let curStatIndex = 0; curStatIndex < stats.length; curStatIndex++) {

        curHeader = headers[curStatIndex]

        if (curHeader === statsTypeSeperator) {

            setCurStatsCategory()
            curHeaderTypeIndex += 1;

        }

        curStatsCategory[curHeader] = stats[curStatIndex]

    }

    setCurStatsCategory() //the last set of stats we built still needs to be inserted

    return statsCategories

}

function parseHtmlDataExport (htmlFile) {

    return new Promise ((resolve,reject) => {
        fs.readFile(htmlFile.path + htmlFile.fileName, 'utf-8', (err,data) => {
            const root = parse(data)

            const statsTable = root.querySelector('table.data.sortable')

            const headers = statsTable.querySelector('tr:first-child')
            const statsRows = statsTable.querySelectorAll('tr:not(:first-child)')

            const parsedHeaders = headers.querySelectorAll('th').map((curHeader) => curHeader.text)
            const parsedStats = []

            for (statsRow of statsRows) {

                const curStats = statsRow.querySelectorAll('td')
                const curStatsTxt = curStats.map((value)=> {

                    statText = value.removeWhitespace().text !== '' ? value.text : '0'
                    statNumber = Number(statText)

                    return isNaN(statNumber) ? statText : statNumber

                })
                
                parsedStats.push(curStatsTxt)

            }

            resolve({parsedHeaders,parsedStats})

        })

    })

}

function getAllPtFolders (root) {

    return new Promise ((resolve,reject) => {

        let savedGames = root + 'saved_games\\'

        let ptFolders = []

        fs.readdir(savedGames, (err, files) => {
            files.forEach((file) => {
                
                if (file.includes(".pt")) {
                    ptFolders.push(savedGames + file + "\\")
                }                
                
            })

            resolve(ptFolders)

        })

    })

}

function locateHtmlFiles (ptFolders) {

    return Promise.all(ptFolders.map((ptFolder) => {
        return new Promise ((resolve,reject) => {
            let htmlStatsFolder = ptFolder + 'news\\html\\temp\\'

            fs.readdir(htmlStatsFolder, (err, files) => {
                
                if (files.length === 1) {
                    resolve({
                        isSuccess: true,
                        ptFolder,
                        path: htmlStatsFolder,
                        fileName: files[0]
                    })
                }
                else if (files.length > 1) {
                    console.log(htmlStatsFolder + " has more than 1 output file ")
                    resolve({
                        isSuccess: false,
                        ptFolder,
                        path: htmlStatsFolder
                    })
                }
                else {
                    resolve({
                        isSuccess: false,
                        ptFolder,
                        path: htmlStatsFolder
                    })
                }

            })
        })
    }))

}

function loadSettings () {
    return new Promise ((resolve,reject) => {

        fs.readFile(__dirname + '\\settings.json', 'utf-8', (err, data) => {

            if (!err) {
                resolve(JSON.parse(data))
            }
            else {
                reject(err)
            }

        })

    })
}

run();