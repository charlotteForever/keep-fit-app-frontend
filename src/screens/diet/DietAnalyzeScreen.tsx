import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Button } from '../../components/Button';
import { dietService } from '../../services/diet.service';
import { COLORS } from '../../constants/config';

type Props = NativeStackScreenProps<any, 'DietAnalyze'>;

export const DietAnalyzeScreen: React.FC<Props> = ({ navigation, route }) => {
  const { imageUri, mode } = route.params as { imageUri: string; mode: string };
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [foods, setFoods] = useState<any[]>([]);

  const handleAnalyze = async () => {
    setAnalyzing(true);
    try {
      const result = await dietService.analyzePhoto(imageUri);

      if (result.foods && result.foods.length > 0) {
        setFoods(result.foods);
      } else {
        Alert.alert(
          '识别失败',
          '无法识别食物，是否切换到快捷模式？',
          [
            { text: '取消', onPress: () => navigation.goBack() },
            {
              text: '快捷模式',
              onPress: () => navigation.replace('DietResult', { imageUri, mode: 'quick' }),
            },
          ]
        );
      }
    } catch (error: any) {
      Alert.alert('识别失败', '请重新拍照或使用快捷模式');
      navigation.goBack();
    } finally {
      setAnalyzing(false);
    }
  };

  const handleContinue = () => {
    const items = foods.map((food) => ({
      name: food.name,
      grams: food.estimatedGrams || 100,
      calories: Math.round(((food.caloriesPer100g || 150) * (food.estimatedGrams || 100)) / 100),
      source: 'ai',
    }));

    navigation.navigate('DietResult', {
      imageUri,
      mode,
      items,
    });
  };

  React.useEffect(() => {
    handleAnalyze();
  }, []);

  if (analyzing) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>正在识别食物...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Image source={{ uri: imageUri }} style={styles.image} />

        {foods.length > 0 && (
          <>
            <View style={styles.resultCard}>
              <Text style={styles.cardTitle}>识别结果</Text>
              {foods.map((food, index) => (
                <View key={index} style={styles.foodRow}>
                  <View style={styles.foodInfo}>
                    <Text style={styles.foodName}>{food.name}</Text>
                    <Text style={styles.foodDetails}>
                      约 {food.estimatedGrams}克 · {food.caloriesPer100g}千卡/100克
                    </Text>
                  </View>
                  <Text style={styles.confidence}>
                    {Math.round(food.probability * 100)}%
                  </Text>
                </View>
              ))}
            </View>

            <Text style={styles.hint}>
              下一步可以编辑食物名称和克数
            </Text>

            <Button
              title="继续编辑"
              onPress={handleContinue}
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
  resultCard: {
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
  foodRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  foodInfo: {
    flex: 1,
  },
  foodName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  foodDetails: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  confidence: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '600',
  },
  hint: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 16,
  },
});
