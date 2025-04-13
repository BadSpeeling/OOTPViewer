import { PtDataExportFile, PtDataStatsFile, TournamentType, DataSaveStatus } from '../types'
import { TournamentTypePicker } from "./tournamentTypePicker"
import { getTournamentOptions } from "./dataLoader"

import * as React from "react";
import {createRoot} from "react-dom/client";

const model = {}

$(document).ready(async function(e) {
    
    $('#collectTournamentsToInsert').click(handleSubmit);
    $('#reloadPage').click(reloadPage);

    const tournamentFiles: PtDataExportFile[] = await window.electronAPI.findTournamentExports();

    const tournaments = await getTournamentOptions();
    const wrapper = document.getElementById("reactWrapper");

    if (wrapper) {
        const root = createRoot(wrapper);
        root.render(<Page tournaments={tournaments} tournamentFiles={tournamentFiles} />);
    }

})

type Props = {
    tournaments: TournamentType[],
    tournamentFiles: PtDataExportFile[];
}

function Page ({tournaments, tournamentFiles}: Props) {

    const [curTournamentExports,setTournamentExports] = React.useState(tournamentFiles.map(tourney => {
        return {
            ...tourney,
            description: "",
            tournamentTypeID: 0,
            isIncludedFlag: false,
            isCumulativeFlag: false,
            dataSaveStatus: DataSaveStatus.None,
        } as PtDataStatsFile
    }));

    const [selectedTournamentType, setSelectedTournamentType] = React.useState(0);

    return (
        <>
            <div id="tournamentList">
                <div><b id="tournamentListStatus"></b></div>
                <div id="tournamentTypeWrapper"><TournamentTypePicker selectedTournamentType={selectedTournamentType} setSelectedTournamentType={setSelectedTournamentType} tournaments={tournaments}/></div>
                <div id="tournamentOptions"><TournamentExports curTournamentExports={curTournamentExports} setTournamentExports={setTournamentExports}/></div>
                <div>
                    <button id="collectTournamentsToInsert" onClick={(e) => handleSubmit(selectedTournamentType, curTournamentExports, setTournamentExports)}>Write Data</button>
                    <button id="reloadTable">Reload Table</button>
                </div>
            </div>
        </>
    );
}

type TournamentExportProps = {
    curTournamentExports: PtDataStatsFile[],
    setTournamentExports: React.Dispatch<React.SetStateAction<PtDataStatsFile[]>>
}

function TournamentExports ({curTournamentExports, setTournamentExports}: TournamentExportProps) {
    
    const updateTournamentExport = (tourney: PtDataStatsFile,index: number) => {
        setTournamentExports(curTournamentExports.map((t, i) => {
            return index === i ? tourney : t;
        }));
    }

    const updateDescription = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        updateTournamentExport({...curTournamentExports[index],description: e.target.value}, index)
    }

    const updateCheckbox = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        updateTournamentExport({...curTournamentExports[index],isIncludedFlag: e.target.checked}, index)
    }

    const tableBody = curTournamentExports.map((tourney, index) => {
        return <tr key={tourney.key}><td><input type='checkbox' checked={tourney.isIncludedFlag} onChange={(e) => updateCheckbox(e, index)}/></td><td>{tourney.fileName}</td><td><input name='Description' onChange={(e) => updateDescription(e,index)} value={curTournamentExports[index].description}/></td><td className='status'>{tournamentRowStatusIcon(tourney.dataSaveStatus)}</td></tr>
    })

    return (
        <table>
            <tr><th>Include?</th><th>File</th><th>Description</th><th>Status</th></tr>
            {tableBody}
        </table>
    )

}

async function handleSubmit (tournamentTypeID: number, tournamentFiles: PtDataStatsFile[], setTournamentExports: React.Dispatch<React.SetStateAction<PtDataStatsFile[]>>) {

    const pendingTournaments = tournamentFiles.filter(tourney => tourney.isIncludedFlag).map(tourney => {
        return {
            ...tourney,
            dataSaveStatus: DataSaveStatus.Pending
        }
    });

    setTournamentExports(pendingTournaments);
    const results = await importTournaments(tournamentTypeID, tournamentFiles)
    setTournamentExports(pendingTournaments.map((tourney) => {

        const result = results.find(result => result.key === tourney.key);

        if (result) {
            return {
                ...tourney,
                dataSaveStatus: result.status
            }
        }
        else {
            return tourney;
        }

    }));

}

async function importTournaments (tournamentTypeID: number, htmlTournamentFilesToWrite: PtDataExportFile[]) {

    const results: {key: number, status: DataSaveStatus}[] = []

    for (let curHtmlTournamentFile of htmlTournamentFilesToWrite) {
        
        const isSuccess: boolean = await window.electronAPI.writeHtmlTournamentStats(tournamentTypeID, curHtmlTournamentFile)
        results.push({status: isSuccess ? DataSaveStatus.Successful : DataSaveStatus.Failure, key: curHtmlTournamentFile.key})
        
    }

    return results;

}

function tournamentRowStatusIcon (status: DataSaveStatus) {

    if (status === DataSaveStatus.Pending) {
        return <div className="loader"></div>
    }
    else if (status === DataSaveStatus.Successful) {
        return <div>&#x2705;</div>
    }
    else if (status === DataSaveStatus.Failure) {
        return <div>&#x274C;</div>
    }
    else {
        return <></>
    }

}