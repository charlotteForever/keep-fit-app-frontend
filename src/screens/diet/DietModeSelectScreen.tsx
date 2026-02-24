import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { COLORS, DIET_MODES } from '../../constants/config';

type Props = NativeStackScreenProps<any, 'DietModeSelect'>;

export const DietModeSelectScreen: React.FC<Props> = ({ navigation }) => {
  const handleModeSelect = (mode: string) => {
    navigation.navigate('DietCamera', { mode });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>选择记录方式</Text>
        <Text style={styles.subtitle}>根据您的场景选择最合适的记录方式</Text>

        {DIET_MODES.map((mode) => (
          <TouchableOpacity
            key={mode.value}
            style={styles.modeCard}
            onPress={() => handleModeSelect(mode.value)}
            activeOpacity={0.7}
          >
            <Text style={styles.modeIcon}>{mode.icon}</Text>
            <View style={styles.modeContent}>
              <Text style={styles.modeLabel}>{mode.label}</Text>
              <Text style={styles.modeDescription}>{mode.description}</Text>
            </View>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>
        ))}
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
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 24,
  },
  modeCard: {
    backgroundColor: COLORS.surface,
    padding: 20,
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  modeIcon: {
    fontSize: 32,
    marginRight: 16,
  },
  modeContent: {
    flex: 1,
  },
  modeLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  modeDescription: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  arrow: {
    fontSize: 24,
    color: COLORS.textSecondary,
  },
});
