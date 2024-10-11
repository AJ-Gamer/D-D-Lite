import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { createRoot } from 'react-dom/client';
import { ChakraProvider } from '@chakra-ui/react';
import App from './components/App';

const $root = document.getElementById('root');
if ($root) {
  const root = createRoot($root);
  root.render(
    <ChakraProvider>
      <Router>
        <App />
      </Router>
    </ChakraProvider>,
  );
} else {
  throw new Error('Element root not found.');
}
