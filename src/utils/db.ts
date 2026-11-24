import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system/legacy';

const STORAGE_KEY = 'calendar_images_combined';

/**
 * Saves an image from a URI. Copies the file to internal storage.
 */
export const saveImageToDB = async (year: number, monthIndex: number, imageUri: string): Promise<string> => {
    const key = `${year}-${monthIndex}`;

    try {
        // @ts-ignore
        const docDir = FileSystem.documentDirectory;

        let finalPath = imageUri;

        if (docDir) {
            const dir = docDir + 'calendar_photos/';
            const dirInfo = await FileSystem.getInfoAsync(dir);
            if (!dirInfo.exists) {
                await FileSystem.makeDirectoryAsync(dir, { intermediates: true });
            }

            // Clean up previous image for this month if it exists
            await deleteImageFromDB(year, monthIndex);

            const fileName = `photo_${key}_${Date.now()}.jpg`;
            const filePath = dir + fileName;

            // Use copyAsync instead of writeAsStringAsync for better performance with large files
            await FileSystem.copyAsync({
                from: imageUri,
                to: filePath
            });

            finalPath = filePath;
        } else {
            console.warn('FileSystem.documentDirectory is null. Storing temporary URI directly. Photos may be lost on app restart.');
            // Even if we can't copy, we should still clean up the record for the previous image
            // Note: deleteImageFromDB might also fail to delete the physical file if docDir is null, 
            // but it will still update AsyncStorage.
            await deleteImageFromDB(year, monthIndex);
        }

        // Store the path in AsyncStorage
        const existingData = await AsyncStorage.getItem(STORAGE_KEY);
        const images = existingData ? JSON.parse(existingData) : {};
        images[key] = finalPath;
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(images));

        return finalPath;
    } catch (error) {
        console.error('Save Error:', error);
        throw error;
    }
};

/**
 * Deletes an image for a specific month.
 */
export const deleteImageFromDB = async (year: number, monthIndex: number): Promise<void> => {
    const key = `${year}-${monthIndex}`;
    try {
        const data = await AsyncStorage.getItem(STORAGE_KEY);
        if (!data) return;

        const images = JSON.parse(data);
        const path = images[key];

        if (path && path.startsWith('file://')) {
            const fileInfo = await FileSystem.getInfoAsync(path);
            if (fileInfo.exists) {
                await FileSystem.deleteAsync(path, { idempotent: true });
            }
        }

        delete images[key];
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(images));
    } catch (error) {
        console.error('Delete Error:', error);
    }
};

/**
 * Clears all saved images.
 */
export const clearAllImagesFromDB = async (): Promise<void> => {
    try {
        // @ts-ignore
        const docDir = FileSystem.documentDirectory;
        if (docDir) {
            const dir = docDir + 'calendar_photos/';
            await FileSystem.deleteAsync(dir, { idempotent: true });
        }
        await AsyncStorage.removeItem(STORAGE_KEY);
    } catch (error) {
        console.error('Clear All Error:', error);
    }
};

/**
 * Loads images. Handles both FileSystem paths and Base64 strings.
 */
export const getImagesFromDB = async (): Promise<Record<string, string>> => {
    try {
        const data = await AsyncStorage.getItem(STORAGE_KEY);
        if (!data) return {};
        const images = JSON.parse(data);
        return images;
    } catch (error) {
        console.error('Unified Load Error:', error);
        return {};
    }
};
