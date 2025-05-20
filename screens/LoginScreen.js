import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from './colors';

export default function LoginScreen({ navigation }) {
  const [loginUser, setLoginUser] = useState('');
  const [passwordUser, setPasswordUser] = useState('');

  return (
    <LinearGradient
      colors={COLORS.gradient}
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
          placeholderTextColor={COLORS.white}
          keyboardType="email-address"
        />

        <TextInput
          style={styles.input}
          onChangeText={setPasswordUser}
          value={passwordUser}
          placeholder="Senha"
          placeholderTextColor={COLORS.white}
          secureTextEntry
        />

        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Main')}>
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
    backgroundColor: COLORS.boxBg,
    borderRadius: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.subtitle,
    marginBottom: 16,
  },
  input: {
    width: '100%',
    height: 45,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginVertical: 10,
    backgroundColor: COLORS.inputBg,
    color: COLORS.whiteSoft,
  },
  button: {
    backgroundColor: COLORS.buttonBg,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 20,
    width: '100%',
    alignItems: 'center',
  },
  buttonSecondary: {
    backgroundColor: COLORS.buttonBg,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
