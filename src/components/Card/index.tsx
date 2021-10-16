import React, {useState} from 'react';
import {Modal, Text, TextInput, TouchableOpacity, View} from 'react-native';
import {styles} from './styles';
import dimensions from '../../style/dimensions';
import colors from '../../style/colors';
import Icon from 'react-native-vector-icons/AntDesign';
import {CardDTO} from './dto/card.dto';
import {launchCamera} from 'react-native-image-picker';

const Card = ({data, index, tamanho, checklist}: CardDTO) => {
  const {vh, vw} = dimensions;

  const [observations, setObservations] = useState<
    Array<{desc: string; state: boolean; foto: string | undefined}>
  >([{desc: '', state: false, foto: ''}]);
  const [observationText, setObservationText] = useState<string>('');
  const [modalVisibility, setModalVisibility] = useState(false);
  const [photo, setPhoto] = useState<string | undefined>(undefined);

  const enviarOthers = () => {
    checklist.push(...observations);
  };

  return (
    <View>
      <Modal
        onRequestClose={() => setModalVisibility(false)}
        animationType="slide"
        visible={modalVisibility}
        transparent>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={styles.buttonPlusInput}>
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
                      setPhoto(response.base64);
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
                    Tirar Foto para esse observação
                  </Text>
                  <Icon name="camera" size={50} color={colors.p_light} />
                </View>
              </TouchableOpacity>
              <View style={styles.addNewObservation}>
                <TextInput
                  placeholder="Adcionar observação?"
                  value={observationText}
                  onChangeText={setObservationText}
                  placeholderTextColor={colors.white}
                  selectionColor={colors.green}
                  autoCapitalize="sentences"
                  keyboardType="default"
                  returnKeyType="go"
                  autoCorrect={false}
                  blurOnSubmit={true}
                  multiline={true}
                  style={styles.input}
                />
                <TouchableOpacity
                  style={styles.addButton}
                  onPress={() => {
                    if (observationText !== '') {
                      if (observations[0].desc !== '') {
                        setObservations([
                          ...observations,
                          {desc: observationText, foto: photo, state: false},
                        ]);
                      } else {
                        setObservations([
                          {desc: observationText, foto: photo, state: false},
                        ]);
                      }
                      setPhoto(undefined);
                      setObservationText('');
                    }
                  }}>
                  <Icon name="pluscircleo" size={40} color={colors.p_light} />
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.observationsContainer}>
              <Text style={styles.observations}>Observações:</Text>
            </View>
            {observations.map((observation, index) => (
              <View style={styles.observationsOptions} key={index}>
                <View style={styles.observationsTextContainer}>
                  <Text style={styles.observationsText}>
                    {observation.desc}
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.observationsDelete}
                  onPress={() => {
                    observations.splice(index, 1);
                  }}>
                  <Icon name="delete" size={20} color={colors.red} />
                </TouchableOpacity>
              </View>
            ))}
            <TouchableOpacity
              style={{
                ...styles.openButton,
                backgroundColor: colors.p_,
                margin: 8,
              }}
              onPress={() => {
                enviarOthers();
                setModalVisibility(false);
              }}>
              <Text style={styles.textStyle}>Sim</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                ...styles.openButton,
                backgroundColor: colors.p_,
                margin: 8,
              }}
              onPress={() => {
                setModalVisibility(false);
              }}>
              <Text style={styles.textStyle}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {data.id ? (
        <View
          style={[
            styles.card,
            {
              backgroundColor: colors.s_,
              width: vw / 1.2,
              height: vh / 2,
              elevation: 8,
              justifyContent: 'center',
              alignItems: 'center',
              margin: 20,
            },
          ]}>
          <View style={{marginBottom: 16}}>
            <Text
              style={{
                fontSize: 14,
                textAlign: 'center',
              }}>{`${index + 1} de ${tamanho}`}</Text>
          </View>
          <View
            style={[
              styles.card,
              {
                justifyContent: 'center',
                alignItems: 'center',
              },
            ]}>
            <Text
              style={{
                fontSize: 20,
                textAlign: 'center',
              }}>
              {data.desc}
            </Text>
          </View>
          {data.desc === 'OUTROS' && (
            <View>
              <TouchableOpacity
                style={{
                  backgroundColor: '#fff',
                  borderRadius: 20,
                  padding: 10,
                }}
                onPress={() => {
                  setModalVisibility(true);
                }}>
                <Text
                  style={{
                    color: '#666',
                  }}>
                  Adicionar Observações
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      ) : (
        <View
          style={[
            styles.card,
            {
              backgroundColor: colors.s_,
              width: vw / 1.2,
              height: vh / 2,
              elevation: 8,
              justifyContent: 'center',
              alignItems: 'center',
            },
          ]}>
          <View style={{marginBottom: 16}}>
            <Icon name="check" size={160} color={colors.p_dark} />
          </View>
          <View
            style={[
              styles.card,
              {
                justifyContent: 'center',
                alignItems: 'center',
              },
            ]}>
            <Text
              style={{
                fontSize: 40,
                textAlign: 'center',
              }}>
              {data.desc}
            </Text>
          </View>
        </View>
      )}
    </View>
  );
};

export default Card;
