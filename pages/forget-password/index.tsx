import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import type { NextPage } from "next";
import Link from "next/link";
import appRoutes from "@/routes/appRoutes";
import Button from "@/components/Buttons/Button";

import { yupResolver } from "@hookform/resolvers/yup";
import OneLineError from "@/components/OneLineError/OneLineError";
import { useGlobal } from "hooks/useGlobal";
import Input from "@/components/Inputs/Input";
import { useRouter } from "next/router";
import { forgetPasswordValidation } from "@/forms/ForgetPassword";
import { useMutation } from "@apollo/client";
import { forgetPassword } from "@/controllers/authControllers";
import { toast } from "react-toastify";

type ForgotPasswordFormFields = {
  email: string;
};

const ForgotPassword: NextPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormFields>({
    resolver: yupResolver(forgetPasswordValidation()),
    mode: "onSubmit",
  });
  const [message, setMessageError] = useState<string | null>(null);

  const { handleSetToken, handleSetLoading } = useGlobal();

  const [frgtPassword] = useMutation(forgetPassword);

  useEffect(() => {
    if (errors.email?.message) {
      setMessageError(errors?.email?.message || "");
    }
  }, [errors]);

  const onSubmitHandler = async (data: ForgotPasswordFormFields) => {
    handleSetLoading(true);
    const resp = await frgtPassword({
      variables: {
        data: {
          email: data?.email,
        },
      },
    });
    handleSetLoading(false);

    if (resp?.data?.forgetPassword?.ok === true) {
      toast.success("Se envio un correo con los siguientes pasos");
    } else {
      toast.error(
        "Error, contacte al desarollador " + resp?.data?.resetPassword?.message
      );
    }
  };

  return (
    <>
      <div className="w-full h-screen min-h-screen bg-white">
        <div className="flex w-full h-full">
          <div className="flex justify-center items-center w-1/2 h-full">
            <div className="flex flex-col w-full w-[400px] gap-7">
              <div>
                <h1 className="font-extrabold text-texto">
                  Restablecer Contraseña
                </h1>
                <p className="text-textogris">
                  ¡Restablece la contraseña de tu usuario!
                </p>
                <p className="text-textogris">
                  Te enviaremos un correo electronico en caso de que tu cuenta
                  exista , para poder recuperar tu contraseña
                </p>
              </div>
              <form onSubmit={handleSubmit(onSubmitHandler)}>
                <div className="flex flex-col py-6 gap-5">
                  <Input
                    label="Email"
                    placeholder="Ingrese un email"
                    type="email"
                    register={register}
                    inputFormName={"email"}
                    autoComplete="email"
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

                  <Button
                    type="submit"
                    sizeVariant="full"
                    // action={() => console.log(register)}
                    text="Restablecer Contraseña"
                  />
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

export default ForgotPassword;
