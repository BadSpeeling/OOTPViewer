import * as React from "react";
import { TournamentType } from "../types"

type Props = {
    tournaments: TournamentType[]
}

export function TournamentTypePicker ({tournaments}: Props) {
    
    const optionElements = [
        <option id="defaultTournament">Select an option</option>,
        ...tournaments.map((value) => {
            return <option value={value['TournamentTypeID']}>{value['Name']}</option>
        })
    ]

    return (
        <select id="tournamentType">
            ${optionElements}
        </select>
    )

}