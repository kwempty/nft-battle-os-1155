import { useNetwork, useAccount } from 'wagmi'
import { useState, useEffect, useMemo } from 'react'
import { Box, Text, Badge, UnorderedList } from '@chakra-ui/react'
import { NotAllowedIcon } from '@chakra-ui/icons'
import { getContractAddress } from '../utils/contractAddress'
import { detectedTokenIds } from '../utils/tokenIds'
import { useHas1155Token } from '../hooks'
import { TokenDisplay } from '../components'

export const Erc1155Balance = () => {
  const [ownedTokens, setOwnedTokens] = useState([0])
  const { chain } = useNetwork()
  const { address, isConnected } = useAccount()
  const erc1155Contract = getContractAddress({
    name: 'erc1155Contract',
    chainId: chain?.id
  })

  let addresses = [address]
  while (addresses.length < detectedTokenIds.length) addresses.push(address)
  const { balances, isError, error } = useHas1155Token(
    erc1155Contract,
    addresses,
    detectedTokenIds.map((e) => e.tokenId)
  )

  useEffect(() => {
    if (balances === undefined) return
    let tokens = []
    balances.map((e) => {
      tokens.push(e.gt(0))
    })
    let tokenList = []
    tokens.map((e, i) => {
      if (e === true) tokenList.push(detectedTokenIds[i])
    })
    setOwnedTokens(tokenList)
  }, [balances])

  if (!isConnected) return <></>
  if (isError)
    return (
      <>
        <div>Error fetching Battle NFTs</div>
        {JSON.stringify(error)}
      </>
    )
  return (
    <Box mt="1em">
      {ownedTokens.length > 0 ? (
        <>
          <Text>{ownedTokens.length} tokens owned:</Text>
          <UnorderedList>
            {ownedTokens.map((token, i) => {
              return <TokenDisplay key={i} token={token} />
            })}
          </UnorderedList>
        </>
      ) : (
        <Text>
          <Badge colorScheme="red">
            <NotAllowedIcon></NotAllowedIcon> No tokens owned
          </Badge>
        </Text>
      )}
    </Box>
  )
}
