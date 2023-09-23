import Table from "@/components/Table/Table";
import styled from "styled-components";
import tw from "twin.macro";
import { useQuery } from "@apollo/client";
import { listUsers } from "@/controllers/userController";
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

const Container = styled.div`
  ${tw`w-full h-auto p-5 flex flex-col items-center justify-start`}
`;

const ActionRow = styled.div`
  ${tw`w-full h-auto flex flex-row items-center justify-end gap-4`}
`;

const Usuarios = () => {
  const { data, loading } = useQuery<{ listUsuarios: UserList[] }>(listUsers);
  const { handleSetLoading } = useGlobal();

  useEffect(() => {
    handleSetLoading(loading);
  }, [loading]);

  const formatUserData = data
    ? data?.listUsuarios?.map((usr) => {
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
    <Container>
      <ActionRow></ActionRow>
      <Table title="Usuarios" cols={Columns} data={formatUserData} />
    </Container>
  );
};

export default Usuarios;
