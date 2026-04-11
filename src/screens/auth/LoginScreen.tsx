import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { supabase } from '../../lib/supabase';

export default function LoginScreen({ onNavigate }: { onNavigate: (screen: string) => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    if (!email || !password) {
      Alert.alert('Erro', 'Preencha todos os campos!');
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) Alert.alert('Erro', error.message);
  }

  return (
    <View style={styles.container}>
      <View style={styles.topAccent} />

      <View style={styles.logoArea}>
        <View style={styles.logoCircle}>
          <Text style={styles.logoEmoji}>💪</Text>
        </View>
        <Text style={styles.appName}>FIT<Text style={styles.appNameAccent}>PRO</Text></Text>
        <Text style={styles.tagline}>TREINE. EVOLUA. SUPERE.</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Bem-vindo de volta!</Text>

        <View style={styles.inputWrapper}>
          <Text style={styles.inputIcon}>✉️</Text>
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#6b7280"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputWrapper}>
          <Text style={styles.inputIcon}>🔒</Text>
          <TextInput
            style={styles.input}
            placeholder="Senha"
            placeholderTextColor="#6b7280"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>ENTRAR →</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => onNavigate('register')} style={styles.linkBtn}>
          <Text style={styles.linkText}>Não tem conta? <Text style={styles.linkBold}>Cadastre-se</Text></Text>
        </TouchableOpacity>
      </View>

      <View style={styles.bottomAccent} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
    justifyContent: 'center',
    padding: 24,
  },
  topAccent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: '#f97316',
  },
  bottomAccent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: '#f97316',
  },
  logoArea: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#f97316',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    shadowColor: '#f97316',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  logoEmoji: { fontSize: 36 },
  appName: {
    fontSize: 36,
    fontWeight: '900',
    color: '#ffffff',
    letterSpacing: 4,
  },
  appNameAccent: { color: '#f97316' },
  tagline: {
    fontSize: 11,
    color: '#6b7280',
    letterSpacing: 3,
    marginTop: 4,
  },
  card: {
    backgroundColor: '#111111',
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: '#1f1f1f',
    maxWidth: 400,
    width: '100%',
    alignSelf: 'center',
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 24,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#2a2a2a',
    marginBottom: 12,
    paddingHorizontal: 14,
  },
  inputIcon: { fontSize: 16, marginRight: 10 },
  input: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 15,
    color: '#ffffff',
  },
  button: {
    backgroundColor: '#f97316',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#f97316',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  buttonDisabled: { opacity: 0.6 },
  buttonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 2,
  },
  linkBtn: { marginTop: 20, alignItems: 'center' },
  linkText: { color: '#6b7280', fontSize: 14 },
  linkBold: { color: '#f97316', fontWeight: 'bold' },
});