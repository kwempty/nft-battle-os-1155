import { getContractAddress } from '../utils/contractAddress'
import { useNetwork, useAccount } from 'wagmi'
import { useHas1155Token } from '../hooks/has1155Token'
import { Badge } from '@chakra-ui/react'
import { CheckIcon, NotAllowedIcon } from '@chakra-ui/icons'

export const Erc1155Balance = () => {
  const { chain } = useNetwork()
  const { address, isConnected } = useAccount()
  const erc1155Contract = getContractAddress({
    name: 'erc1155Contract',
    chainId: chain?.id
  })
  const tokenId =
    '66944570731711987735845020825364593806926065595037873500763412727051124211713'
  const { hasNft, isError, error } = useHas1155Token(erc1155Contract, address, tokenId)

  if (!isConnected) return <></>
  if (isError)
    return (
      <>
        <div>Error fetching Battle NFTs</div>
        {JSON.stringify(error)}
      </>
    )
  return (
    <>
      {hasNft ? (
        <>
          <Badge colorScheme="green">
            <CheckIcon></CheckIcon>
          </Badge>
          You are a Battle NFT holder
        </>
      ) : (
        <>
          <Badge colorScheme="red">
            <NotAllowedIcon></NotAllowedIcon>
          </Badge>
          You do not own any Battle NFTs
        </>
      )}
    </>
  )
}
