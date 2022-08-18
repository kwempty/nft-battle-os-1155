import { ChakraProvider } from '@chakra-ui/react'
import { chain, WagmiConfig, createClient, configureChains } from 'wagmi'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { alchemyProvider } from 'wagmi/providers/alchemy'

const alchemyId = process.env.NEXT_PUBLIC_ALCHEMY_ID
const { chains, provider } = configureChains(
  [chain.mainnet, chain.polygon],
  [alchemyProvider({ alchemyId })]
)
const client = createClient({
  autoConnect: true,
  connectors: [new InjectedConnector({ chains })],
  provider
})

function MyApp({ Component, pageProps }) {
  return (
    <WagmiConfig client={client}>
      <ChakraProvider>
        <Component {...pageProps} />
      </ChakraProvider>
    </WagmiConfig>
  )
}

export default MyApp
