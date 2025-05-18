import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Button } from 'react-native';

export default function LoginScreen({ navigation }) {
  const [loginUser, setLoginUser] = useState('');
  const [passwordUser, setPasswordUser] = useState('');

  return (
    <View style={styles.container}>
      <View style={styles.textLoginBox}>
        <Text style={{ fontSize: 28, fontWeight: "bold" }}>Bem vindo!</Text>
        <Text style={{ fontSize: 18 }}>Faça login para continuar.</Text>
        <TextInput
          style={[styles.input, { marginTop: 60 }]}
          onChangeText={setLoginUser}
          value={loginUser}
          placeholder="Login"
          keyboardType="email-address"
        />
        <TextInput
          style={[styles.input, { marginTop: -5 }]}
          onChangeText={setPasswordUser}
          value={passwordUser}
          placeholder="Senha"
          secureTextEntry={true}
        />

        <View style={{ width: 300, marginTop: 20 }}>
          <Button
            title="Entrar"
            onPress={() => {
              navigation.navigate('Chat');
            }}
          />
        </View>

        <View style={{ width: 300, marginTop: 20 }}>
          <Button
            title="Registrar"
            onPress={() => {
              navigation.navigate('Register');
            }}
          />
        </View>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textLoginBox: {
    flex: 1,
    widgth: 300,
    height: 900,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'top',
    marginTop: 150,
  },
  input: {
    height: 40,
    width: 300,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
});