import { BrowserRouter } from "react-router-dom";
import React from 'react';
import { createRoot } from 'react-dom/client';
import { IntlProvider } from "react-intl";

import './index.css';
import App from './App';

import messages_en from "./translations/en.json";

const messages = {
  'en': messages_en,
};

// get browser language without the region code
const language = navigator.language.split(/[-_]/)[0];

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<BrowserRouter>
  <IntlProvider locale='en' defaultLocale="en" messages={messages[language]}>
    <App />
  </IntlProvider>
</BrowserRouter>);