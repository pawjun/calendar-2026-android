export const MONTHS = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

export const MONTHS_JA = [
    '1月', '2月', '3月', '4月', '5月', '6月',
    '7月', '8月', '9月', '10月', '11月', '12月',
];

export const MONTHS_JA_READING = [
    'いちがつ', 'にがつ', 'さんがつ', 'しがつ', 'ごがつ', 'ろくがつ',
    'しちがつ', 'はちがつ', 'くがつ', 'じゅうがつ', 'じゅういちがつ', 'じゅうにがつ',
];

export const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const DAYS_JA = ['日', '月', '火', '水', '木', '金', '土'];

export const DAYS_JA_READING = ['にち', 'げつ', 'か', 'すい', 'もく', 'きん', 'ど'];

const SPECIAL_DAY_READINGS: Record<number, string> = {
    1: 'ついたち',
    2: 'ふつか',
    3: 'みっか',
    4: 'よっか',
    5: 'いつか',
    6: 'むいか',
    7: 'なのか',
    8: 'ようか',
    9: 'ここのか',
    10: 'とおか',
    14: 'じゅうよっか',
    20: 'はつか',
    24: 'にじゅうよっか',
};

export function getSpecialDayReading(day: number): string | undefined {
    return SPECIAL_DAY_READINGS[day];
}

export function getDaysInMonth(year: number, monthIndex: number): number {
    return new Date(year, monthIndex + 1, 0).getDate();
}

export function getFirstDayOfMonth(year: number, monthIndex: number): number {
    return new Date(year, monthIndex, 1).getDay();
}

export function generateCalendarDays(year: number, monthIndex: number) {
    const daysInMonth = getDaysInMonth(year, monthIndex);
    const firstDay = getFirstDayOfMonth(year, monthIndex);

    const days: (number | null)[] = [];

    // Add padding for previous month
    for (let i = 0; i < firstDay; i++) {
        days.push(null);
    }

    // Add actual days
    for (let i = 1; i <= daysInMonth; i++) {
        days.push(i);
    }

    return days;
}
