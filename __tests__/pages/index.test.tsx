import "@testing-library/jest-dom/extend-expect";
import React from "react";
import userEvent from "@testing-library/user-event";
import { render, screen } from "@testing-library/react";
import Index from "../../pages/index";

describe("TEST index.tsx", () => {
  // debug()
  test("Show h1 Next.js", async () => {
    const {
      debug,
      getByText,
      getAllByText,
      queryByText,
      findByText,
      getAllByRole,
    } = render(<Index />);

    expect(queryByText(/Ruhuna/)).toBeNull();
    expect(getByText(/Next.js!/)).toBeInTheDocument();
    expect(queryByText(/Welcome to/)).toBeInTheDocument();
    expect(await findByText(/Welcome to/)).toBeInTheDocument();
  });

  test("show role that is Learn ", () => {
    const {
      debug,
      getByText,
      getAllByText,
      queryByText,
      findByText,
      getAllByRole,
    } = render(<Index />);
    // debug()
    // debug(screen.getAllByRole("heading"))
    // debug(getAllByRole("heading", { name: "Learn →" }));
    expect(getAllByRole("heading", { name: "Learn →" }).length).toBe(1);
  });

  test("exist a link of home", () => {
    const { debug, getByRole } = render(<Index />);
    expect(getByRole("link", { name: "Home →" })).toBeInTheDocument();
  });
  test("exist a link of Sign In", () => {
    const { debug, getByRole } = render(<Index />);
    expect(getByRole("link", { name: "Sign In →" })).toBeInTheDocument();
  });
  test("exist a link of Sign Up", () => {
    const { debug, getByRole } = render(<Index />);
    expect(getByRole("link", { name: "Sign Up →" })).toBeInTheDocument();
  });
});
