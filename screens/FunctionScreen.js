import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from './colors';
import Accordion from 'react-native-collapsible/Accordion';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { Picker } from '@react-native-picker/picker';
import * as DocumentPicker from 'expo-document-picker';

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

  const [valorSelecionado, setValorSelecionado] = useState('opcao1');
  const [nomeEmpresa, setNomeEmpresa] = useState('');

  const [relatorio, setRelatorio] = useState('');

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
      content: <View>
        <TextInput
            style={styles.input}
            onChangeText={setNomeEmpresa}
            value={nomeEmpresa}
            placeholder="Nome da Empresa"
            placeholderTextColor="#64748b"
            keyboardType="default"
          />
        <Picker
          style={[styles.input, {width: '50%'}]}
          selectedValue={valorSelecionado}
          onValueChange={(itemValue) => setValorSelecionado(itemValue)}
        >
          <Picker.Item label="Selecione Sua Empresa" value="opcao1" />
          <Picker.Item label="Restaurante" value="opcao2" />
          <Picker.Item label="Consultório" value="opcao3" />
          <Picker.Item label="Escritório" value="opcao4" />
          <Picker.Item label="Pet Shop" value="opcao5" />
        </Picker>
        <TouchableOpacity
          style={styles.button}
          onPress={() => alert('Empresa cadastrada!')}
        >
          <Text style={styles.buttonText}>Cadastrar Empresa</Text>
        </TouchableOpacity>
      </View>
    },
    {
      title: 'Upload de Relatórios (CEO)',
      content: (
        <View style={styles.uploadContainer}>
          <View style={styles.dropZone}>
            <Text style={styles.dropText}>Arraste seus documentos aqui</Text>
          </View>
          <TouchableOpacity style={styles.uploadButton}onPress={async () => {
              try {
                const result = await DocumentPicker.getDocumentAsync({});

                if (result.type === 'success') {
                  alert(`Arquivo selecionado: ${result.name}`);
                  // Aqui você pode enviar para seu backend ou armazenar localmente
                } else {
                  alert('Nenhum arquivo selecionado.');
                }
              } catch (error) {
                console.error('Erro ao selecionar arquivo:', error);
                alert('Erro ao selecionar arquivo.');
              }
            }}>
            <Text style={styles.uploadButtonText}>Upload</Text>
          </TouchableOpacity>
        </View>
      ),
    },
    {
      title: 'Gerar Relatórios (CEO)',
      content: <View>
        <TextInput
            style={styles.input}
            onChangeText={setRelatorio}
            value={relatorio}
            placeholder="Descreva Brevemente o Conteúdo do Relatório"
            placeholderTextColor="#64748b"
            keyboardType='default'
          />
        <TouchableOpacity
          style={styles.button}
          onPress={() => alert('Relatório gerado!')}
        >
          <Text style={styles.buttonText}>Gerar Relatório</Text>
        </TouchableOpacity>
      </View>
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
    backgroundColor: COLORS.boxBg,
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
    backgroundColor: COLORS.inputBg, // caixa aberta fica mais escura e com mais contraste
  },
  boxTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  boxContent: {
    marginTop: 10,
    padding: 20,
    backgroundColor: COLORS.inputBg, // fundo da área aberta também escuro para contraste
    borderRadius: 10,
  },
  input: {
    backgroundColor: COLORS.whiteSoft,
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    color: COLORS.gradient[2],
    fontSize: 15,
    borderWidth: 1,
    borderColor: COLORS.boxBg,
  },
  button: {
    backgroundColor: COLORS.buttonBg,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: 16,
  },
  sectionText: {
    color: COLORS.whiteSoft,
    fontSize: 15,
  },
  uploadContainer: {
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },

  dropZone: {
    width: '100%',
    height: 150,
    borderWidth: 2,
    borderColor: '#cbd5e1',
    borderStyle: 'dashed',
    borderRadius: 10,
    backgroundColor: '#e2e8f0', // tom acinzentado
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },

  dropText: {
    fontSize: 16,
    color: '#334155',
    textAlign: 'center',
  },

  uploadButton: {
    backgroundColor: '#2563eb',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },

  uploadButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },

});
