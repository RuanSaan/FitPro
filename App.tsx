import React, { useState, useEffect } from 'react';
import { supabase } from './src/lib/supabase';
import LoginScreen from './src/screens/auth/LoginScreen';
import RegisterScreen from './src/screens/auth/RegisterScreen';
import DashboardScreen from './src/screens/dashboard/DashboardScreen';

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
    return <DashboardScreen session={session} />;
  }

  if (screen === 'register') {
    return <RegisterScreen onNavigate={setScreen} />;
  }

  return <LoginScreen onNavigate={setScreen} />;
}