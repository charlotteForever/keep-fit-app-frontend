import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';
import { userService } from '../../services/user.service';
import { useAuthStore } from '../../store/authStore';
import { Button } from '../../components/Button';
import { Loading } from '../../components/Loading';
import { COLORS } from '../../constants/config';

export const ProfileScreen: React.FC = () => {
  const { user, logout } = useAuthStore();
  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: userService.getProfile,
  });

  const handleLogout = () => {
    Alert.alert('退出登录', '确定要退出登录吗？', [
      { text: '取消', style: 'cancel' },
      {
        text: '确定',
        style: 'destructive',
        onPress: logout,
      },
    ]);
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {profile?.nickname?.[0] || profile?.email?.[0] || 'U'}
            </Text>
          </View>
          <Text style={styles.name}>{profile?.nickname || '用户'}</Text>
          <Text style={styles.email}>{profile?.email}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>个人信息</Text>
          <View style={styles.infoCard}>
            {profile?.age && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>年龄</Text>
                <Text style={styles.infoValue}>{profile.age} 岁</Text>
              </View>
            )}
            {profile?.gender && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>性别</Text>
                <Text style={styles.infoValue}>
                  {profile.gender === 'male' ? '男' : profile.gender === 'female' ? '女' : '其他'}
                </Text>
              </View>
            )}
            {profile?.height && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>身高</Text>
                <Text style={styles.infoValue}>{profile.height} cm</Text>
              </View>
            )}
            {profile?.weight && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>体重</Text>
                <Text style={styles.infoValue}>{profile.weight} kg</Text>
              </View>
            )}
            {profile?.goalType && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>目标</Text>
                <Text style={styles.infoValue}>
                  {profile.goalType === 'lose_weight' && '减重'}
                  {profile.goalType === 'gain_muscle' && '增肌'}
                  {profile.goalType === 'maintain' && '保持'}
                  {profile.goalType === 'improve_health' && '改善健康'}
                </Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>设置</Text>
          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuText}>编辑个人资料</Text>
            <Text style={styles.menuArrow}>›</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuText}>参考物设置</Text>
            <Text style={styles.menuArrow}>›</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuText}>关于</Text>
            <Text style={styles.menuArrow}>›</Text>
          </TouchableOpacity>
        </View>

        <Button
          title="退出登录"
          onPress={handleLogout}
          variant="outline"
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
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.surface,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 12,
  },
  infoCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  infoLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
  },
  menuItem: {
    backgroundColor: COLORS.surface,
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  menuText: {
    fontSize: 16,
    color: COLORS.text,
  },
  menuArrow: {
    fontSize: 24,
    color: COLORS.textSecondary,
  },
});
