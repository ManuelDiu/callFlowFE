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
import { TipoArchivoItem } from "types/tipoArchivo";

// Icons
import { BiPlus } from "react-icons/bi";
import { AiOutlineCalendar, AiOutlineInfoCircle } from "react-icons/ai";

// Form
import { yupResolver } from "@hookform/resolvers/yup";
import { FormProvider, useForm } from "react-hook-form";

// GQL
import {
  createTipoArchivo,
  listTiposArchivo,
  updateTipoArchivo,
  deleteTipoArchivo,
  createdTipoArchivoSubscription,
} from "@/controllers/tipoArchivoController";
import Button from "@/components/Buttons/Button";
import Modal from "@/components/Modal/Modal";
import { toast } from "react-toastify";
import ModalConfirmation from "@/components/Modal/components/ModalConfirmation";
import {
  CreateTipoArchivoForm,
  tipoArchivoValidationSchema,
} from "@/forms/CreateTipoArchivoForm";
import AddTipoArchivoForm from "@/components/AddTipoArchivoForm/AddTipoArchivoForm";

const cols: ColumnItem[] = [
  {
    title: "Nombre",
    icon: <AiOutlineInfoCircle color="#A3AED0" size={20} />,
    key: "name",
  },
  {
    title: "Origen",
    icon: <AiOutlineInfoCircle color="#A3AED0" size={20} />,
    key: "origen",
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
  ${tw`flex md:flex-row flex-col gap-2  justify-between p-5 w-full h-max`}
`;

const ActionRow = styled.div`
  ${tw`w-full h-auto flex flex-row items-center justify-end gap-4`}
`;

const TiposArchivo = () => {
  const { data, loading } = useQuery<{ listTiposArchivo: TipoArchivoItem[] }>(
    listTiposArchivo
  );
  const [createNewTipoArchivo] = useMutation(createTipoArchivo);
  const [updateSelectedTipoArchivo] = useMutation(updateTipoArchivo);
  const [handleDeleteTipoArchivo, { loading: deleteLoading }] = useMutation(
    deleteTipoArchivo
  );
  const client = useApolloClient();

  //State
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedTArchToEdit, setSelectedTArchToEdit] = useState<
    TipoArchivoItem | undefined
  >();
  const [selectedTArchToDelete, setSelectedTArchToDelete] = useState<
    TipoArchivoItem | undefined
  >();
  const [normalErrors, setNormalErrors] = useState<string[]>([]);
  const { handleSetLoading } = useGlobal();

  const {
    data: subscriptionTipoArchivo,
    loading: subscriptionLoading,
  } = useSubscription(createdTipoArchivoSubscription);

  const createTArchivoForm = useForm<CreateTipoArchivoForm>({
    // defaultValues: tipoArchivoDefaultValues,
    resolver: yupResolver(tipoArchivoValidationSchema()),
  });

  useEffect(() => {
    if (subscriptionTipoArchivo?.tipoArchivoCreated) {
      const tipoArchivoCreated = subscriptionTipoArchivo?.data
        ?.tipoArchivoCreated as TipoArchivoItem;

      const alreadyExists = data?.listTiposArchivo?.find((item) => {
        return item?.id === tipoArchivoCreated?.id;
      });
      const formattedTAs = data?.listTiposArchivo?.map((item) => {
        if (item?.id === tipoArchivoCreated?.id) {
          return tipoArchivoCreated;
        } else {
          return item;
        }
      });

      const newListOfTipoArch = alreadyExists
        ? formattedTAs
        : [
            ...(data?.listTiposArchivo || []),
            {
              ...tipoArchivoCreated,
            },
          ];

      client.writeQuery({
        query: listTiposArchivo,
        data: {
          listTiposArchivo: newListOfTipoArch,
        },
      });
    }
  }, [subscriptionTipoArchivo?.tipoArchivoCreated]);

  useEffect(() => {
    handleSetLoading(loading || deleteLoading);
  }, [loading]);

  const isEditing = selectedTArchToEdit !== undefined;

  const { handleSubmit, reset } = createTArchivoForm;

  useEffect(() => {
    if (!showCreateModal) {
      setNormalErrors([]);
      setSelectedTArchToEdit(undefined);
      reset();
    }
  }, [showCreateModal]);

  const deleteTArch = async () => {
    if (selectedTArchToDelete?.id) {
      const resp = await handleDeleteTipoArchivo({
        variables: {
          data: { id: selectedTArchToDelete?.id },
        },
      });
      if (resp?.data?.deleteTipoArchivo?.ok === true) {
        toast.success("Tipo de archivo eliminado correctamente.");
        setSelectedTArchToDelete(undefined);
        setShowDeleteModal(false);
      } else {
        resp?.data?.deleteTipoArchivo.message
          ? toast.error(resp?.data?.deleteTipoArchivo.message)
          : toast.error("Error al eliminar tipo de archivo.");
      }
    }
  };

  const formatTArchData = data
    ? data?.listTiposArchivo?.map((tArch: TipoArchivoItem) => {
        return {
          name: (
            <Text
              text={tArch?.nombre}
              className={" text-texto font-bold !text-lg "}
            />
          ),
          origen: (
            <Text
              text={tArch?.origen}
              className={" text-texto font-bold !text-lg "}
            />
          ),
          updatedAt: <Text text={new Date(tArch.updatedAt).toDateString()} />,
          actions: (
            <ActionsList
              onDelete={() => {
                setSelectedTArchToDelete(tArch);
                setShowDeleteModal(true);
              }}
              onUpdate={() => {
                setSelectedTArchToEdit(tArch);
                setShowCreateModal(true);
              }}
              actions={["delete", "edit"]}
            />
          ),
        };
      })
    : [];

  const handleNext = async (data: CreateTipoArchivoForm) => {
    let allErrs: string[] = [];
    if (allErrs?.length > 0) {
      setNormalErrors(allErrs);
      return;
    }
    setNormalErrors([]);
    handleSetLoading(true);

    if (!isEditing) {
      const resp = await createNewTipoArchivo({
        variables: {
          data: {
            nombre: data?.nombre,
            origen: data?.origen,
          },
        },
      });

      if (resp?.data?.createTipoArchivo?.ok === true) {
        toast.success("Tipo de archivo creado correctamente.", {});
        setShowCreateModal(false);
      } else {
        resp?.data?.createTipoArchivo.message
          ? toast.error(resp?.data?.createTipoArchivo.message)
          : toast.error("Error al crear tipo de archivo.");
      }

      handleSetLoading(false);
    } else {
      const resp = await updateSelectedTipoArchivo({
        variables: {
          data: {
            id: selectedTArchToEdit?.id,
            tipoArchivo: data,
          },
        },
      });

      if (resp?.data?.updateTipoArchivo?.ok === true) {
        toast.success("Tipo de archivo actualizado correctamente.", {});
        setShowCreateModal(false);
      } else {
        resp?.data?.updateTipoArchivo.message
          ? toast.error(resp?.data?.updateTipoArchivo.message)
          : toast.error("Error al actualizar el tipo de archivo.");
      }
      handleSetLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Tipos de Archivo</title>
        <meta name="description" content="Listado de tipos de archivo" />
      </Head>
      {showDeleteModal && (
        <ModalConfirmation
          variant="red"
          textok="Sí, eliminar tipo archivo"
          textcancel="Cancelar"
          onSubmit={() => deleteTArch()}
          onCancel={() => setShowDeleteModal(false)}
          setOpen={setShowDeleteModal}
          title="¿Estas seguro que deseas eliminar este tipo de archivo?"
          description="Recuerda que sólo puedes eliminar tipos de archivo que aún no estén relacionados a algún archivo."
        />
      )}
      {showCreateModal && (
        <FormProvider {...createTArchivoForm}>
          <Modal
            textok={
              selectedTArchToEdit
                ? "Editar Tipo Archivo"
                : "Guardar Tipo Archivo"
            }
            textcancel="Cancelar"
            onSubmit={handleSubmit(handleNext)}
            onCancel={() => setShowCreateModal(false)}
            setOpen={setShowCreateModal}
            title="Agregar Tipo de Archivo"
            content={
              <FormProvider {...createTArchivoForm}>
                <AddTipoArchivoForm
                  selectedTipoArchivo={selectedTArchToEdit}
                  normalErrors={normalErrors}
                />
              </FormProvider>
            }
            description="Se procederá a crear un nuevo tipo de archivo en el sistema."
          />
        </FormProvider>
      )}
      <Topbar>
        <Breadcrumb title="Tipos de Archivo" />
        <ProfileBar />
      </Topbar>
      <Container>
        <ActionRow>
          <Button
            variant="fill"
            icon={<BiPlus size={20} fontWeight={700} color="white" />}
            text="Agregar Tipo Archivo"
            action={() => setShowCreateModal(true)}
            className="w-auto"
          />
        </ActionRow>
        <Table title="Tipos de Archivo" cols={cols} data={formatTArchData} />
      </Container>
    </>
  );
};

export default TiposArchivo;
