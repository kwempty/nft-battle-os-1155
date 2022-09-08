import { useNetwork, useAccount } from 'wagmi'
import { useState, useEffect, useMemo } from 'react'
import { Box, Text, Badge, UnorderedList } from '@chakra-ui/react'
import { NotAllowedIcon } from '@chakra-ui/icons'
import { useHas1155Token } from '../hooks'
import { getContractAddress } from '../utils/contractAddress'
import { TokenDisplay } from '../components'

export const Erc1155Balance = () => {
  const [ownedTokens, setOwnedTokens] = useState([0])
  const { chain } = useNetwork()
  const { address, isConnected } = useAccount()
  const erc1155Contract = getContractAddress({
    name: 'erc1155Contract',
    chainId: chain?.id
  })
  const tokenIds = useMemo(
    () => [
      // uri: https://api.opensea.io/api/v2/metadata/matic/0x2953399124F0cBB46d2CbACD8A89cF0599974963/0x + hex(id)
      // https://api.opensea.io/api/v2/metadata/matic/0x2953399124F0cBB46d2CbACD8A89cF0599974963/0x940148C721C7A0FF2F28668D56E52A8D3DD6832B000000000000080000000001
      '102942637473818750245512684055117078419849759823500598888050169431684317970433',
      '66944570731711987735845020825364593806926065595037873500763412727051124211713',
      '57920695457072532059112617018159441295166854042840448471990454514830664531969'
    ],
    []
  )
  const tokenNames = useMemo(() => ['Mari', 'Village', 'Skull'], [])

  let addresses = [address]
  while (addresses.length < tokenIds.length) addresses.push(address)
  const { balances, isError, error } = useHas1155Token(
    erc1155Contract,
    addresses,
    tokenIds
  )

  useEffect(() => {
    if (balances === undefined) return
    let tokens = []
    balances.map((e) => {
      tokens.push(e.gt(0))
    })
    let tokenList = []
    tokens.map((e, i) => {
      if (e === true) tokenList.push({ name: tokenNames[i], id: tokenIds[i] })
    })
    setOwnedTokens(tokenList)
  }, [balances, tokenIds, tokenNames])

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
