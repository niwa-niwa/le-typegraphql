import { Container, TextField } from "@mui/material";
import type { NextPage } from "next";
import GuestHeader from "../common/header/GuestHeader";
import OneColumn from "../common/layout/OneColumn";
import { centering_vertical } from "../../styles/common";
import {
  Sign_Title,
  Border_Or,
  Google_Button,
  Sign_Submit,
} from "../../styles/sign-style";
import { LocaleText, useLocale } from "../../hooks/useLocal";
import { EmotionJSX } from "@emotion/react/types/jsx-namespace";
import { SubmitHandler, useForm, Controller } from "react-hook-form";
import { useContext } from "react";
import { ThemeModeContext } from "../../hooks/ThemeModeContext";
import { restV1Client } from "../../lib/axios";
import {
  SignupValue,
  signupWithEmail,
  signupWithGoogle,
} from "../../lib/firebaseApp";

const SignUp: NextPage = (): EmotionJSX.Element => {
  const { state, dispatch } = useContext(ThemeModeContext);
  const { txt }: { txt: LocaleText } = useLocale();

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<SignupValue>();

  const onSubmit: SubmitHandler<SignupValue> = async (data: SignupValue) => {
    console.log(data);
    // dispatch(!state.isDarkMode);
    try {
      await signupWithEmail(data);
      const result = await restV1Client.get("/health");
      console.log("axios result = ", result);
    } catch (e) {
      // TODO handling error
      console.error(e);
    }
  };

  const onGoogle = async () => {
    try {
      const me = await signupWithGoogle();
    } catch (e) {
      // TODO handling error
      console.error(e);
    }
  };

  return (
    <OneColumn>
      <GuestHeader />

      <Container maxWidth="sm">
        <main css={centering_vertical}>
          <Sign_Title>{txt.signup_ruhuna}</Sign_Title>

          <Google_Button onClick={onGoogle}>
            {txt.signup_with_google}
          </Google_Button>

          {/* <Border_Or /> */}
          {/* 
          <form onSubmit={handleSubmit(onSubmit)}>
            <Controller
              name="email"
              defaultValue=""
              control={control}
              render={({ field }) => (
                <TextField
                  type="text"
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  label={txt.email}
                  error={!!errors.email}
                  helperText={errors.email?.message}
                  {...register("email", {
                    required: {
                      value: true,
                      message: txt.email_is_required,
                    },
                    pattern: {
                      value:
                        /^[a-zA-Z0-9_.+-]+@([a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]*\.)+[a-zA-Z]{2,}$/,
                      message: txt.enter_email_format,
                    },
                  })}
                  {...field}
                />
              )}
            />

            <Controller
              name="password"
              defaultValue=""
              control={control}
              render={({ field }) => (
                <TextField
                  type="password"
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  label={txt.password}
                  error={!!errors.password}
                  helperText={errors.password?.message}
                  {...register("password", {
                    required: {
                      value: true,
                      message: txt.password_is_required,
                    },
                  })}
                  {...field}
                />
              )}
            />

            <Sign_Submit type="submit">{txt.signup}</Sign_Submit>
          </form> 
*/}
        </main>
      </Container>

      <footer></footer>
    </OneColumn>
  );
};
export default SignUp;
