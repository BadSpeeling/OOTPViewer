import { OotpDataExport } from './index'
import { OotpExportDataColumn } from '../../types'

export const splitOotpStatsExport = (parsedHeaders: OotpExportDataColumn[], statsExport: OotpDataExport) => {

    const headerNames = parsedHeaders.map(h => h.nameInSource);

    const battingBeginIndex = headerNames.indexOf('G');
    const pitchingBeginIndex = headerNames.indexOf('G', battingBeginIndex+1);
    const fieldingBeginIndex = headerNames.indexOf('G', pitchingBeginIndex+1);

    const generalHeaders = parsedHeaders.slice(0, battingBeginIndex);
    const battingHeaders = parsedHeaders.slice(battingBeginIndex, pitchingBeginIndex);
    const pitchingHeaders = parsedHeaders.slice(pitchingBeginIndex, fieldingBeginIndex);
    const fieldingHeaders = fieldingBeginIndex !== -1 ? parsedHeaders.slice(fieldingBeginIndex) : undefined;

    const battingSplit = new OotpDataExport([...generalHeaders, ...battingHeaders]);
    const pitchingSplit = new OotpDataExport([...generalHeaders, ...pitchingHeaders]);
    const fieldingSplit = fieldingHeaders ? new OotpDataExport([...generalHeaders, ...fieldingHeaders!]) : undefined;

    for (const statExportRow of statsExport.makeIterator()) {

        const generalStats = statExportRow.slice(0, battingBeginIndex);

        const battingStats = statExportRow.slice(battingBeginIndex, pitchingBeginIndex);
        battingSplit.addStatsRow([...generalStats, ...battingStats]);

        const pitchingStats = statExportRow.slice(pitchingBeginIndex, fieldingBeginIndex);
        pitchingSplit.addStatsRow([...generalStats, ...pitchingStats]);

        if (fieldingSplit) {
            const fieldingStats = statExportRow.slice(fieldingBeginIndex);
            fieldingSplit.addStatsRow([...generalStats, ...fieldingStats]);                    
        }
        
    }

    return {
        battingSplit,
        pitchingSplit,
        fieldingSplit,
    }

}