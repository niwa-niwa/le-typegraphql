import "@testing-library/jest-dom/extend-expect";
import React from "react";
import userEvent from "@testing-library/user-event";
import { render, screen } from "@testing-library/react";
import Signup from "../../pages/signup"

describe("TEST signup.tsx",()=>{
  test("signup",()=>{
    const {debug} = render(<Signup />);
    debug()
  })
})