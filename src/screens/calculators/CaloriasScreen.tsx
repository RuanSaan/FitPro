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

export default function CaloriasScreen({ onBack }: Props) {
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [activity, setActivity] = useState('1.55');
  const [goal, setGoal] = useState('maintain');
  const [result, setResult] = useState<any>(null);

  function calculate() {
    const w = parseFloat(weight.replace(',', '.'));
    const h = parseFloat(height.replace(',', '.'));
    const a = parseFloat(age);

    if (!w || !h || !a) return;

    let bmr = 0;
    if (gender === 'male') {
      bmr = 88.36 + 13.4 * w + 4.8 * h - 5.7 * a;
    } else {
      bmr = 447.6 + 9.2 * w + 3.1 * h - 4.3 * a;
    }

    const tdee = bmr * parseFloat(activity);

    let targetCalories = tdee;
    let goalLabel = '';
    let goalColor = '';

    if (goal === 'lose') {
      targetCalories = tdee - 500;
      goalLabel = 'Perda de peso';
      goalColor = '#ef4444';
    } else if (goal === 'gain') {
      targetCalories = tdee + 300;
      goalLabel = 'Ganho de massa';
      goalColor = '#22c55e';
    } else {
      goalLabel = 'Manter peso';
      goalColor = '#3b82f6';
    }

    const protein = w * 2;
    const fat = (targetCalories * 0.25) / 9;
    const carbs = (targetCalories - protein * 4 - fat * 9) / 4;

    setResult({
      bmr: Math.round(bmr),
      tdee: Math.round(tdee),
      target: Math.round(targetCalories),
      goalLabel,
      goalColor,
      protein: Math.round(protein),
      fat: Math.round(fat),
      carbs: Math.round(carbs),
    });
  }

  const activityOptions = [
    { label: 'Sedentário', value: '1.2' },
    { label: 'Levemente ativo', value: '1.375' },
    { label: 'Moderadamente ativo', value: '1.55' },
    { label: 'Muito ativo', value: '1.725' },
    { label: 'Extremamente ativo', value: '1.9' },
  ];

  const goalOptions = [
    { label: '🔻 Perder peso', value: 'lose' },
    { label: '⚖️ Manter peso', value: 'maintain' },
    { label: '💪 Ganhar massa', value: 'gain' },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <TouchableOpacity onPress={onBack} style={styles.backBtn}>
        <Text style={styles.backText}>← Voltar</Text>
      </TouchableOpacity>

      <Text style={styles.title}>🔥 Calculadora de Calorias</Text>
      <Text style={styles.subtitle}>Descubra seu gasto calórico diário</Text>

      {/* Gênero */}
      <Text style={styles.label}>Gênero</Text>
      <View style={styles.toggleRow}>
        <TouchableOpacity
          style={[styles.toggleBtn, gender === 'male' && styles.toggleActive]}
          onPress={() => setGender('male')}
        >
          <Text style={[styles.toggleText, gender === 'male' && styles.toggleTextActive]}>
            👨 Masculino
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toggleBtn, gender === 'female' && styles.toggleActive]}
          onPress={() => setGender('female')}
        >
          <Text style={[styles.toggleText, gender === 'female' && styles.toggleTextActive]}>
            👩 Feminino
          </Text>
        </TouchableOpacity>
      </View>

      {/* Dados */}
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

      <Text style={styles.label}>Idade</Text>
      <TextInput
        style={styles.input}
        placeholder="Ex: 25"
        placeholderTextColor="#475569"
        value={age}
        onChangeText={setAge}
        keyboardType="number-pad"
      />

      {/* Nível de atividade */}
      <Text style={styles.label}>Nível de atividade</Text>
      {activityOptions.map((opt) => (
        <TouchableOpacity
          key={opt.value}
          style={[styles.optionBtn, activity === opt.value && styles.optionActive]}
          onPress={() => setActivity(opt.value)}
        >
          <Text style={[styles.optionText, activity === opt.value && styles.optionTextActive]}>
            {opt.label}
          </Text>
        </TouchableOpacity>
      ))}

      {/* Objetivo */}
      <Text style={styles.label}>Objetivo</Text>
      <View style={styles.toggleRow}>
        {goalOptions.map((opt) => (
          <TouchableOpacity
            key={opt.value}
            style={[styles.goalBtn, goal === opt.value && styles.toggleActive]}
            onPress={() => setGoal(opt.value)}
          >
            <Text style={[styles.toggleText, goal === opt.value && styles.toggleTextActive]}>
              {opt.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.button} onPress={calculate}>
        <Text style={styles.buttonText}>Calcular</Text>
      </TouchableOpacity>

      {result && (
        <View style={styles.resultCard}>
          <Text style={styles.resultTitle}>Seus resultados</Text>

          <View style={styles.mainResult}>
            <Text style={styles.mainLabel}>Meta diária</Text>
            <Text style={[styles.mainValue, { color: result.goalColor }]}>
              {result.target} kcal
            </Text>
            <Text style={[styles.goalLabel, { color: result.goalColor }]}>
              {result.goalLabel}
            </Text>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{result.bmr}</Text>
              <Text style={styles.statLabel}>BMR{'\n'}(metabolismo basal)</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{result.tdee}</Text>
              <Text style={styles.statLabel}>TDEE{'\n'}(gasto total)</Text>
            </View>
          </View>

          <Text style={styles.macroTitle}>Macronutrientes sugeridos</Text>
          <View style={styles.macroRow}>
            <View style={[styles.macroBox, { borderColor: '#ef4444' }]}>
              <Text style={[styles.macroValue, { color: '#ef4444' }]}>{result.protein}g</Text>
              <Text style={styles.macroLabel}>Proteína</Text>
            </View>
            <View style={[styles.macroBox, { borderColor: '#f59e0b' }]}>
              <Text style={[styles.macroValue, { color: '#f59e0b' }]}>{result.carbs}g</Text>
              <Text style={styles.macroLabel}>Carboidrato</Text>
            </View>
            <View style={[styles.macroBox, { borderColor: '#3b82f6' }]}>
              <Text style={[styles.macroValue, { color: '#3b82f6' }]}>{result.fat}g</Text>
              <Text style={styles.macroLabel}>Gordura</Text>
            </View>
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
  subtitle: { fontSize: 14, color: '#94a3b8', marginBottom: 24 },
  label: { fontSize: 14, color: '#94a3b8', marginBottom: 8, marginTop: 16 },
  input: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: '#f1f5f9',
    borderWidth: 1,
    borderColor: '#334155',
  },
  toggleRow: { flexDirection: 'row', gap: 10 },
  toggleBtn: {
    flex: 1,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#334155',
    alignItems: 'center',
    backgroundColor: '#1e293b',
  },
  toggleActive: { borderColor: '#22c55e', backgroundColor: '#14532d' },
  toggleText: { color: '#94a3b8', fontSize: 14 },
  toggleTextActive: { color: '#22c55e', fontWeight: 'bold' },
  optionBtn: {
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#334155',
    backgroundColor: '#1e293b',
    marginBottom: 8,
  },
  optionActive: { borderColor: '#22c55e', backgroundColor: '#14532d' },
  optionText: { color: '#94a3b8', fontSize: 14 },
  optionTextActive: { color: '#22c55e', fontWeight: 'bold' },
  goalBtn: {
    flex: 1,
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#334155',
    alignItems: 'center',
    backgroundColor: '#1e293b',
  },
  button: {
    backgroundColor: '#22c55e',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 24,
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  resultCard: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: '#334155',
    marginBottom: 40,
  },
  resultTitle: { fontSize: 18, fontWeight: 'bold', color: '#f1f5f9', marginBottom: 16 },
  mainResult: { alignItems: 'center', marginBottom: 24 },
  mainLabel: { fontSize: 14, color: '#94a3b8' },
  mainValue: { fontSize: 48, fontWeight: 'bold' },
  goalLabel: { fontSize: 16, fontWeight: 'bold' },
  statsRow: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  statBox: {
    flex: 1,
    backgroundColor: '#0f172a',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  statValue: { fontSize: 22, fontWeight: 'bold', color: '#f1f5f9' },
  statLabel: { fontSize: 11, color: '#94a3b8', textAlign: 'center', marginTop: 4 },
  macroTitle: { fontSize: 14, color: '#94a3b8', marginBottom: 12 },
  macroRow: { flexDirection: 'row', gap: 10 },
  macroBox: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
    alignItems: 'center',
    backgroundColor: '#0f172a',
  },
  macroValue: { fontSize: 20, fontWeight: 'bold' },
  macroLabel: { fontSize: 11, color: '#94a3b8', marginTop: 4 },
});