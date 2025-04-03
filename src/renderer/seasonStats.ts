import "datatables.net";
import "datatables.net-fixedheader";
import { SeasonStatsQuery, TournamentStatsQuery, } from "../types";

$(document).ready(async () => {

    $('#loadBtn').click(loadTable)

    const years = [...Array(52).keys()].map((year => year + 2025));
    $('#season').html(years.map(year => `<option value=${year}>${year}</option>`).join(''));

})

async function loadTable () {
    const statsTypeID = $('#statsType').val();
    let columns: string[];

    if (statsTypeID === '0') {
        columns = generalColumns().concat(battingColumns());
    }
    else if (statsTypeID === '1') {
        columns = generalColumns().concat(pitchingColumns());
    }
    else {
        throw Error(statsTypeID + ' is not a valid StatsType');
    }

    const seasons = $('#season').val();
    let seasonsParam;

    if (typeof seasons === 'object') {
        seasonsParam = seasons.map((season => parseInt(season)))
    }
    else if (typeof seasons === 'number'){
        seasonsParam = [seasons]
    }
    else if (typeof seasons === 'string') {
        seasonsParam = [parseInt(seasons)]
    }

    const seasonStats = await window.electronAPI.getSeasonStats({tournamentTypeID: 2,statsType:parseInt(statsTypeID),qualifierValue: '0', positions: [] as string[], years: seasonsParam} as TournamentStatsQuery)

    const tableHeader = buildTableHeader(columns);
    const tableBody = buildTableBody(seasonStats, columns);
    
    const table = $('<table></table>');
    
    table.append(tableHeader);
    table.append(tableBody);

    $('#tournamentData').append(table);
    table.DataTable();
}

function buildTableBody (rows, columns) {

    const tournamentTypeID = $('#tournamentType').val() as string
    const qualifierValue = $('#qualifierValue').val() as string

    const tableBody = rows.map((dataRecord) => {
        const curRow = columns.map((column) => {
            return `<td>${dataRecord[column]}</td>`
        }).join('')

        return `<tr>${curRow}</tr>`

    }).join('')

    return `<tbody>${tableBody}</tbody>
    ` 

}

function buildTableHeader (columns) {

    const tableHeaders = columns.map((column) => {
        return `<th>${column}</th>`
    }).join('');

    return `<thead><tr>${tableHeaders}</tr></thead>`

}


function battingColumns () {
    return ['CardTitle','POS','Bats','PA','AVG','OBP','SLG','OPS'];
}

function pitchingColumns () {
    return ['CardTitle','Throws','G','GS','K/9','BB/9','HR/9','ERA','Stamina']
}

function generalColumns () {
    return ["Perfect Team Season", "Perfect Team Level"]
}