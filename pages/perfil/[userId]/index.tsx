import AvatarSelector from "@/components/Inputs/AvatarSelector";
import Breadcrumb from "@/components/Topbar/Breadcrumb";
import ProfileBar from "@/components/Topbar/ProfileBar";
import { useGlobal } from "@/hooks/useGlobal";
import Image from "next/image";
import React, { FC, useEffect, useState } from "react";
import styled from "styled-components";
import tw from "twin.macro";
import { UserList } from "types/usuario";
import { useQuery } from "@apollo/client";
import { getUserInfoById, updateUserInfo } from "@/controllers/userController";
import { useRouter } from "next/router";
import Text from "@/components/Table/components/Text";
import { MdOutlineWhatsapp } from "react-icons/md";
import GmailIcon from "@/public/icons/GmailIcon.svg";
import { PiPhoneDuotone } from "react-icons/pi";
import Table from "@/components/Table/Table";
import { Columns, formatLlamadosToTable } from "@/utils/llamadoUtils";
import { LlamadoList } from "types/llamado";
import { listLlamadosByUser } from "@/controllers/llamadoController";
import NotFoundPage from "@/components/NotFoundPage/NotFoundPage";
import appRoutes from "@/routes/appRoutes";
import { DEFAULT_USER_IMAGE } from "@/utils/userUtils";

const Topbar = styled.div`
  ${tw`flex md:flex-row flex-col gap-2  justify-between p-5 w-full h-max`}
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
  ${tw`relative min-w-[180px] w-[100px] h-[180px]`}
`;

const ContactAndBiography = styled.div`
  ${tw`flex flex-col justify-center items-center w-full pb-5`}
`;

const ContactIcons = styled.div`
  ${tw`flex gap-10 w-full justify-center items-center pb-3`}
`;

const ContactItem = styled.a`
  ${tw`flex p-1 rounded-full shadow-2xl active:shadow-inner`}
`;

const ShowMore = styled.a`
  ${tw`flex justify-center w-full`}
`;

const UserProfile: FC = () => {
  const router = useRouter();
  const { query } = useRouter();
  const userId = Number(query?.userId || 0);

  const { handleSetLoading } = useGlobal();

  const { data, loading } = useQuery<{
    getUserInfoById?: UserList;
  }>(getUserInfoById, {
    variables: {
      usrId: userId,
    },
  });

  const { data: dataLlamados, loading: loadingLlamados } = useQuery<{
    listarLlamadosByUser: LlamadoList[];
  }>(listLlamadosByUser, {
    variables: { userId },
  });

  const userInfo = data?.getUserInfoById;
  const rows = formatLlamadosToTable(dataLlamados?.listarLlamadosByUser || []);

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
        <Breadcrumb title="Perfil del Usuario" />
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
                  <Image
                    src={userInfo?.imageUrl || DEFAULT_USER_IMAGE}
                    alt="Imagen del usuario"
                    objectFit="fill"
                    layout="fill"
                    className="rounded-full"
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
            <ContactAndBiography>
              <ContactIcons>
                <ContactItem
                  target="_blank"
                  rel="noreferrer"
                  title="Enviar mensaje a whatsapp."
                  href={`https://wa.me/598${userInfo?.telefono}`}
                >
                  <MdOutlineWhatsapp className="fill-green" size={50} />
                </ContactItem>
                <ContactItem
                  href={`mailTo:${userInfo?.email}`}
                  title="Enviar correo."
                >
                  <Image
                    src={GmailIcon?.src}
                    alt="gmail icon"
                    width={50}
                    height={50}
                  />
                </ContactItem>
                <ContactItem
                  href={`tel:+598${userInfo?.telefono}`}
                  title="Iniciar llamada telefónica."
                >
                  <PiPhoneDuotone className="fill-blue-600" size={50} />
                </ContactItem>
              </ContactIcons>
              {userInfo?.biografia && (
                <>
                  <Text text="Biografía" className="!text-lg" />
                  <p className="w-5/6 text-center break-words font-medium text-textoGray">
                    {userInfo?.biografia}
                  </p>
                </>
              )}
            </ContactAndBiography>
          </TopSection>
          {userInfo && (
            <Table
              multiDisabled={false}
              title="Llamados en los que participa"
              cols={Columns}
              data={rows}
              others={
                <ShowMore>
                  <button
                    onClick={() => router.push(appRoutes.llamados())}
                    className="font-medium text-principal rounded-full px-4 py-1 bg-principal/5"
                  >
                    Ver más
                  </button>
                </ShowMore>
              }
            />
          )}
        </Content>
      </MainContainer>
    </>
  );
};

export default UserProfile;
