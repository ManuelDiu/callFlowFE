import styled from "styled-components";
import tw from "twin.macro";
import { useMutation } from "@apollo/client";
import {
  borrarDisponibilidad,
  listarDisponibilidad,
} from "@/controllers/disponibilidadController";
import { useGlobal } from "@/hooks/useGlobal";
import toast from "react-hot-toast";
import ModalConfirmation from "../Modal/components/ModalConfirmation";
import Input from "../Inputs/Input";
import { useForm } from "react-hook-form";
import {
  RenunciarLlamadoForm,
  RenunciarLlamadoFormFields,
  RenunciarLlamadoValidationSchema,
} from "@/forms/RenunciarLlamadoForm";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  getLlamadoInfoById,
  listarLlamados,
  renunciarLlamado,
} from "@/controllers/llamadoController";
import { useRouter } from "next/router";
import appRoutes from "@/routes/appRoutes";
import OneLineError from "../OneLineError/OneLineError";

interface Props {
  setOpen: any;
  llamadoId?: number;
}

const Container = styled.div`
  ${tw`w-full h-auto flex flex-col items-start gap-2 justify-center gap-2`}
`;

const RenunciarLlamadoModal = ({ setOpen, llamadoId }: Props) => {
  const { handleSetLoading, userInfo } = useGlobal();
  const [handleRenunciarLlamado] = useMutation(renunciarLlamado);
  const { push } = useRouter();
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<RenunciarLlamadoForm>({
    resolver: yupResolver(RenunciarLlamadoValidationSchema()),
  });

  const handleNext = async (data: RenunciarLlamadoForm) => {
    handleSetLoading(true);
    try {
      const resp = await handleRenunciarLlamado({
        variables: {
          info: {
            llamadoId: llamadoId,
            userId: userInfo?.id,
            motivoRenuncia: data?.motivoRenuncia,
          },
        },
        refetchQueries: [
          {
            query: listarLlamados,
          },
          {
            query: getLlamadoInfoById,
            variables: {
              llamadoId: Number(llamadoId),
            },
          },
        ],
      });
      if (resp?.data?.renunciarLlamado?.ok) {
        toast.success("Renunciate a este llamado");
        push(appRoutes.llamados());
      } else {
        toast.error("Errro renuncando al llamado");
      }
      handleSetLoading(false);
    } catch (error: any) {
      toast.error(error?.message || "Errro al renunciar al llamado");
      handleSetLoading(false);
    }
  };

  const handleRenderContent = () => {
    return (
      <Container>
        <Input
          label="Motivo renuncia"
          placeholder="Ingrese motivo renuncia"
          type="string"
          variante="textarea"
          register={register}
          required
          isInvalid={
            !!errors[RenunciarLlamadoFormFields.motivoRenuncia]?.message
          }
          inputFormName={RenunciarLlamadoFormFields.motivoRenuncia}
        />
         {!!errors[RenunciarLlamadoFormFields.motivoRenuncia]?.message && (
          <OneLineError
            message={errors[RenunciarLlamadoFormFields.motivoRenuncia]?.message}
          />
        )}
      </Container>
    );
  };

  return (
    <>
      <ModalConfirmation
        variant="red"
        textok="Si, renunciar"
        textcancel="Cancelar"
        onSubmit={handleSubmit(handleNext)}
        onCancel={() => setOpen(false)}
        setOpen={setOpen}
        content={handleRenderContent()}
        title="Estas seguro que deseas renunciar a este llamado?"
        description={`Si haces esto , dejaras de ser titular y no podras realizar acciones sobre el llamado que estas inscripto.`}
      />
    </>
  );
};

export default RenunciarLlamadoModal;
