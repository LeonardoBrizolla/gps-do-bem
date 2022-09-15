import {
  Box,
  Button,
  useColorModeValue,
  Stack,
  Text,
  Heading,
  Container,
  Input
} from "@chakra-ui/react";
import { getSession } from "next-auth/react";
import { GetServerSideProps } from "next";
import { Header } from "../../components/Header";
import { Footer } from "../../components/Footer";

function handlePesquisaOng() {
  console.log("Hii Leo");
}

export default function Simple() {
  return (
    <>
      <Header />
      <Box p={4}>
        <Container maxW={"4xl"}>
          <Stack
            as={Box}
            textAlign={"center"}
            spacing={{ base: 8, md: 14 }}
            py={{ base: 20, md: 36 }}
          >
            <Heading
              color={"yellow.400"}
              fontWeight={600}
              fontSize={{ base: "2xl", sm: "4xl", md: "6xl" }}
              lineHeight={"110%"}
            >
              GPS DO BEM <br />
            </Heading>
            <Text color={"white"}>
              Procure no campo abaixo o nome da ONG desejada:
            </Text>
            <Stack
              direction={"column"}
              spacing={3}
              align={"center"}
              alignSelf={"center"}
              position={"relative"}
              onSubmit={() => handlePesquisaOng}
            >
              <Input
                type={"text"}
                placeholder={"Pesquisar ONG..."}
                color={useColorModeValue("gray.800", "gray.200")}
                bg={useColorModeValue("gray.100", "gray.600")}
                rounded={"base"}
                maxW={"xl"}
                w="auto"
                minW={"sm"}
                mb={3}
                size={"lg"}
                border={0}
                _focus={{
                  bg: useColorModeValue("gray.200", "gray.800"),
                  outline: "none"
                }}
              />
              <Button
                type="submit"
                colorScheme={"green"}
                bg={"green.400"}
                rounded={"full"}
                px={6}
                _hover={{
                  bg: "green.300"
                }}
              >
                Pesquisar
              </Button>
            </Stack>
          </Stack>
        </Container>
      </Box>
      <Footer />
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false
      }
    };
  }

  return {
    props: {
      session
    }
  };
};
