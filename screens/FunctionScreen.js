import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Accordion from 'react-native-collapsible/Accordion';

const SECTIONS = [
  {
    title: 'Cadastrar Funcionário (CEO)',
    content: (<Text> oieeeee
      </Text>)
  },
  {
    title: 'Configurar Detalhes da Empresa (CEO)',
    content: 'Conteúdo do segundo item.'
  },
  {
    title: 'Upload de Relatórios (CEO)',
    content: 'Conteúdo do segundo item.'
  },
  {
    title: 'Gerar Relatórios (CEO)',
    content: 'Conteúdo do segundo item.'
  },
  {
    title: 'Cadastrar Redes Sociais (Marketing)',
    content: 'Conteúdo do segundo item.'
  },
];

export default function FunctionScreen() {
  const [activeSections, setActiveSections] = useState([]);

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
    width: '80%',
  },
});