import Button from "@/components/Buttons/Button";
import Input from "@/components/Inputs/Input";
import Modal from "@/components/Modal/Modal";
import OneLineError from "@/components/OneLineError/OneLineError";
import {
  crearDisponibilidad,
  listarDisponibilidad,
} from "@/controllers/disponibilidadController";
import {
  CrearDisponibilidadForm,
  CrearDisponibilidadFormFields,
  CrearDisponibilidadValidation,
} from "@/forms/CreateDisponibilidadForm";
import { useGlobal } from "@/hooks/useGlobal";
import { useMutation } from "@apollo/client";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import styled from "styled-components";
import tw from "twin.macro";

interface Props {
  setOpen: any;
  llamadoId: any;
}

const Container = styled.div`
  ${tw`w-full h-auto flex flex-col items-start justify-start gap-4`}
`;

const AgregarDisponibilidadModal = ({ setOpen, llamadoId }: Props) => {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<CrearDisponibilidadForm>({
    resolver: yupResolver(CrearDisponibilidadValidation()),
  });
  const [handleCrearDisponibilidad] = useMutation(crearDisponibilidad);
  const { handleSetLoading } = useGlobal();

  const handleNext = async (data: CrearDisponibilidadForm) => {
    handleSetLoading(true);
    const dataToSend = {
      fecha: data.fecha,
      horaMin: data.horaMin,
      llamadoId: llamadoId,
      horaMax: data.horaMax,
    };

    const resp = await handleCrearDisponibilidad({
      variables: {
        data: dataToSend,
      },
      refetchQueries: [
        {
          query: listarDisponibilidad,
          variables: {
            llamadoId: Number(llamadoId),
          },
        },
      ],
    });
    if (resp?.data?.crearDisponibilidad?.ok) {
      toast.success("Disponibilidad agregada correctamente");
      setOpen(false);
    } else {
      toast.error("Error al agregar disponibilidad");
    }
    handleSetLoading(false);
  };

  const handleRenderContent = () => {
    return (
      <Container>
        <Input
          label="Fecha"
          placeholder="Ingrese una fecha (dd:mm:yyyy)"
          type="string"
          required
          register={register}
          isInvalid={!!errors[CrearDisponibilidadFormFields.fecha]?.message}
          inputFormName={CrearDisponibilidadFormFields.fecha}
        />
        {!!errors[CrearDisponibilidadFormFields.fecha]?.message && (
          <OneLineError
            message={errors[CrearDisponibilidadFormFields.fecha]?.message}
          />
        )}

        <Input
          label="Hora minima"
          placeholder="Ingrese una hora minima (hh:mm)"
          type="string"
          required
          register={register}
          isInvalid={!!errors[CrearDisponibilidadFormFields.horaMin]?.message}
          inputFormName={CrearDisponibilidadFormFields.horaMin}
        />
        {!!errors[CrearDisponibilidadFormFields.horaMin]?.message && (
          <OneLineError
            message={errors[CrearDisponibilidadFormFields.horaMin]?.message}
          />
        )}

        <Input
          label="Hora maxima"
          placeholder="Ingrese una hora maxima (hh:mm)"
          type="string"
          required
          register={register}
          isInvalid={!!errors[CrearDisponibilidadFormFields.horaMax]?.message}
          inputFormName={CrearDisponibilidadFormFields.horaMax}
        />
        {!!errors[CrearDisponibilidadFormFields.horaMax]?.message && (
          <OneLineError
            message={errors[CrearDisponibilidadFormFields.horaMax]?.message}
          />
        )}
      </Container>
    );
  };

  return (
    <>
      <Modal
        textok={"Agregar"}
        description="Permite agregar la disponibilidad por todos los miembros del tribunal y cordinar las entrevistas"
        textcancel="Cancelar"
        onSubmit={handleSubmit(handleNext)}
        onCancel={() => setOpen(false)}
        setOpen={setOpen}
        content={handleRenderContent()}
        title="Agregar disponibilidad"
        className=""
      />
    </>
  );
};

export default AgregarDisponibilidadModal;
