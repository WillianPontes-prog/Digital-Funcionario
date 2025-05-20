import React, { useState, useRef } from 'react';
import { View, TextInput, Image, StyleSheet, FlatList, Text, Keyboard, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from './colors';

const BOT_RESPONSES = [
  "Pruuuu",
  "Grrrrk",
  "Prururururu",
  "Passa o PIX"
];

export default function ChatScreen() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const flatListRef = useRef(null);

  const sendMessage = () => {
    if (message.trim() !== '') {
      const userMsg = { id: Date.now().toString(), text: message, from: 'user' };
      setMessages(prev => {
        const newMessages = [...prev, userMsg];
        setTimeout(() => {
          flatListRef.current?.scrollToEnd({ animated: true });
        }, 100);
        return newMessages;
      });
      setMessage('');
      Keyboard.dismiss();

      // Bot response
      setTimeout(() => {
        const botMsg = {
          id: (Date.now() + 1).toString(),
          text: BOT_RESPONSES[Math.floor(Math.random() * BOT_RESPONSES.length)],
          from: 'bot'
        };
        setMessages(prev => [...prev, botMsg]);
        setTimeout(() => {
          flatListRef.current?.scrollToEnd({ animated: true });
        }, 100);
      }, 600);
    }
  };

  return (
    <LinearGradient colors={COLORS.gradient} style={styles.background}>
      <View style={styles.container}>
        <View style={styles.avatarContainer}>
          <Image
            source={require('../assets/avatar.png')}
            style={styles.avatar}
          />
        </View>
        <View style={styles.messagesWrapper}>
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
            style={styles.messagesList}
            contentContainerStyle={{ paddingBottom: 10 }}
            onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
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
            />
            <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
              <Ionicons name="send" size={24} color={COLORS.white} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: 'transparent', // para mostrar o LinearGradient atrás
  },
  avatarContainer: {
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 10,
    height: 90,
    justifyContent: 'center',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  messagesWrapper: {
    flex: 1,
    width: '100%',
    justifyContent: 'flex-end',
  },
  messagesList: {
    flex: 1,
    width: '100%',
    paddingHorizontal: 20,
    backgroundColor: COLORS.boxBg,
    borderRadius: 16,
    paddingTop: 10,
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
  },
  inputContainer: {
    width: '100%',
    alignItems: 'center',
    paddingBottom: 20,
    backgroundColor: 'transparent',
    marginBottom: 30,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '90%',
    backgroundColor: COLORS.inputBg,
    borderRadius: 24,
    borderColor: COLORS.white,
    borderWidth: 1,
  },
  input: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 12,
    fontSize: 16,
    color: COLORS.white,
    backgroundColor: 'transparent',
  },
  sendButton: {
    backgroundColor: COLORS.buttonBg,
    borderTopRightRadius: 24,
    borderBottomRightRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

