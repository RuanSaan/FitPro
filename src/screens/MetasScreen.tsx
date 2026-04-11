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

type Meta = {
  id: string;
  titulo: string;
  atual: number;
  objetivo: number;
  unidade: string;
  cor: string;
};

export default function MetasScreen({ onBack, session }: Props) {
  const [metas, setMetas] = useState<Meta[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [titulo, setTitulo] = useState('');
  const [atual, setAtual] = useState('');
  const [objetivo, setObjetivo] = useState('');
  const [unidade, setUnidade] = useState('');
  const [showForm, setShowForm] = useState(false);

  const cores = ['#22c55e', '#3b82f6', '#a855f7', '#f59e0b', '#ef4444', '#06b6d4'];
  const [corSelecionada, setCorSelecionada] = useState('#a855f7');

  useEffect(() => {
    loadMetas();
  }, []);

  async function loadMetas() {
    setLoading(true);
    const { data } = await supabase
      .from('goals')
      .select('*')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: true });

    if (data) setMetas(data);
    setLoading(false);
  }

  async function addMeta() {
    if (!titulo || !atual || !objetivo) return;
    setSaving(true);

    const { data } = await supabase.from('goals').insert({
      user_id: session.user.id,
      titulo,
      atual: parseFloat(atual),
      objetivo: parseFloat(objetivo),
      unidade,
      cor: corSelecionada,
    }).select().single();

    setSaving(false);
    if (data) {
      setMetas([...metas, data]);
      setTitulo('');
      setAtual('');
      setObjetivo('');
      setUnidade('');
      setShowForm(false);
    }
  }

  async function deleteMeta(id: string) {
    await supabase.from('goals').delete().eq('id', id);
    setMetas(metas.filter((m) => m.id !== id));
  }

  function getProgress(meta: Meta) {
    return Math.min((meta.atual / meta.objetivo) * 100, 100);
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
          <Text style={styles.title}>🎯 Minhas Metas</Text>
          <Text style={styles.subtitle}>Acompanhe seu progresso</Text>
        </View>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => setShowForm(!showForm)}
        >
          <Text style={styles.addBtnText}>{showForm ? '✕' : '+ Nova'}</Text>
        </TouchableOpacity>
      </View>

      {showForm && (
        <View style={styles.formCard}>
          <Text style={styles.formTitle}>Nova meta</Text>

          <Text style={styles.label}>Nome da meta</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: Peso, Treinos por semana..."
            placeholderTextColor="#475569"
            value={titulo}
            onChangeText={setTitulo}
          />

          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>Valor atual</Text>
              <TextInput
                style={styles.input}
                placeholder="Ex: 80"
                placeholderTextColor="#475569"
                value={atual}
                onChangeText={setAtual}
                keyboardType="decimal-pad"
              />
            </View>
            <View style={{ width: 12 }} />
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>Objetivo</Text>
              <TextInput
                style={styles.input}
                placeholder="Ex: 70"
                placeholderTextColor="#475569"
                value={objetivo}
                onChangeText={setObjetivo}
                keyboardType="decimal-pad"
              />
            </View>
          </View>

          <Text style={styles.label}>Unidade</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: kg, x, ml, min..."
            placeholderTextColor="#475569"
            value={unidade}
            onChangeText={setUnidade}
          />

          <Text style={styles.label}>Cor</Text>
          <View style={styles.coresRow}>
            {cores.map((cor) => (
              <TouchableOpacity
                key={cor}
                style={[
                  styles.corBtn,
                  { backgroundColor: cor },
                  corSelecionada === cor && styles.corBtnSelected,
                ]}
                onPress={() => setCorSelecionada(cor)}
              />
            ))}
          </View>

          <TouchableOpacity
            style={[styles.button, saving && styles.buttonDisabled]}
            onPress={addMeta}
            disabled={saving}
          >
            {saving ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Adicionar meta</Text>
            )}
          </TouchableOpacity>
        </View>
      )}

      {metas.length === 0 && !showForm && (
        <View style={styles.emptyBox}>
          <Text style={styles.emptyText}>Nenhuma meta cadastrada</Text>
          <Text style={styles.emptySubtext}>Toque em "+ Nova" para começar!</Text>
        </View>
      )}

      {metas.map((meta) => {
        const progress = getProgress(meta);
        return (
          <View key={meta.id} style={styles.metaCard}>
            <View style={styles.metaHeader}>
              <Text style={styles.metaTitulo}>{meta.titulo}</Text>
              <TouchableOpacity onPress={() => deleteMeta(meta.id)}>
                <Text style={styles.deleteBtn}>✕</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.metaValues}>
              <View style={styles.metaValueBox}>
                <Text style={styles.metaValueLabel}>Atual</Text>
                <Text style={[styles.metaValue, { color: meta.cor }]}>
                  {meta.atual}{meta.unidade}
                </Text>
              </View>
              <View style={styles.metaArrow}>
                <Text style={styles.arrowText}>→</Text>
              </View>
              <View style={styles.metaValueBox}>
                <Text style={styles.metaValueLabel}>Objetivo</Text>
                <Text style={styles.metaValue}>
                  {meta.objetivo}{meta.unidade}
                </Text>
              </View>
              <View style={styles.metaProgressBox}>
                <Text style={[styles.metaPercent, { color: meta.cor }]}>
                  {Math.round(progress)}%
                </Text>
                <Text style={styles.metaValueLabel}>Concluído</Text>
              </View>
            </View>

            <View style={styles.barBg}>
              <View
                style={[
                  styles.barFill,
                  {
                    width: `${progress}%` as any,
                    backgroundColor: meta.cor,
                  },
                ]}
              />
            </View>
          </View>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  content: { padding: 24, paddingTop: 60 },
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
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addBtnText: { color: '#fff', fontWeight: 'bold' },
  formCard: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#334155',
  },
  formTitle: { fontSize: 16, fontWeight: 'bold', color: '#f1f5f9', marginBottom: 8 },
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
  coresRow: { flexDirection: 'row', gap: 10, marginTop: 4 },
  corBtn: { width: 32, height: 32, borderRadius: 16 },
  corBtnSelected: { borderWidth: 3, borderColor: '#fff' },
  button: {
    backgroundColor: '#22c55e',
    borderRadius: 10,
    padding: 14,
    alignItems: 'center',
    marginTop: 16,
  },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
  emptyBox: { alignItems: 'center', padding: 40 },
  emptyText: { fontSize: 15, color: '#475569', marginBottom: 4 },
  emptySubtext: { fontSize: 13, color: '#334155' },
  metaCard: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  metaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  metaTitulo: { fontSize: 16, fontWeight: 'bold', color: '#f1f5f9' },
  deleteBtn: { color: '#475569', fontSize: 16 },
  metaValues: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  metaValueBox: { flex: 1, alignItems: 'center' },
  metaArrow: { paddingHorizontal: 8 },
  arrowText: { color: '#475569', fontSize: 18 },
  metaValueLabel: { fontSize: 11, color: '#94a3b8', marginBottom: 2 },
  metaValue: { fontSize: 20, fontWeight: 'bold', color: '#f1f5f9' },
  metaProgressBox: { flex: 1, alignItems: 'center' },
  metaPercent: { fontSize: 20, fontWeight: 'bold' },
  barBg: {
    height: 6,
    backgroundColor: '#334155',
    borderRadius: 3,
    overflow: 'hidden',
  },
  barFill: { height: 6, borderRadius: 3 },
});