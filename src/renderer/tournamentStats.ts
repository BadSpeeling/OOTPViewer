import "datatables.net";
import "datatables.net-fixedheader";
import { tournamentTypePicker } from "./tournamentTypePicker";

const model: {playerStats?: any} = {}

$(document).ready(() => {

    tournamentTypePicker('tournamentTypeWrapper');
    updateQualifierName();
    $('#loadTournamentTable').click(initializeDataTable);
    $('#statsType').change(updateQualifierName);
    $('#position').change()

})

function updateQualifierName () {

    const getQualifierName = () => {
        if (statsTypeID === '0') {
            return 'PA';
        }
        else if (statsTypeID === '1') {
            return 'G';
        }
        else {
            return '';
        }
    }

    const statsTypeID = $('#statsType').val();
    const qualifierName = getQualifierName();

    $('#qualifierName').text(qualifierName);

}

async function initializeDataTable () {
    
    const tableWrapper = $('#tournamentData').empty();
    
    const statsTypeID = $('#statsType').val();
    let columns: string[];

    if (statsTypeID === '0') {
        columns = battingColumns();
    }
    else if (statsTypeID === '1') {
        columns = pitchingColumns();
    }
    else {
        throw Error(statsTypeID + ' is not a valid StatsType');
    }

    model.playerStats = await getPlayerStats(statsTypeID);

    if (model.playerStats) {
        
        const table = $('<table></table>');
        table.append(buildTableHeader(columns));
        table.append(buildTableBody(model.playerStats, columns));

        tableWrapper.append(table);
        table.DataTable();

    }

}

async function getPlayerStats (statsTypeID) {

    const tournamentTypeID = $('#tournamentType').val() as string
    const qualifierValue = $('#qualifierValue').val() as string

    const selectedPositions = $('#position').val();
    let positions: string[] = [];

    if (Array.isArray(selectedPositions)) {
        positions = selectedPositions;
    }
    else if (typeof selectedPositions === 'string') {
        positions = [selectedPositions];
    }

    return await window.electronAPI.getTournamentStats({tournamentTypeID,statsTypeID,qualifierValue, positions});

}

function buildTableBody (data: any, columns) {

    const tableBody = data.map((dataRecord) => {
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
    return ['CardTitle','CardValue','POS','Bats','PA','AVG','OBP','SLG','OPS'];
}

function pitchingColumns () {
    return ['CardTitle','CardValue','Throws','G','GS','K/9','BB/9','HR/9','ERA','Stamina']
}