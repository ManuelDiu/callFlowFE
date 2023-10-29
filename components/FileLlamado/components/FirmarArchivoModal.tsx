import DropzoneFile from "@/components/DropzoneFile/DropzoneFile";
import Modal from "@/components/Modal/Modal";
import OneLineError from "@/components/OneLineError/OneLineError";
import { firmarArchivo } from "@/controllers/archivoController";
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
  archivo: ArchivoFirma;
}

const Container = styled.div`
  ${tw`w-full h-auto flex flex-col gap-4 items-start justify-start`}
`;

const FirmarArchivoModal = ({ onClose, llamadoInfo, archivo }: Props) => {
  const [selectedFile, setSelectedFile] = useState<File | undefined>(undefined);
  const [formSubmitted, setFormSubmitted] = useState<boolean>(false);
  const { handleSetLoading } = useGlobal();
  const [error, setError] = useState<string | undefined>(undefined);
  const [signFile] = useMutation(firmarArchivo);
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
          archivoFirmaId: archivo?.id,
          url: urlFile,
        };
        const resp = await signFile({
          variables: {
            info: dataToSend,
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
        if (resp?.data?.firmarArchivo?.ok) {
          toast.success("Archivo firmado correctamente");
        } else {
          toast.error("Error al subir archivo");
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
      textok={"Subir Firma"}
      description="Por favor, descargue el archivo que desea firmar, añada su firma con su gestor de firmas favorito y proceda a cargar el documento debidamente firmado con el fin de garantizar su correcto funcionamiento."
      textcancel="Cancelar"
      onSubmit={() => handleSubmit()}
      onCancel={() => onClose()}
      setOpen={() => onClose()}
      content={handleRenderContent()}
      title={`Firmar archivo - ${archivo?.nombre} - ${llamadoInfo?.nombre}`}
      className=""
    />
  );
};

export default FirmarArchivoModal;
