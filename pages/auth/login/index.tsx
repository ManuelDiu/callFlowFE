import React, { useCallback } from "react";
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
import appRoutes from "../../../routes/appRoutes";
import Checkbox from "../../../components/Inputs/Checkbox";
import Button from "../../../components/Buttons/Button";

import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { loginValidationSchema } from "../../../forms/LoginForm";

type LoginFormFields = {
  email: string;
  password: string;
};

const Login: NextPage = () => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<LoginFormFields>({
    resolver: yupResolver(loginValidationSchema()),
    mode: "onSubmit",
  });
  const onSubmitHandler = (data: any) => {
    console.log(register);
    reset();
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
                  {(errors.email?.message || errors.password?.message) && (
                    <div className="flex gap-2 items-center text-red-600">
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M16 8C16 12.4183 12.4183 16 8 16C3.58172 16 0 12.4183 0 8C0 3.58172 3.58172 0 8 0C12.4183 0 16 3.58172 16 8ZM9 4C9 4.55228 8.55228 5 8 5C7.44772 5 7 4.55228 7 4C7 3.44772 7.44772 3 8 3C8.55228 3 9 3.44772 9 4ZM7 7C6.44772 7 6 7.44772 6 8C6 8.55229 6.44772 9 7 9V12C7 12.5523 7.44772 13 8 13H9C9.55228 13 10 12.5523 10 12C10 11.4477 9.55228 11 9 11V8C9 7.44772 8.55228 7 8 7H7Z"
                          fill="#E00000"
                        />
                      </svg>
                      <p>Completa tus credenciales para iniciar sesión.</p>
                    </div>
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
