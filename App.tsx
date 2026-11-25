import { StatusBar } from 'expo-status-bar';
import './global.css';
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Alert, View, FlatList, Dimensions } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { AppLayout } from './src/components/AppLayout';
import { MonthPage } from './src/components/MonthPage';
import { getImagesFromDB, saveImageToDB, deleteImageFromDB, clearAllImagesFromDB } from './src/utils/db';
import generateHtmlContent from './src/utils/printGenerator';

// Generate months from 2025 to 2027
const START_YEAR = 2025;
const END_YEAR = 2027;
interface MonthItem {
  id: string;
  year: number;
  monthIndex: number;
}

const generateMonthsList = (): MonthItem[] => {
  const list: MonthItem[] = [];
  for (let y = START_YEAR; y <= END_YEAR; y++) {
    for (let m = 0; m < 12; m++) {
      list.push({ id: `${y}-${m}`, year: y, monthIndex: m });
    }
  }
  return list;
};

export default function App() {
  const monthsList = useMemo(() => generateMonthsList(), []);

  // Initialize with current date
  const today = new Date();
  const initialIndex = useMemo(() => {
    return monthsList.findIndex(
      item => item.year === today.getFullYear() && item.monthIndex === today.getMonth()
    );
  }, [monthsList]);

  // If current date is out of range (e.g. 2028), default to end or start? 
  // Safety check: if index -1, default to Jan 2026 (index 12)
  const safeInitialIndex = initialIndex !== -1 ? initialIndex : 12;

  const [currentIndex, setCurrentIndex] = useState(safeInitialIndex);
  const [images, setImages] = useState<Record<string, string>>({}); // Key: "YYYY-M"
  const [isSimpleMode, setIsSimpleMode] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  const screenWidth = Dimensions.get('window').width;

  useEffect(() => {
    const loadImages = async () => {
      try {
        const loaded = await getImagesFromDB();
        setImages(loaded);
      } catch (error) {
        console.error('Failed to load images:', error);
      }
    };
    loadImages();
  }, []);

  const currentItem = monthsList[currentIndex] || monthsList[0];

  const handleImageUpload = async (year: number, monthIndex: number, imageUri: string) => {
    try {
      const savedPath = await saveImageToDB(year, monthIndex, imageUri);
      setImages(prev => ({
        ...prev,
        [`${year}-${monthIndex}`]: savedPath
      }));
    } catch (error: any) {
      console.error('Save error details:', error);
      Alert.alert('Error', 'Failed to save image: ' + (error?.message || JSON.stringify(error)));
    }
  };

  const handleImageDelete = async (year: number, monthIndex: number) => {
    Alert.alert(
      'Delete Image',
      'Are you sure you want to delete this image?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteImageFromDB(year, monthIndex);
              setImages(prev => {
                const next = { ...prev };
                delete next[`${year}-${monthIndex}`];
                return next;
              });
            } catch (error) {
              console.error('Delete error:', error);
              Alert.alert('Error', 'Failed to delete image.');
            }
          }
        },
      ]
    );
  };

  const handleClearAll = async () => {
    Alert.alert(
      'Clear All data',
      'All images will be permanently deleted. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: async () => {
            try {
              await clearAllImagesFromDB();
              setImages({});
              Alert.alert('Success', 'Storage cleared.');
            } catch (error) {
              console.error('Clear all error:', error);
              Alert.alert('Error', 'Failed to clear storage.');
            }
          }
        },
      ]
    );
  };

  const handlePrint = async () => {
    try {
      const { year, monthIndex } = currentItem;
      const html = await generateHtmlContent(year, monthIndex, images[`${year}-${monthIndex}`], isSimpleMode);
      const { uri } = await Print.printToFileAsync({
        html,
        width: 595, // A4 width in points (72 dpi)
        height: 842 // A4 height in points
      });
      await Sharing.shareAsync(uri, { UTI: '.pdf', mimeType: 'application/pdf' });
    } catch (error) {
      console.error('Print error:', error);
      Alert.alert('Error', 'Failed to generate PDF.');
    }
  };

  const handlePageChange = (index: number) => {
    if (index >= 0 && index < monthsList.length) {
      flatListRef.current?.scrollToIndex({ index, animated: true });
      setCurrentIndex(index);
    }
  };

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      const index = viewableItems[0].index;
      if (index !== null && index !== undefined) {
        setCurrentIndex(index);
      }
    }
  }).current;

  return (
    <SafeAreaProvider>
      <AppLayout
        year={currentItem.year}
        currentMonth={currentItem.monthIndex}
        isSimpleMode={isSimpleMode}
        onToggleSimpleMode={() => setIsSimpleMode(prev => !prev)}
        onPrev={() => handlePageChange(currentIndex - 1)}
        onNext={() => handlePageChange(currentIndex + 1)}
        onPrint={handlePrint}
        onClearAll={handleClearAll}
      >
        <FlatList
          ref={flatListRef}
          data={monthsList}
          keyExtractor={(item) => item.id}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          initialScrollIndex={safeInitialIndex}
          getItemLayout={(_, index) => ({
            length: screenWidth,
            offset: screenWidth * index,
            index,
          })}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
          renderItem={({ item }) => (
            <View style={{ width: screenWidth, flex: 1 }}>
              <MonthPage
                year={item.year}
                monthIndex={item.monthIndex}
                image={images[`${item.year}-${item.monthIndex}`]}
                isSimpleMode={isSimpleMode}
                onImageUpload={(uri) => handleImageUpload(item.year, item.monthIndex, uri)}
                onDelete={() => handleImageDelete(item.year, item.monthIndex)}
              />
            </View>
          )}
        />
      </AppLayout>
    </SafeAreaProvider>
  );
}
