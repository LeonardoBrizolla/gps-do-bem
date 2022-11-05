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
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  useDisclosure,
  useTheme,
} from "@chakra-ui/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  FiLock,
  FiUser,
  FiMail,
  FiArrowLeft,
  FiBriefcase,
  FiTool,
  FiMap,
  FiSave,
} from "react-icons/fi";
import api from "../../services/api";
import LinkNext from "next/link";
import MapPageEdit from "./MapPageEdit";
import { getSession, signOut } from "next-auth/react";
import { GetServerSideProps } from "next";
import { MdDeleteForever } from "react-icons/md";

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

function EditProfile() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { query } = useRouter();
  const [isOng, setIsOng] = useState(false);
  const [address, setAddress] = useState("");
  const [location, setLocation] = useState({
    lat: 0,
    lng: 0,
  });

  const {
    register: registerNewUser,
    handleSubmit: handleEditUser,
    setValue: setValueUser,
  } = useForm({
    name: "",
    email: "",
    password: "",
    confirmpassword: "",
  } as any);
  const {
    register: registerOng,
    handleSubmit: handleEditOng,
    setValue: setValueOng,
  } = useForm();
  const theme = useTheme();
  const [pageState, setPageState] = useState<PageStateProps>({
    error: "",
    processing: false,
    ok: false,
  });

  async function handleEditNewUser(data: any) {
    setPageState((old) => ({ ...old, processing: true, error: "", ok: false }));

    await api
      .patch(`/editProfile/${query.id}`, {
        name: data.name,
        email: data.email,
        password: data.password,
        confirmpassword: data.confirmpassword,
        isOng: false,
      })
      .then(function (response) {
        setPageState((old) => ({
          ...old,
          processing: false,
          error: "",
          ok: true,
        }));

        if (response.status === 201) {
          setTimeout(() => {
            signOut();
          }, 3000);
        }
      })
      .catch(function (error) {
        console.log(error);
        setPageState((old) => ({
          ...old,
          error: error.response.data.msg,
          processing: false,
          ok: false,
        }));
      });
  }

  async function handleEditNewOng(data: any) {
    setPageState((old) => ({ ...old, processing: true, error: "", ok: false }));

    await api
      .patch(`/editProfile/${query.id}`, {
        name: data.name,
        email: data.email,
        service: data.service,
        password: data.password,
        confirmpassword: data.confirmpassword,
        isOng: true,
        address: address,
        location: location,
      })
      .then(function (response) {
        setPageState((old) => ({
          ...old,
          processing: false,
          error: "",
          ok: true,
        }));

        if (response.status === 201) {
          setTimeout(() => {
            signOut();
          }, 3000);
        }
      })
      .catch(function (error) {
        console.log(error);
        setPageState((old) => ({
          ...old,
          error: error.response.data.msg,
          processing: false,
          ok: false,
        }));
      });
  }

  async function handleDeleteUser() {
    await api
      .delete(`/user/delete/${query.id}`)
      .then((res) => {
        signOut();
      })
      .catch((err: any) => console.log(err));
  }

  useEffect(() => {
    if (!query.id) {
      return;
    }

    api
      .get(`/editProfile/${query.id}`)
      .then((res) => {
        if (res.status !== 200) {
          signOut();
          return;
        }

        const user = {
          _id: res.data.user._id,
          email: res.data.user.email,
          name: res.data.user.name,
          service: res.data.user.service,
          isOng: res.data.user.isOng,
          address: res.data.user.address,
          location: res.data.user.location,
        };

        if (!user.isOng) {
          setValueUser("email", user.email);
          setValueUser("name", user.name);
        }

        setValueOng("email", user.email);
        setValueOng("name", user.name);
        setValueOng("service", user.service);

        setIsOng(user.isOng);
        setLocation(user.location);
        setAddress(user.address);
      })
      .catch((err) => {
        console.log(err);

        signOut();
        return;
      });
  }, [query.id, setValueUser, setValueOng]);

  return (
    <>
      <Head>
        <title>Editar cadastro | Gps do Bem</title>
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
            {!isOng ? (
              <Tab gap={2}>
                <FiUser color={theme.colors.gray["500"]} />
                Usuário
              </Tab>
            ) : (
              <Tab gap={2}>
                <FiBriefcase color={theme.colors.gray["500"]} />
                ONG
              </Tab>
            )}
          </TabList>

          <TabPanels bg="#202024" padding={10} borderRadius={10}>
            {!isOng ? (
              <TabPanel>
                <form onSubmit={handleEditUser(handleEditNewUser)}>
                  <Text
                    color="gray.100"
                    fontSize="xx-large"
                    textAlign="center"
                    fontFamily="heading"
                    fontWeight={800}
                    marginBottom="2rem"
                  >
                    Editar cadastro
                  </Text>
                  <Box width="528px">
                    <InputGroup>
                      <InputLeftElement pointerEvents="none">
                        <FiMail color={theme.colors.gray["500"]} />
                      </InputLeftElement>
                      <Input
                        {...registerNewUser("email")}
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
                        {...registerNewUser("name")}
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
                        {...registerNewUser("password")}
                        name="password"
                        placeholder="Nova senha"
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
                        {...registerNewUser("confirmpassword")}
                        name="confirmpassword"
                        placeholder="Confirme sua nova senha"
                        borderColor="gray.700"
                        backgroundColor="gray.700"
                        color="gray.100"
                        type="password"
                        isRequired
                      />
                    </InputGroup>

                    <Flex direction="column" alignItems="center">
                      {pageState.error !== "" && (
                        <Alert
                          status="error"
                          marginTop="2rem"
                          borderRadius={10}
                        >
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
                            cadastro editado com sucesso
                          </AlertDescription>
                        </Alert>
                      )}
                      <Button
                        leftIcon={<FiSave />}
                        type="submit"
                        marginTop="2rem"
                        marginBottom="1.5rem"
                        width="100%"
                        backgroundColor="secondary.500"
                        _hover={{ backgroundColor: "secondary.600" }}
                        textTransform="uppercase"
                      >
                        Salvar
                      </Button>

                      <Button
                        leftIcon={<MdDeleteForever />}
                        colorScheme="red"
                        variant="solid"
                        marginBottom="1.5rem"
                        title="Deletar conta"
                        onClick={onOpen}
                      >
                        Deletar conta
                      </Button>

                      <LinkNext href="/home">
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
                            Voltar para home
                          </Text>
                        </Link>
                      </LinkNext>
                    </Flex>
                  </Box>
                </form>
              </TabPanel>
            ) : (
              <TabPanel>
                <form onSubmit={handleEditOng(handleEditNewOng)}>
                  <Flex
                    alignItems={"center"}
                    alignContent={"center"}
                    justifyContent={"center"}
                    width="100%"
                    direction={"column"}
                  >
                    <Flex direction="row">
                      <Box width="30rem" pr={"2%"}>
                        <Text
                          color="gray.100"
                          fontSize="xx-large"
                          textAlign="center"
                          fontFamily="heading"
                          fontWeight={800}
                          marginBottom="2rem"
                        >
                          Editar ONG
                        </Text>
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
                            placeholder="Sua nova senha"
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
                            placeholder="Confirme sua nova senha"
                            borderColor="gray.700"
                            backgroundColor="gray.700"
                            color="gray.100"
                            type="password"
                            isRequired
                          />
                        </InputGroup>

                        <Flex direction="column" alignItems="center">
                          {pageState.error !== "" && (
                            <Alert
                              status="error"
                              marginTop="2rem"
                              borderRadius={10}
                            >
                              <AlertIcon />
                              <AlertTitle>Alerta:</AlertTitle>
                              <AlertDescription>
                                {pageState.error}
                              </AlertDescription>
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
                                cadastro foi atualizado com sucesso
                              </AlertDescription>
                            </Alert>
                          )}
                        </Flex>
                      </Box>
                      <Box width="30rem">
                        <Text
                          color="gray.100"
                          fontSize="xx-large"
                          textAlign="center"
                          fontFamily="heading"
                          fontWeight={800}
                          marginBottom="2rem"
                        >
                          Mapa
                        </Text>
                        <InputGroup>
                          <InputLeftElement pointerEvents="none">
                            <FiMap color={theme.colors.gray["500"]} />
                          </InputLeftElement>
                        </InputGroup>
                        <MapPageEdit
                          onSaveLocation={setLocation}
                          onSaveAddress={setAddress}
                          location={location}
                          address={address}
                        />
                      </Box>
                    </Flex>
                    <Flex direction={"column"} alignItems="center">
                      <Button
                        leftIcon={<FiSave />}
                        type="submit"
                        marginTop="2rem"
                        marginBottom="1.5rem"
                        backgroundColor="secondary.500"
                        _hover={{ backgroundColor: "secondary.600" }}
                        textTransform="uppercase"
                        w="30rem"
                        title="Salvar"
                      >
                        Salvar
                      </Button>
                      <Button
                        leftIcon={<MdDeleteForever />}
                        colorScheme="red"
                        variant="solid"
                        marginBottom="1.5rem"
                        title="Deletar conta"
                        onClick={onOpen}
                      >
                        Deletar conta
                      </Button>

                      <LinkNext href="/home">
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
                            Voltar para home
                          </Text>
                        </Link>
                      </LinkNext>
                    </Flex>
                  </Flex>
                </form>
              </TabPanel>
            )}
          </TabPanels>
        </Tabs>
      </Flex>

      {/* MODAL */}

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent bg={"black"} color={theme.colors.gray["100"]}>
          <ModalHeader>Deseja realmente deletar sua conta?</ModalHeader>
          <ModalCloseButton />
          <ModalFooter alignItems={"center"} justifyContent={"center"}>
            <Button
              colorScheme="red"
              mr={3}
              onClick={handleDeleteUser}
              leftIcon={<MdDeleteForever />}
            >
              Sim, deletar
            </Button>
            <Button variant="ghost" color={"gray.500"} onClick={onClose}>
              Não
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default EditProfile;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: "/",
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
