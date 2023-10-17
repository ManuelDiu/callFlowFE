import AvatarSelector from "@/components/Inputs/AvatarSelector";
import Breadcrumb from "@/components/Topbar/Breadcrumb";
import ProfileBar from "@/components/Topbar/ProfileBar";
import { useGlobal } from "@/hooks/useGlobal";
import Image from "next/image";
import React, { FC, useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import styled from "styled-components";
import tw from "twin.macro";
import {
  ModifyProfileInfoForm,
  createModifyProfileInfoValidationSchema,
  defaultValues,
} from "@/forms/ModifyProfileInfoForm";
import { yupResolver } from "@hookform/resolvers/yup";
import { UserList } from "types/usuario";
import { useMutation, useQuery } from "@apollo/client";
import { getUserInfoById, updateUserInfo } from "@/controllers/userController";
import ModalConfirmation from "@/components/Modal/components/ModalConfirmation";
import { toast } from "react-toastify";
import useUploadImage from "@/hooks/useUploadImage";
import { useRouter } from "next/router";
import Text from "@/components/Table/components/Text";
import { MdOutlineWhatsapp } from "react-icons/md";
import GmailIcon from "@/public/icons/GmailIcon.svg";
import { PiPhoneDuotone } from "react-icons/pi";
import Table from "@/components/Table/Table";
import { Columns, formatLlamadosToTable } from "@/utils/llamadoUtils";
import { LlamadoList } from "types/llamado";
import { listarLlamados } from "@/controllers/llamadoController";
import NotFoundPage from "@/components/NotFoundPage/NotFoundPage";
import appRoutes from "@/routes/appRoutes";

const Topbar = styled.div`
  ${tw`flex justify-between p-5 w-full h-max`}
`;

const MainContainer = styled.div`
  ${tw`flex flex-col gap-3 mb-5 items-center justify-center w-full`}
`;

const Content = styled.div`
  ${tw`flex flex-col items-center justify-start gap-5 w-5/6 rounded-3xl overflow-hidden`}
`;

const TopSection = styled.section`
  ${tw`flex flex-col items-center justify-center w-full bg-white rounded-3xl shadow-md`}
`;

const BGImage = styled.div`
  ${tw`relative w-full h-48 overflow-hidden`}
`;

const UserImageAndName = styled.div`
  ${tw`flex flex-col items-center justify-center w-full p-5 pt-0 -mt-[100px]`}
`;

const BlurredCircle = styled.div`
  ${tw`flex justify-center items-center min-w-[200px] w-[200px] h-[200px] rounded-full backdrop-blur-3xl`}
`;

const ImageSelectorContainer = styled.div`
  ${tw`min-w-[180px] w-[180px] h-[180px]`}
`;

const FormSection = styled.section`
  ${tw`flex flex-col items-center justify-center w-full p-8 bg-white rounded-3xl shadow-md relative mb-5`}
`;

const UserProfile: FC = () => {
  const router = useRouter();
  const { query } = useRouter();
  const userId = Number(query?.userId || 0);

  const [selectedFile, setSelectedFile] = useState(null);
  const { handleSetLoading } = useGlobal();

  const { data, loading } = useQuery<{
    getUserInfoById?: UserList;
  }>(getUserInfoById, {
    variables: {
      usrId: userId,
    },
  });

  const { data: dataLlamados, loading: loadingLlamados } = useQuery<{
    listarLlamados: LlamadoList[];
  }>(listarLlamados, {
    variables: {},
  });

  const userInfo = data?.getUserInfoById;
  const rows = formatLlamadosToTable(dataLlamados?.listarLlamados || []);

  useEffect(() => {
    handleSetLoading(loading || loadingLlamados);
  }, [loading, loadingLlamados]);

  if (loading) {
    return null;
  }

  const userDoesntExist = !data?.getUserInfoById?.id;
  if (userDoesntExist && !loading) {
    return <NotFoundPage />;
  }

  return (
    <>
      <Topbar>
        <Breadcrumb title="Modificar Información" />
        <ProfileBar />
      </Topbar>
      <MainContainer>
        <Content>
          <TopSection>
            <BGImage>
              <Image
                src="/img/loginBG.svg"
                alt="backgorund image"
                objectFit="cover"
                layout="fill"
                objectPosition="top"
              />
            </BGImage>
            <UserImageAndName>
              <BlurredCircle>
                <ImageSelectorContainer>
                  <AvatarSelector
                    defaultImage={userInfo?.imageUrl}
                    setFile={setSelectedFile}
                  />
                </ImageSelectorContainer>
              </BlurredCircle>
              <span className="text-texto text-2xl font-semibold">{`${userInfo?.name} ${userInfo?.lastName}`}</span>
              <span className="text-textogris text-md font-semibold">
                {userInfo?.roles.map(
                  (rol, index) =>
                    `${rol}${index + 1 < userInfo?.roles.length ? "," : "."} `
                )}
              </span>
              <span className="text-textogris text-md font-semibold">
                ITR {userInfo?.itr?.replace("_", " ")}
              </span>
            </UserImageAndName>
            <div className="flex flex-col justify-center items-center w-full pb-5">
              <div className="flex gap-10 w-full justify-center items-center pb-3">
                <a
                  target="_blank"
                  rel="noreferrer"
                  title="Enviar mensaje a whatsapp."
                  href={`https://wa.me/598${userInfo?.telefono}`}
                  className="p-1 rounded-full shadow-2xl active:shadow-inner"
                >
                  <MdOutlineWhatsapp className="fill-green" size={50} />
                </a>
                <a
                  href={`mailTo:${userInfo?.email}`}
                  title="Enviar correo."
                  className="flex p-1 rounded-full shadow-2xl active:shadow-inner"
                >
                  <Image
                    src={GmailIcon?.src}
                    alt="gmail icon"
                    width={50}
                    height={50}
                  />
                </a>
                <a
                  href={`tel:+598${userInfo?.telefono}`}
                  title="Iniciar llamada telefónica."
                  className="p-1 rounded-full shadow-2xl active:shadow-inner"
                >
                  <PiPhoneDuotone className="fill-blue-600" size={50} />
                </a>
              </div>
              {userInfo?.biografia && (
                <>
                  <Text text="Biografía" className="!text-lg" />
                  <p className="w-5/6 text-center break-words font-medium text-textoGray">
                    {userInfo?.biografia}
                  </p>
                </>
              )}
            </div>
          </TopSection>
          {userInfo && (
            <Table
              multiDisabled={false}
              title="Llamados en los que participa"
              cols={Columns}
              data={rows}
              others={
                <div className="flex justify-center w-full">
                  <button
                    onClick={() => router.push(appRoutes.llamados())}
                    className="font-medium text-principal rounded-full px-4 py-1 bg-principal/5"
                  >
                    Ver más
                  </button>
                </div>
              }
            />
          )}
        </Content>
      </MainContainer>
    </>
  );
};

export default UserProfile;
