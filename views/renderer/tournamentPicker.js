async function tournamentType (parentID) {
    
    let tournamentTypes = await getTournamentOptions()
    $(`#${parentID}`).append(buildHtml(tournamentTypes))

}

async function getTournamentOptions() {
    let tournamentTypes = await electronAPI.getTournamentTypes()
    return tournamentTypes
}

function buildHtml(tournamentTypes) {

    let optionElements = [`<option id=defaultTournament value>Select an option</option>`]
    let tournamentOptions = tournamentTypes.map((value) => {
        return `<option value=${value['TournamentTypeID']}>${value['Name']}</option>`
    })

    optionElements = optionElements.concat(tournamentOptions)

    return `
        <select id=tournamentType>
            ${optionElements.join('')}
        </select>
    `

}