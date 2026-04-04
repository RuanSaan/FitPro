import React, { useState, useEffect } from 'react';
import { supabase } from './src/lib/supabase';
import LoginScreen from './src/screens/auth/LoginScreen';
import RegisterScreen from './src/screens/auth/RegisterScreen';
import { View, Text, StyleSheet } from 'react-native';

export default function App() {
  const [screen, setScreen] = useState('login');
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });
    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  if (session) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>✅ Logado como:</Text>
        <Text style={styles.email}>{session.user.email}</Text>
      </View>
    );
  }

  if (screen === 'register') {
    return <RegisterScreen onNavigate={setScreen} />;
  }

  return <LoginScreen onNavigate={setScreen} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 18,
    color: '#94a3b8',
    marginBottom: 8,
  },
  email: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#22c55e',
  },
});