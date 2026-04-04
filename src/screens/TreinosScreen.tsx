import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

type Props = {
  onBack: () => void;
};

type Exercicio = {
  nome: string;
  series: number;
  reps: string;
  carga: string;
};

type Treino = {
  id: number;
  nome: string;
  tipo: string;
  exercicios: Exercicio[];
  cor: string;
};

export default function TreinosScreen({ onBack }: Props) {
  const [treinos] = useState<Treino[]>([
    {
      id: 1,
      nome: 'Treino A — Peito e Tríceps',
      tipo: 'Hipertrofia',
      cor: '#3b82f6',
      exercicios: [
        { nome: 'Supino reto', series: 4, reps: '8-12', carga: '60kg' },
        { nome: 'Supino inclinado', series: 3, reps: '10-12', carga: '50kg' },
        { nome: 'Crossover', series: 3, reps: '12-15', carga: '15kg' },
        { nome: 'Tríceps pulley', series: 4, reps: '10-12', carga: '25kg' },
        { nome: 'Tríceps francês', series: 3, reps: '10-12', carga: '20kg' },
      ],
    },
    {
      id: 2,
      nome: 'Treino B — Costas e Bíceps',
      tipo: 'Hipertrofia',
      cor: '#22c55e',
      exercicios: [
        { nome: 'Puxada frontal', series: 4, reps: '8-12', carga: '55kg' },
        { nome: 'Remada curvada', series: 4, reps: '8-10', carga: '60kg' },
        { nome: 'Remada unilateral', series: 3, reps: '10-12', carga: '25kg' },
        { nome: 'Rosca direta', series: 4, reps: '10-12', carga: '30kg' },
        { nome: 'Rosca martelo', series: 3, reps: '10-12', carga: '14kg' },
      ],
    },
    {
      id: 3,
      nome: 'Treino C — Pernas',
      tipo: 'Hipertrofia',
      cor: '#a855f7',
      exercicios: [
        { nome: 'Agachamento livre', series: 4, reps: '8-10', carga: '80kg' },
        { nome: 'Leg press', series: 4, reps: '10-12', carga: '120kg' },
        { nome: 'Cadeira extensora', series: 3, reps: '12-15', carga: '40kg' },
        { nome: 'Mesa flexora', series: 3, reps: '12-15', carga: '35kg' },
        { nome: 'Panturrilha em pé', series: 4, reps: '15-20', carga: '60kg' },
      ],
    },
    {
      id: 4,
      nome: 'Treino D — Ombros e Abdômen',
      tipo: 'Hipertrofia',
      cor: '#f59e0b',
      exercicios: [
        { nome: 'Desenvolvimento militar', series: 4, reps: '8-12', carga: '40kg' },
        { nome: 'Elevação lateral', series: 4, reps: '12-15', carga: '10kg' },
        { nome: 'Elevação frontal', series: 3, reps: '12-15', carga: '8kg' },
        { nome: 'Encolhimento', series: 3, reps: '12-15', carga: '60kg' },
        { nome: 'Abdominal crunch', series: 4, reps: '20', carga: '—' },
      ],
    },
  ]);

  const [treinoAberto, setTreinoAberto] = useState<number | null>(null);
  const [treinoAtivo, setTreinoAtivo] = useState<Treino | null>(null);

  if (treinoAtivo) {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <TouchableOpacity onPress={() => setTreinoAtivo(null)} style={styles.backBtn}>
          <Text style={styles.backText}>← Voltar</Text>
        </TouchableOpacity>

        <Text style={styles.title}>🏋️ {treinoAtivo.nome}</Text>
        <View style={[styles.badge, { backgroundColor: treinoAtivo.cor + '33' }]}>
          <Text style={[styles.badgeText, { color: treinoAtivo.cor }]}>{treinoAtivo.tipo}</Text>
        </View>

        <View style={styles.tableHeader}>
          <Text style={[styles.tableCol, { flex: 2 }]}>Exercício</Text>
          <Text style={styles.tableCol}>Séries</Text>
          <Text style={styles.tableCol}>Reps</Text>
          <Text style={styles.tableCol}>Carga</Text>
        </View>

        {treinoAtivo.exercicios.map((ex, i) => (
          <View key={i} style={[styles.tableRow, i % 2 === 0 && styles.tableRowAlt]}>
            <Text style={[styles.tableCell, { flex: 2 }]}>{ex.nome}</Text>
            <Text style={styles.tableCell}>{ex.series}x</Text>
            <Text style={styles.tableCell}>{ex.reps}</Text>
            <Text style={[styles.tableCell, { color: treinoAtivo.cor }]}>{ex.carga}</Text>
          </View>
        ))}

        <TouchableOpacity style={[styles.startBtn, { backgroundColor: treinoAtivo.cor }]}>
          <Text style={styles.startBtnText}>▶ Iniciar treino</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <TouchableOpacity onPress={onBack} style={styles.backBtn}>
        <Text style={styles.backText}>← Voltar</Text>
      </TouchableOpacity>

      <Text style={styles.title}>🏋️ Treinos</Text>
      <Text style={styles.subtitle}>Escolha seu treino de hoje</Text>

      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>4</Text>
          <Text style={styles.statLabel}>Treinos</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>20</Text>
          <Text style={styles.statLabel}>Exercícios</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>0</Text>
          <Text style={styles.statLabel}>Concluídos</Text>
        </View>
      </View>

      {treinos.map((treino) => (
        <TouchableOpacity
          key={treino.id}
          style={styles.treinoCard}
          onPress={() => setTreinoAberto(treinoAberto === treino.id ? null : treino.id)}
        >
          <View style={styles.treinoHeader}>
            <View style={[styles.treinoDot, { backgroundColor: treino.cor }]} />
            <View style={{ flex: 1 }}>
              <Text style={styles.treinoNome}>{treino.nome}</Text>
              <Text style={styles.treinoInfo}>
                {treino.exercicios.length} exercícios · {treino.tipo}
              </Text>
            </View>
            <TouchableOpacity
              style={[styles.verBtn, { borderColor: treino.cor }]}
              onPress={() => setTreinoAtivo(treino)}
            >
              <Text style={[styles.verBtnText, { color: treino.cor }]}>Ver</Text>
            </TouchableOpacity>
          </View>

          {treinoAberto === treino.id && (
            <View style={styles.exerciciosList}>
              {treino.exercicios.map((ex, i) => (
                <View key={i} style={styles.exercicioRow}>
                  <Text style={styles.exercicioNum}>{i + 1}</Text>
                  <Text style={styles.exercicioNome}>{ex.nome}</Text>
                  <Text style={styles.exercicioDetalhe}>{ex.series}x{ex.reps}</Text>
                </View>
              ))}
            </View>
          )}
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  content: { padding: 24, paddingTop: 60 },
  backBtn: { marginBottom: 24 },
  backText: { color: '#22c55e', fontSize: 16 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#f1f5f9', marginBottom: 4 },
  subtitle: { fontSize: 14, color: '#94a3b8', marginBottom: 24 },
  statsRow: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  statBox: {
    flex: 1,
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  statValue: { fontSize: 24, fontWeight: 'bold', color: '#f1f5f9' },
  statLabel: { fontSize: 12, color: '#94a3b8', marginTop: 2 },
  treinoCard: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  treinoHeader: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  treinoDot: { width: 12, height: 12, borderRadius: 6 },
  treinoNome: { fontSize: 15, fontWeight: 'bold', color: '#f1f5f9' },
  treinoInfo: { fontSize: 12, color: '#94a3b8', marginTop: 2 },
  verBtn: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  verBtnText: { fontSize: 13, fontWeight: 'bold' },
  exerciciosList: { marginTop: 16, borderTopWidth: 1, borderTopColor: '#334155', paddingTop: 12 },
  exercicioRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 6 },
  exercicioNum: { width: 24, fontSize: 12, color: '#475569', fontWeight: 'bold' },
  exercicioNome: { flex: 1, fontSize: 14, color: '#cbd5e1' },
  exercicioDetalhe: { fontSize: 12, color: '#64748b' },
  badge: { alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20, marginBottom: 20 },
  badgeText: { fontSize: 13, fontWeight: 'bold' },
  tableHeader: {
    flexDirection: 'row',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
    marginBottom: 4,
  },
  tableCol: { flex: 1, fontSize: 12, color: '#64748b', fontWeight: 'bold' },
  tableRow: { flexDirection: 'row', paddingVertical: 10 },
  tableRowAlt: { backgroundColor: '#1e293b', borderRadius: 6 },
  tableCell: { flex: 1, fontSize: 13, color: '#cbd5e1' },
  startBtn: {
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 40,
  },
  startBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});