import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { dietService } from '../../services/diet.service';
import { COLORS, MEAL_TYPES } from '../../constants/config';

type Props = NativeStackScreenProps<any, 'NutritionLabel'>;

export const NutritionLabelScreen: React.FC<Props> = ({ navigation, route }) => {
  const { imageUri } = route.params as { imageUri: string };
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [nutrition, setNutrition] = useState<any>(null);
  const [consumedGrams, setConsumedGrams] = useState('');
  const [mealType, setMealType] = useState('breakfast');

  const handleAnalyze = async () => {
    setAnalyzing(true);
    try {
      // Upload image
      const { uploadUrl, fileUrl } = await dietService.getUploadUrl(
        `nutrition-${Date.now()}.jpg`,
        'image/jpeg'
      );
      await dietService.uploadImage(imageUri, uploadUrl);

      // Analyze nutrition label
      const result = await dietService.analyzeLabel(fileUrl);
      setNutrition({ ...result.nutrition, imageUrl: fileUrl });
    } catch (error: any) {
      Alert.alert('识别失败', error.response?.data?.message || '请重新拍照或使用快捷模式');
      navigation.goBack();
    } finally {
      setAnalyzing(false);
    }
  };

  const handleSave = async () => {
    if (!consumedGrams || !nutrition) {
      Alert.alert('错误', '请输入食用克数');
      return;
    }

    const grams = parseFloat(consumedGrams);
    if (isNaN(grams) || grams <= 0) {
      Alert.alert('错误', '请输入有效的克数');
      return;
    }

    setLoading(true);
    try {
      const total = {
        calories: Math.round((nutrition.calories * grams) / 100),
        protein: nutrition.protein ? (nutrition.protein * grams) / 100 : undefined,
        fat: nutrition.fat ? (nutrition.fat * grams) / 100 : undefined,
        carbohydrate: nutrition.carbohydrate
          ? (nutrition.carbohydrate * grams) / 100
          : undefined,
      };

      await dietService.createRecord({
        mode: 'nutrition_label',
        status: 'confirmed',
        mealType,
        images: [{ url: nutrition.imageUrl }],
        nutritionPer100g: nutrition,
        consumedGrams: grams,
        total,
        source: 'nutrition_label_ocr',
      });

      Alert.alert('成功', '饮食记录已保存', [
        { text: '确定', onPress: () => navigation.navigate('MainTabs') },
      ]);
    } catch (error) {
      Alert.alert('错误', '保存失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    handleAnalyze();
  }, []);

  if (analyzing) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>正在识别营养价值表...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Image source={{ uri: imageUri }} style={styles.image} />

        {nutrition && (
          <>
            <View style={styles.nutritionCard}>
              <Text style={styles.cardTitle}>识别结果（每100克）</Text>
              <View style={styles.nutritionRow}>
                <Text style={styles.nutritionLabel}>热量</Text>
                <Text style={styles.nutritionValue}>{nutrition.calories} 千卡</Text>
              </View>
              {nutrition.protein && (
                <View style={styles.nutritionRow}>
                  <Text style={styles.nutritionLabel}>蛋白质</Text>
                  <Text style={styles.nutritionValue}>{nutrition.protein} 克</Text>
                </View>
              )}
              {nutrition.fat && (
                <View style={styles.nutritionRow}>
                  <Text style={styles.nutritionLabel}>脂肪</Text>
                  <Text style={styles.nutritionValue}>{nutrition.fat} 克</Text>
                </View>
              )}
              {nutrition.carbohydrate && (
                <View style={styles.nutritionRow}>
                  <Text style={styles.nutritionLabel}>碳水化合物</Text>
                  <Text style={styles.nutritionValue}>{nutrition.carbohydrate} 克</Text>
                </View>
              )}
            </View>

            <Input
              label="食用克数"
              value={consumedGrams}
              onChangeText={setConsumedGrams}
              placeholder="输入实际食用的克数"
              keyboardType="numeric"
            />

            <View style={styles.mealTypeContainer}>
              <Text style={styles.label}>餐次</Text>
              <View style={styles.mealTypeButtons}>
                {MEAL_TYPES.map((type) => (
                  <Button
                    key={type.value}
                    title={type.label}
                    onPress={() => setMealType(type.value)}
                    variant={mealType === type.value ? 'primary' : 'outline'}
                  />
                ))}
              </View>
            </View>

            {consumedGrams && nutrition && (
              <View style={styles.totalCard}>
                <Text style={styles.cardTitle}>总计</Text>
                <Text style={styles.totalCalories}>
                  {Math.round((nutrition.calories * parseFloat(consumedGrams)) / 100)} 千卡
                </Text>
              </View>
            )}

            <Button
              title="保存记录"
              onPress={handleSave}
              loading={loading}
              fullWidth
            />
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 16,
  },
  nutritionCard: {
    backgroundColor: COLORS.surface,
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 12,
  },
  nutritionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  nutritionLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  nutritionValue: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8,
  },
  mealTypeContainer: {
    marginBottom: 16,
  },
  mealTypeButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  totalCard: {
    backgroundColor: '#E8F5E9',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    alignItems: 'center',
  },
  totalCalories: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
});
