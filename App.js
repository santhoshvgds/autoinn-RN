import React, {useEffect} from 'react';
// import {Text} from 'react-native';
import {MenuProvider} from 'react-native-popup-menu';
import AppRouter from './src/routes/AppRouter';
import AsyncStorage from '@react-native-community/async-storage';

export default function App() {
  useEffect(() => {
    async function b() {
      try {
        await AsyncStorage.setItem('token', 'a');
        let a = await AsyncStorage.getItem('token');
        // console.log(a);
      } catch (error) {
        console.log(error);
      }
    }
    b();
  }, []);
  return (
    <MenuProvider>
      <AppRouter />
    </MenuProvider>
  );
}
