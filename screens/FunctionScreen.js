import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Modal, TouchableWithoutFeedback, Platform } from 'react-native';
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
  const [events, setEvents] = useState({});
  const [selectedDate, setSelectedDate] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [eventTitle, setEventTitle] = useState('');
  const [eventDesc, setEventDesc] = useState('');
  const [eventColor, setEventColor] = useState('#3b82f6');

  const colorOptions = [
    { color: '#3b82f6', label: 'Campanha' },
    { color: '#22c55e', label: 'Reunião' },
    { color: '#f59e42', label: 'Entrega' },
    { color: '#ef4444', label: 'Outro' },
  ];

  function handleDayPress(day) {
    setSelectedDate(day.dateString);
    setEventTitle('');
    setEventDesc('');
    setEventColor('#3b82f6');
    setModalVisible(true);
  }

  async function saveEvent() {
    if (!eventTitle.trim()) {
      alert('Digite um título para o evento.');
      return;
    }
    try {
      await fetch(URL_DEFINE + '/calendar/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: selectedDate,
          title: eventTitle,
          description: eventDesc,
          color: eventColor,
        }),
      });
      setModalVisible(false);
      fetchEvents(); // <-- Atualiza eventos do backend!
    } catch (e) {
      alert('Erro ao salvar evento!');
    }
  }

  // Monta as marcações para o calendário
  const markedDates = {};
  Object.keys(events).forEach(date => {
    markedDates[date] = {
      marked: true,
      dotColor: events[date].color,
      customStyles: {
        container: { backgroundColor: events[date].color },
        text: { color: '#fff' }
      }
    };
  });

  async function fetchEvents() {
    try {
      const response = await fetch(URL_DEFINE + '/calendar/all');
      const data = await response.json();
      const eventsObj = {};
      data.forEach(ev => {
        eventsObj[ev.date] = {
          marked: true,
          dotColor: ev.color,
          customStyles: {
            container: { backgroundColor: ev.color },
            text: { color: '#fff' }
          },
          title: ev.title,
          desc: ev.description,
          color: ev.color,
        };
      });
      setEvents(eventsObj);
    } catch (e) {
      // erro ao buscar eventos
    }
  }

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <View style={{ marginTop: 10 }}>
      <Calendar
        onDayPress={handleDayPress}
        markedDates={markedDates}
        markingType={'custom'}
        theme={{
          backgroundColor: COLORS.white,
          calendarBackground: COLORS.white,
          todayTextColor: COLORS.buttonBg,
          selectedDayBackgroundColor: COLORS.buttonBg,
          selectedDayTextColor: COLORS.white,
          dayTextColor: '#222',
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

      {/* Exibe detalhes do evento do dia selecionado */}
      {selectedDate && events[selectedDate] && (
        <View style={{ marginTop: 16, backgroundColor: events[selectedDate].color, borderRadius: 8, padding: 12 }}>
          <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>{events[selectedDate].title}</Text>
          <Text style={{ color: '#fff', marginTop: 4 }}>{events[selectedDate].desc}</Text>
          <TouchableOpacity
            style={{
              marginTop: 10,
              backgroundColor: '#ef4444',
              borderRadius: 6,
              paddingVertical: 8,
              paddingHorizontal: 16,
              alignSelf: 'flex-end'
            }}
            onPress={async () => {
              try {
                await fetch(URL_DEFINE + '/calendar/delete', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(selectedDate),
                });
                fetchEvents();
                setSelectedDate('');
              } catch (e) {
                alert('Erro ao deletar evento!');
              }
            }}
          >
            <Text style={{ color: '#fff', fontWeight: 'bold' }}>Deletar Evento</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Modal para criar evento */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.4)',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <TouchableWithoutFeedback>
              <View style={{
                backgroundColor: '#fff',
                borderRadius: 12,
                padding: 24,
                width: 320,
                alignItems: 'center'
              }}>
                <Text style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 10 }}>Novo Evento</Text>
                <TextInput
                  placeholder="Título"
                  value={eventTitle}
                  onChangeText={setEventTitle}
                  style={{ borderWidth: 1, borderColor: '#2563eb', borderRadius: 8, width: '100%', marginBottom: 10, padding: 8 }}
                />
                <TextInput
                  placeholder="Descrição"
                  value={eventDesc}
                  onChangeText={setEventDesc}
                  style={{ borderWidth: 1, borderColor: '#2563eb', borderRadius: 8, width: '100%', marginBottom: 10, padding: 8 }}
                />
                <View style={{ flexDirection: 'row', marginBottom: 10 }}>
                  {colorOptions.map(opt => (
                    <TouchableOpacity
                      key={opt.color}
                      onPress={() => setEventColor(opt.color)}
                      style={{
                        width: 28, height: 28, borderRadius: 14,
                        backgroundColor: opt.color,
                        marginHorizontal: 6,
                        borderWidth: eventColor === opt.color ? 3 : 1,
                        borderColor: eventColor === opt.color ? '#222' : '#ccc'
                      }}
                    />
                  ))}
                </View>
                <TouchableOpacity
                  onPress={saveEvent}
                  style={{
                    backgroundColor: '#2563eb',
                    borderRadius: 8,
                    paddingVertical: 10,
                    paddingHorizontal: 24,
                    marginTop: 10
                  }}
                >
                  <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>Salvar Evento</Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
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
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    async function fetchUser() {
      try {
        const response = await fetch(URL_DEFINE + '/getCurrentUser');
        const data = await response.json();
        // Ajuste conforme o retorno do seu backend
        setCurrentUser(data.usertype || data[0]?.usertype || null);
      } catch (error) {
        setCurrentUser(null);
      }
    }
    fetchUser();
  }, []);

  async function fetchCompanyDetails() {
    try {
      const response = await fetch(URL_DEFINE + '/getCompanyDetails');
      const data = await response.json();

      if (data.nome && data.tipo) {
        setNomeEmpresa(data.nome);

        const tipoEncontrado = empresaOptions.find(opt => opt.label === data.tipo);
        if (tipoEncontrado) {
          setValorSelecionado(tipoEncontrado.value);  
        }
      }
    } catch (err) {
      console.error('Erro ao carregar dados da empresa:', err);
    }
  }

  useEffect(() => {
    fetchCompanyDetails();
  }, []);

  useEffect(() => {
    async function fetchSocials() {
      try {
        const [igRes, waRes] = await Promise.all([
          fetch(URL_DEFINE + '/getInstagram'),
          fetch(URL_DEFINE + '/getWhatsapp'),
        ]);

        const igData = await igRes.json();
        const waData = await waRes.json();

        if (igData && igData.username) {
          setNomeInstagram(igData.username);
          setSenhaInstagram(igData.password); // se quiser também
        }

        if (waData && waData.phone_number) {
          setNumeroWhatsapp(waData.phone_number);
        }
      } catch (error) {
        console.log('Erro ao buscar redes sociais:', error);
      }
    }

    fetchSocials();
  }, []);


  const empresaOptions = [
    { label: "Selecione Sua Empresa", value: "opcao1" },
    { label: "Restaurante", value: "opcao2" },
    { label: "Consultório", value: "opcao3" },
    { label: "Escritório", value: "opcao4" },
    { label: "Pet Shop", value: "opcao5" },
  ];

  // Defina SECTIONS normalmente (como você já faz)
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
      only: 'CEO', // Adicione uma chave para indicar para quem mostrar
    },
    {
      title: 'Calendário de Postagem (Marketing)',
      content: <CalendarSection />,
      only: 'Marketing',
    },
    {
      title: 'Configurar Detalhes da Empresa (CEO)',
      content: (<View>
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
      </View>),
      only: 'CEO', 
    },
    {
      title: 'Upload de Relatórios (CEO)',
      content: (
        <View style={styles.uploadContainer}>
          <View style={styles.dropZone}>
            <Text style={styles.dropText}>Faça o upload de seu documento</Text>
          </View>
          <TouchableOpacity
            style={styles.uploadButton}
            onPress={async () => {
              try {
                const result = await DocumentPicker.getDocumentAsync({ copyToCacheDirectory: true });
                const file = result.assets ? result.assets[0] : result;
                console.log('Arquivo selecionado:', file);

                if (file && (file.uri || file.file)) {
                  const formData = new FormData();

                  if (Platform.OS === 'web' && file.file) {
                    // Web: use o objeto File diretamente
                    formData.append('file', file.file, file.name);
                  } else {
                    // Mobile: use uri
                    formData.append('file', {
                      uri: file.uri,
                      name: file.name || 'relatorio.pdf',
                      type: file.mimeType || 'application/pdf',
                    });
                  }

                  const response = await fetch(URL_DEFINE + '/uploadRelatorio', {
                    method: 'POST',
                    body: formData,
                  });

                  if (response.ok) {
                    alert('Relatório enviado com sucesso!');
                  } else {
                    const errorText = await response.text();
                    console.log('Erro do backend:', errorText);
                    alert('Erro ao enviar relatório: ' + errorText);
                  }
                } else {
                  alert('Nenhum arquivo selecionado.');
                }
              } catch (error) {
                console.error('Erro ao selecionar ou enviar arquivo:', error);
                alert('Erro ao selecionar ou enviar arquivo.');
              }
            }}
          >
            <Text style={styles.uploadButtonText}>Upload</Text>
          </TouchableOpacity>
        </View>
      ),
      only: 'CEO', 
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
                      onPress={async () => {
                        try {
                          await fetch(URL_DEFINE + '/configurarInstagram', {
                            method: 'POST',
                            headers: {
                              'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                              username: nomeInstagram,
                              password: senhaInstagram
                            })
                          });
                          alert('Instagram cadastrado!');
                        } catch (err) {
                          alert('Erro ao cadastrar Instagram');
                          console.error(err);
                        }
                      }}
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
                      onPress={async () => {
                        try {
                          await fetch(URL_DEFINE + '/configurarWhatsapp', {
                            method: 'POST',
                            headers: {
                              'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                              phone_number: numeroWhatsapp
                            })
                          });
                          alert('WhatsApp cadastrado!');
                        } catch (err) {
                          alert('Erro ao cadastrar WhatsApp');
                          console.error(err);
                        }
                      }}
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
      only: 'Marketing', 
},


  ];

  // Filtre as seções conforme o usuário
  const filteredSections = SECTIONS.filter(
    section =>
      !section.only || section.only === currentUser
  );

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
          sections={filteredSections}
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
