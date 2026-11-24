import React from 'react';
import { View, Text, TouchableOpacity, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, ChevronRight, Printer, Trash2 } from 'lucide-react-native';
import { MONTHS } from '../utils/calendar';

interface AppLayoutProps {
    currentMonth: number;
    year: number;
    onPrev?: () => void;
    onNext?: () => void;
    onPrint?: () => void;
    onClearAll?: () => void;
    children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({
    currentMonth,
    year,
    onPrev,
    onNext,
    onPrint,
    onClearAll,
    children
}) => {
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#f8f9fa' }} edges={['top', 'left', 'right']}>
            <StatusBar barStyle="dark-content" />
            <View className="flex-1 bg-calendar-bg">
                {/* Navigation Header */}
                <View className="flex-row items-center justify-between px-4 py-2 bg-white shadow-sm z-10">
                    <View className="flex-row items-center space-x-4 gap-4">
                        <TouchableOpacity
                            onPress={onPrev}
                            className="p-2 rounded-full hover:bg-gray-100 bg-gray-50"
                        >
                            <ChevronLeft size={24} color="#333" />
                        </TouchableOpacity>

                        <Text className="text-xl font-medium w-[150px] text-center font-serif">
                            {year} - {MONTHS[currentMonth]}
                        </Text>

                        <TouchableOpacity
                            onPress={onNext}
                            className="p-2 rounded-full hover:bg-gray-100 bg-gray-50"
                        >
                            <ChevronRight size={24} color="#333" />
                        </TouchableOpacity>
                    </View>

                    <View className="flex-row items-center gap-2">
                        {onClearAll && (
                            <TouchableOpacity
                                onPress={onClearAll}
                                className="p-2 bg-red-50 rounded-lg"
                            >
                                <Trash2 size={18} color="#dc2626" />
                            </TouchableOpacity>
                        )}

                        {onPrint && (
                            <TouchableOpacity
                                onPress={onPrint}
                                className="flex-row items-center gap-2 px-3 py-2 bg-slate-900 rounded-lg"
                            >
                                <Printer size={18} color="white" />
                            </TouchableOpacity>
                        )}
                    </View>
                </View>

                {/* Main Content */}
                <View className="flex-1">
                    {children}
                </View>
            </View>
        </SafeAreaView>
    );
};
