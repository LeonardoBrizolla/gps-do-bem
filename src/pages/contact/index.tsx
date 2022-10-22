import { useRef, useState } from "react";
import Head from "next/head";
import { Header } from "../../components/Header";
import emailjs from "emailjs-com";
import {
  Container,
  Flex,
  Box,
  Heading,
  Text,
  IconButton,
  Button,
  VStack,
  HStack,
  Wrap,
  WrapItem,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputLeftElement,
  Textarea,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from "@chakra-ui/react";
import { MdPhone, MdEmail, MdLocationOn, MdOutlineEmail } from "react-icons/md";
import { BsGithub, BsPerson } from "react-icons/bs";
import { useRouter } from "next/router";
import LinkNext from "next/link";
import { Footer } from "../../components/Footer";

interface PageStateProps {
  error: string;
  processing: boolean;
  ok: boolean;
}
function Contact() {
  const form = useRef() as any;
  const router = useRouter();
  const [pageState, setPageState] = useState<PageStateProps>({
    error: "",
    processing: false,
    ok: false,
  });
  function handleSubmit(e: any) {
    e.preventDefault();
    setPageState((old) => ({ ...old, processing: true, error: "", ok: false }));

    emailjs
      .sendForm(
        "service_o6iz3gq",
        "template_r2dy7e8",
        form.current,
        "bZbxb_I0WQ5UF--l3"
      )
      .then(
        (response) => {
          setPageState((old) => ({
            ...old,
            processing: false,
            error: "",
            ok: true,
          }));

          if (response.status === 200) {
            setTimeout(() => {
              router.push("/");
            }, 3000);
          }
        },
        (error) => {
          console.log(error.text);
          setPageState((old) => ({
            ...old,
            error: error.response.data.msg,
            processing: false,
            ok: false,
          }));
        }
      );
  }

  return (
    <>
      <Head>
        <title>Contato | GPS do Bem</title>
      </Head>
      <Header />

      <Box p={2} minHeight="100vh" m="0">
        <Container
          maxW="full"
          mt="50px"
          centerContent
          overflow="hidden"
          position="relative"
        >
          <Flex>
            <Box
              bg="#44475a"
              color="white"
              borderRadius="lg"
              m={{ sm: 4, md: 16, lg: 10 }}
              p={{ sm: 5, md: 5, lg: 16 }}
            >
              <Box p={4}>
                <Wrap spacing={{ base: 20, sm: 3, md: 5, lg: 20 }}>
                  <WrapItem>
                    <Box>
                      <VStack
                        pl={0}
                        spacing={3}
                        alignItems="center"
                        justifyContent="center"
                      >
                        <Heading>Fale Conosco</Heading>
                        <Text mt={{ sm: 3, md: 3, lg: 5 }} color="gray.500">
                          Preencha o formulário abaixo para entrar em contato
                        </Text>
                      </VStack>
                      <Box py={{ base: 5, sm: 5, md: 8, lg: 10 }}>
                        <VStack
                          pl={0}
                          spacing={3}
                          alignItems="center"
                          justifyContent="center"
                        >
                          <Button
                            size="md"
                            height="48px"
                            width="250px"
                            variant="ghost"
                            color="#DCE2FF"
                            _hover={{ border: "2px solid #1C6FEB" }}
                            leftIcon={<MdPhone color="#1970F1" size="20px" />}
                          >
                            +55-51-991537488
                          </Button>
                          <Button
                            size="md"
                            height="48px"
                            width="290px"
                            variant="ghost"
                            color="#DCE2FF"
                            _hover={{ border: "2px solid #1C6FEB" }}
                            leftIcon={<MdEmail color="#1970F1" size="20px" />}
                          >
                            leonardobrizollars@gmail.com
                          </Button>
                          <Button
                            size="md"
                            height="48px"
                            width="290px"
                            variant="ghost"
                            color="#DCE2FF"
                            _hover={{ border: "2px solid #1C6FEB" }}
                            leftIcon={
                              <MdLocationOn color="#1970F1" size="20px" />
                            }
                          >
                            Novo Hamburgo, RS, Brasil
                          </Button>
                        </VStack>
                      </Box>
                      <HStack
                        mt={{ lg: 10, md: 10 }}
                        spacing={5}
                        px={5}
                        justifyContent="center"
                        alignItems="center"
                      >
                        <LinkNext href="https://github.com/LeonardoBrizolla/gps-do-bem">
                          <IconButton
                            aria-label="github"
                            variant="ghost"
                            size="lg"
                            isRound={true}
                            _hover={{ bg: "#0D74FF" }}
                            icon={<BsGithub size="28px" />}
                          />
                        </LinkNext>
                      </HStack>
                    </Box>
                  </WrapItem>
                  <WrapItem>
                    <Box bg="white" borderRadius="lg">
                      <Box m={8} color="#0B0E3F">
                        <VStack spacing={5}>
                          <form ref={form} onSubmit={handleSubmit}>
                            <FormControl id="name">
                              <FormLabel>Seu nome</FormLabel>
                              <InputGroup borderColor="#E0E1E7">
                                <InputLeftElement pointerEvents="none">
                                  <BsPerson color="gray.800" />
                                </InputLeftElement>

                                <Input
                                  name="name"
                                  type="text"
                                  size="md"
                                  isRequired
                                  pattern="^[A-Za-z0-9 _]*[A-Za-z0-9][A-Za-z0-9 _]*$"
                                />
                              </InputGroup>
                            </FormControl>
                            <FormControl id="name">
                              <FormLabel>E-mail</FormLabel>
                              <InputGroup borderColor="#E0E1E7">
                                <InputLeftElement pointerEvents="none">
                                  <MdOutlineEmail color="gray.800" />
                                </InputLeftElement>
                                <Input
                                  name="user_email"
                                  type="text"
                                  size="md"
                                  isRequired
                                  pattern="^[A-Za-z0-9+_.-]+@(.+)$"
                                />
                              </InputGroup>
                            </FormControl>
                            <FormControl id="name">
                              <FormLabel>Mensagem</FormLabel>
                              <Textarea
                                borderColor="gray.300"
                                _hover={{
                                  borderRadius: "gray.300",
                                }}
                                placeholder="mensagem"
                                name="message"
                                isRequired
                              />
                            </FormControl>
                            <FormControl id="name" float="right">
                              <br />
                              <Button
                                variant="solid"
                                bg="#0D74FF"
                                color="white"
                                _hover={{}}
                                type="submit"
                              >
                                Enviar Mensagem
                              </Button>
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
                                  <AlertTitle>Parabéns!</AlertTitle>
                                  <AlertDescription>
                                    Mensagem enviada com sucesso!
                                  </AlertDescription>
                                </Alert>
                              )}
                            </FormControl>
                          </form>
                        </VStack>
                      </Box>
                    </Box>
                  </WrapItem>
                </Wrap>
              </Box>
            </Box>
          </Flex>
        </Container>
      </Box>
      <Footer />
    </>
  );
}

export default Contact;
