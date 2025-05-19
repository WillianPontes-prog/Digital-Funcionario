import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function LoginScreen({ navigation }) {
  const [loginUser, setLoginUser] = useState('');
  const [passwordUser, setPasswordUser] = useState('');

  return (
    <LinearGradient
      colors={['#3b82f6', '#60a5fa', '#93c5fd']}
      style={styles.container}
    >
      <View style={styles.box}>
        <Text style={styles.title}>Bem-vindo!</Text>
        <Text style={styles.subtitle}>Faça login para continuar</Text>

        <TextInput
          style={[styles.input, { marginTop: 40 }]}
          onChangeText={setLoginUser}
          value={loginUser}
          placeholder="Login"
          placeholderTextColor="#fff"
          keyboardType="email-address"
        />

        <TextInput
          style={styles.input}
          onChangeText={setPasswordUser}
          value={passwordUser}
          placeholder="Senha"
          placeholderTextColor="#fff"
          secureTextEntry
        />

        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Chat')}>
          <Text style={styles.buttonText}>Entrar</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, styles.buttonSecondary]} onPress={() => navigation.navigate('Register')}>
          <Text style={styles.buttonText}>Registrar</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  box: {
    width: 320,
    padding: 24,
    backgroundColor: 'rgba(81, 61, 150, 0.1)',
    borderRadius: 20,
    backdropFilter: 'blur(10px)',
    alignItems: 'center',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#f0f0f0',
    marginBottom: 16,
  },
  input: {
    width: '100%',
    height: 45,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginVertical: 10,
    backgroundColor: 'rgba(178, 173, 252, 0.25)',
    color: '#f8f8f8',
  },
  button: {
    backgroundColor: 'rgba(17, 0, 255, 0.79)',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 20,
    width: '100%',
    alignItems: 'center',
  },
  buttonSecondary: {
    backgroundColor: 'rgba(17, 0, 255, 0.79)',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
