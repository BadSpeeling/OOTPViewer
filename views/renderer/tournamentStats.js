const model = {}

$(document).ready(() => {

    tournamentTypePicker('tournamentTypeWrapper');

})

async function initialDataTable () {
    const columns = battingColumns()

    $('#tournamentDataTable').append(buildTableHeader(columns));
    $('#tournamentDataTable').append(await buildTableBody(columns));

    $('#tournamentDataTable').DataTable();
}

async function buildTableBody (columns) {

    const data = await electronAPI.getTournamentStats({tournamentTypeID:1032});

    const tableBody = data.map((dataRecord) => {
        const curRow = columns.map((column) => {
            return `<td>${dataRecord[column]}</td>`
        }).join('')

        return `<tr>${curRow}</tr>`

    }).join('')

    return `<tbody>${tableBody}</tbody>
    ` 

}

function buildTableHeader () {

    const columns = battingColumns();
    
    tableHeaders = columns.map((column) => {
        return `<th>${column}</th>`
    }).join('');

    return `<thead><tr>${tableHeaders}</tr></thead>`

}

function battingColumns () {
    return ['CardTitle','POS','Bats','PA','AVG','OBP','SLG','OPS'];
}