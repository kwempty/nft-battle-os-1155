import { useNetwork, useAccount } from 'wagmi'
import { useState, useEffect } from 'react'
import {
  Box,
  Text,
  Badge,
  ListItem,
  UnorderedList,
  Link
} from '@chakra-ui/react'
import { CheckIcon, NotAllowedIcon } from '@chakra-ui/icons'
import { useHas1155Token } from '../hooks/has1155Token'
import { useTemplateURI } from '../hooks/useTokenURI'
import { getContractAddress } from '../utils/contractAddress'

export const Erc1155Balance = () => {
  const [ownedTokens, setOwnedTokens] = useState([0])
  const [activeToken, setActiveToken] = useState({
    name: '',
    id: ''
  })
  const [tokenUri, setTokenUri] = useState('')
  const { chain } = useNetwork()
  const { address, isConnected } = useAccount()
  const erc1155Contract = getContractAddress({
    name: 'erc1155Contract',
    chainId: chain?.id
  })
  const tokenIds = [
    // uri: https://api.opensea.io/api/v2/metadata/matic/0x2953399124F0cBB46d2CbACD8A89cF0599974963/0x + hex(id)
    // https://api.opensea.io/api/v2/metadata/matic/0x2953399124F0cBB46d2CbACD8A89cF0599974963/0x940148C721C7A0FF2F28668D56E52A8D3DD6832B000000000000080000000001
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
  const { templateURI, templateUriIsError, templateUriError } =
    useTemplateURI(erc1155Contract)

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
    if (tokenList.length > 0) {
      setActiveToken(tokenList[0])
    }
  }, [balances])

  useEffect(() => {
    if (templateURI == '') return
    const idIndex = templateURI.indexOf('0x{id}')
    const hexTokenId = BigInt(activeToken.id).toString(16)
    setTokenUri(templateURI.substring(0, idIndex) + '0x' + hexTokenId)
  }, [templateURI])

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
          <Text>Active token:</Text>
          <Text>{JSON.stringify(activeToken)}</Text>
          <Text>Token URI:</Text>
          <Link href={tokenUri}>{tokenUri}</Link>
          {templateUriIsError && (
            <>
              <Text>Token URI template Error:</Text>
              <Text>{JSON.stringify(templateUriError)}</Text>
            </>
          )}
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
