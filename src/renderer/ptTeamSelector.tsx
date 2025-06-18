import * as React from "react";
import {PtTeam} from "../types";

type PtTeamSelector = {
    teams: PtTeam[],
    selectedTeamName: string,
    setSelectedTeamName: React.Dispatch<React.SetStateAction<string>>, 
}

export const PtTeamSelector = ({teams,selectedTeamName,setSelectedTeamName}: PtTeamSelector) => {

    const teamOptions = teams.map((team) => {
        return (
            <option value={team.TeamName}>{team.TeamName}</option>
        )
    })

    return (
        <select className="border-gray border-1 rounded-md" value={selectedTeamName} onChange={(e) => { setSelectedTeamName(e.target.value) }}>
            {teamOptions}
        </select>
    )

}