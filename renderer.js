$(document).ready(async function(e) {
    let recentTournaments = await electronAPI.getRecentTournaments()
    
    $.each(recentTournaments, (_,tourney) => {
        let timestamp = tourney['Entry Date']
        let curDate = `${timestamp.getMonth()+1}/${timestamp.getDate()}/${timestamp.getFullYear()} ${timestamp.getHours()}:${timestamp.getMinutes()}`
        $('#recentTournaments').append(`<tr><td>${curDate}</td><td>${tourney['Description']}</td><td>${tourney['Name']}</td></tr>`)
    })

})