import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { COLORS } from '../../constants/config';

type Props = NativeStackScreenProps<any, 'DietCamera'>;

export const DietCameraScreen: React.FC<Props> = ({ navigation, route }) => {
  const { mode } = route.params as { mode: string };

  const handlePhotoTaken = (uri: string) => {
    if (mode === 'nutrition_label') {
      navigation.navigate('NutritionLabel', { imageUri: uri });
    } else if (mode === 'reference_photo') {
      navigation.navigate('DietAnalyze', { imageUri: uri, mode });
    } else {
      navigation.navigate('DietResult', { imageUri: uri, mode });
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('权限不足', '需要相机权限才能拍照');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) {
      handlePhotoTaken(result.assets[0].uri);
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) {
      handlePhotoTaken(result.assets[0].uri);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.closeButton} onPress={() => navigation.goBack()}>
        <Text style={styles.closeText}>✕</Text>
      </TouchableOpacity>

      <Text style={styles.title}>选择图片来源</Text>

      <TouchableOpacity style={styles.option} onPress={takePhoto}>
        <Text style={styles.optionIcon}>📷</Text>
        <Text style={styles.optionText}>拍照</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.option} onPress={pickImage}>
        <Text style={styles.optionIcon}>🖼️</Text>
        <Text style={styles.optionText}>从相册选择</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeText: {
    fontSize: 18,
    color: COLORS.text,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 40,
  },
  option: {
    width: '100%',
    padding: 24,
    backgroundColor: '#fff',
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  optionIcon: {
    fontSize: 40,
    marginBottom: 8,
  },
  optionText: {
    fontSize: 16,
    color: COLORS.text,
    fontWeight: '500',
  },
});
