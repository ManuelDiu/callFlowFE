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
import ModifyProfileInfo from "@/components/ModifyProfileInfoForm/ModifyProfileInfoForm";
import { UserList } from "types/usuario";
import { useMutation, useQuery } from "@apollo/client";
import { getUserInfoById, updateUserInfo } from "@/controllers/userController";
import ModalConfirmation from "@/components/Modal/components/ModalConfirmation";
import { toast } from "react-toastify";
import Button from "@/components/Buttons/Button";
import useUploadImage from "@/hooks/useUploadImage";
const Topbar = styled.div`
  ${tw`flex justify-between p-5 w-full h-max`}
`;

const MainContainer = styled.div`
  ${tw`flex flex-col gap-3 px-5 mb-5 items-center justify-center w-full`}
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
  ${tw`flex flex-col items-center justify-center w-full p-8 bg-white rounded-3xl shadow-md relative`}
`;

const ModificarInformacion: FC = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [normalErrors, setNormalErrors] = useState<string[]>([]);
  const { handleSetLoading, userInfo: usrLogg } = useGlobal();
  const [openConfirmationModal, setConfirmationModalOpen] = useState(false);
  const [handleUpdateUser] = useMutation(updateUserInfo);
  const { handleUpload } = useUploadImage({});
  const createModifyProfileForm = useForm<ModifyProfileInfoForm>({
    defaultValues: defaultValues,
    resolver: yupResolver(createModifyProfileInfoValidationSchema()),
  });
  const { handleSubmit } = createModifyProfileForm;

  const { data, loading } = useQuery<{
    getUserInfoById?: UserList;
  }>(getUserInfoById, {
    variables: {
      usrId: usrLogg?.id,
    },
  });

  const userInfo = data?.getUserInfoById;

  useEffect(() => {
    handleSetLoading(loading);
  }, [loading]);

  const handleNext = async (data: ModifyProfileInfoForm) => {
    let allErrs: any = [];
    if (allErrs?.length > 0) {
      setNormalErrors(allErrs);
      return;
    }
    setNormalErrors([]);
    handleSetLoading(true);

    const imageUrl = await handleUpload(selectedFile);
    const resp = await handleUpdateUser({
      variables: {
        updaetUserInfo: {
          id: userInfo?.id,
          name: data?.name,
          itr: data?.itr,
          roles: userInfo?.roles,
          telefono: data?.telefono,
          lastName: data?.lastName,
          imageUrl: imageUrl,
          email: data?.email,
          biografia: data?.biografia,
          documento: data?.documento,
        },
      },
      refetchQueries: [
        {
          query: getUserInfoById,
          variables: {
            usrId: usrLogg?.id,
          },
        },
      ],
    });

    if (resp?.data?.updateUser?.ok === true) {
      toast.success("Usuario actualizado correctamente", {});
    } else {
      toast.error("Error al actualizar usuario");
    }
    handleSetLoading(false);
    setConfirmationModalOpen(false);
  };
  return (
    <>
      {openConfirmationModal && (
        <ModalConfirmation
          variant="red"
          textok="Si, actualizar usuario"
          textcancel="Cancelar"
          onSubmit={handleSubmit(handleNext)}
          onCancel={() => setConfirmationModalOpen(false)}
          setOpen={setConfirmationModalOpen}
          title="¿Está seguro de que desea actualizar el usuario con los datos proporcionados?"
          description=""
        />
      )}
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
                ITR {userInfo?.itr}
              </span>
            </UserImageAndName>
          </TopSection>
          <FormSection>
            <FormProvider {...createModifyProfileForm}>
              <ModifyProfileInfo
                userInfo={userInfo}
                normalErrors={normalErrors}
              />
            </FormProvider>
          </FormSection>
          <Button
            text="Guardar información"
            variant="fill"
            action={() => setConfirmationModalOpen(true)}
            className="!py-2 !text-base"
            sizeVariant="fit"
          />
        </Content>
      </MainContainer>
    </>
  );
};

export default ModificarInformacion;
