import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { supabase } from '../lib/supabase';

type Props = {
  onBack: () => void;
  session: any;
};

type Refeicao = {
  id: string;
  nome: string;
  calorias: number;
  proteina: number;
  carbo: number;
  gordura: number;
  horario: string;
};

export default function NutricaoScreen({ onBack, session }: Props) {
  const [refeicoes, setRefeicoes] = useState<Refeicao[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [nome, setNome] = useState('');
  const [calorias, setCalorias] = useState('');
  const [proteina, setProteina] = useState('');
  const [carbo, setCarbo] = useState('');
  const [gordura, setGordura] = useState('');
  const [horario, setHorario] = useState('');

  const metaCalorias = 2000;
  const totalCalorias = refeicoes.reduce((sum, r) => sum + r.calorias, 0);
  const totalProteina = refeicoes.reduce((sum, r) => sum + r.proteina, 0);
  const totalCarbo = refeicoes.reduce((sum, r) => sum + r.carbo, 0);
  const totalGordura = refeicoes.reduce((sum, r) => sum + r.gordura, 0);
  const progresso = Math.min((totalCalorias / metaCalorias) * 100, 100);

  useEffect(() => {
    loadRefeicoes();
  }, []);

  async function loadRefeicoes() {
    setLoading(true);
    const today = new Date().toISOString().split('T')[0];
    const { data, error } = await supabase
      .from('meals')
      .select('*')
      .eq('user_id', session.user.id)
      .eq('data', today)
      .order('created_at', { ascending: true });

    if (data) setRefeicoes(data);
    setLoading(false);
  }

  async function addRefeicao() {
    if (!nome || !calorias) return;
    setSaving(true);

    const { data, error } = await supabase.from('meals').insert({
      user_id: session.user.id,
      nome,
      calorias: parseInt(calorias) || 0,
      proteina: parseInt(proteina) || 0,
      carbo: parseInt(carbo) || 0,
      gordura: parseInt(gordura) || 0,
      horario,
    }).select().single();

    setSaving(false);
    if (data) {
      setRefeicoes([...refeicoes, data]);
      setNome('');
      setCalorias('');
      setProteina('');
      setCarbo('');
      setGordura('');
      setHorario('');
      setShowForm(false);
    }
  }

  async function deleteRefeicao(id: string) {
    await supabase.from('meals').delete().eq('id', id);
    setRefeicoes(refeicoes.filter((r) => r.id !== id));
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#22c55e" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <TouchableOpacity onPress={onBack} style={styles.backBtn}>
        <Text style={styles.backText}>← Voltar</Text>
      </TouchableOpacity>

      <View style={styles.headerRow}>
        <View>
          <Text style={styles.title}>🍽️ Nutrição</Text>
          <Text style={styles.subtitle}>Diário alimentar de hoje</Text>
        </View>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => setShowForm(!showForm)}
        >
          <Text style={styles.addBtnText}>{showForm ? '✕' : '+ Adicionar'}</Text>
        </TouchableOpacity>
      </View>

      {/* Resumo calórico */}
      <View style={styles.resumoCard}>
        <View style={styles.resumoHeader}>
          <Text style={styles.resumoLabel}>Calorias consumidas</Text>
          <Text style={styles.resumoMeta}>Meta: {metaCalorias} kcal</Text>
        </View>
        <Text style={styles.resumoValor}>
          <Text style={styles.resumoNum}>{totalCalorias}</Text>
          <Text style={styles.resumoUnidade}> kcal</Text>
        </Text>
        <View style={styles.barBg}>
          <View
            style={[
              styles.barFill,
              {
                width: `${progresso}%` as any,
                backgroundColor: progresso > 100 ? '#ef4444' : '#22c55e',
              },
            ]}
          />
        </View>
        <Text style={styles.restante}>
          {totalCalorias >= metaCalorias
            ? `⚠️ ${totalCalorias - metaCalorias} kcal acima da meta`
            : `✅ Faltam ${metaCalorias - totalCalorias} kcal para a meta`}
        </Text>
      </View>

      {/* Macros */}
      <View style={styles.macrosRow}>
        <View style={[styles.macroBox, { borderColor: '#ef4444' }]}>
          <Text style={[styles.macroValor, { color: '#ef4444' }]}>{totalProteina}g</Text>
          <Text style={styles.macroLabel}>Proteína</Text>
        </View>
        <View style={[styles.macroBox, { borderColor: '#f59e0b' }]}>
          <Text style={[styles.macroValor, { color: '#f59e0b' }]}>{totalCarbo}g</Text>
          <Text style={styles.macroLabel}>Carboidrato</Text>
        </View>
        <View style={[styles.macroBox, { borderColor: '#3b82f6' }]}>
          <Text style={[styles.macroValor, { color: '#3b82f6' }]}>{totalGordura}g</Text>
          <Text style={styles.macroLabel}>Gordura</Text>
        </View>
      </View>

      {/* Formulário */}
      {showForm && (
        <View style={styles.formCard}>
          <Text style={styles.formTitle}>Nova refeição</Text>

          <Text style={styles.label}>Nome da refeição</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: Café da manhã, Almoço..."
            placeholderTextColor="#475569"
            value={nome}
            onChangeText={setNome}
          />

          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>Calorias</Text>
              <TextInput
                style={styles.input}
                placeholder="kcal"
                placeholderTextColor="#475569"
                value={calorias}
                onChangeText={setCalorias}
                keyboardType="number-pad"
              />
            </View>
            <View style={{ width: 8 }} />
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>Horário</Text>
              <TextInput
                style={styles.input}
                placeholder="Ex: 08:00"
                placeholderTextColor="#475569"
                value={horario}
                onChangeText={setHorario}
              />
            </View>
          </View>

          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>Proteína (g)</Text>
              <TextInput
                style={styles.input}
                placeholder="g"
                placeholderTextColor="#475569"
                value={proteina}
                onChangeText={setProteina}
                keyboardType="number-pad"
              />
            </View>
            <View style={{ width: 8 }} />
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>Carboidrato (g)</Text>
              <TextInput
                style={styles.input}
                placeholder="g"
                placeholderTextColor="#475569"
                value={carbo}
                onChangeText={setCarbo}
                keyboardType="number-pad"
              />
            </View>
            <View style={{ width: 8 }} />
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>Gordura (g)</Text>
              <TextInput
                style={styles.input}
                placeholder="g"
                placeholderTextColor="#475569"
                value={gordura}
                onChangeText={setGordura}
                keyboardType="number-pad"
              />
            </View>
          </View>

          <TouchableOpacity
            style={[styles.button, saving && styles.buttonDisabled]}
            onPress={addRefeicao}
            disabled={saving}
          >
            {saving ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Adicionar refeição</Text>
            )}
          </TouchableOpacity>
        </View>
      )}

      {/* Lista de refeições */}
      <Text style={styles.sectionTitle}>
        Refeições de hoje {refeicoes.length > 0 ? `(${refeicoes.length})` : ''}
      </Text>

      {refeicoes.length === 0 && (
        <View style={styles.emptyBox}>
          <Text style={styles.emptyText}>Nenhuma refeição registrada hoje</Text>
          <Text style={styles.emptySubtext}>Toque em "+ Adicionar" para começar!</Text>
        </View>
      )}

      {refeicoes.map((r) => (
        <View key={r.id} style={styles.refeicaoCard}>
          <View style={styles.refeicaoHeader}>
            <View>
              <Text style={styles.refeicaoNome}>{r.nome}</Text>
              {r.horario ? (
                <Text style={styles.refeicaoHorario}>🕐 {r.horario}</Text>
              ) : null}
            </View>
            <View style={styles.refeicaoRight}>
              <Text style={styles.refeicaoCal}>{r.calorias} kcal</Text>
              <TouchableOpacity onPress={() => deleteRefeicao(r.id)}>
                <Text style={styles.deleteBtn}>✕</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.refeicaoMacros}>
            <Text style={styles.macroChip}>🥩 {r.proteina}g</Text>
            <Text style={styles.macroChip}>🍚 {r.carbo}g</Text>
            <Text style={styles.macroChip}>🥑 {r.gordura}g</Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  content: { padding: 24, paddingTop: 60, paddingBottom: 40 },
  loadingContainer: { flex: 1, backgroundColor: '#0f172a', alignItems: 'center', justifyContent: 'center' },
  backBtn: { marginBottom: 24 },
  backText: { color: '#22c55e', fontSize: 16 },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: { fontSize: 28, fontWeight: 'bold', color: '#f1f5f9' },
  subtitle: { fontSize: 14, color: '#94a3b8', marginTop: 2 },
  addBtn: {
    backgroundColor: '#22c55e',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 13 },
  resumoCard: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  resumoHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  resumoLabel: { fontSize: 14, color: '#94a3b8' },
  resumoMeta: { fontSize: 13, color: '#475569' },
  resumoValor: { marginBottom: 12 },
  resumoNum: { fontSize: 36, fontWeight: 'bold', color: '#f1f5f9' },
  resumoUnidade: { fontSize: 16, color: '#94a3b8' },
  barBg: { height: 8, backgroundColor: '#334155', borderRadius: 4, overflow: 'hidden', marginBottom: 8 },
  barFill: { height: 8, borderRadius: 4 },
  restante: { fontSize: 13, color: '#94a3b8' },
  macrosRow: { flexDirection: 'row', gap: 10, marginBottom: 24 },
  macroBox: {
    flex: 1,
    backgroundColor: '#1e293b',
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
    alignItems: 'center',
  },
  macroValor: { fontSize: 20, fontWeight: 'bold' },
  macroLabel: { fontSize: 11, color: '#94a3b8', marginTop: 2 },
  formCard: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#334155',
  },
  formTitle: { fontSize: 16, fontWeight: 'bold', color: '#f1f5f9', marginBottom: 4 },
  label: { fontSize: 13, color: '#94a3b8', marginBottom: 6, marginTop: 12 },
  input: {
    backgroundColor: '#0f172a',
    borderRadius: 10,
    padding: 12,
    fontSize: 15,
    color: '#f1f5f9',
    borderWidth: 1,
    borderColor: '#334155',
  },
  row: { flexDirection: 'row' },
  button: {
    backgroundColor: '#22c55e',
    borderRadius: 10,
    padding: 14,
    alignItems: 'center',
    marginTop: 16,
  },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#f1f5f9', marginBottom: 12 },
  emptyBox: { alignItems: 'center', padding: 32 },
  emptyText: { fontSize: 15, color: '#475569', marginBottom: 4 },
  emptySubtext: { fontSize: 13, color: '#334155' },
  refeicaoCard: {
    backgroundColor: '#1e293b',
    borderRadius: 14,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#334155',
  },
  refeicaoHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  refeicaoNome: { fontSize: 15, fontWeight: 'bold', color: '#f1f5f9' },
  refeicaoHorario: { fontSize: 12, color: '#64748b', marginTop: 2 },
  refeicaoRight: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  refeicaoCal: { fontSize: 15, fontWeight: 'bold', color: '#22c55e' },
  deleteBtn: { color: '#475569', fontSize: 16 },
  refeicaoMacros: { flexDirection: 'row', gap: 8 },
  macroChip: { fontSize: 12, color: '#94a3b8', backgroundColor: '#0f172a', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
});