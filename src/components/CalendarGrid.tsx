import React from 'react';
import { View, Text } from 'react-native';
import { DAYS, DAYS_JA, DAYS_JA_READING, generateCalendarDays, getSpecialDayReading } from '../utils/calendar';
import { HOLIDAYS } from '../utils/holidays';

interface CalendarGridProps {
    year: number;
    monthIndex: number;
    isSimpleMode?: boolean;
}

export const CalendarGrid: React.FC<CalendarGridProps> = ({ year, monthIndex, isSimpleMode = false }) => {
    const days = generateCalendarDays(year, monthIndex);
    const rows = Math.ceil(days.length / 7);
    const isSixWeeks = rows > 5;

    return (
        <View className="w-full p-4 bg-white">
            {/* Days Header */}
            <View className="flex-row mb-2">
                {(isSimpleMode ? DAYS_JA : DAYS).map((day, idx) => (
                    <View key={day} className="flex-1 items-center justify-center">
                        <Text className="text-xs font-semibold text-calendar-muted uppercase tracking-wider">
                            {day}
                        </Text>
                        {isSimpleMode && (
                            <Text className="text-[9px] text-calendar-muted">
                                {DAYS_JA_READING[idx]}
                            </Text>
                        )}
                    </View>
                ))}
            </View>

            {/* Days Grid */}
            <View className="flex-row flex-wrap">
                {days.map((day, index) => {
                    const dateKey = day ? `${year}-${monthIndex + 1}-${day}` : '';
                    const holidayName = dateKey ? HOLIDAYS[dateKey] : undefined;
                    const dayReading = isSimpleMode && day ? getSpecialDayReading(day) : undefined;
                    const isSunday = index % 7 === 0;
                    const isSaturday = index % 7 === 6;

                    const isToday = day && new Date().toDateString() === new Date(year, monthIndex, day).toDateString();

                    // Text Color Logic
                    let textColor = 'text-calendar-text';
                    if (isToday) textColor = 'text-calendar-accent';
                    else if (isSunday || holidayName) textColor = 'text-red-500';
                    else if (isSaturday) textColor = 'text-blue-500';

                    const dayFontSize = isSimpleMode
                        ? (isSixWeeks ? 'text-lg leading-tight' : 'text-xl leading-tight')
                        : (isSixWeeks ? 'text-base' : 'text-lg');

                    return (
                        <View
                            key={index}
                            className={`w-[14.28%] ${isSixWeeks ? 'p-0.5' : 'p-1'} border-t-2 border-transparent ${day ? 'border-gray-100' : ''}`}
                            style={{ aspectRatio: isSixWeeks ? 6 / 5 : 1 }}
                        >
                            {day && (
                                <View className="flex-col h-full justify-between items-center">
                                    <View className="items-center w-full">
                                        <Text className={`${dayFontSize} font-medium ${textColor}`}>
                                            {day}
                                        </Text>
                                        {dayReading && (
                                            <Text
                                                numberOfLines={1}
                                                adjustsFontSizeToFit
                                                className="text-[8px] leading-tight text-gray-500 font-medium w-full text-center"
                                            >
                                                {dayReading}
                                            </Text>
                                        )}
                                    </View>
                                    {holidayName && (
                                        <Text
                                            numberOfLines={1}
                                            className={`${isSixWeeks ? 'text-[8px]' : 'text-[9px]'} text-red-500 font-medium w-full text-center`}
                                        >
                                            {holidayName}
                                        </Text>
                                    )}
                                </View>
                            )}
                        </View>
                    );
                })}
            </View>
        </View>
    );
};
