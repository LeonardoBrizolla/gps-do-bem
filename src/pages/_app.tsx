import { ChakraProvider } from "@chakra-ui/react";
import type { AppProps } from "next/app";
import { theme } from "../../chakra.theme";
import { SessionProvider } from "next-auth/react";
import "../styles/global.scss";

export const REACT_APP_GOOGLE_API_KEY = process.env.GOOGLE_MAP_API_KEY;

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SessionProvider session={session}>
      <ChakraProvider theme={theme}>
        <Component {...pageProps} />
      </ChakraProvider>
    </SessionProvider>
  );
}

export default MyApp;
