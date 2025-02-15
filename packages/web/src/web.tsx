import './common.css';

import { createRoot } from 'react-dom/client';

import { Web } from './app/Web';

const element = document.getElementById('app');
if (element) {
  createRoot(element).render(<Web />);
}
