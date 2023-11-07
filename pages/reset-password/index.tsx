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
import { gql, useMutation } from "@apollo/client";
import OneLineError from "@/components/OneLineError/OneLineError";
import { loginGraph, resetPassword } from "controllers/authControllers";
import { useGlobal } from "hooks/useGlobal";
import Input from "@/components/Inputs/Input";
import { useRouter } from "next/router";
import { resetPasswordValidation } from "@/forms/ResetPassword";
import toast from "react-hot-toast";
import styled from "styled-components";
import tw from "twin.macro";
import Image from "next/image";
import clsx from "clsx";
import { useWindowDimensions } from "@/hooks/useWindowDimensions";

type ResetPasswordFormFields = {
  password: string;
  confirmPassword: string;
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
  const { isMobile } = useWindowDimensions();

  const { handleSetLoading } = useGlobal();

  const [resetPass] = useMutation(resetPassword);

  useEffect(() => {
    if (errors.password?.message || errors.confirmPassword?.message) {
      setMessageError(
        errors?.password?.message || errors?.confirmPassword?.message || ""
      );
    }
  }, [errors]);

  const onSubmitHandler = async (data: ResetPasswordFormFields) => {
    try {
      if (data?.password !== data?.confirmPassword) {
        setMessageError("Las contraseñas no coinciden");
      }
      handleSetLoading(true);
  
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
        toast.error(
          "Error al cambiar la contraseña " + resp?.data?.resetPassword?.message
        );
      } else {
        toast.success("Contraseña cambiada correctamente");
      }
    } catch (error) {
      toast.error("Error al restablecer password")
    } finally {
      handleSetLoading(false);
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
          </section>
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

export default ResetPassword;
