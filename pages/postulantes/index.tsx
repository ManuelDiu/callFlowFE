import Table from "@/components/Table/Table";
import styled from "styled-components";
import tw from "twin.macro";
import {
  useApolloClient,
  useMutation,
  useQuery,
  useSubscription,
} from "@apollo/client";
import { useEffect, useState } from "react";
import { useGlobal } from "hooks/useGlobal";
import Text from "@/components/Table/components/Text";
import ActionsList from "@/components/Table/components/ActionsList";
import { ColumnItem } from "types/table";
import ProfileBar from "@/components/Topbar/ProfileBar";
import Breadcrumb from "@/components/Topbar/Breadcrumb";
import Head from "next/head";
import { PostulanteList } from "types/postulante";

// Icons
import { BiPlus } from "react-icons/bi";
import { AiOutlineCalendar, AiOutlineInfoCircle } from "react-icons/ai";

// Form
import { yupResolver } from "@hookform/resolvers/yup";
import { FormProvider, useForm } from "react-hook-form";

// GQL
import {
  createPostulante,
  listarPostulantes,
  updatePostulante,
  deletePostulante,
  createdPostulanteSubscription,
} from "@/controllers/postulanteController";
import Button from "@/components/Buttons/Button";
import Modal from "@/components/Modal/Modal";
import { toast } from "react-toastify";
import ModalConfirmation from "@/components/Modal/components/ModalConfirmation";
import {
  CreatePostulanteForm,
  postulanteValidationSchema,
} from "@/forms/CreatePostulanteForm";
import AddPostulanteForm from "@/components/AddPostulanteForm/AddPostulanteForm";
import UserInfoLine from "@/components/Table/components/UserInfoLine";
import { DEFAULT_USER_IMAGE } from "@/utils/userUtils";
"@/components/AddPostulanteForm/AddPostulanteForm";

const cols: ColumnItem[] = [
  {
    title: "Documento",
    icon: <AiOutlineInfoCircle color="#A3AED0" size={20} />,
    key: "documento",
  },
  {
    title: "Nombres",
    icon: <AiOutlineInfoCircle color="#A3AED0" size={20} />,
    key: "nombres",
  },
  {
    title: "Fecha Últ. Modificación",
    icon: <AiOutlineCalendar color="#A3AED0" size={20} />,
    key: "updatedAt",
  },
  {
    title: "",
    icon: "",
    key: "actions",
  },
];

const Container = styled.div`
  ${tw`w-full h-auto px-5 flex gap-5 flex-col items-center justify-start`}
`;

const Topbar = styled.div`
  ${tw`flex justify-between p-5 w-full h-max`}
`;

const ActionRow = styled.div`
  ${tw`w-full h-auto flex flex-row items-center justify-end gap-4`}
`;

const Postulantes = () => {
  const { data, loading } = useQuery<{ listarPostulantes: PostulanteList[] }>(
    listarPostulantes
  );
  const [createNewPostulante] = useMutation(createPostulante);
  const [updateSelectedPostulante] = useMutation(updatePostulante);
  const [handleDeletePostulante, { loading: deleteLoading }] = useMutation(
    deletePostulante
  );
  const client = useApolloClient();

  //State
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedPostToEdit, setSelectedPostToEdit] = useState<
    PostulanteList | undefined
  >();
  const [selectedPostToDelete, setSelectedPostToDelete] = useState<
    PostulanteList | undefined
  >();
  const [normalErrors, setNormalErrors] = useState<string[]>([]);
  const { handleSetLoading } = useGlobal();

  const {
    data: subscriptionPostulante,
    loading: subscriptionLoading,
  } = useSubscription(createdPostulanteSubscription);

  const createPostulForm = useForm<CreatePostulanteForm>({
    resolver: yupResolver(postulanteValidationSchema()),
  });

  useEffect(() => {
    if (subscriptionPostulante?.postulanteCreated) {
      const postulanteCreated = subscriptionPostulante?.data
        ?.postulanteCreated?.postulante as PostulanteList;

      const alreadyExists = data?.listarPostulantes?.find((item) => {
        return item?.id === postulanteCreated?.id;
      });
      const formattedTAs = data?.listarPostulantes?.map((item) => {
        if (item?.id === postulanteCreated?.id) {
          return postulanteCreated;
        } else {
          return item;
        }
      });

      const newListOfPostulantes = alreadyExists
        ? formattedTAs
        : [
            ...(data?.listarPostulantes || []),
            {
              ...postulanteCreated,
            },
          ];

      client.writeQuery({
        query: listarPostulantes,
        data: {
          listarPostulantes: newListOfPostulantes,
        },
      });
    }
  }, [subscriptionPostulante?.postulanteCreated]);

  useEffect(() => {
    handleSetLoading(loading || deleteLoading);
  }, [loading]);

  const isEditing = selectedPostToEdit !== undefined;

  const { handleSubmit, reset } = createPostulForm;

  useEffect(() => {
    if (!showCreateModal) {
      setNormalErrors([]);
      setSelectedPostToEdit(undefined);
      reset();
    }
  }, [showCreateModal]);

  const deletePostul = async () => {
    if (selectedPostToDelete?.id) {
      const resp = await handleDeletePostulante({
        variables: {
          data: { id: selectedPostToDelete?.id },
        },
      });
      if (resp?.data?.deletePostulante?.ok === true) {
        toast.success("Postulante eliminado correctamente.");
        setSelectedPostToDelete(undefined);
        setShowDeleteModal(false);
      } else {
        resp?.data?.deletePostulante.message
          ? toast.error(resp?.data?.deletePostulante.message)
          : toast.error("Error al eliminar postulante.");
      }
    }
  };

  const formatPostulanteData = data
    ? data?.listarPostulantes?.map((postulante: PostulanteList) => {
        return {
          nombres: (
            <UserInfoLine
              userImage={DEFAULT_USER_IMAGE}
              userName={postulante?.nombres}
              userlastName={postulante?.apellidos}
            />
          ),
          documento: (
            <Text
              text={postulante?.documento}
              className={" text-texto font-bold !text-lg "}
            />
          ),
          updatedAt: (
            <Text text={new Date(postulante.updatedAt).toDateString()} />
          ),
          actions: (
            <ActionsList
              onDelete={() => {
                setSelectedPostToDelete(postulante);
                setShowDeleteModal(true);
              }}
              onUpdate={() => {
                setSelectedPostToEdit(postulante);
                setShowCreateModal(true);
              }}
              actions={["delete", "edit"]}
            />
          ),
        };
      })
    : [];

  const handleNext = async (data: CreatePostulanteForm) => {
    let allErrs: string[] = [];
    if (allErrs?.length > 0) {
      setNormalErrors(allErrs);
      return;
    }
    setNormalErrors([]);
    handleSetLoading(true);

    if (!isEditing) {
      const resp = await createNewPostulante({
        variables: {
          data: {
            nombres: data?.nombres,
            apellidos: data?.apellidos,
            documento: data?.documento,
          },
        },
      });

      if (resp?.data?.createPostulante?.ok === true) {
        toast.success("Postulante creado correctamente.");
        setShowCreateModal(false);
      } else {
        resp?.data?.createPostulante.message
          ? toast.error(resp?.data?.createPostulante.message)
          : toast.error("Error al crear postulante.");
      }

      handleSetLoading(false);
    } else {
      const resp = await updateSelectedPostulante({
        variables: {
          data: {
            id: selectedPostToEdit?.id,
            postulante: data,
          },
        },
      });

      if (resp?.data?.updatePostulante?.ok === true) {
        toast.success("Postulante actualizado correctamente.", {});
        setShowCreateModal(false);
      } else {
        resp?.data?.updatePostulante.message
          ? toast.error(resp?.data?.updatePostulante.message)
          : toast.error("Error al actualizar el postulante.");
      }
      handleSetLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Postulantes</title>
        <meta name="description" content="Listado de Postulantes" />
      </Head>
      {showDeleteModal && (
        <ModalConfirmation
          variant="red"
          textok="Sí, eliminar postulante"
          textcancel="Cancelar"
          onSubmit={() => deletePostul()}
          onCancel={() => setShowDeleteModal(false)}
          setOpen={setShowDeleteModal}
          title="¿Estas seguro que deseas eliminar este postulante?"
          description="Recuerda que sólo puedes eliminar postulantes que aún no estén relacionados a algún llamado."
        />
      )}
      {showCreateModal && (
        <FormProvider {...createPostulForm}>
          <Modal
            textok={
              selectedPostToEdit
                ? "Editar Postulante"
                : "Guardar Postulante"
            }
            textcancel="Cancelar"
            onSubmit={handleSubmit(handleNext)}
            onCancel={() => setShowCreateModal(false)}
            setOpen={setShowCreateModal}
            title="Agregar Postulante"
            content={
              <FormProvider {...createPostulForm}>
                <AddPostulanteForm
                  selectedPostulante={selectedPostToEdit}
                  normalErrors={normalErrors}
                />
              </FormProvider>
            }
            description="Se procederá a crear un nuevo postulante en el sistema."
          />
        </FormProvider>
      )}
      <Topbar>
        <Breadcrumb title="Postulantes" />
        <ProfileBar />
      </Topbar>
      <Container>
        <ActionRow>
          <Button
            variant="fill"
            icon={<BiPlus size={20} fontWeight={700} color="white" />}
            text="Agregar Postulante"
            action={() => setShowCreateModal(true)}
            className="w-auto"
          />
        </ActionRow>
        <Table title="Postulantes" cols={cols} data={formatPostulanteData} />
      </Container>
    </>
  );
};

export default Postulantes;
