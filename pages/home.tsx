import Head from "next/head";
import AuthLayout from "../frontend/components/common/layouts/AuthLayout";
import HomeBody from "../frontend/components/bodies/HomeBody";
import { useLocale, LocaleText } from "../frontend/hooks/Local/useLocal";

const Home = () => {
  const { txt }: { txt: LocaleText } = useLocale();

  return (
    <AuthLayout>
      <Head>
        <title>
          {txt.signin} | {txt.app_name}
        </title>
        <meta name="description" content={txt.app_name + txt.signin} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <HomeBody />
    </AuthLayout>
  );
};

export default Home;
