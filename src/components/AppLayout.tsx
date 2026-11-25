import React from 'react';
import { View, Text, TouchableOpacity, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, ChevronRight, Printer, Trash2 } from 'lucide-react-native';
import { MONTHS, MONTHS_JA } from '../utils/calendar';

interface AppLayoutProps {
    currentMonth: number;
    year: number;
    isSimpleMode?: boolean;
    onToggleSimpleMode?: () => void;
    onPrev?: () => void;
    onNext?: () => void;
    onPrint?: () => void;
    onClearAll?: () => void;
    children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({
    currentMonth,
    year,
    isSimpleMode = false,
    onToggleSimpleMode,
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
                    <View className="flex-row items-center gap-2">
                        <TouchableOpacity
                            onPress={onPrev}
                            className="p-2 rounded-full hover:bg-gray-100 bg-gray-50"
                        >
                            <ChevronLeft size={24} color="#333" />
                        </TouchableOpacity>

                        <Text className="text-lg font-medium w-[120px] text-center font-serif" numberOfLines={1}>
                            {isSimpleMode
                                ? `${year}年 ${MONTHS_JA[currentMonth]}`
                                : `${year} - ${MONTHS[currentMonth]}`}
                        </Text>

                        <TouchableOpacity
                            onPress={onNext}
                            className="p-2 rounded-full hover:bg-gray-100 bg-gray-50"
                        >
                            <ChevronRight size={24} color="#333" />
                        </TouchableOpacity>
                    </View>

                    <View className="flex-row items-center gap-1.5">
                        {onToggleSimpleMode && (
                            <TouchableOpacity
                                onPress={onToggleSimpleMode}
                                className={`px-2.5 py-2 rounded-lg border ${
                                    isSimpleMode
                                        ? 'bg-amber-100 border-amber-400'
                                        : 'bg-gray-100 border-gray-200'
                                }`}
                            >
                                <Text
                                    className={`text-xs font-bold ${
                                        isSimpleMode ? 'text-amber-800' : 'text-gray-600'
                                    }`}
                                >
                                    かんたん
                                </Text>
                            </TouchableOpacity>
                        )}

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
