import { chainId } from "wagmi";

const contractAddress = {
  erc1155Contract: {
    [chainId.polygon]: "0x2953399124f0cbb46d2cbacd8a89cf0599974963",
  },
};

const defaultChainID = process.env.production
  ? chainId.polygon
  : chainId.polygon;

const getContractAddress = ({ name, chainId }) => {
  return contractAddress[name][chainId || defaultChainID];
};

export { contractAddress, defaultChainID, getContractAddress };
