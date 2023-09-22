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
import appRoutes from "@/routes/appRoutes";
import Checkbox from "@/components/Inputs/Checkbox";
import Button from "@/components/Buttons/Button";

import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { loginValidationSchema } from "@/forms/LoginForm";
import { gql, useMutation } from "@apollo/client";
import OneLineError from "@/components/OneLineError/OneLineError";
import { loginGraph, resetPassword } from "controllers/authControllers";
import { useAuth } from "hooks/useAuth";
import Input from "@/components/Inputs/Input";
import { useRouter } from "next/router";
import { resetPasswordValidation } from "@/forms/ResetPassword";
import { toast } from "react-toastify";

type ResetPasswordFormFields = {
  password: string;
  confirmPassword: string;
};

const ResetPassword: NextPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormFields>({
    resolver: yupResolver(resetPasswordValidation()),
    mode: "onSubmit",
  });
  const [message, setMessageError] = useState<string | null>(null);

  const { query } = useRouter();
  const token = query?.token;

  const { handleSetToken } = useAuth();

  const [resetPass, { loading }] = useMutation(resetPassword);

  useEffect(() => {
    if (errors.password?.message || errors.confirmPassword?.message) {
      setMessageError(
        errors?.password?.message || errors?.confirmPassword?.message || ""
      );
    }
  }, [errors]);

  const onSubmitHandler = async (data: ResetPasswordFormFields) => {
    if (data?.password !== data?.confirmPassword) {
      setMessageError("Las contraseñas no coinciden");
    }

    const resp = await resetPass({
      variables: {
        info: {
          password: data?.password,
          newPassword: data?.confirmPassword,
          token: token,
        },
      },
    });

    if (resp?.data?.resetPassword?.ok === false) {
      toast.error("Error al cambiar la contraseña");
    } else {
      toast.success("Contraseña cambiada correctamente " + resp?.data?.resetPassword?.message);
    }
  };

  return (
    <>
      <div className="w-full h-screen min-h-screen bg-white">
        <div className="flex w-full h-full">
          <div className="flex justify-center items-center w-1/2 h-full">
            {token ? (
              <div className="flex flex-col w-full px-48 gap-7">
                <div>
                  <h1 className="font-extrabold text-texto">
                    Restablecer Contraseña
                  </h1>
                  <p className="text-textogris">
                    ¡Restablece la contraseña de tu usuario!
                  </p>
                </div>
                <form onSubmit={handleSubmit(onSubmitHandler)}>
                  <div className="flex flex-col py-6 gap-5">
                    <Input
                      label="Contraseña"
                      placeholder="Min. 8 caraceres"
                      type="password"
                      register={register}
                      inputFormName={"password"}
                      autoComplete="current-password"
                      required
                    />
                    <Input
                      label="Repetir Contraseña"
                      placeholder="Min. 8 caraceres"
                      type="password"
                      register={register}
                      inputFormName={"confirmPassword"}
                      autoComplete="current-password"
                      required
                    />
                    {message && <OneLineError message={message} />}
                    <div className="flex justify-between pt-2">
                      <div className="font-medium text-principal select-none">
                        <Link href={appRoutes.login()}>
                          ¿Ya tienes una cuenta?
                        </Link>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Button
                      type="submit"
                      // action={() => console.log(register)}
                      text="Restablecer Contraseña"
                    />
                  </div>
                </form>
              </div>
            ) : (
              <span className="text-gray-900 font-medium">Token invalido</span>
            )}
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

export default ResetPassword;
