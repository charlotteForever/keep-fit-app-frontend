import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { authService } from '../../services/auth.service';
import { useAuthStore } from '../../store/authStore';
import { COLORS } from '../../constants/config';

type Props = NativeStackScreenProps<any, 'Register'>;

export const RegisterScreen: React.FC<Props> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [loading, setLoading] = useState(false);
  const setAuth = useAuthStore((state) => state.setAuth);

  const handleRegister = async () => {
    if (!email || !password) {
      Alert.alert('错误', '请填写邮箱和密码');
      return;
    }

    if (password.length < 6) {
      Alert.alert('错误', '密码至少需要6个字符');
      return;
    }

    setLoading(true);
    try {
      const response = await authService.register({
        email,
        password,
        nickname: nickname || undefined,
      });
      setAuth(response.user, response.token);
    } catch (error: any) {
      Alert.alert('注册失败', error.response?.data?.message || '请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>注册</Text>
        <Text style={styles.subtitle}>创建您的账号</Text>

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
            placeholder="至少6个字符"
            secureTextEntry
          />
          <Input
            label="昵称（可选）"
            value={nickname}
            onChangeText={setNickname}
            placeholder="输入您的昵称"
          />

          <Button
            title="注册"
            onPress={handleRegister}
            loading={loading}
            fullWidth
          />

          <Button
            title="已有账号？登录"
            onPress={() => navigation.navigate('Login')}
            variant="outline"
            fullWidth
          />
        </View>
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
    padding: 24,
    justifyContent: 'center',
    minHeight: '100%',
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
