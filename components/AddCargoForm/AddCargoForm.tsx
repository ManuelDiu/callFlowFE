import styled from "styled-components";
import tw from "twin.macro";
import Input from "../Inputs/Input";
import { FormProvider, useForm, useFormContext } from "react-hook-form";
import { CreateCargoFormFields } from "@/enums/CreateCargoFormFields";
import {
  CreateCargoForm,
  cargoValidationSchema,
} from "@/forms/CreateCargoForm";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect } from "react";
import OneLineError from "../OneLineError/OneLineError";
import { Cargo } from "types/cargo";

interface Props {
  normalErrors?: string[];
  selectedCargo: Cargo | undefined;
}

const Container = styled.div`
  ${tw`w-full h-auto flex flex-col gap-4 items-center justify-start`}
`;

const ErrorList = styled.div`
  ${tw`w-full h-auto flex flex-col gap-1`}
`;

const AddCargoForm = ({ normalErrors = [], selectedCargo }: Props) => {
  const createCargoForm = useForm<CreateCargoForm>({
    resolver: yupResolver(cargoValidationSchema()),
  });

  const {
    register,
    setValue,
    formState: { errors },
  } = useFormContext();

  useEffect(() => {
    if (selectedCargo) {
      setValue(CreateCargoFormFields.nombre, selectedCargo.nombre);
      setValue(CreateCargoFormFields.tips, selectedCargo.tips);
    }
  }, [selectedCargo]);

  const formatErrors = errors as any;

  return (
    <FormProvider {...createCargoForm}>
      <Container data-testid="Container">
        <Input
          label="Nombre"
          placeholder="Ingrese un nombre para el cargo"
          type="string"
          register={register}
          required
          isInvalid={!!errors[CreateCargoFormFields.nombre]?.message}
          inputFormName={CreateCargoFormFields.nombre}
        />
        <Input
          label="Tips a recordar al momento de las entrevistas"
          placeholder="Ingrese tips"
          variante="textarea"
          register={register}
          required
          isInvalid={!!errors[CreateCargoFormFields.tips]?.message}
          inputFormName={CreateCargoFormFields.tips}
        />
      </Container>
      {normalErrors?.length > 0 && (
        <ErrorList>
          {normalErrors.map((err: string, index) => {
            return <OneLineError key={`error-${index}`} message={err || ""} />;
          })}
        </ErrorList>
      )}
      {Object.keys(formatErrors)?.length > 0 && (
        <ErrorList>
          {Object.keys(formatErrors)?.map((errKey: any, index) => {
            return (
              <OneLineError
                key={`error-${index}`}
                message={formatErrors[errKey]?.message || ""}
              />
            );
          })}
        </ErrorList>
      )}
    </FormProvider>
  );
};

export default AddCargoForm;
