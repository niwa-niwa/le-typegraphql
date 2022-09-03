import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import { css } from "@emotion/react";
import { useLocale, LocaleText } from "../../../hooks/Local/useLocal";
import { EmotionJSX } from "@emotion/react/types/jsx-namespace";

export default function GuestHeader(): EmotionJSX.Element {
  const { txt }: { txt: LocaleText } = useLocale();
  const pages: Array<{ text: string; link: string }> = [
    { text: "Sign In", link: "signin" },
    { text: "Sign Up", link: "signup" },
  ];

  return (
    <AppBar position="static">
      <Container
        css={css`
          display: flex;
          flex-flow: column;
          align-items: center;
        `}
      >
        <Box
          maxWidth="xl"
          css={css`
            display: contents;
          `}
        >
          <Typography
            variant="h1"
            noWrap
            component="a"
            href=""
            sx={{
              mr: 2,
              mt: 1.5,
              display: { xs: "flex" },
              flexGrow: 1,
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
              fontSize: 32,
            }}
          >
            {txt.app_name}
          </Typography>
        </Box>

        <Box
          maxWidth="xl"
          color="secondary"
          css={css`
            display: flex;
          `}
        >
          {pages.map((page, index) => (
            <Button
              key={index}
              sx={{
                my: 0,
                mx: 5,
                color: "white",
                display: "inline",
                fontSize: 16,
              }}
              href={page.link}
            >
              {page.text}
            </Button>
          ))}
        </Box>
      </Container>
    </AppBar>
  );
}
