import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App'
import { ChakraProvider } from '@chakra-ui/react'
import { Provider } from 'react-redux'
import store from '../src/Store/store'
import { ColorModeScript } from '@chakra-ui/react'
import theme from './theme'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <Provider store={store}>
        <ColorModeScript initialColorMode={theme.config.initialColorMode} />
        <App />
      </Provider>
    </ChakraProvider>
  </React.StrictMode>
);
