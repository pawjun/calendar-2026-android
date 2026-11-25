import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { PhotoUploader } from './PhotoUploader';
import { CalendarGrid } from './CalendarGrid';
import { MONTHS, MONTHS_JA, MONTHS_JA_READING } from '../utils/calendar';

interface MonthPageProps {
    year: number;
    monthIndex: number;
    image?: string;
    isSimpleMode?: boolean;
    onImageUpload: (uri: string) => void;
    onDelete: () => void;
}

export const MonthPage: React.FC<MonthPageProps> = ({
    year,
    monthIndex,
    image,
    isSimpleMode = false,
    onImageUpload,
    onDelete
}) => {
    return (
        <ScrollView
            className="flex-1 bg-gray-200"
            contentContainerStyle={{ padding: 16, flexGrow: 1, alignItems: 'center' }}
        >
            <View
                className="w-full bg-white shadow-lg overflow-hidden"
                style={{ aspectRatio: 210 / 297, maxWidth: 500 }}
            >
                <View className="flex-1 p-4">
                    <PhotoUploader
                        month={isSimpleMode ? MONTHS_JA[monthIndex] : MONTHS[monthIndex]}
                        currentImage={image}
                        onImageUpload={onImageUpload}
                        onDelete={onDelete}
                    />

                    <View className="p-2 items-center">
                        {isSimpleMode ? (
                            <View className="flex-row items-baseline gap-2 mb-1">
                                <Text className="text-2xl font-bold text-calendar-text font-serif">
                                    {MONTHS_JA[monthIndex]}
                                </Text>
                                <Text className="text-sm text-calendar-muted font-medium">
                                    {MONTHS_JA_READING[monthIndex]}
                                </Text>
                            </View>
                        ) : (
                            <Text className="text-2xl font-bold text-calendar-text mb-1 font-serif">
                                {MONTHS[monthIndex]}
                            </Text>
                        )}
                        <Text className="text-base text-calendar-muted font-medium tracking-widest font-serif">
                            {year}
                        </Text>
                    </View>

                    <CalendarGrid year={year} monthIndex={monthIndex} isSimpleMode={isSimpleMode} />
                </View>
            </View>
        </ScrollView>
    );
};
