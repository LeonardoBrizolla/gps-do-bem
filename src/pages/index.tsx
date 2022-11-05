import type { GetServerSideProps, NextPage } from "next";
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
  Link,
  Text,
  useTheme,
} from "@chakra-ui/react";
import { FiLock, FiUser } from "react-icons/fi";
import { FaGoogle } from "react-icons/fa";
import Head from "next/head";
import { signIn, getSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useRouter } from "next/router";
import LinkNext from "next/link";

interface PageStateProps {
  error: string;
  processing: boolean;
}

const Home: NextPage = () => {
  const router = useRouter();
  const theme = useTheme();
  const { register, handleSubmit } = useForm();
  const [pageState, setPageState] = useState<PageStateProps>({
    error: "",
    processing: false,
  });

  function simplifyError(error: string) {
    const errorMap: any = {
      CredentialsSignin: "E-mail ou senha inválidos",
    };
    return errorMap[error] ?? "Algo deu errado";
  }

  async function handleSignIn(data: any) {
    setPageState((old) => ({ ...old, processing: true, error: "" }));

    await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
      callbackUrl: `${window.location.origin}/home`,
    })
      .then((res: any) => {
        if (res?.ok) {
          setPageState((old) => ({
            ...old,
            processing: false,
          }));

          router.push(res.url);
        } else {
          setPageState((old) => ({
            ...old,
            processing: false,
            error: res.error ?? "Algo deu errado",
          }));
        }
      })
      .catch((err) => {
        setPageState((old) => ({
          ...old,
          processing: false,
          error: err.error ?? "Algo deu errado",
        }));
      });
  }

  return (
    <>
      <Head>
        <title>Login | GPS do Bem</title>
      </Head>
      <Flex
        width="100%"
        height="100vh"
        alignItems="center"
        justifyContent="center"
      >
        <form onSubmit={handleSubmit(handleSignIn)}>
          <Box width="528px" bg="#202024" padding={10} borderRadius={10}>
            <Text
              color="gray.100"
              fontSize="xxx-large"
              textAlign="center"
              fontFamily="heading"
              fontWeight={600}
              marginBottom="2rem"
            >
              GPS DO BEM
            </Text>

            <InputGroup>
              <InputLeftElement pointerEvents="none">
                <FiUser color={theme.colors.gray["500"]} />
              </InputLeftElement>
              <Input
                {...register("email")}
                name="email"
                placeholder="Email"
                marginBottom="1rem"
                borderColor="gray.700"
                backgroundColor="gray.700"
                color="gray.100"
                isRequired
              />
            </InputGroup>
            <InputGroup>
              <InputLeftElement pointerEvents="none">
                <FiLock color={theme.colors.gray["500"]} />
              </InputLeftElement>
              <Input
                {...register("password")}
                name="password"
                placeholder="Senha"
                borderColor="gray.700"
                backgroundColor="gray.700"
                color="gray.100"
                type="password"
                isRequired
              />
            </InputGroup>

            <Flex direction="column" alignItems="center">
              {pageState.error !== "" && (
                <Alert status="error" marginTop="2rem">
                  <AlertIcon />
                  <AlertTitle>Alerta:</AlertTitle>
                  <AlertDescription>
                    {simplifyError(pageState.error)}
                  </AlertDescription>
                </Alert>
              )}
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

              <LinkNext href="/signup">
                <Link color="gray.100">
                  Não tem uma conta?
                  <Text as="span" color="secondary.500">
                    {" "}
                    Registre-se
                  </Text>
                </Link>
              </LinkNext>
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
        permanent: false,
      },
    };
  }

  return {
    props: {
      session,
    },
  };
};

export default Home;
