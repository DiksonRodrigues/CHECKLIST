import React, { Dispatch, useEffect, useRef, useState } from 'react';
import {
  Modal,
  Platform,
  StatusBar,
  Text,
  TextInput,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import ActionButton from 'react-native-action-button';
import Autocomplete from 'react-native-autocomplete-input';
import { launchCamera } from 'react-native-image-picker';
import axios from 'axios';

import { useAuth } from '../../hooks/auth';

import { styles } from './styles';

import Swipe from '../../components/SwipeCard/SwipeCards';

import dimensions from '../../style/dimensions';
import colors from '../../style/colors';
import api from '../../services/api';

import { card } from '../../util/card';
import Card from '../../components/Card';
import { CardDataDTO } from '../../components/Card/dto/card.dto';
import { Veiculo } from '../../Interface/veiculo';

const { vh, vw } = dimensions;

const Main: React.FC = () => {
  const { user, signOut, matricula } = useAuth();
  // Virá do store
  const [veiculos, setVeiculos] = useState([]);
  const [modalVisibilityInfo1, setModalVisibilityInfo1] = useState(false);
  const [modalVisibilityInfo2, setModalVisibilityInfo2] = useState(false);
  const [veiculo, setVeiculo] = useState('');
  const [listaCar, setListaCar] = useState<Veiculo[] | []>([]);
  const [horimetro, setHorimetro] = useState('');
  const [odometro, setOdometro] = useState('');
  const [veiculoId, setVeiculoId] = useState('');
  const [foto, setFoto] = useState('');
  const [startCheck, setStartCheck] = useState(false);
  const [cards, setCards] = useState(card);
  const [checklist, setCheckList] = useState([]);
  const [yeep, setYeep] = useState(false);
  const [howOptionSelected, setHowOptionSelected] = useState('');
  const [otherQuestion, setOtherQuestion] = useState(false);
  const [modalVisibilityL1, setModalVisibilityL1] = useState(false);
  const [modalVisibilityL2, setModalVisibilityL2] = useState(false);
  const [obs, setObs] = useState('');
  const [modalVisibilityEnvio, setModalVisibilityEnvio] = useState(false);
  const [currentCard, setCurrentCard] = useState(0);
  const [tipoOsId, setTipoOsId] = useState('');
  const [typesCheckList, setTypesCheckList] = useState([]);
  const swipe = useRef(null);

  async function handleSignOut() {
    signOut();
  }

  const comp = (a, b) => a.toLowerCase().trim() === b.toLowerCase().trim();

  const findCar = query => {
    if (query === '') {
      return [];
    }
    const regex = new RegExp(`${query.trim()}`, 'i');
    const listaCar = veiculos.filter(carro => {
      return carro.description.search(regex) >= 0;
    });
    return listaCar;
  };

  const receiveCard = async (id, typeId) => {
    const res = await axios
      .get(
        `https://system.mobs2.com/api/assets/${id}/items/${matricula}`,
      )
    const resposta = res.data;

    if (resposta.length > 0) {
      for (let index = 0; index < resposta.length; index++) {
        resposta[index].item = index + 1;
      }
      
      setCards(resposta.find(resp => resp.checklist_type_id == typeId).items);
    } else {
      //Teste
      setCards(card);
    }
  };

  const buscarTipos = async () => {
    const responseTypesChecklist = await api.get(
      `/users/${user?.id}/checklist-types/${matricula}`,
    );

    const { data } = responseTypesChecklist;

    setTypesCheckList(data);
  };

  const buscarVeiculos = async (type_id_selected: String) => {
    api
      .get(`checklist-types/${type_id_selected}/assets/${matricula}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then(res => {
        const resposta = res.data;
        setVeiculos(resposta);
      })
      .catch(erro => {
        console.log('Erro ao buscar os veiculos: ' + erro);
      });
  };

  // Vai para uma função separada
  function handleYup(card) {
    console.log(checklist);
    if (cards[card].desc !== 'OUTROS') {
      setHowOptionSelected('yeep');
      setCurrentCard(card);
    }
    setOtherQuestion(false);
    setModalVisibilityL1(true);
    setOtherQuestion(true);
    setYeep(true);

    if (cards[card].desc === 'OUTROS') {
      setYeep(true);
    }
  }

  // Vai para uma função separada
  function handleNope(card) {
    if (cards[card].desc !== 'OUTROS') {
      setHowOptionSelected('nope');
      setCurrentCard(card);
    }
    setOtherQuestion(false);
    setYeep(false);
    setModalVisibilityL1(true);
  }

  // Vai para uma função separada
  function handleReturn(card) {
    if (card == 0) {
      setStartCheck(false);
    } else {
      checklist.pop();
    }
  }

  // Vai para uma função separada
  const enviarChecklist = () => {
    let values = checklist.filter(function (a) {
      return !this[JSON.stringify(a)] && (this[JSON.stringify(a)] = true);
    }, Object.create(null));

    const data = {
      orgid: user?.group_id,
      tipoOsId,
      userId: user?.id,
      veiculoId: veiculoId,
      odometro: odometro,
      horimetro: horimetro,
      items: values,
    };
    console.log(data);
    api
      .post(
        'https://system.mobs2.com/api/checklist/items',
        data,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      )
      .then(res => {
        console.log(res);
        setVeiculo('');
        setOdometro('');
        setHorimetro('');
        setCheckList([]);
      })
      .catch(err => {
        console.log(err);
        setVeiculo('');
        setOdometro('');
        setHorimetro('');
        setCheckList([]);
      });
  };

  useEffect(() => {
    buscarTipos();
  }, []);

  return (
    <>
      <View style={styles.body}>
        {Platform.OS === 'ios' && <StatusBar barStyle="light-content" />}
        {Platform.OS === 'android' && (
          <StatusBar
            backgroundColor="rgba(49,49,49,0)"
            translucent={true}
            barStyle="light-content"
          />
        )}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.titulo}>Mobs2 Checklist</Text>
          </View>
          <TouchableOpacity
            style={styles.close}
            onPress={() => {
              handleSignOut();
            }}>
            <Text style={styles.titulo}>SAIR</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.main}>
          {/* <View>
            <Text>Últimos Registros</Text>
          </View> */}
          <View
            style={{
              borderRadius: 30,
              position: 'absolute',
              bottom: 10,
              alignSelf: 'center',
            }}>
            <Text>Powered by Mobs2</Text>
          </View>
          {startCheck ? (
            <Swipe
              ref={swipe}
              cards={cards}
              renderCard={(cardData: CardDataDTO, index: number) => {
                console.log(index);
                return (
                  <Card
                    data={cardData}
                    index={index}
                    tamanho={cards.length}
                    checklist={checklist}
                  />
                );
              }}
              onSwipedAll={() => {
                setModalVisibilityEnvio(true);
                setStartCheck(false);
              }}
              onSwipedLeft={handleNope}
              onSwipedRight={handleYup}
              onSwipedTop={handleReturn}
              disableBottomSwipe={true}
              goBackToPreviousCardOnSwipeTop={true}
              overlayLabels={{
                left: {
                  element: (
                    <Icon name="closecircle" size={160} color="#ff1111" />
                  ),
                  title: 'NOPE',
                  style: {
                    label: {
                      backgroundColor: 'black',
                      borderColor: 'black',
                      color: 'white',
                      borderWidth: 1,
                    },
                    wrapper: {
                      flexDirection: 'column',
                      alignItems: 'flex-end',
                      justifyContent: 'flex-start',
                      marginTop: 30,
                      marginLeft: 160,
                    },
                  },
                },
                right: {
                  element: <Icon name="like1" size={160} color="#1111ff" />,
                  title: 'LIKE',
                  style: {
                    label: {
                      backgroundColor: 'black',
                      borderColor: 'black',
                      color: 'white',
                      borderWidth: 9,
                    },
                    wrapper: {
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                      justifyContent: 'flex-start',
                      marginTop: 30,
                      marginLeft: -160,
                    },
                  },
                },
                top: {
                  title: 'VOLTAR',
                  style: {
                    label: {
                      backgroundColor: 'black',
                      borderColor: 'black',
                      color: 'white',
                      borderWidth: 1,
                    },
                    wrapper: {
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginTop: 160,
                    },
                  },
                },
              }}
              animateOverlayLabelsOpacity
              animateCardOpacity
            />
          ) : null}
          {modalVisibilityInfo1 || modalVisibilityInfo2 || startCheck ? (
            <View
              style={{
                borderRadius: 30,
                position: 'absolute',
                top: 10,
                alignSelf: 'center',
              }}>
              <Icon
                name="reload1"
                size={60}
                color="#aaaaaa"
                style={{
                  transform: [{ rotateY: '180deg' }, { rotateZ: '80deg' }],
                }}
              />
            </View>
          ) : null}
          {modalVisibilityInfo1 || modalVisibilityInfo2 || startCheck ? (
            <View
              style={{
                width: vw,
                flexDirection: 'row',
                borderRadius: 30,
                position: 'absolute',
                bottom: 10,
              }}>
              <View style={{ left: 10 }}>
                <TouchableOpacity onPress={() => { }}>
                  <Icon name="closecircle" size={60} color="#ff1111" />
                </TouchableOpacity>
              </View>
              <View style={{ position: 'absolute', right: 10 }}>
                <TouchableOpacity onPress={() => { }}>
                  <Icon name="like1" size={60} color="#1111ff" />
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <ActionButton buttonColor={colors.s_}>
              {typesCheckList.map(type => (
                <ActionButton.Item
                  size={34}
                  buttonColor={colors.p_dark}
                  title={type.desc}
                  onPress={() => {
                    console.log(type)
                    setModalVisibilityInfo1(true);
                    setTipoOsId(type.id);
                    buscarVeiculos(type.id);
                  }}>
                  <Icon
                    name={
                      type.desc === 'Entrada'
                        ? 'login'
                        : type.desc === 'Saída'
                          ? 'logout'
                          : 'form'
                    }
                    color={colors.white}
                  />
                </ActionButton.Item>
              ))}
            </ActionButton>
          )}
        </View>
      </View>
      {/* Send To Checklist */}
      <Modal
        visible={
          modalVisibilityEnvio && !modalVisibilityL1 && !modalVisibilityL2
        }
        transparent>
        <View style={[styles.centeredView]}>
          <View style={[styles.modalView, { backgroundColor: colors.s_light }]}>
            <Icon name="check" size={160} color={colors.p_dark} />
            <Text style={styles.modalText}>Checklist Enviado</Text>
            <View style={{ flexDirection: 'row' }}>
              <TouchableHighlight
                style={{
                  ...styles.openButton,
                  backgroundColor: colors.p_,
                  margin: 8,
                }}
                onPress={() => {
                  enviarChecklist();
                  setModalVisibilityEnvio(false);
                }}>
                <Text style={styles.textStyle}>Ok</Text>
              </TouchableHighlight>
            </View>
          </View>
        </View>
      </Modal>
      {/* Modal sim e não */}
      <Modal animationType="slide" visible={modalVisibilityL1} transparent>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>
              {otherQuestion ? 'Deseja tirar uma foto?' : 'Aplicavel?'}
            </Text>
            <View style={{ flexDirection: 'row' }}>
              <TouchableHighlight
                style={{
                  ...styles.openButton,
                  backgroundColor: colors.s_,
                  margin: 8,
                }}
                onPress={() => {
                  if (howOptionSelected === 'yeep') {
                    checklist.push({
                      id: cards[currentCard].id,
                      state: true,
                      obs: obs,
                      foto: foto ? foto : '',
                    });
                  } else if (howOptionSelected === 'nope') {
                    checklist.push({
                      id: cards[currentCard].id,
                      state: false,
                      obs: obs,
                      foto: foto ? foto : '',
                    });
                  } else {
                    checklist.push({
                      id: cards[currentCard].id,
                      state: null,
                      obs: obs,
                      foto: foto ? foto : '',
                    });
                  }
                  console.log(checklist);
                  setModalVisibilityL1(false);
                }}>
                <Text style={styles.textStyle}>Não</Text>
              </TouchableHighlight>
              <TouchableHighlight
                style={{
                  ...styles.openButton,
                  backgroundColor: colors.s_,
                  margin: 8,
                }}
                onPress={() => {
                  setModalVisibilityL1(false);
                  setModalVisibilityL2(true);
                }}>
                <Text style={styles.textStyle}>Sim</Text>
              </TouchableHighlight>
            </View>
          </View>
        </View>
      </Modal>
      {/* Modal photo */}
      <Modal animationType="slide" visible={modalVisibilityL2} transparent>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            {!yeep && <Text style={styles.modalText}>Item Irregular!</Text>}
            {/* <Text style={styles.modalSubtext}>Deseja tirar uma foto?</Text> */}
            <TouchableOpacity
              onPress={() => {
                launchCamera(
                  {
                    mediaType: 'photo',
                    includeBase64: true,
                    maxHeight: 200,
                    maxWidth: 200,
                  },
                  response => {
                    setFoto(response.base64 || '');
                  },
                );
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  alignContent: 'center',
                }}>
                <Text
                  style={{
                    marginRight: 8,
                    fontSize: 18,
                    color: colors.p_dark,
                    fontWeight: 'bold',
                  }}>
                  Tirar Foto
                </Text>
                <Icon name="camera" size={50} color={colors.p_light} />
              </View>
            </TouchableOpacity>
            {!yeep && (
              <TextInput
                placeholder="Adcionar observação?"
                value={obs}
                onChangeText={setObs}
                placeholderTextColor={colors.white}
                selectionColor={colors.green}
                autoCapitalize="sentences"
                keyboardType="default"
                returnKeyType="go"
                autoCorrect={false}
                blurOnSubmit={true}
                multiline={true}
                style={[styles.input]}
              />
            )}
            <View style={{ flexDirection: 'row' }}>
              <TouchableHighlight
                style={{
                  ...styles.openButton,
                  backgroundColor: colors.s_,
                  marginTop: 20,
                }}
                onPress={() => {
                  if (cards[currentCard].desc !== 'OUTROS') {
                    if (howOptionSelected === 'yeep') {
                      checklist.push({
                        id: cards[currentCard].id,
                        state: true,
                        obs: obs,
                        foto: foto ? foto : '',
                      });
                    } else if (howOptionSelected === 'nope') {
                      checklist.push({
                        id: cards[currentCard].id,
                        state: false,
                        obs: obs,
                        foto: foto ? foto : '',
                      });
                    } else {
                      checklist.push({
                        id: cards[currentCard].id,
                        state: null,
                        obs: obs,
                        foto: foto ? foto : '',
                      });
                    }
                  }
                  setFoto(null);
                  console.log(checklist);
                  setModalVisibilityL2(false);
                  setObs('');
                }}>
                <Text style={styles.textStyle}>Continuar</Text>
              </TouchableHighlight>
            </View>
          </View>
        </View>
      </Modal>
      {/* Modal de uma lista de carros  */}
      <Modal
        visible={modalVisibilityInfo1}
        onRequestClose={() => {
          setModalVisibilityInfo1(false);
        }}
        transparent>
        <View style={styles.centeredView}>
          <View style={[styles.modalView, { height: vh / 1.8, width: vw / 1.2 }]}>
            <Text style={styles.modalText}>Criar OS</Text>
            <Autocomplete
              placeholder="Ativo"
              placeholderTextColor={colors.white}
              autoCapitalize="none"
              autoCorrect={false}
              style={styles.input}
              inputContainerStyle={[styles.autocomplete]}
              listContainerStyle={[styles.options_autocomplete]}
              listStyle={{
                backgroundColor: 'transparent',
                borderColor: 'transparent',
              }}
              data={
                listaCar.length === 1 && comp(veiculo, listaCar[0].description)
                  ? []
                  : listaCar
              }
              defaultValue={veiculo}
              onChangeText={veiculo => {
                setVeiculo(veiculo);
                setListaCar(findCar(veiculo));
              }}
              flatListProps={{
                keyExtractor: (_, idx) => `${idx}`,
                renderItem: ({ item }) => (
                  <TouchableOpacity
                    onPress={() => {
                      setVeiculo(item.description);
                      setVeiculoId(item.id);
                      receiveCard(item.id, tipoOsId);
                    }}>
                    <Text>{item.description}</Text>
                  </TouchableOpacity>
                ),
              }}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => {
                    setVeiculo(item.description);
                    setVeiculoId(item.id);
                    receiveCard(item.id, tipoOsId);
                    console.log(item.id);
                  }}>
                  <Text>{item.description}</Text>
                </TouchableOpacity>
              )}
            />
            <View style={{ flexDirection: 'row' }}>
              <TouchableHighlight
                style={{
                  ...styles.openButton,
                  backgroundColor: colors.s_,
                  margin: 8,
                }}
                onPress={() => {
                  if (veiculoId != '') {
                    setModalVisibilityInfo1(false);
                    setModalVisibilityInfo2(true);
                  }
                  // setStartCheck(true);
                }}>
                <Text style={styles.textStyle}>Continuar</Text>
              </TouchableHighlight>
            </View>
          </View>
        </View>
      </Modal>

      {/* Odômetro e Horímetro */}
      <Modal
        visible={modalVisibilityInfo2}
        onRequestClose={() => {
          setModalVisibilityInfo2(false);
        }}
        transparent>
        <View style={styles.centeredView}>
          <View style={[styles.modalView]}>
            <Text style={styles.modalText}>Registre</Text>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                alignContent: 'center',
              }}>
              <Text
                style={{
                  marginRight: 8,
                  fontSize: 18,
                  color: colors.p_dark,
                  fontWeight: 'bold',
                }}>
                {' '}
                Odómetro
              </Text>
              <TextInput
                placeholder="Digite"
                value={odometro}
                onChangeText={setOdometro}
                placeholderTextColor={colors.white}
                selectionColor={colors.green}
                autoCapitalize="sentences"
                keyboardType="numeric"
                returnKeyType="go"
                autoCorrect={false}
                blurOnSubmit={true}
                multiline={true}
                style={[styles.input, { width: vw / 3 }]}
              />
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                alignContent: 'center',
              }}>
              <Text
                style={{
                  marginRight: 8,
                  fontSize: 18,
                  color: colors.p_dark,
                  fontWeight: 'bold',
                }}>
                {' '}
                Horímetro
              </Text>
              <TextInput
                placeholder="Digite"
                value={horimetro}
                onChangeText={setHorimetro}
                placeholderTextColor={colors.white}
                selectionColor={colors.green}
                autoCapitalize="sentences"
                keyboardType="numeric"
                returnKeyType="go"
                autoCorrect={false}
                blurOnSubmit={true}
                multiline={true}
                style={[styles.input, { width: vw / 3 }]}
              />
            </View>

            <View style={{ flexDirection: 'row' }}>
              <TouchableHighlight
                style={{
                  ...styles.openButton,
                  backgroundColor: colors.s_,
                  margin: 8,
                }}
                onPress={() => {
                  setModalVisibilityInfo2(false);
                  setStartCheck(true);
                }}>
                <Text style={styles.textStyle}>Continuar</Text>
              </TouchableHighlight>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default Main;
