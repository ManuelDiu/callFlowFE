import Table from "@/components/Table/Table";
import styled from "styled-components";
import tw from "twin.macro";
import {
  useApolloClient,
  useMutation,
  useQuery,
  useSubscription,
} from "@apollo/client";
import {
  createUser,
  createdUserSubscription,
  deleteUser,
  listUsers,
  updateUserInfo,
} from "@/controllers/userController";
import { useEffect, useState } from "react";
import { useGlobal } from "hooks/useGlobal";
import { UserList } from "types/usuario";
import Text from "@/components/Table/components/Text";
import { MdCancel } from "react-icons/md";
import { GoCheckCircleFill } from "react-icons/go";
import { Columns, DEFAULT_USER_IMAGE } from "@/utils/userUtils";
import UserInfoLine from "@/components/Table/components/UserInfoLine";
import ITRBubble from "@/components/Table/components/ITRBubble";
import ActionsList from "@/components/Table/components/ActionsList";
import Button from "@/components/Buttons/Button";
import { BiPlus, BiTrash } from "react-icons/bi";
import Breadcrumb from "@/components/Topbar/Breadcrumb";
import ProfileBar from "@/components/Topbar/ProfileBar";
import { Topbar } from "@/components/CheckTokenWrapper/CheckTokenWrapper";
import Modal from "@/components/Modal/Modal";
import AddUserForm from "@/components/AddUserForm/AddUserForm";
import { FormProvider, useForm } from "react-hook-form";
import {
  CreateUserForm,
  createUserValidationSchema,
  defaultValues,
} from "@/forms/CreateUserForm";
import { yupResolver } from "@hookform/resolvers/yup";
import OneLineError from "@/components/OneLineError/OneLineError";
import { DEFAULT_SELECT_ROLES_ERROR_MESSAGE } from "@/utils/errors";
import useUploadImage from "@/hooks/useUploadImage";
import { toast } from "react-toastify";
import ModalConfirmation from "@/components/Modal/components/ModalConfirmation";
import { useUsersOrder } from "@/hooks/useUsersOrder";
import appRoutes from "@/routes/appRoutes";

const Container = styled.div`
  ${tw`w-full max-h-full pb-5 h-auto p-5 py-0 flex gap-4 flex-col items-center justify-start`}
`;

const ActionRow = styled.div`
  ${tw`w-full h-auto flex flex-row items-center justify-end gap-4`}
`;

const Usuarios = () => {
  const { data, loading } = useQuery<{ listUsuarios: UserList[] }>(listUsers);
  const { handleSetLoading } = useGlobal();
  const { userInfo } = useGlobal();
  const [showAddModal, setShowAddModal] = useState(false);
  const [file, setFileSelected] = useState(false);
  const [normalErrors, setNormalErrors] = useState<string[]>([]);
  const { handleUpload } = useUploadImage({});
  const [createNewUser] = useMutation(createUser);
  const client = useApolloClient();
  const [openDeleteModal, setDeleteModalOpen] = useState(false);
  const [selectedUserToDelete, setSelectedUserToDelete] =
    useState<UserList | null>(null);
  const [handleDeleteUser, { loading: deleteLoading }] =
    useMutation(deleteUser);

  const [handleUpdateUser] = useMutation(updateUserInfo);
  const [selectedUserToEdit, setSelectedUserToEdit] = useState<
    UserList | undefined
  >();

  const { data: subscriptionCreatedUser, loading: createdLoading } =
    useSubscription(createdUserSubscription);

  const isEdit = selectedUserToEdit !== undefined;

  useEffect(() => {
    if (subscriptionCreatedUser?.userCreated) {
      const userCreated = subscriptionCreatedUser?.data
        ?.userCreated as UserList;

      const alreadyExists = data?.listUsuarios?.find((item) => {
        return item?.id === userCreated?.id;
      });
      const formattedUsers = data?.listUsuarios?.map((item) => {
        if (item?.id === userCreated?.id) {
          return userCreated;
        } else {
          return item;
        }
      });

      const newListOfUsers = alreadyExists
        ? formattedUsers
        : [
            ...(data?.listUsuarios || []),
            {
              ...userCreated,
              __typename: "UsuarioInfo",
            },
          ];

      client.writeQuery({
        query: listUsers,
        data: {
          listUsuarios: newListOfUsers,
        },
      });
    }
  }, [subscriptionCreatedUser?.userCreated]);

  useEffect(() => {
    handleSetLoading(loading || deleteLoading);
  }, [loading, deleteLoading]);

  const createUserForm = useForm<CreateUserForm>({
    defaultValues: defaultValues,
    resolver: yupResolver(createUserValidationSchema()),
  });

  const { handleSubmit, reset } = createUserForm;

  useEffect(() => {
    if (!showAddModal) {
      setNormalErrors([]);
      setSelectedUserToEdit(undefined);
      reset();
    }
  }, [showAddModal]);

  const borrarUsuario = async () => {
    if (selectedUserToDelete?.id) {
      const resp = await handleDeleteUser({
        variables: {
          uid: selectedUserToDelete?.id,
        },
      });
      if (resp?.data?.disabledUser?.ok === true) {
        toast.success("Usuario deshabilitado correctaemtne");
        setSelectedUserToDelete(null);
        setDeleteModalOpen(false);
      } else {
        toast.error("Error al deshabilitar usuario");
      }
    }
  };
  const { newOrder: newOrderUsers } = useUsersOrder({
    users: data?.listUsuarios || [],
  });

  const formatUserData = data
    ? newOrderUsers?.map((usr) => {
        return {
          email: <Text text={usr?.email} />,
          name: (
            <UserInfoLine
              userImage={usr?.imageUrl || DEFAULT_USER_IMAGE}
              userName={usr?.name}
              userlastName={usr?.lastName}
            />
          ),
          lastName: <Text text={usr?.lastName} />,
          roles: <Text text={usr?.roles?.toString() || "Vacio"} />,
          itr: <ITRBubble itr={usr?.itr!} />,
          llamados: <Text text={usr?.llamados?.toString()} />,
          activo: usr?.activo ? (
            <GoCheckCircleFill size={20} color="green" />
          ) : (
            <MdCancel size={20} color="red" />
          ),
          href: appRoutes.userProfilePage(usr?.id),
          actions:
            userInfo?.email !== usr?.email ? (
              <ActionsList
                onDelete={() => {
                  setSelectedUserToDelete(usr);
                  setDeleteModalOpen(true);
                }}
                onUpdate={() => {
                  setSelectedUserToEdit(usr);
                  setShowAddModal(true);
                }}
                actions={["delete", "edit"]}
              />
            ) : (
              <Text text="Yo" className="!text-[20px] w-full text-center" />
            ),
        };
      })
    : [];

  const handleNext = async (data: CreateUserForm) => {
    let allErrs = [];
    if (data?.roles?.length <= 0) {
      allErrs?.push(DEFAULT_SELECT_ROLES_ERROR_MESSAGE);
    }
    if (allErrs?.length > 0) {
      setNormalErrors(allErrs);
      return;
    }
    setNormalErrors([]);
    handleSetLoading(true);
    const imageUrl = await handleUpload(file);

    if (!isEdit) {
      const resp = await createNewUser({
        variables: {
          createUserData: {
            name: data?.name,
            itr: data?.itr,
            roles: data?.roles,
            telefono: data?.telefono,
            lastname: data?.lastName,
            image: imageUrl,
            email: data?.email,
            biografia: data?.biografia,
            documento: data?.document,
          },
        },
      });

      if (resp?.data?.createUser?.ok === true) {
        toast.success("Usuario agregado correctamente", {});
        setShowAddModal(false);
      } else {
        toast.error("Error al agergar usuario, tal vez el email ya exista");
      }

      handleSetLoading(false);
    } else {
      const resp = await handleUpdateUser({
        variables: {
          updaetUserInfo: {
            id: selectedUserToEdit?.id,
            name: data?.name,
            itr: data?.itr,
            roles: data?.roles,
            telefono: data?.telefono,
            lastName: data?.lastName,
            imageUrl: imageUrl,
            email: data?.email,
            biografia: data?.biografia,
            documento: data?.document,
          },
        },
      });

      if (resp?.data?.updateUser?.ok === true) {
        toast.success("Usuario actualizado correctamente", {});
        setShowAddModal(false);
      } else {
        toast.error("Error al actualizar usuario");
      }
      handleSetLoading(false);
    }
  };

  return (
    <Container>
      {openDeleteModal && (
        <ModalConfirmation
          variant="red"
          textok="Si, eliminar usuario"
          textcancel="Cancelar"
          onSubmit={() => borrarUsuario()}
          onCancel={() => setDeleteModalOpen(false)}
          setOpen={setDeleteModalOpen}
          title="Estas seguro que deseas eliminar a este usuario?"
          description="Si eliminas a este usuario, el mismo permanecera en el sistema pero como estado inactivo, por lo tanto no se podra loguear ni realizar las acciones requeridas para el sistema"
        />
      )}
      {showAddModal && (
        <FormProvider {...createUserForm}>
          <Modal
            textok={selectedUserToEdit ? "Editar Usuario" : "Guardar Usuario"}
            textcancel="Cancelar"
            onSubmit={handleSubmit(handleNext)}
            onCancel={() => setShowAddModal(false)}
            setOpen={setShowAddModal}
            title="Agregar Usuario"
            content={
              <FormProvider {...createUserForm}>
                <AddUserForm
                  selectedUser={selectedUserToEdit}
                  normalErrors={normalErrors}
                  setFile={setFileSelected}
                />
              </FormProvider>
            }
            description="Se procederá a agregar un nuevo usuario como miembro del tribunal, postulante o del Centro de Desarrollo de Personas (CDP) en el sistema. Una vez creado, se enviará un correo electrónico para la creación de una contraseña que permitirá el acceso a la plataforma."
          />
        </FormProvider>
      )}
      <Topbar>
        <Breadcrumb title="Usuarios" />
        <ProfileBar />
      </Topbar>
      <ActionRow>
        <Button
          variant="fill"
          icon={<BiPlus size={20} fontWeight={700} color="white" />}
          text="Agregar Usuario"
          action={() => setShowAddModal(true)}
          className="w-auto"
        />
      </ActionRow>
      <Table title="Usuarios" cols={Columns} data={formatUserData} />
    </Container>
  );
};

export default Usuarios;
