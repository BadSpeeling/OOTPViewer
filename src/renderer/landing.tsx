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
            <div className="font-bold text-xl my-2 w-40 m-auto text-center">
                Perfect Team Viewer
            </div>
            <div className="flex mx-40">
                <div className="text-center flex-1 mr-4"><button className="w-full mx-8 cursor-pointer bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full" onClick={openStatsImporterHandler}>Stats Importer</button></div>
                <div className="text-center flex-1 mr-4"><button className="w-full mx-8 cursor-pointer bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full" onClick={openTournamentStatsHandler}>Tournament Stats</button></div>
                <div className="text-center flex-1 mr-4"><button className="w-full mx-8 cursor-pointer bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full" onClick={openSeasonStatsHandler}>Season Stats</button></div>
                <div className="text-center flex-1 mr-4"><button className="w-full mx-8 cursor-pointer bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full" onClick={openCardImporterHandler}>Card Importer</button></div>
            </div>
            <div className="mx-40 mt-4">
                <div className="mb-4"><span className="mr-4">Recent Tournaments for: </span><PtTeamSelector selectedTeamName={selectedTeamName} setSelectedTeamName={setSelectedTeamName} teams={myTeams}/></div>
                {recentTournaments && <RecentTournaments recentTournaments={recentTournaments}/>}
            </div>
        </>
    )

}

type RecentTournamentsProps = {
    recentTournaments: TournamentMetaData[],
}

function RecentTournaments ({recentTournaments}: RecentTournamentsProps) {

    const recentTournamentHeaders = (
        <tr className="table-header">
            <th className="p-2 text-center">Tournament</th>
            <th className="p-2 text-center">Wins</th>
            <th className="p-2 text-center">Losses</th>
            <th className="p-2 text-center">Description</th>
            <th className="p-2 text-center">Timestamp</th>
        </tr>
    )

    const recentTournamentRows = recentTournaments.map((recentTournament) => {
        return (
            <tr className="table-header">
                <td     >{recentTournament['Tournament Name']}</td>
                <td className="p-2 text-center">{recentTournament.W}</td>
                <td className="p-2 text-center">{recentTournament.L}</td>
                <td className="p-2 text-center">{recentTournament.Description}</td>
                <td className="p-2 text-center">{recentTournament['Import Date']}</td>
            </tr>
        )
    })

    return (
        <table>
            {recentTournamentHeaders}
            {recentTournamentRows}
        </table>
    )

}