import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from './colors';
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
    '2025-05-21': { marked: true, dotColor: '#3b82f6' },
    '2025-05-23': { marked: true, dotColor: '#2563eb' },
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
          backgroundColor: COLORS.boxBg,
          calendarBackground: COLORS.boxBg,
          todayTextColor: '#2563eb',
          selectedDayBackgroundColor: '#2563eb',
          selectedDayTextColor: '#fff',
          dayTextColor: '#1e293b',
          textDisabledColor: '#94a3b8',
          monthTextColor: '#1e3a8a',
          arrowColor: '#2563eb',
          textSectionTitleColor: '#2563eb',
        }}
      />
      {selectedDate !== '' && (
        <View style={{ marginTop: 10 }}>
          <Text style={{ fontWeight: 'bold', color: '#1e3a8a', fontSize: 16 }}>{selectedDate}</Text>
          <Text style={{ marginTop: 6, color: '#1e293b', fontSize: 15 }}>{details}</Text>
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
            placeholderTextColor="#64748b"
          />
          <TextInput
            style={styles.input}
            onChangeText={setSenhaCadastro}
            value={senhaCadastro}
            placeholder="Senha"
            placeholderTextColor="#64748b"
            secureTextEntry
          />
          <TextInput
            style={styles.input}
            onChangeText={setEmailCadastro}
            value={emailCadastro}
            placeholder="Email"
            placeholderTextColor="#64748b"
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
      content: <Text style={styles.sectionText}>Conteúdo do segundo item.</Text>,
    },
    {
      title: 'Upload de Relatórios (CEO)',
      content: <Text style={styles.sectionText}>Conteúdo do terceiro item.</Text>,
    },
    {
      title: 'Gerar Relatórios (CEO)',
      content: <Text style={styles.sectionText}>Conteúdo do quarto item.</Text>,
    },
    {
      title: 'Cadastrar Redes Sociais (Marketing)',
      content: <Text style={styles.sectionText}>Conteúdo do quinto item.</Text>,
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
    <LinearGradient colors={COLORS.gradient} style={{ flex: 1 }}>
      <ScrollView style={styles.container}>
        <View style={styles.content}>
          <Accordion
            sections={SECTIONS}
            activeSections={activeSections}
            renderHeader={renderHeader}
            renderContent={renderContent}
            onChange={setActiveSections}
            underlayColor="rgba(59,130,246,0.08)"
          />
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  box: {
    backgroundColor: 'rgba(255,255,255,0.85)',
    borderRadius: 10,
    padding: 14,
    marginTop: 20,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2,
  },
  activeBox: {
    backgroundColor: 'rgba(59,130,246,0.12)',
  },
  boxTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e3a8a',
  },
  boxContent: {
    marginTop: 10,
    padding: 20,
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 10,
  },
  input: {
    backgroundColor: '#f1f5f9',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    color: '#1e293b',
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#cbd5e1',
  },
  button: {
    backgroundColor: '#2563eb',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  sectionText: {
    color: '#1e293b',
    fontSize: 15,
  },
});
