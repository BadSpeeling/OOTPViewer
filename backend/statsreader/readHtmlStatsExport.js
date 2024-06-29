const parse = require('node-html-parser').parse
const fs = require('fs')

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
    
    let res = await parseHtmlDataExport(htmlFilesToProcess[0])
    let processedHtmlStats = [] 

    for (stats of res.parsedStats) {
        processedHtmlStats.push(processStatsIntoCategories(res.parsedHeaders,stats))
    }

    console.log(processedHtmlStats)

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