import * as React from "react";
import { TournamentType } from "../types"

type Props = {
    tournaments: TournamentType[],
    selectedTournamentType: number,
    setSelectedTournamentType: React.Dispatch<React.SetStateAction<number>>,
}

export function TournamentTypePicker ({tournaments, selectedTournamentType, setSelectedTournamentType}: Props) {
    
    const optionElements = [
        <option value={0} id="defaultTournament">Select an option</option>,
        ...tournaments.map((value) => {
            return <option value={value['TournamentTypeID']}>{value['Name']}</option>
        })
    ]

    return (
        <select className="border-gray border-1 rounded-md" value={selectedTournamentType} onChange={(e) => { setSelectedTournamentType(parseInt(e.target.value)) }} id="tournamentType">
            ${optionElements}
        </select>
    )

}