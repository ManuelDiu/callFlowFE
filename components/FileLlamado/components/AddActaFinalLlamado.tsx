import DropzoneFile from "@/components/DropzoneFile/DropzoneFile";
import Modal from "@/components/Modal/Modal";
import OneLineError from "@/components/OneLineError/OneLineError";
import {
  addArchivoFirmaToLlamado,
  firmarArchivo,
} from "@/controllers/archivoController";
import { getLlamadoInfoById } from "@/controllers/llamadoController";
import { useGlobal } from "@/hooks/useGlobal";
import useUploadImage from "@/hooks/useUploadImage";
import { useMutation } from "@apollo/client";
import { useState } from "react";
import { toast } from "react-toastify";
import styled from "styled-components";
import tw from "twin.macro";
import { ArchivoFirma, FullLlamadoInfo } from "types/llamado";

interface Props {
  onClose: any;
  llamadoInfo: FullLlamadoInfo;
}

const Container = styled.div`
  ${tw`w-full h-auto flex flex-col gap-4 items-start justify-start`}
`;

const AddActaFinalLlamado = ({ onClose, llamadoInfo }: Props) => {
  const [selectedFile, setSelectedFile] = useState<File | undefined>(undefined);
  const [formSubmitted, setFormSubmitted] = useState<boolean>(false);
  const { handleSetLoading } = useGlobal();
  const [error, setError] = useState<string | undefined>(undefined);
  const [handleAddFile] = useMutation(addArchivoFirmaToLlamado);

  const { handleUpload } = useUploadImage({});

  const handleRenderContent = () => {
    return (
      <Container>
        <DropzoneFile
          accept=".pdf"
          isInvalid={!selectedFile && formSubmitted}
          setFile={setSelectedFile}
        />
        {error && <OneLineError message={error} />}
      </Container>
    );
  };

  const handleSubmit = async () => {
    setFormSubmitted(true);
    if (!selectedFile) {
      setError("Debes subir un archivo para continuar");
    } else {
      try {
        handleSetLoading(true);

        const urlFile = await handleUpload(selectedFile);
        const dataToSend = {
          nombre: "Acta",
          url: urlFile,
          extension: "pdf",
          llamadoId: Number(llamadoInfo?.id || 0),
        };

        const resp = await handleAddFile({
          variables: {
            dataFile: dataToSend,
          },
          refetchQueries: [
            {
              query: getLlamadoInfoById,
              variables: {
                llamadoId: Number(llamadoInfo?.id),
              },
            },
          ],
        });

        if (resp?.data?.addArchivoFirmaToLlamado?.ok) {
          toast.success(
            "Acta final subida correctamente, se envio un email a todos los miembros del tribunal para que firmen la misma"
          );
        } else {
          throw new Error("Error subiendo acta final");
        }
      } catch (error) {
        setError("Error al firmar archivo, intentalo mas tarde");
        toast.error("Error al firmar archivo, intentalo mas tarde");
      } finally {
        handleSetLoading(false);
      }
    }
  };

  return (
    <Modal
      textok={"Subir Acta"}
      description="Agrega el acta final del llamado para que los miembros del tribunal puedan firmar la misma"
      textcancel="Cancelar"
      onSubmit={() => handleSubmit()}
      onCancel={() => onClose()}
      setOpen={() => onClose()}
      content={handleRenderContent()}
      title={`Agregar acta final - ${llamadoInfo?.nombre}`}
      className=""
    />
  );
};

export default AddActaFinalLlamado;
