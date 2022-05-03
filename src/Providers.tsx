import React, { useState } from 'react'
import { ModalProvider } from 'uikit'
import { createWeb3ReactRoot, Web3ReactProvider } from '@web3-react/core'
import { HelmetProvider } from 'react-helmet-async'
import { Provider } from 'react-redux'
import { getLibrary, getLibrarySwap } from 'utils/web3React'
import { ThemeContextProvider } from 'contexts/ThemeContext'
import { LanguageProvider } from 'contexts/Localization'
import { RefreshContextProvider } from 'contexts/RefreshContext'
import { ToastsProvider } from 'contexts/ToastsContext'
import store from 'state'
import { ApolloProvider } from 'react-apollo'
import { MoralisProvider } from 'react-moralis'
import { QueryClientProvider, QueryClient } from 'react-query'
import { NetworkContextName, MORALIS_APP_ID, MORALIS_SERVER_URL } from './config'

// import { client } from './views/Analytics/apollo/client'
// import LocalStorageContextProvider, { Updater as LocalStorageContextUpdater } from './contexts/Analytics/LocalStorage'
// import ApplicationContextProvider from './contexts/Analytics/Application'
// import TokenDataContextProvider, { Updater as TokenDataContextUpdater } from './contexts/Analytics/TokenData'
// import GlobalDataContextProvider from './contexts/Analytics/GlobalData'
// import PairDataContextProvider, { Updater as PairDataContextUpdater } from './contexts/Analytics/PairData'
// import UserContextProvider from './contexts/Analytics/User'

const Web3ProviderNetwork = createWeb3ReactRoot(NetworkContextName)

const Providers: React.FC = ({ children }) => {
  const [queryClient] = useState(() => new QueryClient())
  return (
    /*     <ApolloProvider client={client}> */
    <Web3ReactProvider getLibrary={getLibrarySwap}>
      <Web3ProviderNetwork getLibrary={getLibrarySwap}>
        <MoralisProvider appId={MORALIS_APP_ID} serverUrl={MORALIS_SERVER_URL}>
          <Provider store={store}>
            <QueryClientProvider client={queryClient}>
              <ToastsProvider>
                <HelmetProvider>
                  <ThemeContextProvider>
                    <LanguageProvider>
                      <RefreshContextProvider>
                        {/*   <LocalStorageContextProvider>
                        <ApplicationContextProvider>
                          <TokenDataContextProvider>
                            <GlobalDataContextProvider>
                              <PairDataContextProvider>
                                <UserContextProvider> */}
                        <ModalProvider>{children}</ModalProvider>
                        {/*  </UserContextProvider>
                              </PairDataContextProvider>
                            </GlobalDataContextProvider>
                          </TokenDataContextProvider>
                        </ApplicationContextProvider>
                      </LocalStorageContextProvider> */}
                      </RefreshContextProvider>
                    </LanguageProvider>
                  </ThemeContextProvider>
                </HelmetProvider>
              </ToastsProvider>
            </QueryClientProvider>
          </Provider>
        </MoralisProvider>
      </Web3ProviderNetwork>
    </Web3ReactProvider>
    /*     </ApolloProvider> */
  )
}

export default Providers
