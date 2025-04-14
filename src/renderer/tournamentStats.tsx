import DataTable from 'datatables.net-react';
import DT from 'datatables.net-dt';

import * as React from "react";
import {createRoot} from "react-dom/client";

import { getTournamentOptions } from "./getTournamentTypes"
import { TournamentTypePicker } from "./tournamentTypePicker";
import { TournamentType, StatsType, TournamentStatsQuery } from "../types"

import { Bats, Throws, Position, BattingStatsExpanded, PitchingStatsExpanded } from "../backend/types"

addEventListener("load", async (event) => {

    const tournamentOptions = await getTournamentOptions();
    DataTable.use(DT);

    $('#position').change()

    const wrapper = document.getElementById("reactWrapper");

    if (wrapper) {
        const root = createRoot(wrapper);
        root.render(<StatsDisplay tournamentOptions={tournamentOptions} />);
    }

})

function getQualifierName (statsTypeID: StatsType) {

    if (statsTypeID === StatsType.Batting) {
        return 'PA';
    }
    else if (statsTypeID === StatsType.Pitching) {
        return 'G';
    }
    else {
        return '';
    }

}

type StatsDisplayProps = {
    tournamentOptions: TournamentType[],
}

function StatsDisplay ({tournamentOptions}: StatsDisplayProps) {
    
    const [playerStats,setPlayerStats] = React.useState([] as BattingStatsExpanded[] | PitchingStatsExpanded[])
    const [selectedTournamentType, setSelectedTournamentType] = React.useState(0);
    const [statsTypeID, setStatsType] = React.useState(0);
    const [qualifierValue, setQualifierValue] = React.useState('');

    const dataLoadHandler = async () => {
        const playerStats: BattingStatsExpanded[] | PitchingStatsExpanded[] = await getPlayerStats(selectedTournamentType, statsTypeID, qualifierValue.length > 0 ? parseInt(qualifierValue) : 0);
        setPlayerStats(playerStats);
    }
    
    let columns: string[];

    if (statsTypeID === 0) {
        columns = battingColumns();
    }
    else if (statsTypeID === 1) {
        columns = pitchingColumns();
    }
    else {
        throw Error(statsTypeID + ' is not a valid StatsType');
    }

    const playerStatsEnummed = playerStats.map((playerStat) => {
        return {
            ...playerStat,
            Bats: Bats[playerStat.Bats],
            Throws: Throws[playerStat.Throws],
            Position: Position[playerStat.Position],
        }
    })

    return (
        <>
            <div>
                <TournamentTypePicker selectedTournamentType={selectedTournamentType} setSelectedTournamentType={setSelectedTournamentType} tournaments={tournamentOptions}/>            
                <select value={statsTypeID} onChange={(e) => setStatsType(parseInt(e.target.value))}>
                    <option value={0}>Batting</option>
                    <option value={1}>Pitching</option>
                </select>
                <div>Min {getQualifierName(statsTypeID)} to qualify: <input value={qualifierValue} onChange={(e) => setQualifierValue(e.target.value)}/></div>
            </div>
            { 
                playerStatsEnummed.length > 0 &&
                <div>
                    <DataTable>
                        { buildTableHeader(columns) }
                        { buildTableBody(playerStatsEnummed, columns) }
                    </DataTable>
                </div>
            }
            <div>
                <button onClick={dataLoadHandler}>Load</button>
            </div>
        </>
    )

}

async function getPlayerStats (tournamentTypeID: number, statsTypeID: number, qualifierValue: number) {

    const selectedPositions = $('#position').val();
    let positions: string[] = [];

    if (Array.isArray(selectedPositions)) {
        positions = selectedPositions;
    }
    else if (typeof selectedPositions === 'string') {
        positions = [selectedPositions];
    }

    return await window.electronAPI.getTournamentStats({tournamentTypeID, statsType: statsTypeID, qualifierValue, positions} as TournamentStatsQuery);

}

function buildTableBody (data: any, columns) {

    const tableBody = data.map((dataRecord) => {
        const curRow = columns.map((column) => {
            return (<td>{dataRecord[column]}</td>)
        })
        return (<tr>{curRow}</tr>)

    })

    return (<tbody>${tableBody}</tbody>)

}

function buildTableHeader (columns) {

    const tableHeaders = columns.map((column) => {
        return (<th>{column}</th>)
    });

    return (<thead><tr>{tableHeaders}</tr></thead>)

}

function battingColumns () {
    return ['CardTitle','CardValue','Position','Bats','PA','AVG','OBP','SLG','OPS'];
}

function pitchingColumns () {
    return ['CardTitle','CardValue','Throws','G','GS','K/9','BB/9','HR/9','ERA','Stamina']
}