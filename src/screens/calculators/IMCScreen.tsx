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

type IMCResult = {
  value: number;
  category: string;
  color: string;
  tip: string;
};

export default function IMCScreen({ onBack }: Props) {
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [result, setResult] = useState<IMCResult | null>(null);

  function calculateIMC() {
    const w = parseFloat(weight.replace(',', '.'));
    const h = parseFloat(height.replace(',', '.')) / 100;

    if (!w || !h || h <= 0) return;

    const imc = w / (h * h);

    let category = '';
    let color = '';
    let tip = '';

    if (imc < 18.5) {
      category = 'Abaixo do peso';
      color = '#3b82f6';
      tip = 'Considere aumentar a ingestão calórica com alimentos nutritivos.';
    } else if (imc < 25) {
      category = 'Peso normal';
      color = '#22c55e';
      tip = 'Parabéns! Mantenha seus hábitos saudáveis.';
    } else if (imc < 30) {
      category = 'Sobrepeso';
      color = '#f59e0b';
      tip = 'Considere ajustar a dieta e aumentar a atividade física.';
    } else if (imc < 35) {
      category = 'Obesidade grau I';
      color = '#f97316';
      tip = 'Procure orientação médica e nutricional.';
    } else if (imc < 40) {
      category = 'Obesidade grau II';
      color = '#ef4444';
      tip = 'É importante buscar acompanhamento médico.';
    } else {
      category = 'Obesidade grau III';
      color = '#dc2626';
      tip = 'Procure acompanhamento médico urgente.';
    }

    setResult({ value: imc, category, color, tip });
  }

  function getBarWidth(imc: number) {
    const max = 45;
    return Math.min((imc / max) * 100, 100);
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <TouchableOpacity onPress={onBack} style={styles.backBtn}>
        <Text style={styles.backText}>← Voltar</Text>
      </TouchableOpacity>

      <Text style={styles.title}>⚖️ Calculadora de IMC</Text>
      <Text style={styles.subtitle}>Índice de Massa Corporal</Text>

      <View style={styles.form}>
        <Text style={styles.label}>Peso (kg)</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: 70"
          placeholderTextColor="#475569"
          value={weight}
          onChangeText={setWeight}
          keyboardType="decimal-pad"
        />

        <Text style={styles.label}>Altura (cm)</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: 175"
          placeholderTextColor="#475569"
          value={height}
          onChangeText={setHeight}
          keyboardType="decimal-pad"
        />

        <TouchableOpacity style={styles.button} onPress={calculateIMC}>
          <Text style={styles.buttonText}>Calcular IMC</Text>
        </TouchableOpacity>
      </View>

      {result && (
        <View style={styles.resultCard}>
          <Text style={styles.resultLabel}>Seu IMC</Text>
          <Text style={[styles.resultValue, { color: result.color }]}>
            {result.value.toFixed(1)}
          </Text>
          <Text style={[styles.resultCategory, { color: result.color }]}>
            {result.category}
          </Text>

          <View style={styles.barContainer}>
            <View style={styles.barBg}>
              <View
                style={[
                  styles.barFill,
                  {
                    width: `${getBarWidth(result.value)}%` as any,
                    backgroundColor: result.color,
                  },
                ]}
              />
            </View>
          </View>

          <Text style={styles.tip}>💡 {result.tip}</Text>

          <View style={styles.table}>
            {[
              { range: '< 18.5', label: 'Abaixo do peso', color: '#3b82f6' },
              { range: '18.5 – 24.9', label: 'Peso normal', color: '#22c55e' },
              { range: '25 – 29.9', label: 'Sobrepeso', color: '#f59e0b' },
              { range: '30 – 34.9', label: 'Obesidade I', color: '#f97316' },
              { range: '35 – 39.9', label: 'Obesidade II', color: '#ef4444' },
              { range: '≥ 40', label: 'Obesidade III', color: '#dc2626' },
            ].map((item) => (
              <View key={item.range} style={styles.tableRow}>
                <View style={[styles.dot, { backgroundColor: item.color }]} />
                <Text style={styles.tableRange}>{item.range}</Text>
                <Text style={styles.tableLabel}>{item.label}</Text>
              </View>
            ))}
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  content: { padding: 24, paddingTop: 60 },
  backBtn: { marginBottom: 24 },
  backText: { color: '#22c55e', fontSize: 16 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#f1f5f9', marginBottom: 4 },
  subtitle: { fontSize: 14, color: '#94a3b8', marginBottom: 32 },
  form: { marginBottom: 24 },
  label: { fontSize: 14, color: '#94a3b8', marginBottom: 6, marginTop: 16 },
  input: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: '#f1f5f9',
    borderWidth: 1,
    borderColor: '#334155',
  },
  button: {
    backgroundColor: '#22c55e',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 24,
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  resultCard: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  resultLabel: { fontSize: 14, color: '#94a3b8', marginBottom: 4 },
  resultValue: { fontSize: 56, fontWeight: 'bold' },
  resultCategory: { fontSize: 20, fontWeight: 'bold', marginBottom: 16 },
  barContainer: { width: '100%', marginBottom: 16 },
  barBg: {
    height: 8,
    backgroundColor: '#334155',
    borderRadius: 4,
    overflow: 'hidden',
  },
  barFill: { height: 8, borderRadius: 4 },
  tip: {
    fontSize: 14,
    color: '#94a3b8',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  table: { width: '100%' },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  dot: { width: 10, height: 10, borderRadius: 5, marginRight: 12 },
  tableRange: { fontSize: 13, color: '#94a3b8', width: 90 },
  tableLabel: { fontSize: 13, color: '#f1f5f9' },
});