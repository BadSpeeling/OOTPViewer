import { BattingStatsFilter } from ".";
import { BattingStatsExpanded } from "../types";

export interface IBattingStatsGetter {

    getTournamentStatsAsync: (battingStatsFilter: BattingStatsFilter) => Promise<BattingStatsExpanded[]>

}