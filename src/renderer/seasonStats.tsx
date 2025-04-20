import DataTable from 'datatables.net-react';
import DT from 'datatables.net-dt';

import * as React from "react";
import {createRoot} from "react-dom/client";

import { getTournamentOptions } from "./getTournamentTypes";
import { SeasonStatsQuery, TournamentStatsQuery, StatsType } from "../types";
import { Bats, Throws, Position, BattingStatsExpanded, PitchingStatsExpanded } from "../backend/types"

import * as settings from '../../settings.json';

addEventListener("load", async (event) => {

    DataTable.use(DT);

    const wrapper = document.getElementById("reactWrapper");

    if (wrapper) {
        const root = createRoot(wrapper);
        root.render(<StatsDisplay />);
    }

})

function StatsDisplay () {
    
    const tournamentTypeID = settings.leaguePlayTournamentID;
    const [playerStats,setPlayerStats] = React.useState([] as BattingStatsExpanded[] | PitchingStatsExpanded[]);
    const [headers, setHeaders] = React.useState([] as string[]);
    const [statsTypeID, setStatsType] = React.useState(0);
    const [qualifierValue, setQualifierValue] = React.useState('');
    const [positions, setPositions] = React.useState([] as string[]);
    const [years, setYears] = React.useState([] as string[]);

    const dataLoadHandler = async () => {
        const statsResult = await getPlayerStats(tournamentTypeID, statsTypeID, qualifierValue.length > 0 ? parseInt(qualifierValue) : 0, positions, years);
        setPlayerStats(statsResult.stats);
        setHeaders(statsResult.headers);
    }
    
    const setPositionsHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const options = Array.from(e.target.selectedOptions, option => option.value);
        setPositions(options);
    };

    const setYearsHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const options = Array.from(e.target.selectedOptions, option => option.value);
        setYears(options);        
    }

    const playerStatsEnummed = playerStats.map((playerStat) => {
        return {
            ...playerStat,
            Bats: Bats[playerStat.Bats],
            Throws: Throws[playerStat.Throws],
            Position: Position[playerStat.Position],
        }
    })

    const yearsValues = [...Array(52).keys()].map((year => year + 2025));
    const yearOptions = yearsValues.map(year => (<option value={year}>{year}</option>));

    return (
        <>
            <div>
                <select value={statsTypeID} onChange={(e) => setStatsType(parseInt(e.target.value))}>
                    <option value={0}>Batting</option>
                    <option value={1}>Pitching</option>
                </select>
                <select multiple value={positions} onChange={setPositionsHandler}>
                    <option value={1}>P</option>
                    <option value={2}>C</option>
                    <option value={3}>1B</option>
                    <option value={4}>2B</option>
                    <option value={5}>3B</option>
                    <option value={6}>SS</option>
                    <option value={7}>LF</option>
                    <option value={8}>CF</option>
                    <option value={9}>RF</option>
                </select>
                <select multiple value={years} onChange={setYearsHandler}>
                    {yearOptions}
                </select>
                <div>Min {getQualifierName(statsTypeID)} to qualify: <input value={qualifierValue} onChange={(e) => setQualifierValue(e.target.value)}/></div>
            </div>
            { 
                playerStatsEnummed.length > 0 &&
                <div>
                    <DataTable data={buildTableBody(playerStatsEnummed, headers)}>
                        { buildTableHeader(headers) }                        
                    </DataTable>
                </div>
            }
            <div>
                <button onClick={dataLoadHandler}>Load</button>
            </div>
        </>
    )

}

async function getPlayerStats (tournamentTypeID: number, statsTypeID: number, qualifierValue: number, positions: string[], years: string[]) {

    const response = await window.electronAPI.getTournamentStats({tournamentTypeID, statsType: statsTypeID, qualifierValue, positions, years: years.map(year => parseInt(year))} as TournamentStatsQuery);
    return response as {headers: string[], stats:BattingStatsExpanded[] | PitchingStatsExpanded[]};

}

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

function buildTableBody (data: any, columns) {

    const tableBody = data.map((dataRecord) => {
        return columns.map((column) => dataRecord[column])
    })

    return tableBody

}

function buildTableHeader (columns) {

    const tableHeaders = columns.map((column) => {
        return (<th>{column}</th>)
    });

    return (<thead><tr>{tableHeaders}</tr></thead>)

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