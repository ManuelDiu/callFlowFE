import styled from "styled-components";
import tw from "twin.macro";
import Input from "../Inputs/Input";
import { FormProvider, useForm, useFormContext } from "react-hook-form";
import { ModifyProfileInfoFormFields } from "@/forms/ModifyProfileInfoForm";
import {
  CreateUserForm,
  createUserValidationSchema,
  defaultValues,
} from "@/forms/CreateUserForm";
import { yupResolver } from "@hookform/resolvers/yup";
import Dropdown from "../Inputs/Dropdown";
import { ITR } from "@/enums/ITR";
import { useEffect, useState } from "react";
import { Roles } from "@/enums/Roles";
import AvatarSelector from "../Inputs/AvatarSelector";
import OneLineError from "../OneLineError/OneLineError";
import { DEFAULT_SELECT_ROLES_ERROR_MESSAGE } from "@/utils/errors";
import { UserList } from "types/usuario";

interface Props {
  normalErrors?: string[];
  userInfo: UserList | undefined;
}

const Container = styled.div`
  ${tw`w-full h-auto flex flex-col gap-4 items-center justify-start`}
`;
const Row = styled.div`
  ${tw`w-full flex flex-row items-center justify-center gap-4`}
`;

const Col = styled.div`
  ${tw`w-full flex flex-col items-start justify-start gap-4`}
`;

const ErrorList = styled.div`
  ${tw`w-full h-auto flex flex-col gap-1`}
`;

const ModifyProfileInfoForm = ({
  normalErrors = [],
  userInfo,
}: Props) => {
  const createUserForm = useForm<CreateUserForm>({
    defaultValues: defaultValues,
    resolver: yupResolver(createUserValidationSchema()),
  });

  const {
    register,
    setValue,
    formState: { errors },
    getValues,
  } = useFormContext();

  useEffect(() => {
    if (userInfo) {
      setValue(ModifyProfileInfoFormFields.biografia, userInfo.biografia);
      setValue(ModifyProfileInfoFormFields.email, userInfo.email);
      setValue(ModifyProfileInfoFormFields.lastName, userInfo.lastName);
      setValue(ModifyProfileInfoFormFields.name, userInfo.name);
      setValue(ModifyProfileInfoFormFields.itr, userInfo.itr);
      setValue(ModifyProfileInfoFormFields.telefono, userInfo.telefono);
      setValue(ModifyProfileInfoFormFields.documento, userInfo?.documento);
    }
  }, [userInfo]);

  const formatErrors = errors as any;

  return (
    <FormProvider {...createUserForm}>
      <Container>
        <Row>
          <Col>
            <Input
              label="Nombres"
              placeholder="Ingrese un nombre"
              type="text"
              register={register}
              isInvalid={!!errors[ModifyProfileInfoFormFields.name]?.message}
              required
              inputFormName={ModifyProfileInfoFormFields.name}
            />
            <Input
              isInvalid={!!errors[ModifyProfileInfoFormFields.lastName]?.message}
              label="Apellidos"
              placeholder="Ingrese un apellido"
              type="text"
              register={register}
              required
              inputFormName={ModifyProfileInfoFormFields.lastName}
            />
          </Col>
        </Row>
        <Input
          label="Documento"
          placeholder="Ingrese un documento"
          type="string"
          register={register}
          disabled={userInfo?.roles.find((rol: Roles) => rol === Roles.admin ) ? false : true}
          required
          isInvalid={!!errors[ModifyProfileInfoFormFields.documento]?.message}
          inputFormName={ModifyProfileInfoFormFields.documento}
        />
        <Input
          label="Telefono"
          placeholder="Ingrese un Telefono"
          isInvalid={!!errors[ModifyProfileInfoFormFields.telefono]?.message}
          type="string"
          register={register}
          required
          inputFormName={ModifyProfileInfoFormFields.telefono}
        />
        <Input
          label="Correo electronico"
          placeholder="Ingrese un email"
          disabled={userInfo !== undefined && userInfo !== null}
          type="email"
          register={register}
          required
          inputFormName={ModifyProfileInfoFormFields.email}
          isInvalid={!!errors[ModifyProfileInfoFormFields.email]?.message}
        />

        <Dropdown
          defaultValue={userInfo?.itr ? [userInfo?.itr] : []}
          label="ITR"
          isInvalid={!!errors[ModifyProfileInfoFormFields.itr]?.message}
          placeholder={userInfo ? userInfo.itr :"Seleccione un ITR"}
          onChange={(val: any) =>
            setValue(ModifyProfileInfoFormFields.itr, val?.value)
          }
          required
          items={[
            { label: "Suroeste", value: ITR.suroeste },
            { label: "Este", value: ITR.este },
            { label: "Norte", value: ITR.norte },
            { label: "Centro Sur", value: ITR.centrosur },
            { label: "ULO", value: ITR.ulo },
          ]}
          inputFormName={ModifyProfileInfoFormFields.itr}
        />

        {/* <Dropdown
          defaultValue={userInfo?.roles || []}
          label="Roles"
          placeholder="Seleccione roles"
          isInvalid={
            normalErrors?.includes(DEFAULT_SELECT_ROLES_ERROR_MESSAGE) &&
            getValues(ModifyProfileInfoFormFields.roles).length === 0
          }
          onChange={(val: any) => {
            setValue(
              ModifyProfileInfoFormFields.roles,
              val?.map((item: any) => item?.value)
            );
          }}
          required
          multiSelect
          items={[
            { label: "Admin", value: Roles.admin },
            { label: "Tribunal", value: Roles.tribunal },
            { label: "Cordinador", value: Roles.cordinador },
          ]}
          inputFormName={ModifyProfileInfoFormFields.roles}
        /> */}

        <Input
          label="Biografia"
          placeholder="Ingrese una biografia"
          type="text"
          isInvalid={!!errors[ModifyProfileInfoFormFields.biografia]?.message}
          variante="textarea"
          register={register}
          required
          inputFormName={ModifyProfileInfoFormFields.biografia}
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

export default ModifyProfileInfoForm;
