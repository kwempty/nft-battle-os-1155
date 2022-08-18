import { useContractRead } from 'wagmi'
import erc1155Contract from '../utils/abis/erc1155Contract.json'

export const useHas1155Token = (contract, owner, tokenId) => {
  const {
    data: balanceOf,
    isError,
    error
  } = useContractRead({
    addressOrName: contract,
    contractInterface: erc1155Contract,
    functionName: "balanceOf",
    args: [owner, tokenId],
  });

  return {
    balanceOf,
    hasNft: balanceOf?.gt(0),
    isError,
    error
  }
}
