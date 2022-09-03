import type { NextPage } from "next";
import Router from "next/router";
import { ReactNode, useEffect, useState } from "react";
import { authState } from "../../../lib/firebaseApp";
import { ModalCircular } from "../loadings/ModalCircular";

const GuestLayout: NextPage<{
  children: ReactNode;
}> = ({ children }) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // after render window
    if (typeof window !== "undefined" && isLoading) {
      authState((user) => {
        if (!user) return setIsLoading(false);

        //  auth user it should redirect /home
        Router.push("/home");
      });
    }
  }, [isLoading]);

  if (isLoading) {
    return <ModalCircular isOpen={isLoading} />;
  }

  return <>{children}</>;
};
export default GuestLayout;
