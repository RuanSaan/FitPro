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

type Props = {
  session: any;
};

export default function DashboardScreen({ session }: Props) {
  const [currentScreen, setCurrentScreen] = useState('dashboard');
  const userName = session?.user?.user_metadata?.full_name?.split(' ')[0] || 'Atleta';

  async function handleLogout() {
    await supabase.auth.signOut();
  }

  if (currentScreen === 'imc') {
    return <IMCScreen onBack={() => setCurrentScreen('dashboard')} />;
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Olá, {userName}! 👋</Text>
          <Text style={styles.subtitle}>Vamos treinar hoje?</Text>
        </View>
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutText}>Sair</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.cardsRow}>
        <View style={[styles.card, styles.cardGreen]}>
          <Text style={styles.cardEmoji}>🔥</Text>
          <Text style={styles.cardValue}>0</Text>
          <Text style={styles.cardLabel}>Dias seguidos</Text>
        </View>
        <View style={[styles.card, styles.cardBlue]}>
          <Text style={styles.cardEmoji}>💪</Text>
          <Text style={styles.cardValue}>0</Text>
          <Text style={styles.cardLabel}>Treinos feitos</Text>
        </View>
      </View>

      <View style={styles.cardsRow}>
        <View style={[styles.card, styles.cardOrange]}>
          <Text style={styles.cardEmoji}>🍎</Text>
          <Text style={styles.cardValue}>0</Text>
          <Text style={styles.cardLabel}>Kcal hoje</Text>
        </View>
        <View style={[styles.card, styles.cardPurple]}>
          <Text style={styles.cardEmoji}>💧</Text>
          <Text style={styles.cardValue}>0ml</Text>
          <Text style={styles.cardLabel}>Água hoje</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>O que vamos fazer?</Text>

      <View style={styles.menuGrid}>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => setCurrentScreen('imc')}
        >
          <Text style={styles.menuEmoji}>⚖️</Text>
          <Text style={styles.menuLabel}>Calculadora IMC</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuEmoji}>🔥</Text>
          <Text style={styles.menuLabel}>Calorias</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuEmoji}>🏋️</Text>
          <Text style={styles.menuLabel}>Treinos</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuEmoji}>🎯</Text>
          <Text style={styles.menuLabel}>Minhas Metas</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuEmoji}>🍽️</Text>
          <Text style={styles.menuLabel}>Nutrição</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuEmoji}>👤</Text>
          <Text style={styles.menuLabel}>Perfil</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  content: { padding: 24, paddingTop: 60 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  greeting: { fontSize: 24, fontWeight: 'bold', color: '#f1f5f9' },
  subtitle: { fontSize: 14, color: '#94a3b8', marginTop: 2 },
  logoutBtn: {
    backgroundColor: '#1e293b',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#334155',
  },
  logoutText: { color: '#94a3b8', fontSize: 14 },
  cardsRow: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  card: { flex: 1, borderRadius: 16, padding: 16, alignItems: 'center' },
  cardGreen: { backgroundColor: '#14532d' },
  cardBlue: { backgroundColor: '#1e3a5f' },
  cardOrange: { backgroundColor: '#431407' },
  cardPurple: { backgroundColor: '#2e1065' },
  cardEmoji: { fontSize: 24, marginBottom: 4 },
  cardValue: { fontSize: 22, fontWeight: 'bold', color: '#f1f5f9' },
  cardLabel: { fontSize: 12, color: '#94a3b8', marginTop: 2, textAlign: 'center' },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#f1f5f9',
    marginTop: 12,
    marginBottom: 16,
  },
  menuGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  menuItem: {
    width: '30%',
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  menuEmoji: { fontSize: 28, marginBottom: 8 },
  menuLabel: { fontSize: 12, color: '#94a3b8', textAlign: 'center' },
});