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
import toast from "react-hot-toast";
import tw from "twin.macro";
import styled from "styled-components";
import { useWindowDimensions } from "@/hooks/useWindowDimensions";
import clsx from "clsx";
import Image from "next/image";

type ForgotPasswordFormFields = {
  email: string;
};

// Variants
type ContainerVariant = "firstHalf" | "secondHalf";

// Containers Props
interface ContainerProps {
  variant?: ContainerVariant;
}

const HalfScreenContainerVariants = {
  firstHalf: tw` items-center md:w-1/2 !w-full`,
  secondHalf: tw`md:flex !hidden`,
};

const MainContainer = styled.div(() => [
  tw`flex w-full h-screen min-h-screen bg-white`,
]);

const HalfScreenContainer = styled.div<ContainerProps>(() => [
  tw`flex justify-center w-1/2 h-full`,
  ({ variant = "firstHalf" }) => HalfScreenContainerVariants[variant],
]);

const FirstHalfContainer = styled.div(() => [
  tw`flex flex-col md:w-[400px] w-[90%] md:p-0 px-5 md:py-0 py-5 rounded-lg bg-white/100 gap-7`,
]);

const FormContainer = styled.div(() => [tw`flex flex-col py-6 gap-5`]);

const ImagesContainer = styled.div(() => [
  tw`flex w-full h-full relative w-full justify-center items-center md:rounded-bl-[200px] overflow-hidden`,
]);

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
  const { isMobile } = useWindowDimensions();

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
    <MainContainer>
      <HalfScreenContainer className="z-[20]">
        <FirstHalfContainer>
          <section>
            <h1 className="font-extrabold text-texto">
              Restablecer Contraseña
            </h1>
            <p className="text-textogris">
              ¡Restablece la contraseña de tu usuario!
            </p>
            <p className="text-textogris my-4">
              Te enviaremos un correo electronico en caso de que tu cuenta
              exista , para poder recuperar tu contraseña
            </p>
          </section>
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
                  <Link href={appRoutes.login()}>¿Ya tienes una cuenta?</Link>
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
        </FirstHalfContainer>
      </HalfScreenContainer>
      <HalfScreenContainer
        className={clsx(isMobile && "fixed inset-0 z-[10] h-full w-full")}
      >
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

export default ForgotPassword;
