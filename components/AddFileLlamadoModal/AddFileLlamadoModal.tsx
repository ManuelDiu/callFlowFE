import styled from "styled-components";
import Modal from "../Modal/Modal";
import tw from "twin.macro";
import Link from "next/link";
import appRoutes from "@/routes/appRoutes";
import { useEffect, useState } from "react";
import { useGlobal } from "@/hooks/useGlobal";
import OneLineError from "../OneLineError/OneLineError";
import { TribunalInfo } from "types/usuario";
import Input from "../Inputs/Input";
import DropzoneFile from "../DropzoneFile/DropzoneFile";
import Dropdown from "../Inputs/Dropdown";
import { useMutation, useQuery } from "@apollo/client";
import { TipoArchivoItem } from "types/tipoArchivo";
import { listTiposArchivo } from "@/controllers/tipoArchivoController";
import { TipoArchivoOrigen } from "@/enums/TipoArchivoOrigen";
import { formatFileTypeToDropdown } from "@/utils/llamadoUtils";
import useUploadImage from "@/hooks/useUploadImage";
import { useRouter } from "next/router";
import {
  addFileToLlamado,
  getLlamadoInfoById,
} from "@/controllers/llamadoController";
import { toast } from "react-toastify";
import ModalConfirmation from "../Modal/components/ModalConfirmation";
import { Archivo } from "types/llamado";

interface Props {
  setOpen: any;
  archivos: Archivo[];
}

const Container = styled.div`
  ${tw`w-full h-auto flex flex-col gap-2 items-center justify-start`}
`;

const SuggestText = styled.span`
  ${tw`w-full h-auto text-left text-sm text-textoGray`}
`;

const ErrorContainer = styled.span`
  ${tw`w-full h-auto flex flex-row items-center justify-start`}
`;

const AddFileLlamadoModal = ({ setOpen, archivos }: Props) => {
  const { handleSetLoading } = useGlobal();
  const { query } = useRouter();
  const llamadoId = query?.llamadoId;
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File>();
  const [selectedFileType, setSelectedFileType] = useState<number>();
  const { data, loading: loadingTipoArchivo } = useQuery<{
    listTiposArchivo: TipoArchivoItem[];
  }>(listTiposArchivo);
  const { handleUpload } = useUploadImage();
  const [handleAddFile] = useMutation(addFileToLlamado);
  const [existsWithSameType, setExistsWithSameType] = useState(false);

  const fileTypes = data?.listTiposArchivo;
  const selectedFileTypeInfo = fileTypes?.find(
    (itm) => itm?.id === selectedFileType
  );

  const fileTypesLlamado =
    fileTypes?.filter((item) => item?.origen === TipoArchivoOrigen.llamado) ||
    [];

  useEffect(() => {
    handleSetLoading(loadingTipoArchivo);
  }, [loadingTipoArchivo]);

  const handleValidate = () => {
    const existsWithSame = archivos?.find(
      (itm) => itm?.tipoArchivo?.nombre === selectedFileTypeInfo?.nombre
    );
    if (existsWithSame) {
      setExistsWithSameType(true);
    } else {
      handleNext();
    }
  };

  const handleNext = async () => {
    try {
      setFormSubmitted(true);
      if (!selectedFile || !name || name === "" || !selectedFileType) {
        setError("Completa los campos requeridos para continuar");
        return;
      }
      setError(null);
      handleSetLoading(true);
      const fileLink = await handleUpload(selectedFile);
      const dataToSend = {
        nombre: name,
        url: fileLink,
        extension: selectedFile.type,
        tipoArchivo: selectedFileType,
        llamadoId: Number(llamadoId || 0),
      };
      const resp = await handleAddFile({
        variables: {
          dataFile: dataToSend,
        },
        refetchQueries: [
          {
            query: getLlamadoInfoById,
            variables: {
              llamadoId: Number(llamadoId),
            },
          },
        ],
      });
      if (resp?.data?.addFileToLlamado?.ok === true) {
        toast.success("Archivo agregado correctamente");
        setOpen(false);
      } else {
        toast.error("Error al agregar archivo al llamado");
      }
      handleSetLoading(false);
    } catch (error) {
      setError("Error al subir archivo, comuniquese con soporte");
    }
  };

  const handleRenderContent = () => {
    return (
      <Container className="">
        <DropzoneFile
          isInvalid={!selectedFile && formSubmitted}
          setFile={setSelectedFile}
        />
        <Input
          label="Nombre"
          isInvalid={!name && formSubmitted}
          placeholder="Ingrese un nombre"
          type="text"
          min={1}
          required
          onChange={(val: any) => setName(val?.target?.value || 0)}
        />
        <Dropdown
          defaultValue={[]}
          label="Seleccione un tipo"
          isInvalid={formSubmitted && !selectedFileType}
          placeholder="Seleccione la categoria de este archivo"
          onChange={(val: any) => setSelectedFileType(val?.value)}
          required
          items={formatFileTypeToDropdown(fileTypesLlamado)}
        />
        <ErrorContainer>
          {error && <OneLineError message={error} />}
        </ErrorContainer>
        <SuggestText>
          No existe el tipo de archivo que deseas agregar?{" "}
          <Link href={appRoutes.tiposArchivo()}>
            <span className="text-principal cursor-pointer">
              Agrega uno nuevo
            </span>
          </Link>
        </SuggestText>
      </Container>
    );
  };

  return (
    <>
      <Modal
        textok={"Agregar"}
        description="Permite agregar nuevos archivos en un llamado, con cualqueir extension"
        textcancel="Cancelar"
        onSubmit={() => handleValidate()}
        onCancel={() => setOpen(false)}
        setOpen={setOpen}
        content={handleRenderContent()}
        title="Agregar Archivo"
        className=""
      />
      {existsWithSameType && (
        <ModalConfirmation
          variant="red"
          textok="Si, agregar"
          textcancel="Cancelar"
          onSubmit={() => handleNext()}
          onCancel={() => setExistsWithSameType(false)}
          setOpen={setExistsWithSameType}
          title="Estas seguro que deseas agregar este tipo de archivo?"
          description={`Al parecer el ya tienes un archivo con el tipo archivo llamado '${selectedFileTypeInfo?.nombre}' en este llamado, deseas agregarlo igualmente?`}
        />
      )}
    </>
  );
};

export default AddFileLlamadoModal;
