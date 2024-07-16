const model = {}

$(document).ready(async function(e) {
    loadTournamentTypes();
    $('#gatherExports').click(async () => {
        
        model['htmlFiles'] = await electronAPI.findTournamentExports()
        
        //build table rows with content
        let tableElement = model['htmlFiles'].map((htmlFile) => {
            return `<tr key=${htmlFile['key']}><td><input type='checkbox'/></td><td>${htmlFile.fileName}</td><td><input name='Description'/></td><td name='Status'></td></tr>`
            // return "  <div class='TournamentWriteSelector'>"
            //         +   `<div>${htmlFile.fileName}</div><div><input name='Description'/></div><div><input type='checkbox'/></div>`
            //         +"</div>"
        }).join('')

        //insert table into UI
            $('#tournamentOptions').append("<table>"
        +   "<tr><th>Include?</th><th>File</th><th>Description</th><th>Status</th></tr>"
        +   tableElement
        +   "</table>")

        $('#tournamentList').show()

    })
    $('#collectTournamentsToInsert').click(collectTournamentsToInsert)
})

async function collectTournamentsToInsert() {

    let tournamentKeys = $('input:checked').parents('tr').toArray().map((val) => parseInt(val.getAttribute('key')))

    let lookupModelValue = (key) => {
        for (let curModelValue of model['htmlFiles']) {
            if (curModelValue['key'] === key) {
                return curModelValue
            }
        }
    }

    let htmlTournamentFilesToWrite = []

    for (let curTournamentKey of tournamentKeys) {
        let curTournamentFile = lookupModelValue(curTournamentKey)
        if (curTournamentFile) {
            
            htmlTournamentFilesToWrite.push({
                ...curTournamentFile,
                description:$(`#tournamentList tr[key=${curTournamentKey}] input[name=Description]`).val(),
                tournamentTypeID:$('#tournamentType').val(),
                isCumulativeFlag: 0
            })

        }
    }

    for (let curHtmlTournamentFile of htmlTournamentFilesToWrite) {
        
        uxTournamentRowStatus(curHtmlTournamentFile.key, 'Pending')

        res = await window.electronAPI.counterValue(curHtmlTournamentFile)

        console.log(curHtmlTournamentFile.ptFolder + " : " + res.isSuccess)
        
        if (res.isSuccess) {
            uxTournamentRowStatus(curHtmlTournamentFile.key, 'Success')
        }
        else {
            uxTournamentRowStatus(curHtmlTournamentFile.key, 'Failure')
            console.log(res.msg)
        }
        
    }

    setTimeout(() => {
        $('#tournamentOptions').empty()
        $('#tournamentListStatus').text('')
        $('#tournamentList').hide()
    },1000)

}

async function getRecentTournaments () {
    let recentTournaments = await electronAPI.getRecentTournaments()
    
    $.each(recentTournaments, (_,tourney) => {
        let timestamp = tourney['Entry Date']
        let curDate = `${timestamp.getMonth()+1}/${timestamp.getDate()}/${timestamp.getFullYear()} ${timestamp.getHours()}:${timestamp.getMinutes()}`
        $('#recentTournaments').append(`<tr><td>${curDate}</td><td>${tourney['Description']}</td><td>${tourney['Name']}</td></tr>`)
    })
}

async function loadTournamentTypes () {
    
    let tournamentTypes = await electronAPI.getTournamentTypes()
    
    let optionElements = tournamentTypes.map((value) => {
        return `<option value=${value['TournamentTypeID']}>${value['Name']}</option>`
    })

    $('#tournamentType').append(optionElements.join(''))

}

function uxTournamentRowStatus (key, status) {

    const statusCell = $(`tr[key=${key}] td[name=Status]`)
    let htmlToInsert = null

    if (status === 'Pending') {
        htmlToInsert = '<div class="loader"></div>'
    }
    else if (status === 'Success') {
        htmlToInsert = '<div>&#x2705;</div>'
    }
    else if (status === 'Failure') {
        htmlToInsert = '<div>&#x274C;</div>'
    }

    statusCell.html(htmlToInsert)

}