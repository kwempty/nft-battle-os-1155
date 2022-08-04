import { Box, Container, Heading } from "@chakra-ui/react";
import { useAccount } from "wagmi";
import { Account, Connect } from "../components";
import { useMounted } from "../hooks";

export default function Home() {
  const isMounted = useMounted();
  const { isConnected } = useAccount();

  return (
    <Box>
      <Container maxW="container.sm" mt="4em">
        <Heading as="h1" size="4xl">
          NFT Battle
        </Heading>
        <Box>
          {isMounted && <Connect />}

          {isMounted && isConnected && (
            <>
              <Account />
            </>
          )}
        </Box>
      </Container>
    </Box>
  );
}
