import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function App() {

  return (
    <View style={styles.container}>

      <View style={styles.textLoginBox}>
        <Text >Bem vindo!</Text>
        
        <Text>Faça login para continuar.</Text>
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
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'top',

    marginTop: 150,
  },


});
