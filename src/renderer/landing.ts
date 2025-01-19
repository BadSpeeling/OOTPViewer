$(document).ready(async function(e) {

    $('#openStatsImporter').click((e) => {
        window.electronAPI.openStatsImporter()
    });

    $('#openStatsViewer').click((e) => {
       window.electronAPI.openTournamentStats() 
    });

    $('#openCardMarketManager').click((e) => {
        
    });

});