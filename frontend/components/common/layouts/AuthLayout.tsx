import type { NextPage } from "next";
import Router from "next/router";
import { ReactNode, useEffect, useState } from "react";
import { useAuthState } from "../../../hooks/authState/useAuthState";
import { authState } from "../../../lib/firebaseApp";
import { ModalCircular } from "../loadings/ModalCircular";

const AuthLayout: NextPage<{
  children: ReactNode;
}> = ({ children }) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { currentUser } = useAuthState();

  useEffect(() => {
    // after render window
    if (typeof window !== "undefined" && isLoading) {
      if (currentUser) return setIsLoading(false);

      // if currentUser was null it should confirm auth state
      authState((user) => {
        if (user) return setIsLoading(false);

        // not auth it should redirect guest pafe
        Router.push("/");
      });
    }
  }, [isLoading, currentUser]);

  if (isLoading) {
    return <ModalCircular isOpen={isLoading} />;
  }
  return <>{children}</>;
};

export default AuthLayout;
