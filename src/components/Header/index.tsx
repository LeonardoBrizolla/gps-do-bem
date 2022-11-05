import { ReactNode, useEffect, useState } from "react";
import {
  Box,
  Flex,
  Avatar,
  HStack,
  Link,
  IconButton,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useDisclosure,
  Text,
  VStack,
} from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon } from "@chakra-ui/icons";
import { useSession, signOut } from "next-auth/react";
import { FiChevronDown } from "react-icons/fi";
import LinkNext from "next/link";
import api from "../../services/api";

const Links = ["Fale Conosco"];

const NavLink = ({ children }: { children: ReactNode }) => (
  <LinkNext href="/contact">
    <Link
      color="white"
      px={2}
      py={1}
      rounded={"md"}
      _hover={{
        textDecoration: "none",
        bg: "gray.700",
      }}
    >
      {children}
    </Link>
  </LinkNext>
);

export function Header() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { data: session } = useSession();
  const [idUser, setIdUser] = useState();

  useEffect(() => {
    let email = session?.user?.email;

    api
      .post("/userEmail", { email: email })
      .then((res: any) => setIdUser(res.data.user[0]._id))
      .catch((err) => console.log(err));
  }, [session]);

  return (
    <Box bg={"gray.900"} px={4} position="fixed" w="100%" zIndex={"500"}>
      <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
        <IconButton
          size={"md"}
          icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
          aria-label={"Open Menu"}
          display={{ md: "none" }}
          onClick={isOpen ? onClose : onOpen}
        />
        <HStack spacing={8} alignItems={"center"}>
          <Box>
            <Text color="white" fontWeight={900}>
              <LinkNext href="/home">GPS DO BEM</LinkNext>
            </Text>
          </Box>
          <HStack as={"nav"} spacing={4} display={{ base: "none", md: "flex" }}>
            {Links.map((link) => (
              <NavLink key={link}>{link}</NavLink>
            ))}
          </HStack>
        </HStack>
        <Flex alignItems={"center"}>
          <Menu>
            <MenuButton
              as={Button}
              rounded={"full"}
              variant={"link"}
              cursor={"pointer"}
              minW={0}
            >
              <HStack>
                {session?.user?.image ? (
                  <Avatar size={"sm"} src={session?.user?.image} />
                ) : (
                  <Avatar
                    size={"sm"}
                    src={
                      "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                    }
                  />
                )}
                <VStack
                  display={{ base: "none", md: "flex" }}
                  alignItems="flex-start"
                  spacing="1px"
                  ml="2"
                >
                  <Text fontSize="sm" color="gray.200">
                    {session?.user?.name ?? ""}
                  </Text>
                  <Text fontSize="xs" color="gray.400">
                    Serviço
                  </Text>
                </VStack>
                <Box display={{ base: "none", md: "flex" }}>
                  <FiChevronDown color={"white"} />
                </Box>
              </HStack>
            </MenuButton>
            <MenuList>
              <LinkNext href={`/editProfile/${idUser}`}>
                <MenuItem>Editar perfil</MenuItem>
              </LinkNext>
              <MenuItem onClick={() => signOut()}>Sair</MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </Flex>
    </Box>
  );
}
