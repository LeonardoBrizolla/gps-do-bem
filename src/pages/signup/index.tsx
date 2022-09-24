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
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  useTheme
} from "@chakra-ui/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  FiLock,
  FiUser,
  FiMail,
  FiArrowLeft,
  FiBriefcase,
  FiTool
} from "react-icons/fi";
import api from "../../services/api";
import LinkNext from "next/link";

interface PageStateProps {
  error: string;
  processing: boolean;
  ok: boolean;
}

interface DataForm {
  email: string;
  name: string;
  services: string;
  password: string;
  confirmpassword: string;
}

function SignUp() {
  const { register, handleSubmit } = useForm();
  const { register: registerOng, handleSubmit: handleSubmitOng } = useForm();
  const theme = useTheme();
  const [pageState, setPageState] = useState<PageStateProps>({
    error: "",
    processing: false,
    ok: false
  });
  const router = useRouter();

  async function handleSignUpUser(data: any) {
    setPageState((old) => ({ ...old, processing: true, error: "", ok: false }));

    await api
      .post("/auth/register", {
        name: data.name,
        email: data.email,
        password: data.password,
        confirmpassword: data.confirmpassword,
        isOng: false
      })
      .then(function (response) {
        setPageState((old) => ({
          ...old,
          processing: false,
          error: "",
          ok: true
        }));

        if (response.status === 201) {
          setTimeout(() => {
            router.push("/");
          }, 3000);
        }
      })
      .catch(function (error) {
        console.log(error);
        setPageState((old) => ({
          ...old,
          error: error.response.data.msg,
          processing: false,
          ok: false
        }));
      });
  }

  async function handleSignUpOng(data: any) {
    setPageState((old) => ({ ...old, processing: true, error: "", ok: false }));

    await api
      .post("/auth/register", {
        name: data.name,
        email: data.email,
        service: data.service,
        password: data.password,
        confirmpassword: data.confirmpassword,
        isOng: true
      })
      .then(function (response) {
        setPageState((old) => ({
          ...old,
          processing: false,
          error: "",
          ok: true
        }));

        if (response.status === 201) {
          setTimeout(() => {
            router.push("/");
          }, 3000);
        }
      })
      .catch(function (error) {
        console.log(error);
        setPageState((old) => ({
          ...old,
          error: error.response.data.msg,
          processing: false,
          ok: false
        }));
      });
  }

  return (
    <>
      <Head>
        <title>Cadastro | Gps do Bem</title>
      </Head>

      <Flex
        width="100%"
        height="100vh"
        alignItems="center"
        justifyContent="center"
        flexDirection="column"
      >
        <Tabs variant="soft-rounded" colorScheme="teal">
          <TabList marginBottom={3} gap={1}>
            <Tab gap={2}>
              <FiUser color={theme.colors.gray["500"]} />
              Usuário
            </Tab>
            <Tab gap={2}>
              <FiBriefcase color={theme.colors.gray["500"]} />
              ONG
            </Tab>
          </TabList>

          <TabPanels bg="#202024" padding={10} borderRadius={10}>
            {/* USER */}
            <TabPanel>
              <form onSubmit={handleSubmit(handleSignUpUser)}>
                <Text
                  color="gray.100"
                  fontSize="xx-large"
                  textAlign="center"
                  fontFamily="heading"
                  fontWeight={800}
                  marginBottom="2rem"
                >
                  Crie sua conta
                </Text>
                <Box width="528px">
                  <InputGroup>
                    <InputLeftElement pointerEvents="none">
                      <FiMail color={theme.colors.gray["500"]} />
                    </InputLeftElement>
                    <Input
                      {...register("email")}
                      name="email"
                      placeholder="Seu E-mail"
                      marginBottom="1rem"
                      borderColor="gray.700"
                      backgroundColor="gray.700"
                      color="gray.100"
                      isRequired
                    />
                  </InputGroup>
                  <InputGroup>
                    <InputLeftElement pointerEvents="none">
                      <FiUser color={theme.colors.gray["500"]} />
                    </InputLeftElement>
                    <Input
                      {...register("name")}
                      name="name"
                      placeholder="Seu Nome"
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
                      placeholder="Sua senha"
                      borderColor="gray.700"
                      marginBottom="1rem"
                      backgroundColor="gray.700"
                      color="gray.100"
                      type="password"
                      isRequired
                    />
                  </InputGroup>

                  <InputGroup>
                    <InputLeftElement pointerEvents="none">
                      <FiLock color={theme.colors.gray["500"]} />
                    </InputLeftElement>
                    <Input
                      {...register("confirmpassword")}
                      name="confirmpassword"
                      placeholder="Confirme sua senha"
                      borderColor="gray.700"
                      backgroundColor="gray.700"
                      color="gray.100"
                      type="password"
                      isRequired
                    />
                  </InputGroup>

                  <Flex direction="column" alignItems="center">
                    {pageState.error !== "" && (
                      <Alert status="error" marginTop="2rem" borderRadius={10}>
                        <AlertIcon />
                        <AlertTitle>Alerta:</AlertTitle>
                        <AlertDescription>{pageState.error}</AlertDescription>
                      </Alert>
                    )}
                    {pageState.ok && (
                      <Alert
                        status="success"
                        marginTop="2rem"
                        borderRadius={10}
                      >
                        <AlertIcon />
                        <AlertTitle>Parabéns:</AlertTitle>
                        <AlertDescription>
                          cadastro foi realizado com sucesso
                        </AlertDescription>
                      </Alert>
                    )}
                    <Button
                      type="submit"
                      marginTop="2rem"
                      marginBottom="3rem"
                      width="100%"
                      backgroundColor="secondary.500"
                      _hover={{ backgroundColor: "secondary.600" }}
                      textTransform="uppercase"
                    >
                      Cadastrar
                    </Button>

                    <LinkNext href="/">
                      <Link color="gray.100">
                        <Text
                          as="span"
                          color="secondary.100"
                          display="flex"
                          alignItems="center"
                          gap="4"
                        >
                          <FiArrowLeft
                            color={theme.colors.gray["500"]}
                            size={20}
                          />
                          Voltar para login
                        </Text>
                      </Link>
                    </LinkNext>
                  </Flex>
                </Box>
              </form>
            </TabPanel>

            {/* ONS */}
            <TabPanel>
              <form onSubmit={handleSubmitOng(handleSignUpOng)}>
                <Text
                  color="gray.100"
                  fontSize="xx-large"
                  textAlign="center"
                  fontFamily="heading"
                  fontWeight={800}
                  marginBottom="2rem"
                >
                  Cadastro de ONG
                </Text>
                <Box width="528px">
                  <InputGroup>
                    <InputLeftElement pointerEvents="none">
                      <FiMail color={theme.colors.gray["500"]} />
                    </InputLeftElement>
                    <Input
                      {...registerOng("email")}
                      name="email"
                      placeholder="E-mail"
                      marginBottom="1rem"
                      borderColor="gray.700"
                      backgroundColor="gray.700"
                      color="gray.100"
                      isRequired
                    />
                  </InputGroup>
                  <InputGroup>
                    <InputLeftElement pointerEvents="none">
                      <FiBriefcase color={theme.colors.gray["500"]} />
                    </InputLeftElement>
                    <Input
                      {...registerOng("name")}
                      name="name"
                      placeholder="Nome da sua ONG"
                      marginBottom="1rem"
                      borderColor="gray.700"
                      backgroundColor="gray.700"
                      color="gray.100"
                      isRequired
                    />
                  </InputGroup>
                  <InputGroup>
                    <InputLeftElement pointerEvents="none">
                      <FiTool color={theme.colors.gray["500"]} />
                    </InputLeftElement>
                    <Input
                      {...registerOng("service")}
                      name="service"
                      title="Qual serviço seu ONG atende?"
                      placeholder="Serviço"
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
                      {...registerOng("password")}
                      name="password"
                      placeholder="Sua senha"
                      borderColor="gray.700"
                      marginBottom="1rem"
                      backgroundColor="gray.700"
                      color="gray.100"
                      type="password"
                      isRequired
                    />
                  </InputGroup>

                  <InputGroup>
                    <InputLeftElement pointerEvents="none">
                      <FiLock color={theme.colors.gray["500"]} />
                    </InputLeftElement>
                    <Input
                      {...registerOng("confirmpassword")}
                      name="confirmpassword"
                      placeholder="Confirme sua senha"
                      borderColor="gray.700"
                      backgroundColor="gray.700"
                      color="gray.100"
                      type="password"
                      isRequired
                    />
                  </InputGroup>

                  <Flex direction="column" alignItems="center">
                    {pageState.error !== "" && (
                      <Alert status="error" marginTop="2rem" borderRadius={10}>
                        <AlertIcon />
                        <AlertTitle>Alerta:</AlertTitle>
                        <AlertDescription>{pageState.error}</AlertDescription>
                      </Alert>
                    )}
                    {pageState.ok && (
                      <Alert
                        status="success"
                        marginTop="2rem"
                        borderRadius={10}
                      >
                        <AlertIcon />
                        <AlertTitle>Parabéns:</AlertTitle>
                        <AlertDescription>
                          cadastro foi realizado com sucesso
                        </AlertDescription>
                      </Alert>
                    )}
                    <Button
                      type="submit"
                      marginTop="2rem"
                      marginBottom="3rem"
                      width="100%"
                      backgroundColor="secondary.500"
                      _hover={{ backgroundColor: "secondary.600" }}
                      textTransform="uppercase"
                    >
                      Cadastrar
                    </Button>

                    <LinkNext href="/">
                      <Link color="gray.100">
                        <Text
                          as="span"
                          color="secondary.100"
                          display="flex"
                          alignItems="center"
                          gap="4"
                        >
                          <FiArrowLeft
                            color={theme.colors.gray["500"]}
                            size={20}
                          />
                          Voltar para login
                        </Text>
                      </Link>
                    </LinkNext>
                  </Flex>
                </Box>
              </form>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Flex>
    </>
  );
}

export default SignUp;
