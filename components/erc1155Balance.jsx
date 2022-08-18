import { getContractAddress } from '../utils/contractAddress'
import { useNetwork, useAccount } from 'wagmi'
import { useHas1155Token } from '../hooks/has1155Token'
import { useState, useEffect } from 'react'
import { Box, Text, Badge, ListItem, UnorderedList } from '@chakra-ui/react'
import { CheckIcon, NotAllowedIcon } from '@chakra-ui/icons'

export const Erc1155Balance = () => {
  const [ownedTokens, setOwnedTokens] = useState([0])
  const { chain } = useNetwork()
  const { address, isConnected } = useAccount()
  const erc1155Contract = getContractAddress({
    name: 'erc1155Contract',
    chainId: chain?.id
  })
  const tokenIds = [
    '66944570731711987735845020825364593806926065595037873500763412727051124211713',
    '89863914919801430517959213592055400710389243750546056901808860984226390999047',
    '28583945730878618704816541677749661839032078384876779106450920615411361775622'
  ]
  const tokenNames = ['Village', 'Music', 'kusa']
  let addresses = [address]
  while (addresses.length < tokenIds.length) addresses.push(address)
  const { balances, isError, error } = useHas1155Token(
    erc1155Contract,
    addresses,
    tokenIds
  )
  useEffect(() => {
    let tokens = []
    balances.map((e) => {
      tokens.push(e.gt(0))
    })
    let tokenList = []
    tokens.map((e, i) => {
      if (e === true) tokenList.push({ name: tokenNames[i], id: tokenIds[i] })
    })
    setOwnedTokens(tokenList)
    console.log(tokenList)
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
            {ownedTokens.map((e, i) => {
              return (
                <ListItem key={i}>
                  <Badge colorScheme="green" mr="0.5em">
                    <CheckIcon></CheckIcon> {e.name}
                  </Badge>
                </ListItem>
              )
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
