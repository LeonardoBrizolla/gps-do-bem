import type { GetServerSideProps, NextPage } from "next";
import {
  Box,
  Button,
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
  Link,
  Text,
  useTheme
} from "@chakra-ui/react";
import { FiLock, FiUser } from "react-icons/fi";
import { FaGoogle } from "react-icons/fa";
import Head from "next/head";
import { signIn, getSession } from "next-auth/react";

const Home: NextPage = () => {
  const theme = useTheme();

  return (
    <>
      <Head>
        <title>GPS do bem</title>
      </Head>
      <Flex
        width="100%"
        height="100vh"
        alignItems="center"
        justifyContent="center"
      >
        <form onSubmit={() => {}}>
          <Box width="428px">
            <Text
              color="gray.100"
              fontSize="xl"
              textAlign="center"
              fontFamily="heading"
              fontWeight={600}
              marginBottom="2rem"
            >
              Sign in to your account
            </Text>
            <InputGroup>
              <InputLeftElement pointerEvents="none">
                <FiUser color={theme.colors.gray["500"]} />
              </InputLeftElement>
              <Input
                placeholder="Email"
                marginBottom="1rem"
                borderColor="gray.700"
                backgroundColor="gray.700"
                color="gray.100"
              />
            </InputGroup>
            <InputGroup>
              <InputLeftElement pointerEvents="none">
                <FiLock color={theme.colors.gray["500"]} />
              </InputLeftElement>
              <Input
                placeholder="Senha"
                borderColor="gray.700"
                backgroundColor="gray.700"
                color="gray.100"
                type="password"
              />
            </InputGroup>

            <Flex direction="column" alignItems="center">
              <Button
                type="submit"
                marginTop="2rem"
                marginBottom="1rem"
                width="100%"
                backgroundColor="secondary.500"
                _hover={{ backgroundColor: "secondary.600" }}
              >
                Entrar
              </Button>
              <Link href="#" color="gray.100">
                Não tem uma conta?
                <Text as="span" color="secondary.500">
                  {" "}
                  Registre-se
                </Text>
              </Link>
            </Flex>

            <Flex marginTop="2rem" alignItems="center" justifyContent="center">
              <Text color="secondary.500" textAlign="center" marginRight="1rem">
                Ou entre com
              </Text>
              <Button
                backgroundColor="gray.600"
                leftIcon={<FaGoogle color={theme.colors.gray["100"]} />}
                color={theme.colors.gray["100"]}
                _hover={{ backgroundColor: "gray.700" }}
                onClick={() => signIn("google")}
              >
                Google
              </Button>
            </Flex>
          </Box>
        </form>
      </Flex>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);

  if (session) {
    return {
      redirect: {
        destination: "/home",
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

export default Home;
