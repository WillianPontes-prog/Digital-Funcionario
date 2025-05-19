import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Image, Dimensions } from 'react-native';

export default function ChatScreen({ navigation }) {
  const [message, setMessage] = useState('');

  return (
    <View style={styles.container}>
      {/* Abas estilo navegador */}
      <View style={styles.tabsWrapper}>
        <View style={styles.tabsContainer}>
          {/* Aba "Chat" */}
          <View style={[styles.tab, styles.inactiveTab]}>
            <Text style={styles.tabText}>Chat</Text>
          </View>

          {/* Aba "Recursos" */}
          <TouchableOpacity
            style={styles.tab}
            onPress={() => navigation.navigate('FunctionScreen')}
          >
            <Text style={styles.tabText}>Recursos</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Avatar centralizado */}
      <View style={styles.avatarContainer}>
        <Image
          source={require('../assets/avatar.png')} // Atualize para o caminho correto no seu projeto
          style={styles.avatar}
        />
      </View>

      {/* Input logo abaixo do avatar */}
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

const { width } = Dimensions.get('window');
const tabWidth = width * 0.4; // 40% da largura da tela para cada aba

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  tabsWrapper: {
    alignItems: 'center',
    paddingTop: 50,
  },
  tabsContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12,
    overflow: 'hidden',
  },
  tab: {
    width: tabWidth,
    backgroundColor: '#e0e7ff',
    paddingVertical: 12,
    alignItems: 'center',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  inactiveTab: {
    backgroundColor: '#c7d2fe',
  },
  tabText: {
    color: '#1e3a8a',
    fontWeight: 'bold',
    fontSize: 16,
  },
  avatarContainer: {
    alignItems: 'center',
    marginTop: 60,
  },
  avatar: {
    width: 140,
    height: 140,
    borderRadius: 70,
  },
  inputContainer: {
    alignItems: 'center',
    marginTop: 20,
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

