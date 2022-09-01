import { useContractRead } from 'wagmi'
import erc1155Contract from '../utils/abis/erc1155Contract.json'

export const useTemplateURI = (contract) => {
  const {
    data: templateURI,
    isError,
    error
  } = useContractRead({
    addressOrName: contract,
    contractInterface: erc1155Contract,
    functionName: 'templateURI'
  })

  return {
    templateURI,
    templateUriIsError: isError,
    templateUriError: error
  }
}
