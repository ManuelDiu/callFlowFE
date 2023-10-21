import styled from "styled-components";
import tw from "twin.macro";
import Input from "../Inputs/Input";
import { FormProvider, useForm, useFormContext } from "react-hook-form";
import { CreateUserFormFields } from "@/enums/CreateUserFormFields";
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
  setFile: any;
  normalErrors?: string[];
  selectedUser: UserList | undefined;
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

const ImageSelectorContainer = styled.div`
  ${tw`min-w-[180px] w-[180px] h-[180px] flex items-center justify-center`}
`;

const ErrorList = styled.div`
  ${tw`w-full h-auto flex flex-col gap-1`}
`;

const AddUserForm = ({ setFile, normalErrors = [], selectedUser }: Props) => {
  const createUserForm = useForm<CreateUserForm>({
    defaultValues: defaultValues,
    resolver: yupResolver(createUserValidationSchema()),
  });
  const [selectedUserFile, setSelectedUserFile] = useState(null);
  const [showITR, setShowITR] = useState(false);

  useEffect(() => {
    setFile(selectedUserFile);
  }, [selectedUserFile]);

  const {
    register,
    setValue,
    formState: { errors },
    watch,
    getValues,
  } = useFormContext();

  useEffect(() => {
    if (selectedUser) {
      setValue(CreateUserFormFields.biografia, selectedUser.biografia);
      setValue(CreateUserFormFields.email, selectedUser.email);
      setValue(CreateUserFormFields.lastName, selectedUser.lastName);
      setValue(CreateUserFormFields.name, selectedUser.name);
      setValue(CreateUserFormFields.telefono, selectedUser.telefono);
      setValue(CreateUserFormFields.document, selectedUser?.documento);
    }
  }, [selectedUser]);

  const formatErrors = errors as any;

  useEffect(() => {
    const value = getValues(CreateUserFormFields.roles);
    if (value && value?.includes(Roles.admin)) {
      setShowITR(true);
    } else {
      setShowITR(false);
    }
  }, [watch(CreateUserFormFields.roles)]);

  return (
    <FormProvider {...createUserForm}>
      <Container>
        <Row>
          <ImageSelectorContainer>
            <AvatarSelector
              defaultImage={selectedUser?.imageUrl}
              setFile={setSelectedUserFile}
            />
          </ImageSelectorContainer>
          <Col>
            <Input
              label="Nombres"
              placeholder="Ingrese un nombre"
              type="text"
              register={register}
              isInvalid={!!errors[CreateUserFormFields.name]?.message}
              required
              inputFormName={CreateUserFormFields.name}
            />
            <Input
              isInvalid={!!errors[CreateUserFormFields.lastName]?.message}
              label="Apellidos"
              placeholder="Ingrese un apellido"
              type="text"
              register={register}
              required
              inputFormName={CreateUserFormFields.lastName}
            />
          </Col>
        </Row>
        <Input
          label="Documento"
          placeholder="Ingrese un documento"
          type="string"
          register={register}
          required
          isInvalid={!!errors[CreateUserFormFields.document]?.message}
          inputFormName={CreateUserFormFields.document}
        />
        <Input
          label="Telefono"
          placeholder="Ingrese un Telefono"
          isInvalid={!!errors[CreateUserFormFields.telefono]?.message}
          type="string"
          register={register}
          required
          inputFormName={CreateUserFormFields.telefono}
        />
        <Input
          label="Correo electronico"
          placeholder="Ingrese un email"
          disabled={selectedUser !== undefined && selectedUser !== null}
          type="email"
          register={register}
          required
          inputFormName={CreateUserFormFields.email}
          isInvalid={!!errors[CreateUserFormFields.email]?.message}
        />
        <Dropdown
          defaultValue={selectedUser?.roles || []}
          label="Roles"
          placeholder="Seleccione roles"
          isInvalid={
            normalErrors?.includes(DEFAULT_SELECT_ROLES_ERROR_MESSAGE) &&
            getValues(CreateUserFormFields.roles).length === 0
          }
          onChange={(val: any) => {
            setValue(
              CreateUserFormFields.roles,
              val?.map((item: any) => item?.value)
            );
          }}
          required
          multiSelect
          items={[
            { label: "Admin", value: Roles.admin },
            { label: "Tribunal", value: Roles.tribunal },
            { label: "Solicitante", value: Roles.cordinador },
          ]}
          inputFormName={CreateUserFormFields.roles}
        />

        {showITR && (
          <Dropdown
            defaultValue={selectedUser?.itr ? [selectedUser?.itr] : []}
            label="ITR"
            isInvalid={!!errors[CreateUserFormFields.itr]?.message}
            placeholder="Seleccione un ITR"
            onChange={(val: any) =>
              setValue(CreateUserFormFields.itr, val?.value)
            }
            required
            items={[
              { label: "Suroeste", value: ITR.suroeste },
              { label: "Este", value: ITR.este },
              { label: "Norte", value: ITR.norte },
              { label: "Centro Sur", value: ITR.centrosur },
              { label: "ULO", value: ITR.ulo },
            ]}
            inputFormName={CreateUserFormFields.itr}
          />
        )}

        <Input
          label="Biografia"
          placeholder="Ingrese una biografia"
          type="text"
          isInvalid={!!errors[CreateUserFormFields.biografia]?.message}
          variante="textarea"
          register={register}
          required
          inputFormName={CreateUserFormFields.biografia}
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

export default AddUserForm;
