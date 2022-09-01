import type { NextPage } from "next";
import styles from "../styles/home.module.scss";
import Head from "next/head";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>GPS do Bem</title>
      </Head>

      <h1 className={styles.title}>
        GPS do <span>bem</span>
      </h1>
    </>
  );
};

export default Home;
