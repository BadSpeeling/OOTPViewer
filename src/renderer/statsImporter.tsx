import { PtDataExportFile, PtDataStatsFile,TournamentType } from '../types'
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
        root.render(Test({tournaments, tournamentFiles}));
    }

})

type Props = {
    tournaments: TournamentType[],
    tournamentFiles: PtDataExportFile[];
}

export const Test = ({tournaments, tournamentFiles}: Props) => {

    React.useState(0)
    return (<></>)

    // const [curTournamentExports,setTournamentExports] = React.useState(tournamentFiles.map(tourney => {
    //     return {
    //         ...tourney,
    //         description: "",
    //         tournamentTypeID: 0,
    //         isCumulativeFlag: false,
    //         dataSaveSuccessful: false,
    //     } as PtDataStatsFile
    // }));

    // return (
    //     <>
    //         <div id="tournamentList">
    //             <div><b id="tournamentListStatus"></b></div>
    //             <div id="tournamentTypeWrapper"><TournamentTypePicker tournaments={tournaments}/></div>
    //             <div id="tournamentOptions"><TournamentExports curTournamentExports={curTournamentExports} setTournamentExports={setTournamentExports}/></div>
    //             <div>
    //                 <button id="collectTournamentsToInsert" onClick={handleSubmit}>Write Data</button>
    //                 <button id="reloadTable">Reload Table</button>
    //             </div>
    //         </div>
    //     </>
    // );
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

    const tableBody = curTournamentExports.map((tourney, index) => {
        return <tr key={tourney.key}><td><input type='checkbox'/></td><td>{tourney.fileName}</td><td><input name='Description' onChange={(e) => updateDescription(e,index)} value={curTournamentExports[index].description}/></td><td className='status'></td></tr>
    })

    return (
        <table>
            <tr><th>Include?</th><th>File</th><th>Description</th><th>Status</th></tr>
            {tableBody}
        </table>
    )

}

function reloadPage() {
    $('option#defaultTournament').val('')
    $('#tournamentOptions').empty()
    $('#reloadTable').hide()
    $('#collectTournamentsToInsert').show()
}

function handleSubmit () {
    
    let htmlTournamentFilesToWrite: PtDataExportFile[] = collectTournamentsToInsert()
    submitTournaments(htmlTournamentFilesToWrite)

}

function collectTournamentsToInsert() {

    let tournamentKeys = $('input:checked').parents('tr').toArray().map((val) => parseInt(val.getAttribute('key')))

    let lookupModelValue = (key) => {
        for (let curModelValue of model['htmlFiles']) {
            if (curModelValue['key'] === key) {
                return curModelValue
            }
        }
    }

    let htmlTournamentFilesToWrite: PtDataExportFile[] = []

    for (let curTournamentKey of tournamentKeys) {
        let curTournamentFile = lookupModelValue(curTournamentKey)
        if (curTournamentFile) {
            
            htmlTournamentFilesToWrite.push({
                ...curTournamentFile,
                description:$(`#tournamentList tr[key=${curTournamentKey}] input[name=Description]`).val(),
                tournamentTypeID:$('#tournamentType').val(),
                isCumulativeFlag: 0
            })

        }
    }

    return htmlTournamentFilesToWrite

}

async function submitTournaments (htmlTournamentFilesToWrite) {

    for (let curHtmlTournamentFile of htmlTournamentFilesToWrite) {
        
        uxTournamentRowStatus(curHtmlTournamentFile.key, 'Pending')
        const isSuccess = await window.electronAPI.writeHtmlTournamentStats(curHtmlTournamentFile)

        console.log(curHtmlTournamentFile.ptFolder + " : " + isSuccess)
        
        if (isSuccess) {
            uxTournamentRowStatus(curHtmlTournamentFile.key, 'Success')
        }
        else {
            uxTournamentRowStatus(curHtmlTournamentFile.key, 'Failure')
            console.log(isSuccess.msg)
        }
        
    }

    $('#reloadTable').show()

}

async function getRecentTournaments () {
    let recentTournaments = await window.electronAPI.getRecentTournaments()
    
    $.each(recentTournaments, (_,tourney) => {
        let timestamp = tourney['Entry Date']
        //let curDate = `${timestamp.getMonth()+1}/${timestamp.getDate()}/${timestamp.getFullYear()} ${timestamp.getHours()}:${timestamp.getMinutes()}`
        //$('#recentTournaments').append(`<tr><td>${curDate}</td><td>${tourney['Description']}</td><td>${tourney['Name']}</td></tr>`)
    })
}

function uxTournamentRowStatus (key, status) {

    const statusCell = $(`tr[key=${key}] td[name=Status]`)
    let htmlToInsert = null

    if (status === 'Pending') {
        htmlToInsert = '<div class="loader"></div>'
    }
    else if (status === 'Success') {
        htmlToInsert = '<div>&#x2705;</div>'
    }
    else if (status === 'Failure') {
        htmlToInsert = '<div>&#x274C;</div>'
    }

    statusCell.html(htmlToInsert)

}