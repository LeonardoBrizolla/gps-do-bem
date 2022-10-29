import {
  Box,
  Button,
  useColorModeValue,
  Stack,
  Text,
  Heading,
  Container,
  Input,
  Center,
  Flex,
  Avatar,
  Image,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from "@chakra-ui/react";
import { getSession } from "next-auth/react";
import { GetServerSideProps } from "next";
import { Header } from "../../components/Header";
import { Footer } from "../../components/Footer";
import { useForm } from "react-hook-form";
import api from "../../services/api";
import { useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { GoogleMap, MarkerF, useJsApiLoader } from "@react-google-maps/api";

interface PageStateProps {
  error: string;
  processing: boolean;
}

export default function Simple() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [pageState, setPageState] = useState<PageStateProps>({
    error: "",
    processing: false,
  });
  const { register, handleSubmit } = useForm();
  const [services, setServices] = useState([]) as any;
  const [userSearch, setUserSearch] = useState({}) as any;
  const router = useRouter();

  function simplifyError(error: string) {
    const errorMap: any = {
      CredentialsSignin: "Serviço não encontrado!",
    };
    return errorMap[error] ?? "Serviço não encontrado";
  }

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.GOOGLE_MAP_API_KEY || "",
  });

  async function handlePesquisaOng(serviceOng: any) {
    setPageState((old) => ({ ...old, processing: true, error: "" }));
    setServices([]);

    await api
      .post("/services", serviceOng)
      .then((response: any) => {
        console.log(response);

        if (response.status === 200 && response.data.user.length > 0) {
          setServices((old: any) => [...old, response?.data]);
          router.push("#ongFounded");
          setPageState((old) => ({
            ...old,
            processing: false,
          }));
        } else {
          console.log("oi", response);

          setPageState((old) => ({
            ...old,
            processing: false,
            error: "Serviço não encontrado",
          }));
        }
      })
      .catch((error) => {
        console.log("oi", error);

        setPageState((old) => ({
          ...old,
          processing: false,
          error: error.error ?? "Serviço não encontrado",
        }));
      });
  }

  async function handleSearchMap(event: any) {
    const id = event.target.id;

    await api
      .post("/user", { _id: id })
      .then((res: any) => setUserSearch(res.data.user))
      .catch((err) => console.log(err));

    onOpen();
  }

  function renderMap(user: any) {
    return (
      <>
        <Text>Endereço: {user.address}</Text>
        <Flex h="20rem">
          {isLoaded ? (
            <GoogleMap
              mapContainerStyle={{
                width: "100%",
                height: "100%",
              }}
              center={user?.location}
              zoom={15}
            >
              <MarkerF
                position={user?.location}
                label={{
                  text: user.name,
                  fontSize: "18px",
                  fontWeight: "bold",
                }}
                animation={google.maps.Animation.DROP}
              />
            </GoogleMap>
          ) : (
            <></>
          )}
        </Flex>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Home | GPS do Bem</title>
      </Head>
      <Box minHeight="100vh" m="0">
        <Header />
        <Box p={2}>
          <Container maxW={"container.lg"}>
            <Stack
              as={Box}
              textAlign={"center"}
              alignItems={"center"}
              spacing={{ base: 4, md: 10 }}
              py={{ base: 10, md: 20 }}
            >
              <Box boxSize="180px">
                <Image src="/icon-gps-do-bem.png" alt="Logo GPS" />
              </Box>
              <Heading
                color={"yellow.400"}
                fontWeight="bold"
                fontSize={{ base: "2xl", sm: "4xl", md: "6xl" }}
                lineHeight={"110%"}
                fontFamily="Roboto"
              >
                GPS DO BEM <br />
              </Heading>
              <Text
                color={"gray.100"}
                maxW={"2xl"}
                fontFamily="Roboto"
                fontSize={"lg"}
              >
                Bem-vindo ao GPS DO BEM, abaixo você poderá pesquisar pelo{" "}
                <strong>serviço</strong> da ONG que você deseja
                encontrar/conhecer:
              </Text>
              <form onSubmit={handleSubmit(handlePesquisaOng)}>
                <Stack
                  direction={{ base: "column", md: "row" }}
                  spacing={3}
                  align={"center"}
                  alignSelf={"center"}
                  position={"relative"}
                  onSubmit={() => handlePesquisaOng}
                >
                  <Input
                    type={"text"}
                    {...register("serviceOng")}
                    name="serviceOng"
                    placeholder={"Roupas..."}
                    color={useColorModeValue("gray.800", "gray.200")}
                    bg={useColorModeValue("gray.100", "gray.600")}
                    rounded={"base"}
                    w={{ base: "auto", md: "25rem", sm: "25rem" }}
                    size={"lg"}
                    fontFamily="Roboto"
                    border={0}
                    _focus={{
                      bg: useColorModeValue("gray.200", "gray.800"),
                      outline: "none",
                    }}
                  />
                  <Button
                    type="submit"
                    size={"lg"}
                    colorScheme={"green"}
                    bg={
                      "linear-gradient(to bottom, rgb(123, 0, 255, 0.9), rgb(250, 8, 255, 0.87))"
                    }
                    w={"150px"}
                    rounded={"base"}
                    transition={"ease"}
                    transitionDuration={"10"}
                    _hover={{
                      bg: "linear-gradient(to bottom, rgb(123, 0, 255, 0.5), rgb(300, 8, 255, 0.5))",
                    }}
                  >
                    Pesquisar
                  </Button>
                </Stack>
                {pageState.error !== "" && (
                  <Alert status="error" marginTop="1rem">
                    <AlertIcon />
                    <AlertTitle>Alerta:</AlertTitle>
                    <AlertDescription>
                      {simplifyError(pageState.error)}
                    </AlertDescription>
                  </Alert>
                )}
              </form>
            </Stack>
          </Container>
        </Box>
        <Box bgColor="#282a36" id="ongFounded">
          <Container maxWidth={"container.lg"}>
            {services[0]?.user?.length > 0 && (
              <>
                <Flex alignItems={"center"} justifyContent={"center"}>
                  <Text
                    mt="10"
                    fontSize="3xl"
                    color="yellow.400"
                    fontWeight="bold"
                    fontFamily="Roboto"
                  >
                    ONGS ENCONTRADAS
                  </Text>
                </Flex>
                <Flex
                  maxWidth={"container.xl"}
                  alignItems={"center"}
                  justifyContent={"space-around"}
                  flexWrap={"wrap"}
                >
                  {services[0]?.user?.map((item: any) => (
                    <Center py={5} key={item._id} minW={"300px"}>
                      <Box
                        minW={"270px"}
                        minH={"350px"}
                        w={"full"}
                        bg="gray.100"
                        boxShadow={"2xl"}
                        rounded={"md"}
                        overflow={"hidden"}
                      >
                        <Image
                          h={"120px"}
                          w={"full"}
                          src={
                            "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=460&q=80"
                          }
                          alt={""}
                          objectFit={"cover"}
                        />
                        <Flex justify={"center"} mt={-12}>
                          <Avatar
                            size={"xl"}
                            src={
                              "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                            }
                            css={{
                              border: "2px solid white",
                            }}
                          />
                        </Flex>

                        <Box p={6} flex={"1"} flexDirection={"column"}>
                          <Stack spacing={0} align={"center"} mb={5}>
                            <Heading
                              fontSize={"2xl"}
                              fontWeight={500}
                              fontFamily={"body"}
                            >
                              {item.name}
                            </Heading>
                            <Text color={"gray.500"}>{item.email}</Text>
                          </Stack>
                          <Stack spacing={0} align={"center"} mb={2}>
                            <Text color={"gray.500"}>{item.service}</Text>
                          </Stack>
                          <Flex
                            flex={"1"}
                            flexDirection={"column"}
                            justifyContent={"flex-end"}
                            alignItems={"flex-end"}
                          >
                            {!!item.address && (
                              <Button
                                id={item._id}
                                w={"full"}
                                bg="linear-gradient(to bottom, rgb(123, 0, 255, 0.9), rgb(250, 8, 255, 0.87))"
                                color={"gray.100"}
                                rounded={"md"}
                                _hover={{
                                  transform: "translateY(-2px)",
                                  boxShadow: "lg",
                                }}
                                onClick={handleSearchMap}
                              >
                                Geolocalização
                              </Button>
                            )}
                            {!!userSearch.address &&
                              item._id === userSearch._id && (
                                <Modal isOpen={isOpen} onClose={onClose}>
                                  <ModalOverlay />
                                  <ModalContent>
                                    <ModalHeader>
                                      Geolocalização da ONG {item.name}
                                    </ModalHeader>
                                    <ModalCloseButton />
                                    <ModalBody flexDirection={"column"}>
                                      {!!userSearch.address &&
                                      item._id === userSearch._id ? (
                                        renderMap(userSearch)
                                      ) : (
                                        <></>
                                      )}
                                    </ModalBody>

                                    <ModalFooter>
                                      <Button
                                        colorScheme="red"
                                        mr={3}
                                        onClick={onClose}
                                      >
                                        Close
                                      </Button>
                                    </ModalFooter>
                                  </ModalContent>
                                </Modal>
                              )}
                          </Flex>
                        </Box>
                      </Box>
                    </Center>
                  ))}
                </Flex>
              </>
            )}
          </Container>
        </Box>
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
