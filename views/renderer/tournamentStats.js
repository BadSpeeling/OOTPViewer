const model = {}

$(document).ready(async () => {

    model['tournamentTypes'] = await electronAPI.getTournamentTypes()

})