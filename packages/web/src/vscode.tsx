import './common.css';

import { createRoot } from 'react-dom/client';

import { VSCode } from './app/VSCode';

const element = document.getElementById('app');
if (element) {
  createRoot(element).render(<VSCode />);
}
