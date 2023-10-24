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
import DatePicker from "react-date-picker";
import moment from "moment";
import { useState } from "react";
import TimePicker from "react-time-picker";

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
    setValue,
    getValues,
  } = useForm<CrearDisponibilidadForm>({
    resolver: yupResolver(CrearDisponibilidadValidation()),
  });
  const [handleCrearDisponibilidad] = useMutation(crearDisponibilidad);
  const { handleSetLoading } = useGlobal();
  const [selectedDate, setSelectedDate] = useState<any>(null);
  const [selectedTimeMin, setSelectedTimeMin] = useState<any>(null);
  const [selectedTimeMax, setSelectedTimeMax] = useState<any>(null);

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
        <label className="text-md font-medium text-texto select-none">
          Fecha
          <span className="text-principal">*</span>
        </label>
        <DatePicker
          minDate={new Date()}
          onChange={(val) => {
            setSelectedDate(val);
            const fecha = new Date(val?.toString() || "");
            const formattedFecha = moment(fecha)
              .format("DD/MM/YYYY")
              .toString();
            setValue(CrearDisponibilidadFormFields.fecha, formattedFecha);
          }}
          value={selectedDate}
        />
        {!!errors[CrearDisponibilidadFormFields.fecha]?.message && (
          <OneLineError
            message={errors[CrearDisponibilidadFormFields.fecha]?.message}
          />
        )}

        <label className="text-md font-medium text-texto select-none">
          Hora minima
          <span className="text-principal">*</span>
        </label>

        <TimePicker
          onChange={(val) => {
            setSelectedTimeMin(val);
            setValue(
              CrearDisponibilidadFormFields.horaMin,
              val?.toString() || ""
            );
          }}
          value={selectedTimeMin}
        />

        {!!errors[CrearDisponibilidadFormFields.horaMin]?.message && (
          <OneLineError
            message={errors[CrearDisponibilidadFormFields.horaMin]?.message}
          />
        )}

        <label className="text-md font-medium text-texto select-none">
          Hora maxima
          <span className="text-principal">*</span>
        </label>

        <TimePicker
          onChange={(val) => {
            setSelectedTimeMax(val);
            setValue(
              CrearDisponibilidadFormFields.horaMax,
              val?.toString() || ""
            );
          }}
          value={selectedTimeMax}
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
