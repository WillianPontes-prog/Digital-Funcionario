import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import Accordion from 'react-native-collapsible/Accordion';

export default function FunctionScreen() {
  const [activeSections, setActiveSections] = useState([]);
  const [nomeCadastro, setName] = useState('');

  const SECTIONS = [
    {
      title: 'Cadastrar Funcionário (CEO)',
      content: (
        <View>
          <TextInput
            style={{ backgroundColor: '#e0e7ff', padding: 12, borderRadius: 6, width: '60%', marginBottom: 10 }}
            onChangeText={setName}
            value={nomeCadastro}
            placeholder="Nome"
            placeholderTextColor="#374151"
            keyboardType='default'
          />
          
          <TouchableOpacity
            style={{ backgroundColor: '#2563eb', padding: 12, borderRadius: 6, alignItems: 'center', width: '60%' }}
            onPress={() => alert('Cadastrar Funcionário')}
          >
            <Text style={{ color: '#fff', fontWeight: 'bold' }}>Cadastrar Funcionário</Text>
          </TouchableOpacity>
        </View>
      )
    },
    {
      title: 'Configurar Detalhes da Empresa (CEO)',
      content: (<Text>Conteúdo do segundo item.</Text>)
    },
    {
      title: 'Upload de Relatórios (CEO)',
      content: <Text>Conteúdo do segundo item.</Text>
    },
    {
      title: 'Gerar Relatórios (CEO)',
      content: <Text>Conteúdo do segundo item.</Text>
    },
    {
      title: 'Cadastrar Redes Sociais (Marketing)',
      content: <Text>Conteúdo do segundo item.</Text>
    },
  ];

  const renderHeader = (section, _, isActive) => (
    <View style={[styles.box, isActive && { backgroundColor: '#c7d2fe' }]}> 
      <Text style={styles.boxTitle}>{section.title}</Text>
    </View>
  );

  const renderContent = section => (
    <View style={styles.boxContent}>
      {section.content}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Accordion
          sections={SECTIONS}
          activeSections={activeSections}
          renderHeader={renderHeader}
          renderContent={renderContent}
          onChange={setActiveSections}
          underlayColor="#e0e7ff"
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
  content: {
    flex: 1,
    alignItems: 'left',
    justifyContent: 'top',
    padding: 20,
  },
  box: {
    width: '90%',
    backgroundColor: '#e0e7ff',
    borderRadius: 8,
    padding: 12,
    marginTop: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  boxTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e40af',
  },
  boxContent: {
    marginTop: 10,
    padding: 20,
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    width: '60%',
  },
});