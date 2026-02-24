import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '../../services/user.service';
import { Loading } from '../../components/Loading';
import { Button } from '../../components/Button';
import { COLORS } from '../../constants/config';

type Props = NativeStackScreenProps<any, 'Home'>;

export const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const { data, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ['dashboard'],
    queryFn: dashboardService.getDashboard,
  });

  if (isLoading) {
    return <Loading />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
        }
      >
        <Text style={styles.title}>今日状态</Text>
        <Text style={styles.date}>
          {new Date().toLocaleDateString('zh-CN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </Text>

        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>热量</Text>
            <Text style={styles.statValue}>
              {data?.calories.current || 0} / {data?.calories.goal || 2000}
            </Text>
            <Text style={styles.statUnit}>千卡</Text>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${Math.min(data?.calories.percentage || 0, 100)}%` },
                ]}
              />
            </View>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statLabel}>蛋白质</Text>
            <Text style={styles.statValue}>
              {data?.protein.current || 0} / {data?.protein.goal || 60}
            </Text>
            <Text style={styles.statUnit}>克</Text>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${Math.min(data?.protein.percentage || 0, 100)}%` },
                ]}
              />
            </View>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statLabel}>运动</Text>
            <Text style={styles.statValue}>
              {data?.workout.minutes || 0} / {data?.workout.goal || 30}
            </Text>
            <Text style={styles.statUnit}>分钟</Text>
          </View>
        </View>

        <View style={styles.aiCard}>
          <Text style={styles.aiTitle}>💡 AI 建议</Text>
          <Text style={styles.aiText}>
            {data?.aiRecommendation || '暂无建议'}
          </Text>
        </View>

        <Button
          title="+ 记录饮食"
          onPress={() => navigation.navigate('DietModeSelect')}
          fullWidth
        />

        {data?.recentRecords && data.recentRecords.length > 0 && (
          <View style={styles.recentSection}>
            <Text style={styles.sectionTitle}>最近记录</Text>
            {data.recentRecords.map((record: any) => (
              <View key={record.id} style={styles.recordCard}>
                <Text style={styles.recordMeal}>
                  {record.valueJson.mealType === 'breakfast' && '早餐'}
                  {record.valueJson.mealType === 'lunch' && '午餐'}
                  {record.valueJson.mealType === 'dinner' && '晚餐'}
                  {record.valueJson.mealType === 'snack' && '加餐'}
                </Text>
                <Text style={styles.recordCalories}>
                  {record.valueJson.total?.calories || 0} 千卡
                </Text>
              </View>
            ))}
          </View>
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
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  date: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 24,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: COLORS.surface,
    padding: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  statUnit: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  progressBar: {
    height: 4,
    backgroundColor: COLORS.border,
    borderRadius: 2,
    marginTop: 8,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
  },
  aiCard: {
    backgroundColor: '#E8F5E9',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  aiTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8,
  },
  aiText: {
    fontSize: 14,
    color: COLORS.text,
    lineHeight: 20,
  },
  recentSection: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 12,
  },
  recordCard: {
    backgroundColor: COLORS.surface,
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  recordMeal: {
    fontSize: 16,
    color: COLORS.text,
  },
  recordCalories: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
});
