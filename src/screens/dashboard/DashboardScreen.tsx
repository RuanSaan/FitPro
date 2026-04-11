import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { supabase } from '../../lib/supabase';
import IMCScreen from '../calculators/IMCScreen';
import CaloriasScreen from '../calculators/CaloriasScreen';
import MetasScreen from '../MetasScreen';
import TreinosScreen from '../TreinosScreen';
import PerfilScreen from '../PerfilScreen';
import NutricaoScreen from '../NutricaoScreen';

type Props = { session: any };

const MENU = [
  { key: 'imc', emoji: '⚖️', label: 'IMC', color: '#3b82f6' },
  { key: 'calorias', emoji: '🔥', label: 'Calorias', color: '#f97316' },
  { key: 'treinos', emoji: '🏋️', label: 'Treinos', color: '#22c55e' },
  { key: 'metas', emoji: '🎯', label: 'Metas', color: '#a855f7' },
  { key: 'nutricao', emoji: '🍽️', label: 'Nutrição', color: '#ef4444' },
  { key: 'perfil', emoji: '👤', label: 'Perfil', color: '#06b6d4' },
];

export default function DashboardScreen({ session }: Props) {
  const [currentScreen, setCurrentScreen] = useState('dashboard');
  const userName = session?.user?.user_metadata?.full_name?.split(' ')[0] || 'Atleta';

  async function handleLogout() {
    await supabase.auth.signOut();
  }

  if (currentScreen === 'imc') return <IMCScreen onBack={() => setCurrentScreen('dashboard')} />;
  if (currentScreen === 'calorias') return <CaloriasScreen onBack={() => setCurrentScreen('dashboard')} />;
  if (currentScreen === 'metas') return <MetasScreen onBack={() => setCurrentScreen('dashboard')} session={session} />;
  if (currentScreen === 'treinos') return <TreinosScreen onBack={() => setCurrentScreen('dashboard')} />;
  if (currentScreen === 'perfil') return <PerfilScreen onBack={() => setCurrentScreen('dashboard')} session={session} />;
  if (currentScreen === 'nutricao') return <NutricaoScreen onBack={() => setCurrentScreen('dashboard')} session={session} />;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Top bar */}
      <View style={styles.topBar}>
        <View>
          <Text style={styles.topBarTitle}>FIT<Text style={styles.topBarAccent}>PRO</Text></Text>
        </View>
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutText}>Sair</Text>
        </TouchableOpacity>
      </View>

      {/* Hero */}
      <View style={styles.hero}>
        <Text style={styles.heroGreeting}>Olá, {userName}! 💪</Text>
        <Text style={styles.heroSub}>VAMOS SUPERAR SEUS LIMITES HOJE?</Text>
      </View>

      {/* Stats */}
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statEmoji}>🔥</Text>
          <Text style={styles.statValue}>0</Text>
          <Text style={styles.statLabel}>Dias{'\n'}seguidos</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statEmoji}>💪</Text>
          <Text style={styles.statValue}>0</Text>
          <Text style={styles.statLabel}>Treinos{'\n'}feitos</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statEmoji}>🍎</Text>
          <Text style={styles.statValue}>0</Text>
          <Text style={styles.statLabel}>Kcal{'\n'}hoje</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statEmoji}>💧</Text>
          <Text style={styles.statValue}>0</Text>
          <Text style={styles.statLabel}>Água{'\n'}(ml)</Text>
        </View>
      </View>

      {/* Section title */}
      <View style={styles.sectionHeader}>
        <View style={styles.sectionAccent} />
        <Text style={styles.sectionTitle}>MÓDULOS</Text>
      </View>

      {/* Menu grid */}
      <View style={styles.menuGrid}>
        {MENU.map((item) => (
          <TouchableOpacity
            key={item.key}
            style={styles.menuCard}
            onPress={() => setCurrentScreen(item.key)}
          >
            <View style={[styles.menuIconBg, { backgroundColor: item.color + '22' }]}>
              <Text style={styles.menuEmoji}>{item.emoji}</Text>
            </View>
            <Text style={styles.menuLabel}>{item.label}</Text>
            <View style={[styles.menuAccentLine, { backgroundColor: item.color }]} />
          </TouchableOpacity>
        ))}
      </View>

      {/* Motivational */}
      <View style={styles.motivationCard}>
        <Text style={styles.motivationText}>"O único treino ruim é aquele que não aconteceu."</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0a' },
  content: { paddingBottom: 40 },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 50,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1a1a1a',
  },
  topBarTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#ffffff',
    letterSpacing: 3,
  },
  topBarAccent: { color: '#f97316' },
  logoutBtn: {
    borderWidth: 1,
    borderColor: '#2a2a2a',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 8,
  },
  logoutText: { color: '#6b7280', fontSize: 13 },
  hero: {
    paddingHorizontal: 24,
    paddingVertical: 28,
    borderBottomWidth: 1,
    borderBottomColor: '#1a1a1a',
  },
  heroGreeting: {
    fontSize: 28,
    fontWeight: '900',
    color: '#ffffff',
    marginBottom: 4,
  },
  heroSub: {
    fontSize: 11,
    color: '#f97316',
    letterSpacing: 2,
    fontWeight: 'bold',
  },
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 20,
    gap: 10,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#111111',
    borderRadius: 14,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1f1f1f',
  },
  statEmoji: { fontSize: 20, marginBottom: 4 },
  statValue: {
    fontSize: 20,
    fontWeight: '900',
    color: '#ffffff',
  },
  statLabel: {
    fontSize: 10,
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 16,
    gap: 10,
  },
  sectionAccent: {
    width: 4,
    height: 18,
    backgroundColor: '#f97316',
    borderRadius: 2,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '900',
    color: '#ffffff',
    letterSpacing: 3,
  },
  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    gap: 12,
  },
  menuCard: {
    width: '30%',
    backgroundColor: '#111111',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1f1f1f',
    overflow: 'hidden',
  },
  menuIconBg: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  menuEmoji: { fontSize: 24 },
  menuLabel: {
    fontSize: 12,
    color: '#9ca3af',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  menuAccentLine: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
  },
  motivationCard: {
    margin: 24,
    marginTop: 24,
    backgroundColor: '#111111',
    borderRadius: 16,
    padding: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#f97316',
    borderWidth: 1,
    borderColor: '#1f1f1f',
  },
  motivationText: {
    fontSize: 14,
    color: '#9ca3af',
    fontStyle: 'italic',
    lineHeight: 22,
  },
});