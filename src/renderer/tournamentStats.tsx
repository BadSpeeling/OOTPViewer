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
    const [headers, setHeaders] = React.useState([] as string[])
    const [selectedTournamentType, setSelectedTournamentType] = React.useState(0);
    const [statsTypeID, setStatsType] = React.useState(0);
    const [qualifierValue, setQualifierValue] = React.useState('');
    const [positions, setPositions] = React.useState([] as string[])
    const [tournamentStartDate, setTournamentStartDate] = React.useState('1970-01-01');
    const [tournamentEndDate, setTournamentEndDate] = React.useState('1970-01-01');

    const dataLoadHandler = async () => {
        const statsResult = await getPlayerStats(selectedTournamentType, statsTypeID, qualifierValue.length > 0 ? parseInt(qualifierValue) : 0, positions, tournamentStartDate, tournamentEndDate);
        setPlayerStats(statsResult.stats);
        setHeaders(statsResult.headers);
    }
    
    const setPositionsHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const options = Array.from(e.target.selectedOptions, option => option.value);
        setPositions(options);
    };

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
                <TournamentDatePicker tournamentStartDate={tournamentStartDate} setTournamentStartDate={setTournamentStartDate} tournamentEndDate={tournamentEndDate} setTournamentEndDate={setTournamentEndDate}/>
                <select value={statsTypeID} onChange={(e) => setStatsType(parseInt(e.target.value))}>
                    <option value={0}>Batting</option>
                    <option value={1}>Pitching</option>
                </select>
                <select multiple value={positions.map(position => position.toString())} onChange={setPositionsHandler}>
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

async function getPlayerStats (tournamentTypeID: number, statsTypeID: number, qualifierValue: number, positions: string[], tournamentStartDate: string, tournamentEndDate: string) {

    const response = await window.electronAPI.getTournamentStats({tournamentTypeID, statsType: statsTypeID, qualifierValue, positions, tourneyTimeframe: {startDate:tournamentStartDate,endDate:tournamentEndDate}} as TournamentStatsQuery);
    return response as {headers: string[], stats:BattingStatsExpanded[] | PitchingStatsExpanded[]};

}

type TournamentDatePicker = {
    tournamentStartDate: string,
    setTournamentStartDate: React.Dispatch<React.SetStateAction<string>>,
    tournamentEndDate: string,
    setTournamentEndDate: React.Dispatch<React.SetStateAction<string>>,
}

function TournamentDatePicker ({tournamentStartDate, setTournamentStartDate, tournamentEndDate, setTournamentEndDate}: TournamentDatePicker) {

    const tournamentStartDateHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTournamentStartDate(e.currentTarget.value);
    }

    const tournamentEndDateHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTournamentEndDate(e.currentTarget.value);
    }

    return (
        <div>
            <span>Start Date:</span><input value={tournamentStartDate} onChange={tournamentStartDateHandler} />
            <span>End Date:</span><input value={tournamentEndDate} onChange={tournamentEndDateHandler} />
        </div>
    )

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
    return ['CardTitle','CardValue','Position','Bats','PA','AVG','OBP','SLG','OPS'];
}

function pitchingColumns () {
    return ['CardTitle','CardValue','Throws','G','GS','K/9','BB/9','HR/9','ERA','Stamina']
}