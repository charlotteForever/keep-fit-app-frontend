import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { authService } from '../../services/auth.service';
import { useAuthStore } from '../../store/authStore';
import { COLORS } from '../../constants/config';

type Props = NativeStackScreenProps<any, 'Login'>;

export const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const setAuth = useAuthStore((state) => state.setAuth);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('错误', '请填写所有字段');
      return;
    }

    setLoading(true);
    try {
      const response = await authService.login({ email, password });
      setAuth(response.user, response.token);
    } catch (error: any) {
      Alert.alert('登录失败', error.response?.data?.message || '请检查您的邮箱和密码');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>登录</Text>
        <Text style={styles.subtitle}>欢迎回来！</Text>

        <View style={styles.form}>
          <Input
            label="邮箱"
            value={email}
            onChangeText={setEmail}
            placeholder="输入您的邮箱"
            keyboardType="email-address"
          />
          <Input
            label="密码"
            value={password}
            onChangeText={setPassword}
            placeholder="输入您的密码"
            secureTextEntry
          />

          <Button
            title="登录"
            onPress={handleLogin}
            loading={loading}
            fullWidth
          />

          <Button
            title="还没有账号？注册"
            onPress={() => navigation.navigate('Register')}
            variant="outline"
            fullWidth
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginBottom: 32,
  },
  form: {
    gap: 16,
  },
});
