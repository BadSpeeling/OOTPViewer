import { TournamentMetaData, PtTeam } from "../types";
import { dateTime } from "../utilities";

import * as React from "react";
import { createRoot } from "react-dom/client";
import { PtTeamSelector } from "./ptTeamSelector";

addEventListener("load", async (event) => {

    const myTeams = await window.electronAPI.getPtTeams() as PtTeam[];
    
    const wrapper = document.getElementById("reactWrapper");

    if (wrapper) {
        const root = createRoot(wrapper);
        root.render(<Landing myTeams={myTeams} />);
    }

});

type LandingProps = {
    myTeams: PtTeam[],
}

const Landing = ({myTeams}: LandingProps) => {

    const openStatsImporterHandler = (e) => {
        window.electronAPI.openStatsImporter()
    };

    const openTournamentStatsHandler = (e) => {
       window.electronAPI.openTournamentStats() 
    };

    const openSeasonStatsHandler = (e) => {
        window.electronAPI.openSeasonStats()
    };

    const openCardImporterHandler = (e) => {
        window.electronAPI.openCardImporter()
    }

    const [selectedTeamName, setSelectedTeamName] = React.useState(myTeams.length > 0 ? myTeams[0].TeamName : "");
    const [recentTournaments,setRecentTournaments] = React.useState([]);

    React.useEffect(() => {
        (async () => {setRecentTournaments(await window.electronAPI.getRecentTournaments(selectedTeamName))})();
    }, [selectedTeamName]);

    return (
        <>
            <div>
                <button id="openStatsImporter" onClick={openStatsImporterHandler}>Stats Importer</button>
                <button id="openStatsViewer" onClick={openTournamentStatsHandler}>Tournament Stats</button>
                <button id="openSeasonStats" onClick={openSeasonStatsHandler}>Season Stats</button>
                <button id="openSeasonStats" onClick={openCardImporterHandler}>Card Importer</button>
            </div>
            <div>
                <PtTeamSelector selectedTeamName={selectedTeamName} setSelectedTeamName={setSelectedTeamName} teams={myTeams}/>
                {recentTournaments && <RecentTournaments recentTournaments={recentTournaments}/>}
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