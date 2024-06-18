const parse = require('node-html-parser').parse
const fs = require('fs')

//let ptFolderRoot = savedGames + '\\' + file + 'news\\html\\temp\\'

async function run () {

    let settings = await loadSettings()    
    let ptFolders = await getAllPtFolders(settings.ootpRoot)
    
    let htmlFiles = await getHtmlFiles(ptFolders)

    for (htmlFile of htmlFiles) {
        if (htmlFile.isSuccess) console.log(htmlFile)
    }
    
}

function getAllPtFolders (root) {

    return new Promise ((resolve,reject) => {

        let savedGames = root + '\\saved_games'

        let ptFolders = []

        fs.readdir(savedGames, (err, files) => {
            files.forEach((file) => {
                
                if (file.includes(".pt")) {
                    ptFolders.push(savedGames + "\\" + file)
                }                
                
            })

            resolve(ptFolders)

        })

    })

}

function getHtmlFiles (ptFolders) {

    return Promise.all(ptFolders.map((ptFolder) => {
        return new Promise ((resolve,reject) => {
            let htmlStatsFolder = ptFolder + '\\news\\html\\temp'
            
            fs.readdir(htmlStatsFolder, (err, files) => {
                
                if (files.length === 1) {
                    resolve({
                        isSuccess: true,
                        ptFolder,
                        path: htmlStatsFolder + "\\" + files[0],
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