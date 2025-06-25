import React, { useState, useRef, useEffect } from 'react';
import { View, TextInput, Image, StyleSheet, FlatList, Text, Keyboard, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from './colors';
import { URL_DEFINE } from './defines';


const BOT_RESPONSES = [
  "Pruuuu",
  "Grrrrk",
  "Prururururu",
  "Passa o PIX"
];

async function getFuncionario(message) {
                    try {
                      const response = await fetch(URL_DEFINE+'/mandarMensagem', {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                          message: message
                        }),
                      });
                      return response.json();
                    } catch (error) {
                      alert('Erro ao carregar funcionário');
                      console.error(error);
                    }
                  }

export default function ChatScreen() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const flatListRef = useRef(null);

  // UseEffect para scroll automático quando mensagens mudarem
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 150);
    }
  }, [messages]);

  const sendMessage = async () => {
    if (message.trim() !== '') {
      const userMessage = message.trim();
      const userMsg = { id: Date.now().toString(), text: userMessage, from: 'user' };
      
      // Adiciona mensagem do usuário
      setMessages(prev => [...prev, userMsg]);
      setMessage('');
      
      // Força scroll imediato para a mensagem do usuário
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);

      // Bot response
      try {
        const response = await getFuncionario(userMessage); 
        const botMsg = {
          id: (Date.now() + 1).toString(),
          text: response.name || "Desculpa, não consegui processar sua mensagem", 
          from: 'bot'
        };
        
        // Adiciona resposta do bot
        setMessages(prev => [...prev, botMsg]);
        
        // Força scroll para a resposta do bot
        setTimeout(() => {
          flatListRef.current?.scrollToEnd({ animated: true });
        }, 200);
        
      } catch (error) {
        console.error('Erro ao enviar mensagem:', error);
        const errorMsg = {
          id: (Date.now() + 2).toString(),
          text: "Ops! Ocorreu um erro. Tente novamente.", 
          from: 'bot'
        };
        setMessages(prev => [...prev, errorMsg]);
        
        setTimeout(() => {
          flatListRef.current?.scrollToEnd({ animated: true });
        }, 200);
      }
    }
  };

  return (
    <LinearGradient colors={COLORS.gradient} style={styles.background}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
        enabled={true}
      >
        <View style={styles.container}>
          <View style={styles.avatarContainer}>
            <Image
              source={require('../assets/avatar.png')}
              style={styles.avatar}
            />
          </View>
          
          <View style={styles.messagesContainer}>
            <FlatList
              ref={flatListRef}
              data={messages}
              keyExtractor={item => item.id}
              renderItem={({ item }) => (
                <View
                  style={[
                    styles.messageBubble,
                    item.from === 'user' ? styles.userBubble : styles.botBubble
                  ]}
                >
                  <Text style={styles.messageText}>{item.text}</Text>
                </View>
              )}
              contentContainerStyle={{ flexGrow: 1, ...styles.messagesContentContainer }}
              showsVerticalScrollIndicator={true}
              onContentSizeChange={() => {
                setTimeout(() => {
                  flatListRef.current?.scrollToEnd({ animated: true });
                }, 100);
              }}
              onLayout={() => {
                setTimeout(() => {
                  flatListRef.current?.scrollToEnd({ animated: true });
                }, 100);
              }}
              removeClippedSubviews={false}
            />
          </View>
          
          <View style={styles.inputContainer}>
            <View style={styles.inputRow}>
              <TextInput
                style={styles.input}
                placeholder="Digite sua mensagem..."
                placeholderTextColor={COLORS.whiteSoft}
                value={message}
                onChangeText={setMessage}
                onSubmitEditing={sendMessage}
                returnKeyType="send"
                multiline={false}
                blurOnSubmit={true}
              />
              <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
                <Ionicons name="send" size={24} color={COLORS.white} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  avatarContainer: {
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: 10,
    backgroundColor: 'transparent',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  messagesContainer: {
    flex: 1,
    marginHorizontal: 20,
    marginBottom: 10,
    backgroundColor: COLORS.boxBg,
    borderRadius: 16,
  },
  messagesList: {
  },
  messagesContentContainer: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    paddingBottom: 20,
  },
  messageBubble: {
    borderRadius: 16,
    padding: 12,
    marginVertical: 4,
    maxWidth: '80%',
    shadowColor: COLORS.buttonBg,
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  userBubble: {
    backgroundColor: COLORS.buttonBg,
    alignSelf: 'flex-end',
  },
  botBubble: {
    backgroundColor: COLORS.inputBg,
    alignSelf: 'flex-start',
  },
  messageText: {
    color: COLORS.white,
    fontSize: 16,
    lineHeight: 22,
  },
  inputContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    paddingBottom: Platform.OS === 'ios' ? 30 : 15,
    backgroundColor: 'transparent',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.inputBg,
    borderRadius: 24,
    borderColor: COLORS.white,
    borderWidth: 1,
    minHeight: 48,
  },
  input: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 12,
    fontSize: 16,
    color: COLORS.white,
    backgroundColor: 'transparent',
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: COLORS.buttonBg,
    borderTopRightRadius: 24,
    borderBottomRightRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 12,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 48,
  },
});

