import { BrowserRouter } from "react-router-dom";
import { createRoot } from 'react-dom/client';
import { IntlProvider } from "react-intl";
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';

import App from './App';

import messages_en from "./translations/en.json";

const client = new ApolloClient({
  uri: 'graphql',
  cache: new InMemoryCache(),
});

const messages = {
  'en': messages_en,
};

// get browser language without the region code
const language = navigator.language.split(/[-_]/)[0];

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<BrowserRouter>
  <IntlProvider locale='en' defaultLocale="en" messages={messages[language]}>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </IntlProvider>
</BrowserRouter>);