"use client"

import {
  DynamicContextProvider,
} from "@dynamic-labs/sdk-react-core";
import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";
import { Provider as ReduxProvider } from 'react-redux'
import { store } from '@/store/store'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ReduxProvider store={store}>
      <DynamicContextProvider
        settings={{
          environmentId: "78799c32-9916-4f12-80b4-ae761ea75884",
          walletConnectors: [EthereumWalletConnectors],
        }}
      >
        {children}
      </DynamicContextProvider>
    </ReduxProvider>
  );
}


