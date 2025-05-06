/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {Provider} from 'react-redux';
import Store from './Store';
import Navigation from './src/navigation/navigation';

function App() {
  return (
    <>
      <Provider store={Store}>
        <Navigation />
      </Provider>
    </>
  );
}

export default App;
