import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import Accordion from 'react-native-collapsible/Accordion';
import { Calendar, LocaleConfig } from 'react-native-calendars';

// Configuração do calendário em português
LocaleConfig.locales['pt-br'] = {
  monthNames: ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'],
  monthNamesShort: ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'],
  dayNames: ['Domingo','Segunda','Terça','Quarta','Quinta','Sexta','Sábado'],
  dayNamesShort: ['Dom','Seg','Ter','Qua','Qui','Sex','Sab'],
  today: 'Hoje'
};
LocaleConfig.defaultLocale = 'pt-br';

function CalendarSection() {
  const [selectedDate, setSelectedDate] = useState('');
  const [details, setDetails] = useState('');

  const markedDates = {
    '2025-05-21': { marked: true, dotColor: 'red' },
    '2025-05-23': { marked: true, dotColor: 'blue' },
  };

  const postDetails = {
    '2025-05-21': 'Post sobre a nova campanha da empresa.',
    '2025-05-23': 'Publicar o vídeo institucional no Instagram e LinkedIn.',
  };

  const handleDayPress = (day) => {
    const dateStr = day?.dateString || '';
    setSelectedDate(dateStr);
    setDetails(postDetails[dateStr] || 'Nenhuma postagem planejada para este dia.');
  };

  const finalMarkedDates = {
    ...markedDates,
    ...(selectedDate
      ? {
          [selectedDate]: {
            selected: true,
            selectedColor: '#2563eb',
            marked: !!markedDates[selectedDate],
            dotColor: markedDates[selectedDate]?.dotColor || undefined,
          },
        }
      : {}),
  };

  return (
    <View style={{ marginTop: 10 }}>
      <Calendar
        onDayPress={handleDayPress}
        markedDates={finalMarkedDates}
        theme={{
          todayTextColor: '#2563eb',
          selectedDayBackgroundColor: '#2563eb',
          arrowColor: '#2563eb',
        }}
      />
      {selectedDate !== '' && (
        <View style={{ marginTop: 10 }}>
          <Text style={{ fontWeight: 'bold', color: '#1e3a8a' }}>{selectedDate}</Text>
          <Text style={{ marginTop: 6 }}>{details}</Text>
        </View>
      )}
    </View>
  );
}

export default function FunctionScreen() {
  const [activeSections, setActiveSections] = useState([]);
  const [nomeCadastro, setNomeCadastro] = useState('');
  const [senhaCadastro, setSenhaCadastro] = useState('');
  const [emailCadastro, setEmailCadastro] = useState('');

  const SECTIONS = [
    {
      title: 'Cadastrar Funcionário (CEO)',
      content: (
        <View>
          <TextInput
            style={styles.input}
            onChangeText={setNomeCadastro}
            value={nomeCadastro}
            placeholder="Nome"
            placeholderTextColor="#374151"
          />
          <TextInput
            style={styles.input}
            onChangeText={setSenhaCadastro}
            value={senhaCadastro}
            placeholder="Senha"
            placeholderTextColor="#374151"
            secureTextEntry
          />
          <TextInput
            style={styles.input}
            onChangeText={setEmailCadastro}
            value={emailCadastro}
            placeholder="Email"
            placeholderTextColor="#374151"
            keyboardType="email-address"
          />
          <TouchableOpacity
            style={styles.button}
            onPress={() => alert('Funcionário cadastrado!')}
          >
            <Text style={styles.buttonText}>Cadastrar Funcionário</Text>
          </TouchableOpacity>
        </View>
      ),
    },
    {
      title: 'Calendário de Postagem (Marketing)',
      content: <CalendarSection />,
    },
    {
      title: 'Configurar Detalhes da Empresa (CEO)',
      content: <Text>Conteúdo do segundo item.</Text>,
    },
    {
      title: 'Upload de Relatórios (CEO)',
      content: <Text>Conteúdo do terceiro item.</Text>,
    },
    {
      title: 'Gerar Relatórios (CEO)',
      content: <Text>Conteúdo do quarto item.</Text>,
    },
    {
      title: 'Cadastrar Redes Sociais (Marketing)',
      content: <Text>Conteúdo do quinto item.</Text>,
    },

  ];

  const renderHeader = (section, _, isActive) => (
    <View style={[styles.box, isActive && styles.activeBox]}>
      <Text style={styles.boxTitle}>{section.title}</Text>
    </View>
  );

  const renderContent = section => (
    <View style={styles.boxContent}>
      {section.content}
    </View>
  );

  return (
    <ScrollView style={styles.container}>
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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  content: {
    padding: 20,
  },
  box: {
    backgroundColor: '#e0e7ff',
    borderRadius: 8,
    padding: 12,
    marginTop: 20,
  },
  activeBox: {
    backgroundColor: '#c7d2fe',
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
  },
  input: {
    backgroundColor: '#e0e7ff',
    padding: 12,
    borderRadius: 6,
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#2563eb',
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
