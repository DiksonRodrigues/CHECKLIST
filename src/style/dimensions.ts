import {Dimensions} from 'react-native';

const dimensions = {
  vw: Dimensions.get('screen').width,
  ww: Dimensions.get('window').width,
  vh: Dimensions.get('screen').height,
  wh: Dimensions.get('window').height,
  ss: Dimensions.get('window').width <= 360,
  xs: Dimensions.get('window').width <= 320,
};

export default dimensions;
