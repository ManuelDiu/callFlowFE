import DropzoneFile from "@/components/DropzoneFile/DropzoneFile";
import Modal from "@/components/Modal/Modal";
import OneLineError from "@/components/OneLineError/OneLineError";
import UserInfoLine from "@/components/Table/components/UserInfoLine";
import { firmarArchivo } from "@/controllers/archivoController";
import { getLlamadoInfoById } from "@/controllers/llamadoController";
import { useGlobal } from "@/hooks/useGlobal";
import useUploadImage from "@/hooks/useUploadImage";
import { useMutation } from "@apollo/client";
import clsx from "clsx";
import { useState } from "react";
import { toast } from "react-toastify";
import styled from "styled-components";
import tw from "twin.macro";
import { ArchivoFirma, FullLlamadoInfo } from "types/llamado";

interface Props {
  onClose: any;
  llamadoInfo: FullLlamadoInfo;
  archivo: ArchivoFirma;
}

const Container = styled.div`
  ${tw`w-full h-auto flex flex-col gap-4 items-start justify-start`}
`;

const VerFirmasArchivoModal = ({ onClose, llamadoInfo, archivo }: Props) => {
  const handleRenderContent = () => {
    return (
      <Container>
        {llamadoInfo?.miembrosTribunal?.map((user) => {
          const hasFirma = archivo?.firmas?.find((firma) => {
            return firma?.usuario?.id === user?.id;
          });
          const defaultLabel = hasFirma ? "Firmó" : "No firmó";

          const userInfo = user?.usuario;
          return (
            <UserInfoLine
              className="shadow-md w-full rounded-2xl p-4 cursor-pointer"
              key={`userInfoLine-${userInfo?.id}`}
              userImage={userInfo?.imageUrl}
              userName={userInfo?.name}
              userlastName={userInfo?.lastName}
              withDot={false}
              options={[]}
              label={defaultLabel}
              labelClass={clsx('px-4 py-2 rounded-lg shadow-sm font-medium text-white' , hasFirma ? "bg-[#48D656]" : "bg-red-500")}
            />
          );
        })}
      </Container>
    );
  };

  return (
    <Modal
      textok={"Aceptar"}
      description={`Esto son los miembros del tribunal y el estado de su firma con el archivo ${archivo?.nombre}`}
      onSubmit={() => onClose()}
      setOpen={() => onClose()}
      content={handleRenderContent()}
      title={`Firmas archivo - ${archivo?.nombre} - ${llamadoInfo?.nombre}`}
      className=""
    />
  );
};

export default VerFirmasArchivoModal;
