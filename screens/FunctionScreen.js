import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from './colors';
import Accordion from 'react-native-collapsible/Accordion';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { Picker } from '@react-native-picker/picker';
import * as DocumentPicker from 'expo-document-picker';
import { URL_DEFINE } from './defines';

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
          backgroundColor: COLORS.white, // fundo branco
          calendarBackground: COLORS.white, // fundo branco
          todayTextColor: COLORS.buttonBg,
          selectedDayBackgroundColor: COLORS.buttonBg,
          selectedDayTextColor: COLORS.white,
          dayTextColor: '#222', // preto para máximo contraste
          textDisabledColor: COLORS.subtitle,
          monthTextColor: COLORS.buttonBg,
          arrowColor: COLORS.buttonBg,
          textSectionTitleColor: COLORS.buttonBg,
          textDayFontWeight: 'bold',
          textMonthFontWeight: 'bold',
          textDayFontSize: 16,
          textMonthFontSize: 18,
        }}
      />
      {selectedDate !== '' && (
        <View style={{ marginTop: 10 }}>
          <Text style={{ fontWeight: 'bold', color: COLORS.buttonBg, fontSize: 16 }}>
            {selectedDate}
          </Text>
          <Text
            style={{
              marginTop: 6,
              color: COLORS.white, // agora o texto do dia selecionado fica branco
              fontSize: 15,
              fontWeight: 'bold',
            }}
          >
            {details}
          </Text>
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

  const [nomeInstagram, setNomeInstagram] = useState('');
  const [senhaInstagram, setSenhaInstagram] = useState('');
  const [numeroWhatsapp, setNumeroWhatsapp] = useState('');

  const [activeSubsections, setActiveSubsections] = useState([]);

  const empresaOptions = [
    { label: "Selecione Sua Empresa", value: "opcao1" },
    { label: "Restaurante", value: "opcao2" },
    { label: "Consultório", value: "opcao3" },
    { label: "Escritório", value: "opcao4" },
    { label: "Pet Shop", value: "opcao5" },
  ];

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
            onPress={async () => {
              try {
                const response = await fetch(URL_DEFINE+'/cadastrarFuncionario', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify({
                    name: nomeCadastro,
                    password: senhaCadastro,
                    email: emailCadastro,
                  })
                });
                const data = await response.json();
              } catch (error) {
                alert('Erro ao cadastrar funcionário');
                console.error(error);
              }
            }}
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
          {empresaOptions.map(opt => (
            <Picker.Item key={opt.value} label={opt.label} value={opt.value} />
          ))}
        </Picker>
        <TouchableOpacity
          style={styles.button}
          onPress={async () => {
              try {
                const tipoLabel = empresaOptions.find(opt => opt.value === valorSelecionado)?.label || "";

                // Validação: não envie se for a opção padrão ou se o nome estiver vazio
                if (valorSelecionado === "opcao1" || !nomeEmpresa.trim()) {
                  alert("Selecione um tipo de empresa válido e preencha o nome.");
                  return;
                }

                const response = await fetch(URL_DEFINE+'/cadastrarEmpresa', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify({
                    name: nomeEmpresa,
                    tipo: tipoLabel,
                  })
                });
                const data = await response.json();
                alert("Empresa cadastrada com sucesso!");
              } catch (error) {
                alert('Erro ao cadastrar empresa');
                console.error(error);
              }
            }}
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
      content: (
        <ScrollView
          style={{ maxHeight: 300 }} // ajuste conforme necessário
          nestedScrollEnabled={true}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={true}
        >
          <Accordion
            sections={[
              {
                title: 'Instagram',
                content: (
                  <View>
                    <TextInput
                      style={styles.input}
                      onChangeText={setNomeInstagram}
                      value={nomeInstagram}
                      placeholder="Nome do Instagram"
                      placeholderTextColor="#374151"
                    />
                    <TextInput
                      style={styles.input}
                      onChangeText={setSenhaInstagram}
                      value={senhaInstagram}
                      placeholder="Senha do Instagram"
                      placeholderTextColor="#374151"
                      secureTextEntry
                    />
                    <TouchableOpacity
                      style={styles.button}
                      onPress={() => alert('Instagram cadastrado!')}
                    >
                      <Text style={styles.buttonText}>Cadastrar Instagram</Text>
                    </TouchableOpacity>
                  </View>
                ),
              },
              {
                title: 'WhatsApp',
                content: (
                  <View>
                    <TextInput
                      style={styles.input}
                      onChangeText={setNumeroWhatsapp}
                      value={numeroWhatsapp}
                      placeholder="Numero do WhatsApp"
                      placeholderTextColor="#374151"
                    />
                    <TouchableOpacity
                      style={styles.button}
                      onPress={() => alert('WhatsApp cadastrado!')}
                    >
                      <Text style={styles.buttonText}>Cadastrar WhatsApp</Text>
                    </TouchableOpacity>
                  </View>
                ),
              },
            ]}
            activeSections={activeSubsections}
            renderHeader={(section, _, isActive) => (
              <View style={[styles.subBox, isActive && styles.activeSubBox]}>
                <Text style={styles.subBoxTitle}>{section.title}</Text>
              </View>
            )}
            renderContent={(section) => (
              <View style={styles.boxContent}>{section.content}</View>
            )}
            onChange={setActiveSubsections}
            underlayColor="rgba(59,130,246,0.08)"
          />
        </ScrollView>
      ),
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
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 20, paddingBottom: 60 }}
        nestedScrollEnabled={true}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
      >
        <Accordion
          sections={SECTIONS}
          activeSections={activeSections}
          renderHeader={renderHeader}
          renderContent={renderContent}
          onChange={setActiveSections}
          underlayColor="rgba(59,130,246,0.08)"
        />
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
    backgroundColor: COLORS.buttonBgSoft,
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
    borderColor: COLORS.buttonBg,
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

  subBox: {
    backgroundColor: '#2563eb',
    borderRadius: 8,
    padding: 12,
    marginTop: 10,
  },
  activeSubBox: {
    backgroundColor: '#2563eb',
  },
  subBoxTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
});
