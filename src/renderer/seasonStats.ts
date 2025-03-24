import "datatables.net";
import "datatables.net-fixedheader";
import { SeasonStatsQuery, } from "../types";

$(document).ready(async () => {

    $('#loadBtn').click(loadTable)

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

    const seasonStats = await window.electronAPI.getSeasonStats({statsTypeID:parseInt(statsTypeID)} as SeasonStatsQuery)

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