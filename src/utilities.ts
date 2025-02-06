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