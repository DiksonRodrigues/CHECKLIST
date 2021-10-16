import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import Main from '../pages/Main';

const AppStack = createStackNavigator();

const Routes: React.FC = () => (
  <AppStack.Navigator
    screenOptions={{
      headerShown: false,
    }}>
    <AppStack.Screen name="Main" component={Main} />
  </AppStack.Navigator>
);

export default Routes;
