import { Box, Container, Stack, Text } from "@chakra-ui/react";

export function Footer() {
  return (
    <Box bg={"gray.900"} color={"gray.200"} minHeight="50px">
      <Container
        as={Stack}
        maxW={"full"}
        py={4}
        direction={{ base: "column", md: "row" }}
        spacing={4}
        justify={{ base: "center", md: "space-between" }}
        align={{ base: "center", md: "center" }}
      >
        <Text fontSize={"sm"}>
          © 2022 GPS DO BEM. Todos os direitos reservados
        </Text>
      </Container>
    </Box>
  );
}
