import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAuthStore } from '../store/authStore';
import { LoginScreen } from '../screens/auth/LoginScreen';
import { RegisterScreen } from '../screens/auth/RegisterScreen';
import { HomeScreen } from '../screens/home/HomeScreen';
import { ProfileScreen } from '../screens/profile/ProfileScreen';
import { AIChatScreen } from '../screens/ai/AIChatScreen';
import { DietModeSelectScreen } from '../screens/diet/DietModeSelectScreen';
import { DietCameraScreen } from '../screens/diet/DietCameraScreen';
import { NutritionLabelScreen } from '../screens/diet/NutritionLabelScreen';
import { DietAnalyzeScreen } from '../screens/diet/DietAnalyzeScreen';
import { DietResultScreen } from '../screens/diet/DietResultScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#4CAF50',
        tabBarInactiveTintColor: '#757575',
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ tabBarLabel: '首页' }}
      />
      <Tab.Screen
        name="AI"
        component={AIChatScreen}
        options={{ tabBarLabel: 'AI' }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ tabBarLabel: '我的' }}
      />
    </Tab.Navigator>
  );
};

const AuthStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
};

const AppStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="MainTabs"
        component={MainTabs}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="DietModeSelect"
        component={DietModeSelectScreen}
        options={{ title: '选择记录方式' }}
      />
      <Stack.Screen
        name="DietCamera"
        component={DietCameraScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="NutritionLabel"
        component={NutritionLabelScreen}
        options={{ title: '营养价值表识别' }}
      />
      <Stack.Screen
        name="DietAnalyze"
        component={DietAnalyzeScreen}
        options={{ title: '食物识别' }}
      />
      <Stack.Screen
        name="DietResult"
        component={DietResultScreen}
        options={{ title: '编辑记录' }}
      />
    </Stack.Navigator>
  );
};

export const RootNavigator: React.FC = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return (
    <NavigationContainer>
      {true ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
};
