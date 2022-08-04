import Head from "next/head";
import Image from "next/image";
import { Box, Container, Heading } from "@chakra-ui/react";

export default function Home() {
  return (
    <Box>
      <Container maxW="container.sm" mt="4em">
        <Heading as="h1" size="4xl">
          NFT Battle
        </Heading>
      </Container>
    </Box>
  );
}
