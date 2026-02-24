import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, Alert, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { dietService } from '../../services/diet.service';
import { COLORS, MEAL_TYPES } from '../../constants/config';

type Props = NativeStackScreenProps<any, 'DietResult'>;

interface FoodItem {
  name: string;
  grams: number;
  calories: number;
  source: string;
}

export const DietResultScreen: React.FC<Props> = ({ navigation, route }) => {
  const { imageUri, mode, items: initialItems } = route.params as any;
  const [loading, setLoading] = useState(false);
  const [mealType, setMealType] = useState('breakfast');
  const [items, setItems] = useState<FoodItem[]>(initialItems || []);

  const handleAddItem = () => {
    setItems([...items, { name: '', grams: 100, calories: 0, source: 'manual' }]);
  };

  const handleUpdateItem = (index: number, field: keyof FoodItem, value: any) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };

    // Recalculate calories if grams changed
    if (field === 'grams' && newItems[index].source === 'ai') {
      const caloriesPer100g = (newItems[index].calories * 100) / (items[index].grams || 100);
      newItems[index].calories = Math.round((caloriesPer100g * value) / 100);
    }

    setItems(newItems);
  };

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const calculateTotal = () => {
    return items.reduce((sum, item) => sum + (item.calories || 0), 0);
  };

  const handleSave = async () => {
    if (items.length === 0) {
      Alert.alert('错误', '请至少添加一项食物');
      return;
    }

    const invalidItems = items.filter((item) => !item.name || item.grams <= 0);
    if (invalidItems.length > 0) {
      Alert.alert('错误', '请填写完整的食物信息');
      return;
    }

    setLoading(true);
    try {
      const total = {
        calories: calculateTotal(),
      };

      const recordData: any = {
        mode,
        status: mode === 'quick' ? 'pending' : 'confirmed',
        mealType,
        items,
        total,
      };

      if (mode === 'reference_photo') {
        recordData.reference = {
          type: 'fist',
          presentInImage: true,
        };
      }

      await dietService.createRecord(recordData);

      Alert.alert(
        '成功',
        mode === 'quick' ? '已保存为待补录记录' : '饮食记录已保存',
        [{ text: '确定', onPress: () => navigation.navigate('MainTabs') }]
      );
    } catch (error) {
      Alert.alert('错误', '保存失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Image source={{ uri: imageUri }} style={styles.image} />

        <View style={styles.mealTypeContainer}>
          <Text style={styles.label}>餐次</Text>
          <View style={styles.mealTypeButtons}>
            {MEAL_TYPES.map((type) => (
              <TouchableOpacity
                key={type.value}
                style={[
                  styles.mealTypeButton,
                  mealType === type.value && styles.mealTypeButtonActive,
                ]}
                onPress={() => setMealType(type.value)}
              >
                <Text
                  style={[
                    styles.mealTypeText,
                    mealType === type.value && styles.mealTypeTextActive,
                  ]}
                >
                  {type.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.itemsContainer}>
          <View style={styles.itemsHeader}>
            <Text style={styles.label}>食物列表</Text>
            <TouchableOpacity onPress={handleAddItem}>
              <Text style={styles.addButton}>+ 添加</Text>
            </TouchableOpacity>
          </View>

          {items.map((item, index) => (
            <View key={index} style={styles.itemCard}>
              <Input
                label="食物名称"
                value={item.name}
                onChangeText={(value) => handleUpdateItem(index, 'name', value)}
                placeholder="例如：炒鸡蛋"
              />
              <View style={styles.itemRow}>
                <View style={styles.itemInput}>
                  <Input
                    label="克数"
                    value={item.grams.toString()}
                    onChangeText={(value) =>
                      handleUpdateItem(index, 'grams', parseFloat(value) || 0)
                    }
                    keyboardType="numeric"
                  />
                </View>
                <View style={styles.itemInput}>
                  <Input
                    label="热量（千卡）"
                    value={item.calories.toString()}
                    onChangeText={(value) =>
                      handleUpdateItem(index, 'calories', parseFloat(value) || 0)
                    }
                    keyboardType="numeric"
                  />
                </View>
              </View>
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => handleRemoveItem(index)}
              >
                <Text style={styles.removeText}>删除</Text>
              </TouchableOpacity>
            </View>
          ))}

          {items.length === 0 && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>暂无食物，点击"添加"按钮开始</Text>
            </View>
          )}
        </View>

        {items.length > 0 && (
          <View style={styles.totalCard}>
            <Text style={styles.totalLabel}>总热量</Text>
            <Text style={styles.totalValue}>{calculateTotal()} 千卡</Text>
          </View>
        )}

        <Button
          title={mode === 'quick' ? '保存为待补录' : '保存记录'}
          onPress={handleSave}
          loading={loading}
          fullWidth
        />
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
  image: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 16,
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
    gap: 8,
  },
  mealTypeButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
  },
  mealTypeButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  mealTypeText: {
    fontSize: 14,
    color: COLORS.text,
  },
  mealTypeTextActive: {
    color: COLORS.surface,
    fontWeight: '600',
  },
  itemsContainer: {
    marginBottom: 16,
  },
  itemsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  addButton: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '600',
  },
  itemCard: {
    backgroundColor: COLORS.surface,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  itemRow: {
    flexDirection: 'row',
    gap: 12,
  },
  itemInput: {
    flex: 1,
  },
  removeButton: {
    alignSelf: 'flex-end',
    marginTop: 8,
  },
  removeText: {
    fontSize: 14,
    color: COLORS.error,
  },
  emptyState: {
    padding: 32,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  totalCard: {
    backgroundColor: '#E8F5E9',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
  },
  totalValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
});
