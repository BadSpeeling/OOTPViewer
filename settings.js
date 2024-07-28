const fs = require('fs')

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

module.exports.loadSettings = loadSettings;