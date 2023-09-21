import React, { useCallback, useEffect, useState } from "react";
import {
  useForm,
  SubmitHandler,
  RegisterOptions,
  useFormState,
  Resolver,
} from "react-hook-form";
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

type LoginFormFields = {
  email: string;
  password: string;
};

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
    <>
      <div className="w-full h-screen min-h-screen bg-white">
        <div className="flex w-full h-full">
          <div className="flex justify-center items-center w-1/2 h-full">
            <div className="flex flex-col w-full px-48 gap-7">
              <div>
                <h1 className="font-extrabold text-texto">Iniciar Sesión</h1>
                <p className="text-textogris">
                  ¡Ingresa tu usuario y contraseña para iniciar sesión!
                </p>
              </div>
              <form onSubmit={handleSubmit(onSubmitHandler)}>
                <div className="flex flex-col py-6 gap-5">
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
                </div>

                <div>
                  <Button
                    type="submit"
                    // action={() => console.log(register)}
                    text="Iniciar Sesión"
                  />
                </div>
              </form>
            </div>
          </div>
          <div className="flex justify-center w-1/2 h-full">
            <div className="flex w-full justify-center items-center bg-login rounded-bl-[200px] bg-no-repeat">
              <img
                src="/img/callflowLogo.svg"
                alt="Logo"
                className="absolute w-80 h-80"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
