import Table from "@/components/Table/Table";
import styled from "styled-components";
import tw from "twin.macro";
import { useQuery } from "@apollo/client";
import { listCategorias } from "@/controllers/categoriaController";
import { useEffect } from "react";
import { useGlobal } from "hooks/useGlobal";
import { UserList } from "types/usuario";
import Text from "@/components/Table/components/Text";
import { MdCancel } from "react-icons/md";
import { GoCheckCircleFill } from "react-icons/go";
import { Columns, DEFAULT_USER_IMAGE } from "@/utils/userUtils";
import UserInfoLine from "@/components/Table/components/UserInfoLine";
import ITRBubble from "@/components/Table/components/ITRBubble";
import ActionsList from "@/components/Table/components/ActionsList";
import { CategoriaItem } from "types/categoria";
import { ColumnItem } from "types/table";
import { AiOutlineInfoCircle } from "react-icons/ai";
import ProfileBar from "@/components/Topbar/ProfileBar";
import Breadcrumb from "@/components/Topbar/Breadcrumb";
import Head from "next/head";

export const cols: ColumnItem[] = [
  {
    title: "Nombre",
    icon: <AiOutlineInfoCircle color="#A3AED0" size={20} />,
    key: "name",
  },
  {
    title: "Fecha Últ. Modificación",
    icon: <AiOutlineInfoCircle color="#A3AED0" size={20} />,
    key: "updatedAt",
  },
  {
    title: "",
    icon: "",
    key: "actions",
  },
];

const Container = styled.div`
  ${tw`w-full h-auto px-5 flex flex-col items-center justify-start`}
`;

const Topbar = styled.div`
  ${tw`flex justify-between p-5 w-full h-max`}
`;

const Categorias = () => {
  const { data, loading } = useQuery<{ listCategorias: CategoriaItem[] }>(
    listCategorias
  );
  const { handleSetLoading } = useGlobal();

  useEffect(() => {
    handleSetLoading(loading);
  }, [loading]);

  const formatUserData = data
    ? data?.listCategorias?.map((cat: CategoriaItem) => {
        return {
          name: (
            <Text
              text={cat?.nombre}
              className={" text-texto font-bold text-xl "}
            />
          ),
          updatedAt: <Text text={new Date(cat.updatedAt).toDateString()} />,
          actions: (
            <ActionsList
              onDelete={() => null}
              onUpdate={() => null}
              actions={["delete", "edit"]}
            />
          ),
        };
      })
    : [];

  return (
    <>
      <Head>
        <title>Categorías</title>
        <meta name="description" content="Listado de categorías" />
      </Head>
      {/* TODO: Componentizar el componente topbar */}
      <Topbar>
        <Breadcrumb title="Categorías" />
        <ProfileBar />
      </Topbar>

      <Container>
        <Table title="Categorías" cols={cols} data={formatUserData} />
      </Container>
    </>
  );
};

export default Categorias;
