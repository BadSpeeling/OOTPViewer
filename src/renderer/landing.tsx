import { TournamentMetaData } from "../types";
import { dateTime } from "../utilities";

import * as React from "react";
import {createRoot} from "react-dom/client";

addEventListener("load", async (event) => {

    const recentTournaments: TournamentMetaData[] = await window.electronAPI.getRecentTournaments()
    const wrapper = document.getElementById("reactWrapper");

    if (wrapper) {
        const root = createRoot(wrapper);
        root.render(<Landing recentTournaments={recentTournaments} />);
    }

});

type LandingProps = {
    recentTournaments: TournamentMetaData[],
}

const Landing = ({recentTournaments}: LandingProps) => {

    const openStatsImporterHandler = (e) => {
        window.electronAPI.openStatsImporter()
    };

    const openTournamentStatsHandler = (e) => {
       window.electronAPI.openTournamentStats() 
    };

    const openCardMarketManagerHandler = (e) => {
        
    };

    return (
        <>
            <div>
                <button id="openStatsImporter" onClick={openStatsImporterHandler}>Stats Importer</button>
                <button id="openStatsViewer" onClick={openTournamentStatsHandler}>Stats Viewer</button>
                <button id="openCardMarketManager">Card Market</button>
            </div>
            <div>
                <RecentTournaments recentTournaments={recentTournaments}/>
            </div>
        </>
    )

}

type RecentTournamentsProps = {
    recentTournaments: TournamentMetaData[],
}

function RecentTournaments ({recentTournaments}: RecentTournamentsProps) {

    const recentTournamentHeaders = (<tr><th>Tournament</th><th>Wins</th><th>Losses</th><th>Description</th><th>Timestamp</th></tr>)
    const recentTournamentRows = recentTournaments.map((recentTournament) => {
        return (<tr><td>{recentTournament['Tournament Name']}</td><td>{recentTournament.W}</td><td>{recentTournament.L}</td><td>{recentTournament.Description}</td><td>{recentTournament['Import Date']}</td></tr>)
    })

    return (
        <table>
            {recentTournamentHeaders}
            {recentTournamentRows}
        </table>
    )

}