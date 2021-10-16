import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import LogIn from '../pages/LogIn';

const AuthStack = createStackNavigator();

const Routes: React.FC = () => (
  <AuthStack.Navigator
    screenOptions={{
      headerShown: false,
    }}>
    <AuthStack.Screen name="Log In" component={LogIn} />
  </AuthStack.Navigator>
);

export default Routes;
