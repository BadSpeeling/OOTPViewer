import { BattingStatsFilter, IBattingStatsGetter } from ".";
import { Database } from "../database/Database";
import { BattingStatsExpanded } from "../types";

export class LocalSqliteBattingStatsGetter implements IBattingStatsGetter {
    
    database: Database;

    constructor (database: Database) {
        this.database = database;
    }

    async getTournamentStatsAsync (battingStatsFilter: BattingStatsFilter) {
        
        const battingStatsGetScript = this.getTournamentBattingStatsScript(battingStatsFilter);
        return await this.database.getAllMapped<BattingStatsExpanded>(battingStatsGetScript);

    }

    private getTournamentBattingStatsScript = (filter: BattingStatsFilter) => {
        return `
select bs.PtCardID, c.CardValue, c.Position, c.Bats, SUM([G]) [G], SUM([GS]) [GS], SUM([PA]) [PA], SUM([AB]) [AB], SUM([H]) [H], SUM([1B]) [1B], SUM([2B]) [2B], SUM([3B]) [3B], SUM([HR]) [HR], SUM([RBI]) [RBI], SUM([R]) [R], SUM([BB]) [BB], SUM([IBB]) [IBB], SUM([HP]) [HP], SUM([SH]) [SH], SUM([SF]) [SF], SUM([CI]) [CI], SUM([SO]) [SO], SUM([GIDP]) [GIDP], SUM([EBH]) [EBH], SUM([TB]) [TB], SUM([RC]) [RC], SUM([WPA]) [WPA], SUM([wRC]) [wRC], ROUND(SUM([wRAA]),1) [wRAA], ROUND(SUM([WAR]),1) [WAR], SUM([SB]) [SB], SUM([CS]) [CS], SUM([BatR]) [BatR], SUM([wSB]) [wSB], SUM([UBR]) [UBR], SUM([BsR]) [BsR]
from BattingStats bs
join StatsBatch sb on bs.StatsBatchID = sb.StatsBatchID
join PtCard c on bs.PtCardID = c.PtCardID
where TournamentTypeID = ${filter.TournamentTypeID}
${filter.TournamentTimeRange ? `AND (UNIXEPOCH(TournamentStartDate) >= UNIXEPOCH('${filter.TournamentTimeRange.StartDate}') AND UNIXEPOCH(TournamentStartDate) <= UNIXEPOCH('${filter.TournamentTimeRange.EndDate}'))` : ""}
group by bs.PtCardID
    `
    }

}