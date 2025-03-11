export function dateTime (date: Date) {
    
    const month = date.getMonth()+1;
    const dateOfMonth = date.getDate();
    const hour = date.getHours();
    const minute = date.getMinutes();
    
    const digitHelper = (s: string) => {
        return s.length === 1 ? '0'+s : s;
    }

    return `${date.getFullYear()}-${digitHelper(month.toString())}-${digitHelper(dateOfMonth.toString())} ${digitHelper(hour.toString())}:${digitHelper(minute.toString())}`;
}

export function positionNumberToString (num: number) {
    switch (num) {
        case 1:
            return 'P';
        case 2:
            return 'C';
        case 3:
            return '1B';
        case 4:
            return '2B';
        case 5:
            return '3B';
        case 6:
            return 'SS';
        case 7:
            return 'LF';
        case 8:
            return 'CF';
        case 9:
            return 'RF';
    }
}

export const parseCsvDataColumnToDatatype = (type: string) => {
    switch (type) {
        case "DATETIME":
            return "INTEGER";
        default:
            return type;
    }
}

export const databaseObjectEqual = (databaseObject: any, testingObject: any) => {

    for (const curKey of Object.keys(testingObject)) {
        if (databaseObject[curKey] !== testingObject[curKey]) {
            return false;
        }
    }

    return true;

}