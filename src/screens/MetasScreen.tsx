import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

type Props = {
  onBack: () => void;
};

type Meta = {
  id: number;
  titulo: string;
  atual: number;
  objetivo: number;
  unidade: string;
  cor: string;
};

export default function MetasScreen({ onBack }: Props) {
  const [metas, setMetas] = useState<Meta[]>([
    { id: 1, titulo: 'Peso atual', atual: 80, objetivo: 70, unidade: 'kg', cor: '#22c55e' },
    { id: 2, titulo: 'Treinos por semana', atual: 2, objetivo: 5, unidade: 'x', cor: '#3b82f6' },
    { id: 3, titulo: 'Água diária', atual: 1500, objetivo: 2500, unidade: 'ml', cor: '#06b6d4' },
  ]);

  const [titulo, setTitulo] = useState('');
  const [atual, setAtual] = useState('');
  const [objetivo, setObjetivo] = useState('');
  const [unidade, setUnidade] = useState('');
  const [showForm, setShowForm] = useState(false);

  function addMeta() {
    if (!titulo || !atual || !objetivo) return;
    const nova: Meta = {
      id: Date.now(),
      titulo,
      atual: parseFloat(atual),
      objetivo: parseFloat(objetivo),
      unidade,
      cor: '#a855f7',
    };
    setMetas([...metas, nova]);
    setTitulo('');
    setAtual('');
    setObjetivo('');
    setUnidade('');
    setShowForm(false);
  }

  function deleteMeta(id: number) {
    setMetas(metas.filter((m) => m.id !== id));
  }

  function getProgress(meta: Meta) {
    if (meta.objetivo === 0) return 0;
    // Para peso: progresso inverso (quanto menos, melhor)
    if (meta.titulo.toLowerCase().includes('peso')) {
      const total = meta.atual - meta.objetivo;
      const progress = Math.max(0, 1 - total / (meta.atual - meta.objetivo + 1));
      return Math.min(progress * 100, 100);
    }
    return Math.min((meta.atual / meta.objetivo) * 100, 100);
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

          <TouchableOpacity style={styles.button} onPress={addMeta}>
            <Text style={styles.buttonText}>Adicionar meta</Text>
          </TouchableOpacity>
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
  button: {
    backgroundColor: '#22c55e',
    borderRadius: 10,
    padding: 14,
    alignItems: 'center',
    marginTop: 16,
  },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
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