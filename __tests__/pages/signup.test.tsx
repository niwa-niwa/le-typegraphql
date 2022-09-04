import "@testing-library/jest-dom/extend-expect";
import React from "react";
import userEvent from "@testing-library/user-event";
import { render, screen } from "@testing-library/react";
import Signup from "../../pages/signup";
// import {
//   connectAuthEmulator,
//   GoogleAuthProvider,
//   signInWithCredential,
// } from "firebase/auth";

// jest.mock("../../frontend/lib/firebaseApp", () => ({
//   client_auth: {
//     onAuthStateChanged: (func) => {
//       func(null);
//     },
//   },
// }));

describe("TEST signup.tsx", () => {
  // test("signup",()=>{
  //   const {debug} = render(<Signup />);
  //   debug()
  // })

  test("show sign up Ruhuna", () => {
    const { getByText } = render(<Signup />);
    expect(getByText(/Sign up Ruhuna/)).toBeInTheDocument();
  });

  test("show title Ruhuna", () => {
    const { getByText } = render(<Signup />);
    expect(getByText(/Sign In/)).toBeInTheDocument();
  });

  test("show title Ruhuna", () => {
    const { getByText } = render(<Signup />);
    expect(getByText(/Sign Up/)).toBeInTheDocument();
  });

  test("show title Ruhuna", () => {
    const { getByText } = render(<Signup />);
    expect(getByText(/Sign up with Google/)).toBeInTheDocument();
  });

  // test("google auth", async ()=>{
  //   const auth = client_auth
  //   connectAuthEmulator(auth, `http://${process.env.FIREBASE_AUTH_EMULATOR_HOST}`)

  //   const result = await signInWithCredential(
  //     auth,
  //     GoogleAuthProvider.credential(
  //       '{"sub": "abc1234", "email": "yamayama@gmail.com", "email_verified": true}',
  //     ),
  //   )
  //   const idToken = await result.user.getIdToken()
  //   console.log(idToken)
  //   expect(true).toBe(true)
  // })
});
