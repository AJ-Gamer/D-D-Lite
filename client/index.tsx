import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './components/App';

const $root = document.getElementById('root');
if ($root) {
  const root = createRoot($root);
  root.render(<App />);
} else {
  throw new Error('Element root not found.');
}
