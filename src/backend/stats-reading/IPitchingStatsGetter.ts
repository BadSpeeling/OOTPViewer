import { PitchingStatsFilter } from ".";
import { PitchingStatsExpanded } from "../types";

export interface IPitchingStatsGetter {

    getTournamentStatsAsync: (pitchingStatsFilter: PitchingStatsFilter) => Promise<PitchingStatsExpanded[]>

}