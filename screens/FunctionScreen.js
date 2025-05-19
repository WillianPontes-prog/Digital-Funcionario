import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function FunctionScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Recursos</Text>
        <Text style={styles.subtitle}>Aqui você pode acessar as funções do app.</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1e3a8a',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#374151',
    marginBottom: 30,
  },
});