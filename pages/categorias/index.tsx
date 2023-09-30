import Table from "@/components/Table/Table";
import styled from "styled-components";
import tw from "twin.macro";
import { useApolloClient, useMutation, useQuery, useSubscription } from "@apollo/client";
import { useEffect, useState } from "react";
import { useGlobal } from "hooks/useGlobal";
import Text from "@/components/Table/components/Text";
import ActionsList from "@/components/Table/components/ActionsList";
import { CategoriaItem } from "types/categoria";
import { ColumnItem } from "types/table";
import ProfileBar from "@/components/Topbar/ProfileBar";
import Breadcrumb from "@/components/Topbar/Breadcrumb";
import Head from "next/head";

// Icons
import { BiPlus } from "react-icons/bi";
import { AiOutlineCalendar, AiOutlineInfoCircle } from "react-icons/ai";

// Form
import {
  CreateCategoryForm,
  categoryValidationSchema,
} from "@/forms/CreateCategoryForm";
import { yupResolver } from "@hookform/resolvers/yup";
import { FormProvider, useForm } from "react-hook-form";

// GQL
import {
  createCategory,
  listCategorias,
  updateCategory,
  deleteCategory,
  createdCategorySubscription,
} from "@/controllers/categoriaController";
import Button from "@/components/Buttons/Button";
import Modal from "@/components/Modal/Modal";
import AddCategoryForm from "@/components/AddCategoryForm/AddCategoryForm";
import { toast } from "react-toastify";
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
  ${tw`flex justify-between p-5 w-full h-max`}
`;

const ActionRow = styled.div`
  ${tw`w-full h-auto flex flex-row items-center justify-end gap-4`}
`;

const Categorias = () => {
  const { data, loading } = useQuery<{ listCategorias: CategoriaItem[] }>(
    listCategorias
  );
  const [createNewCategory] = useMutation(createCategory);
  const [updateSelectedCategory] = useMutation(updateCategory);
  const [handleDeleteCategory, { loading: deleteLoading }] = useMutation(
    deleteCategory
  );
  const client = useApolloClient();

  //State
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCatToEdit, setSelectedCatToEdit] = useState<
  CategoriaItem | undefined
  >();
  const [selectedCatToDelete, setSelectedCatToDelete] = useState<
  CategoriaItem | undefined
  >();
  const [normalErrors, setNormalErrors] = useState<string[]>([]);
  const { handleSetLoading } = useGlobal();

  const { data: subscriptionCreatedCategory, loading: subscriptionLoading } =
    useSubscription(createdCategorySubscription);

  const createCatForm = useForm<CreateCategoryForm>({
    resolver: yupResolver(categoryValidationSchema()),
  });

  useEffect(() => {
    if (subscriptionCreatedCategory?.categoryCreated) {
      const categoryCreated = subscriptionCreatedCategory?.data
        ?.categoryCreated as CategoriaItem;

      const alreadyExists = data?.listCategorias?.find((item) => {
        return item?.id === categoryCreated?.id;
      });
      const formattedCats = data?.listCategorias?.map((item) => {
        if (item?.id === categoryCreated?.id) {
          return categoryCreated;
        } else {
          return item;
        }
      });

      const newListOfCategories = alreadyExists
        ? formattedCats
        : [
            ...(data?.listCategorias || []),
            {
              ...categoryCreated,
            },
          ];

      client.writeQuery({
        query: listCategorias,
        data: {
          listCategorias: newListOfCategories,
        },
      });
    }
  }, [subscriptionCreatedCategory?.categoryCreated]);

  useEffect(() => {
    handleSetLoading(loading || deleteLoading);
  }, [loading]);

  const isEditing = selectedCatToEdit !== undefined;


  const { handleSubmit, reset } = createCatForm;

  useEffect(() => {
    if (!showCreateModal) {
      setNormalErrors([]);
      setSelectedCatToEdit(undefined);
      reset();
    }
  }, [showCreateModal]);

  const deleteCat = async () => {
    if (selectedCatToDelete?.id) {
      const resp = await handleDeleteCategory({
        variables: {
          data: { id: selectedCatToDelete?.id },
        },
      });
      if (resp?.data?.deleteCategory?.ok === true) {
        toast.success("Categoría eliminada correctamente.");
        setSelectedCatToDelete(undefined);
        setShowDeleteModal(false);
      } else {
        resp?.data?.deleteCategory.message
          ? toast.error(resp?.data?.deleteCategory.message)
          : toast.error("Error al eliminar categoría.");
      }
    }
  };

  const formatCategoryData = data
    ? data?.listCategorias?.map((cat: CategoriaItem) => {
        return {
          name: (
            <Text
              text={cat?.nombre}
              className={" text-texto font-bold !text-lg "}
            />
          ),
          updatedAt: <Text text={new Date(cat.updatedAt).toDateString()} />,
          actions: (
            <ActionsList
              onDelete={() => {
                setSelectedCatToDelete(cat);
                setShowDeleteModal(true);
              }}
              onUpdate={() => {
                setSelectedCatToEdit(cat);
                setShowCreateModal(true);
              }}
              actions={["delete", "edit"]}
            />
          ),
        };
      })
    : [];

  const handleNext = async (data: CreateCategoryForm) => {
    let allErrs: string[] = [];
    if (allErrs?.length > 0) {
      setNormalErrors(allErrs);
      return;
    }
    setNormalErrors([]);
    handleSetLoading(true);

    if (!isEditing) {
      const resp = await createNewCategory({
        variables: {
          data: {
            nombre: data?.nombre,
          },
        },
      });

      if (resp?.data?.createCategory?.ok === true) {
        toast.success("Categoría creada correctamente.", {});
        setShowCreateModal(false);
      } else {
        resp?.data?.createCategory.message
          ? toast.error(resp?.data?.createCategory.message)
          : toast.error("Error al crear categoría.");
      }

      handleSetLoading(false);
    } else {
      const resp = await updateSelectedCategory({
        variables: {
          data: {
            id: selectedCatToEdit?.id,
            categoria: data,
          },
        },
      });

      if (resp?.data?.updateCategory?.ok === true) {
        toast.success("Categoría actualizada correctamente.", {});
        setShowCreateModal(false);
      } else {
        resp?.data?.updateCategory.message
          ? toast.error(resp?.data?.updateCategory.message)
          : toast.error("Error al actualizar categoria.");
      }
      handleSetLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Categorías</title>
        <meta name="description" content="Listado de categorías" />
      </Head>
      {/* TODO: Componentizar el componente topbar */}
      {showDeleteModal && (
        <ModalConfirmation
          variant="red"
          textok="Sí, eliminar categoría"
          textcancel="Cancelar"
          onSubmit={() => deleteCat()}
          onCancel={() => setShowDeleteModal(false)}
          setOpen={setShowDeleteModal}
          title="¿Estas seguro que deseas eliminar esta categoría?"
          description="Recuerda que sólo puedes eliminar categorías que no estén asociadas a llamados."
        />
      )}
      {showCreateModal && (
        <FormProvider {...createCatForm}>
          <Modal
            textok={
              selectedCatToEdit ? "Editar Categoría" : "Guardar Categoría"
            }
            textcancel="Cancelar"
            onSubmit={handleSubmit(handleNext)}
            onCancel={() => setShowCreateModal(false)}
            setOpen={setShowCreateModal}
            title="Agregar Categoría"
            content={
              <FormProvider {...createCatForm}>
                <AddCategoryForm
                  selectedCategory={selectedCatToEdit}
                  normalErrors={normalErrors}
                />
              </FormProvider>
            }
            description="Se procederá a crear una nueva categoría en el sistema."
          />
        </FormProvider>
      )}
      <Topbar>
        <Breadcrumb title="Categorías" />
        <ProfileBar />
      </Topbar>
      <Container>
        <ActionRow>
          <Button
            variant="fill"
            icon={<BiPlus size={20} fontWeight={700} color="white" />}
            text="Agregar Categoría"
            action={() => setShowCreateModal(true)}
            className="w-auto"
          />
        </ActionRow>
        <Table title="Categorías" cols={cols} data={formatCategoryData} />
      </Container>
    </>
  );
};

export default Categorias;
