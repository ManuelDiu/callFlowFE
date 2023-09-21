import React, { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import type { NextPage } from "next";
import Link from "next/link";
import Input from "../../../components/Inputs/Input";
import appRoutes from "@/routes/appRoutes";
import Checkbox from "@/components/Inputs/Checkbox";
import Button from "@/components/Buttons/Button";

import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { loginValidationSchema } from "@/forms/LoginForm";
import { gql, useMutation } from "@apollo/client";
import OneLineError from "@/components/OneLineError/OneLineError";
import { loginGraph } from "controllers/authControllers";
import { useAuth } from "hooks/useAuth";

import styled from "styled-components";
import tw from "twin.macro";
import Image from "next/image";

type LoginFormFields = {
  email: string;
  password: string;
};

// Variants
type ContainerVariant = "firstHalf" | "secondHalf";

// Containers Props
interface ContainerProps {
  variant?: ContainerVariant;
}

const HalfScreenContainerVariants = {
  firstHalf: tw` items-center`,
  secondHalf: tw``,
};

const MainContainer = styled.div(() => [
  tw`flex w-full h-screen min-h-screen bg-white`,
]);

const HalfScreenContainer = styled.div<ContainerProps>(() => [
  tw`flex justify-center w-1/2 h-full`,
  ({ variant = "firstHalf" }) => HalfScreenContainerVariants[variant],
]);

const FirstHalfContainer = styled.div(() => [
  tw`flex flex-col w-full px-40 gap-7`,
]);

const FormContainer = styled.div(() => [tw`flex flex-col py-6 gap-5`]);

const ImagesContainer = styled.div(() => [
  tw`flex relative w-full justify-center items-center rounded-bl-[200px] overflow-hidden`,
]);

const ErrorContainer = styled.div(() => [
  tw`flex gap-2 items-center text-red-600`,
]);

const Login: NextPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormFields>({
    resolver: yupResolver(loginValidationSchema()),
    mode: "onSubmit",
  });
  const [message, setMessage] = useState<string | null>(null);

  const { handleSetToken } = useAuth();

  const [login, { loading }] = useMutation(loginGraph, {
    errorPolicy: "ignore",
  });

  useEffect(() => {
    if (errors.email?.message || errors.password?.message) {
      setMessage("Completa tus credenciales para iniciar sesión.");
    }
  }, [errors])

  const onSubmitHandler = async (data: LoginFormFields) => {
    const resp = await login({
      variables: {
        data: data,
      },
    });

    if (resp?.data?.login?.ok === false) {
      setMessage("Credenciales inválidas.");
    } else {
      const token = resp?.data?.login?.token;
      handleSetToken(token);
    }
  };

  return (
      <MainContainer>
        <HalfScreenContainer>
          <FirstHalfContainer>
            <section>
              <h1 className="font-extrabold text-texto">Iniciar Sesión</h1>
              <p className="text-textogris">
                ¡Ingresa tu usuario y contraseña para iniciar sesión!
              </p>
            </section>
            <form onSubmit={handleSubmit(onSubmitHandler)}>
              <FormContainer>
                <Input
                  label="Correo Electrónico"
                  placeholder="ejemplo@utec.edu.uy"
                  type="email"
                  register={register}
                  inputFormName={"email"}
                  autoComplete="email"
                  required
                />
                <Input
                  label="Contraseña"
                  placeholder="Min. 8 caraceres"
                  type="password"
                  register={register}
                  inputFormName={"password"}
                  autoComplete="current-password"
                  required
                />
                {message && (
                 <OneLineError message={message}/>
                )}
                <div className="flex justify-between pt-2">
                  <Checkbox label="Recordar mi contraseña" />
                  <div className="font-medium text-principal select-none">
                    <Link href={appRoutes.login()}>
                      ¿Olvidaste tu contraseña?
                    </Link>
                  </div>
                </div>

                <Button
                  type="submit"
                  // action={() => console.log(register)}
                  text="Iniciar Sesión"
                />
              </FormContainer>
            </form>
          </FirstHalfContainer>
         </HalfScreenContainer>
      <HalfScreenContainer variant="secondHalf">
        <ImagesContainer>
          <Image
            src="/img/loginBG.svg"
            alt="Logo"
            objectFit="cover"
            layout="fill"
            className=""
          />
          <Image
            src="/img/callflowLogo.svg"
            alt="Logo"
            width={250}
            height={250}
          />
        </ImagesContainer>
      </HalfScreenContainer>
    </MainContainer>
  );
};

export default Login;
