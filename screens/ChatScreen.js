import React, { useState } from 'react';
import { View, TextInput, Image, StyleSheet } from 'react-native';

export default function ChatScreen() {
  const [message, setMessage] = useState('');

  return (
    <View style={styles.container}>
      {/* Avatar centralizado */}
      <View style={styles.avatarContainer}>
        <Image
          source={require('../assets/avatar.png')}
          style={styles.avatar}
        />
      </View>

      {/* Input fixo na parte de baixo */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Digite sua mensagem..."
          placeholderTextColor="#888"
          value={message}
          onChangeText={setMessage}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  avatarContainer: {
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 20,
  },
  avatar: {
    width: 140,
    height: 140,
    borderRadius: 70,
  },
  inputContainer: {
    justifyContent: 'flex-end',
    position: 'absolute',
    bottom: 40, // <-- aumente este valor para subir o input
    width: '100%',
    alignItems: 'center',
    paddingBottom: 20,
    backgroundColor: 'transparent',
  },
  input: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingVertical: 12,
    fontSize: 16,
    borderColor: '#ccc',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
});

