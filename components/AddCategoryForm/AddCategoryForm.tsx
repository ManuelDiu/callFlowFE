import styled from "styled-components";
import tw from "twin.macro";
import Input from "../Inputs/Input";
import { FormProvider, useForm, useFormContext } from "react-hook-form";
import { CreateCategoryFormFields } from "@/enums/CreateCategoryFormFields";
import {
  CreateCategoryForm,
  categoryValidationSchema,
} from "@/forms/CreateCategoryForm";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useState } from "react";
import OneLineError from "../OneLineError/OneLineError";
import { CategoriaItem } from "types/categoria";

interface Props {
  normalErrors?: string[];
  selectedCategory: CategoriaItem | undefined;
}

const Container = styled.div`
  ${tw`w-full h-auto flex flex-col gap-4 items-center justify-start`}
`;

const ErrorList = styled.div`
  ${tw`w-full h-auto flex flex-col gap-1`}
`;

const AddCategoryForm = ({
  normalErrors = [],
  selectedCategory,
}: Props) => {
  const createCategoryForm = useForm<CreateCategoryForm>({
    resolver: yupResolver(categoryValidationSchema()),
  });

  const {
    register,
    setValue,
    formState: { errors },
  } = useFormContext();

  useEffect(() => {
    if (selectedCategory) {
      setValue(CreateCategoryFormFields.nombre, selectedCategory.nombre);
    }
  }, [selectedCategory]);

  const formatErrors = errors as any;

  return (
    <FormProvider {...createCategoryForm}>
      <Container data-testId="Container">
        <Input
          label="Nombre"
          placeholder="Ingrese un nombre para la categoría"
          type="string"
          register={register}
          required
          isInvalid={!!errors[CreateCategoryFormFields.nombre]?.message}
          inputFormName={CreateCategoryFormFields.nombre}
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

export default AddCategoryForm;
