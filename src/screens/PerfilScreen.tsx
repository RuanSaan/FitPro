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

export default function PerfilScreen({ onBack, session }: Props) {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [nome, setNome] = useState('');
  const [peso, setPeso] = useState('');
  const [altura, setAltura] = useState('');
  const [idade, setIdade] = useState('');
  const [objetivo, setObjetivo] = useState('emagrecer');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    setLoading(true);
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single();

    if (data) {
      setNome(data.full_name || '');
      setPeso(data.weight?.toString() || '');
      setAltura(data.height?.toString() || '');
      setIdade(data.age?.toString() || '');
      setObjetivo(data.goal || 'emagrecer');
    }
    setLoading(false);
  }

  async function saveProfile() {
    setSaving(true);
    const { error } = await supabase.from('profiles').upsert({
      id: session.user.id,
      full_name: nome,
      weight: parseFloat(peso) || null,
      height: parseFloat(altura) || null,
      age: parseInt(idade) || null,
      goal: objetivo,
      updated_at: new Date().toISOString(),
    });

    setSaving(false);
    if (!error) {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
  }

  const objetivos = [
    { label: '🔻 Emagrecer', value: 'emagrecer' },
    { label: '⚖️ Manter peso', value: 'manter' },
    { label: '💪 Ganhar massa', value: 'massa' },
    { label: '🏃 Melhorar condicionamento', value: 'condicionamento' },
  ];

  const initials = nome
    ? nome.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()
    : '?';

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

      <Text style={styles.title}>👤 Meu Perfil</Text>
      <Text style={styles.subtitle}>Seus dados pessoais</Text>

      {/* Avatar */}
      <View style={styles.avatarContainer}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>
        <Text style={styles.avatarEmail}>{session.user.email}</Text>
      </View>

      {/* Formulário */}
      <View style={styles.form}>
        <Text style={styles.label}>Nome completo</Text>
        <TextInput
          style={styles.input}
          placeholder="Seu nome"
          placeholderTextColor="#475569"
          value={nome}
          onChangeText={setNome}
        />

        <View style={styles.row}>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>Peso (kg)</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: 70"
              placeholderTextColor="#475569"
              value={peso}
              onChangeText={setPeso}
              keyboardType="decimal-pad"
            />
          </View>
          <View style={{ width: 12 }} />
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>Altura (cm)</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: 175"
              placeholderTextColor="#475569"
              value={altura}
              onChangeText={setAltura}
              keyboardType="decimal-pad"
            />
          </View>
        </View>

        <Text style={styles.label}>Idade</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: 25"
          placeholderTextColor="#475569"
          value={idade}
          onChangeText={setIdade}
          keyboardType="number-pad"
        />

        <Text style={styles.label}>Objetivo</Text>
        {objetivos.map((obj) => (
          <TouchableOpacity
            key={obj.value}
            style={[styles.optionBtn, objetivo === obj.value && styles.optionActive]}
            onPress={() => setObjetivo(obj.value)}
          >
            <Text style={[styles.optionText, objetivo === obj.value && styles.optionTextActive]}>
              {obj.label}
            </Text>
          </TouchableOpacity>
        ))}

        <TouchableOpacity
          style={[styles.button, saving && styles.buttonDisabled]}
          onPress={saveProfile}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>
              {saved ? '✅ Salvo com sucesso!' : 'Salvar perfil'}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  content: { padding: 24, paddingTop: 60 },
  loadingContainer: { flex: 1, backgroundColor: '#0f172a', alignItems: 'center', justifyContent: 'center' },
  backBtn: { marginBottom: 24 },
  backText: { color: '#22c55e', fontSize: 16 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#f1f5f9', marginBottom: 4 },
  subtitle: { fontSize: 14, color: '#94a3b8', marginBottom: 24 },
  avatarContainer: { alignItems: 'center', marginBottom: 32 },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#22c55e',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  avatarText: { fontSize: 28, fontWeight: 'bold', color: '#fff' },
  avatarEmail: { fontSize: 14, color: '#94a3b8' },
  form: {},
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
  row: { flexDirection: 'row' },
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
  button: {
    backgroundColor: '#22c55e',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 40,
  },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});