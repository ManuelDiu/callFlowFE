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
import { Cargo } from "types/cargo";
import { ColumnItem } from "types/table";
import ProfileBar from "@/components/Topbar/ProfileBar";
import Breadcrumb from "@/components/Topbar/Breadcrumb";
import Head from "next/head";

// Icons
import { BiPlus } from "react-icons/bi";
import { AiOutlineCalendar, AiOutlineInfoCircle } from "react-icons/ai";

// Form
import {
  CreateCargoForm,
  cargoValidationSchema,
} from "@/forms/CreateCargoForm";
import { yupResolver } from "@hookform/resolvers/yup";
import { FormProvider, useForm } from "react-hook-form";

// GQL
import {
  createCargo,
  listarCargos,
  updateCargo,
  deleteCargo,
  createdCargoSubscription,
} from "@/controllers/cargoController";
import Button from "@/components/Buttons/Button";
import Modal from "@/components/Modal/Modal";
import AddCargoForm from "@/components/AddCargoForm/AddCargoForm";
import toast from "react-hot-toast";
import ModalConfirmation from "@/components/Modal/components/ModalConfirmation";

const cols: ColumnItem[] = [
  {
    title: "Nombre",
    icon: <AiOutlineInfoCircle color="#A3AED0" size={20} />,
    key: "name",
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

const Cargos = () => {
  const { data, loading } = useQuery<{ listarCargos: Cargo[] }>(listarCargos);
  const [createNewCargo] = useMutation(createCargo);
  const [updateSelectedCargo] = useMutation(updateCargo);
  const [handleDeleteCargo, { loading: deleteLoading }] = useMutation(
    deleteCargo
  );
  const client = useApolloClient();

  //State
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCargoToEdit, setSelectedCargoToEdit] = useState<
    Cargo | undefined
  >();
  const [selectedCargoToDelete, setSelectedCargoToDelete] = useState<
    Cargo | undefined
  >();
  const [normalErrors, setNormalErrors] = useState<string[]>([]);
  const { handleSetLoading } = useGlobal();

  const {
    data: subscriptionCreatedCargo,
    loading: subscriptionLoading,
  } = useSubscription(createdCargoSubscription);

  const createCargForm = useForm<CreateCargoForm>({
    resolver: yupResolver(cargoValidationSchema()),
  });

  useEffect(() => {
    if (subscriptionCreatedCargo?.cargoCreated) {
      const cargoCreated = subscriptionCreatedCargo?.data
        ?.cargoCreated as Cargo;

      const alreadyExists = data?.listarCargos?.find((item) => {
        return item?.id === cargoCreated?.id;
      });
      const formattedCargos = data?.listarCargos?.map((item) => {
        if (item?.id === cargoCreated?.id) {
          return cargoCreated;
        } else {
          return item;
        }
      });

      const newListOfCargos = alreadyExists
        ? formattedCargos
        : [
            ...(data?.listarCargos || []),
            {
              ...cargoCreated,
            },
          ];

      client.writeQuery({
        query: listarCargos,
        data: {
          listarCargos: newListOfCargos,
        },
      });
    }
  }, [subscriptionCreatedCargo?.cargoCreated]);

  useEffect(() => {
    handleSetLoading(loading || deleteLoading);
  }, [loading]);

  const isEditing = selectedCargoToEdit !== undefined;

  const { handleSubmit, reset } = createCargForm;

  useEffect(() => {
    if (!showCreateModal) {
      setNormalErrors([]);
      setSelectedCargoToEdit(undefined);
      reset();
    }
  }, [showCreateModal]);

  const deletCargo = async () => {
    if (selectedCargoToDelete?.id) {
      const resp = await handleDeleteCargo({
        variables: {
          data: { id: selectedCargoToDelete?.id },
        },
      });
      if (resp?.data?.deleteCargo?.ok === true) {
        toast.success("Cargo eliminado correctamente.");
        setSelectedCargoToDelete(undefined);
        setShowDeleteModal(false);
      } else {
        resp?.data?.deleteCargo.message
          ? toast.error(resp?.data?.deleteCargo.message)
          : toast.error("Error al eliminar cargo.");
      }
    }
  };

  const formatCargoData = data
    ? data?.listarCargos?.map((cargo: Cargo) => {
        return {
          name: (
            <Text
              text={cargo?.nombre}
              className={" text-texto font-bold !text-lg "}
            />
          ),
          updatedAt: <Text text={new Date(cargo.updatedAt).toDateString()} />,
          actions: (
            <ActionsList
              onDelete={() => {
                setSelectedCargoToDelete(cargo);
                setShowDeleteModal(true);
              }}
              onUpdate={() => {
                setSelectedCargoToEdit(cargo);
                setShowCreateModal(true);
              }}
              actions={["delete", "edit"]}
            />
          ),
        };
      })
    : [];

  const handleNext = async (data: CreateCargoForm) => {
    let allErrs: string[] = [];
    if (allErrs?.length > 0) {
      setNormalErrors(allErrs);
      return;
    }
    setNormalErrors([]);
    handleSetLoading(true);

    if (!isEditing) {
      const resp = await createNewCargo({
        variables: {
          data: {
            nombre: data?.nombre,
            tips: data?.tips,
          },
        },
      });

      if (resp?.data?.createCargo?.ok === true) {
        toast.success("Cargo creado correctamente.", {});
        setShowCreateModal(false);
      } else {
        resp?.data?.createCargo.message
          ? toast.error(resp?.data?.createCargo.message)
          : toast.error("Error al crear cargo.");
      }

      handleSetLoading(false);
    } else {
      const resp = await updateSelectedCargo({
        variables: {
          data: {
            id: selectedCargoToEdit?.id,
            cargo: data,
          },
        },
      });

      if (resp?.data?.updateCargo?.ok === true) {
        toast.success("Cargo actualizado correctamente.", {});
        setShowCreateModal(false);
      } else {
        resp?.data?.updateCargo.message
          ? toast.error(resp?.data?.updateCargo.message)
          : toast.error("Error al actualizar cargo.");
      }
      handleSetLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Cargos</title>
        <meta name="description" content="Listado de cargos" />
      </Head>
      {showDeleteModal && (
        <ModalConfirmation
          variant="red"
          textok="Sí, eliminar cargo"
          textcancel="Cancelar"
          onSubmit={() => deletCargo()}
          onCancel={() => setShowDeleteModal(false)}
          setOpen={setShowDeleteModal}
          title="¿Estas seguro que deseas eliminar este cargo?"
          description="Recuerda que sólo puedes eliminar cargos que aún no estén asociados a llamados."
        />
      )}
      {showCreateModal && (
        <FormProvider {...createCargForm}>
          <Modal
            textok={
              selectedCargoToEdit ? "Editar Cargo" : "Guardar Cargo"
            }
            textcancel="Cancelar"
            onSubmit={handleSubmit(handleNext)}
            onCancel={() => setShowCreateModal(false)}
            setOpen={setShowCreateModal}
            title={selectedCargoToEdit ? "Editar Cargo" : "Agregar Cargo"}
            content={
              <FormProvider {...createCargForm}>
                <AddCargoForm
                  selectedCategory={selectedCargoToEdit}
                  normalErrors={normalErrors}
                />
              </FormProvider>
            }
            description="Se procederá a crear un nuevo cargo en el sistema."
          />
        </FormProvider>
      )}
      <Topbar>
        <Breadcrumb title="Cargos" />
        <ProfileBar />
      </Topbar>
      <Container>
        <ActionRow>
          <Button
            variant="fill"
            icon={<BiPlus size={20} fontWeight={700} color="white" />}
            text="Agregar Cargo"
            action={() => setShowCreateModal(true)}
            className="w-auto"
          />
        </ActionRow>
        <Table title="Cargos" cols={cols} data={formatCargoData} />
      </Container>
    </>
  );
};

export default Cargos;
