import { TournamentType } from '../types'

export async function getTournamentOptions(): Promise<TournamentType[]> {
    let tournamentTypes = await window.electronAPI.getTournamentTypes()
    return tournamentTypes
}