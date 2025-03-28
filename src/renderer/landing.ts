import { TournamentMetaData } from "../types";
import { dateTime } from "../utilities";

$(document).ready(async function(e) {

    $('#openStatsImporter').click((e) => {
        window.electronAPI.openStatsImporter()
    });

    $('#openStatsViewer').click((e) => {
       window.electronAPI.openTournamentStats() 
    });

    $('#openCardMarketManager').click((e) => {
        
    });

    getRecentTournaments();

});

async function getRecentTournaments () {

    const recentTournaments: TournamentMetaData[] = await window.electronAPI.getRecentTournaments()

    const recentTournamentHeaders = '<tr><th>Tournament</th><th>Wins</th><th>Losses</th><th>Description</th><th>Timestamp</th></tr>'
    const recentTournamentRows = recentTournaments.map((recentTournament) => {
        return `<tr><td>${recentTournament.TournamentName}</td><td>${recentTournament.W}</td><td>${recentTournament.L}</td><td>${recentTournament.Description}</td><td>${dateTime(recentTournament.Timestamp)}</td></tr>`
    })

    $('#recentTournaments').html(recentTournamentHeaders + recentTournamentRows.join(''));

}