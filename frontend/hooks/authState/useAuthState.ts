import { useEffect, useState } from "react";
import { VARS } from "../../../consts/vars";
import { restV1Client } from "../../lib/axios";

export function useAuthState() {
  const [currentUser, setCurrentUser] = useState<any>();

  useEffect(() => {
    const token = localStorage.getItem(VARS.ACCESS_TOKEN);

    if (!token) return setCurrentUser(null);

    const f = async () => {
      const {
        data: { user },
      } = await restV1Client.get("/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setCurrentUser(user);
    };
    f();
  }, []);

  return { currentUser, setCurrentUser };
}
