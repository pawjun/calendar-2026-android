import React from 'react';
import { View, Text, Image, TouchableOpacity, Alert } from 'react-native';
import { Camera, Image as ImageIcon, Trash2 } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';

interface PhotoUploaderProps {
    month: string;
    currentImage?: string;
    onImageUpload: (uri: string) => void;
    onDelete: () => void;
}

export const PhotoUploader: React.FC<PhotoUploaderProps> = ({ month, currentImage, onImageUpload, onDelete }) => {

    const pickImage = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (permissionResult.granted === false) {
            Alert.alert("Permission Required", "You need to grant camera roll permissions to upload photos.");
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [133, 89], // L-wide Landscape ratio
            quality: 0.7, // Reduced quality for storage efficiency
            base64: false, // Don't need base64, URI is fine
        });

        if (!result.canceled && result.assets[0].uri) {
            onImageUpload(result.assets[0].uri);
        }
    };

    return (
        <View
            className="w-full bg-gray-100 overflow-hidden relative mb-4 shadow-sm rounded-md"
            style={{ width: '100%', aspectRatio: 1.49 }}
        >
            {currentImage ? (
                <View className="w-full h-full relative">
                    <Image
                        source={{ uri: currentImage }}
                        className="w-full h-full"
                        resizeMode="cover"
                    />
                    <View className="absolute bottom-2 right-2 flex-row gap-2">
                        <TouchableOpacity
                            className="p-2 bg-red-500 rounded-full"
                            onPress={onDelete}
                        >
                            <Trash2 color="white" size={20} />
                        </TouchableOpacity>
                        <TouchableOpacity
                            className="p-2 bg-black/50 rounded-full"
                            onPress={pickImage}
                        >
                            <Camera color="white" size={20} />
                        </TouchableOpacity>
                    </View>
                </View>
            ) : (
                <TouchableOpacity
                    className="w-full h-full items-center justify-center border-2 border-dashed border-gray-300 bg-gray-50"
                    onPress={pickImage}
                >
                    <View className="items-center justify-center p-4">
                        <ImageIcon size={40} color="#94a3b8" />
                        <Text className="mt-2 text-sm text-calendar-muted text-center font-medium">
                            Tap to add photo for {month}
                        </Text>
                    </View>
                </TouchableOpacity>
            )}
        </View>
    );
};
