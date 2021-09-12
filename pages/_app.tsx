import React from 'react';

import axios from 'axios';
import type { AppProps } from 'next/app';
import { QueryClient, QueryClientProvider } from 'react-query';

import '../styles/globals.css';
import 'semantic-ui-css/semantic.min.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: async (queryKey) => {
        return axios.get(queryKey.queryKey[0] as string);
      },
    },
  },
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <Component {...pageProps} />
    </QueryClientProvider>
  );
}
export default MyApp;
