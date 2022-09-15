import { Button, Flex, Image, Text } from "@chakra-ui/react";
import { GetServerSideProps } from "next";
import { useSession, signOut, getSession } from "next-auth/react";

function Home() {
  const { data: session } = useSession();

  return (
    <Flex
      width="100%"
      height="100vh"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
    >
      <Text color="gray.400" fontSize="md">
        Bem vindo
      </Text>
      <Flex marginTop="1rem" alignItems="center">
        {session?.user?.image && (
          <Image
            src={session?.user?.image}
            alt="User avatar"
            width="88px"
            height="88px"
            borderRadius="full"
            marginRight="1rem"
          />
        )}

        <Text color="gray.100" marginTop="0.5rem" fontSize="xl">
          {session?.user?.name}
        </Text>
      </Flex>

      <Button
        type="submit"
        marginTop="2rem"
        marginBottom="1rem"
        width="256px"
        backgroundColor="secondary.500"
        onClick={() => signOut()}
      >
        Sair
      </Button>
    </Flex>
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

export default Home;
