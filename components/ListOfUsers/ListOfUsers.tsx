import styled from "styled-components";
import tw from "twin.macro";
import { BsPlusCircleFill } from "react-icons/bs";
import UserInfoLine from "../Table/components/UserInfoLine";
import { DEFAULT_USER_IMAGE } from "@/utils/userUtils";
import { OptionsItem } from "@/utils/utils";
import Link from "next/link";
import appRoutes from "@/routes/appRoutes";
import { useRouter } from "next/router";

interface Props {
  title: string;
  selectedUsers: any[];
  onAddClick?: any;
  onRemove?: any;
  onEdit?: any;
  isTribunal?: boolean;
}

const Container = styled.div`
  ${tw`w-full h-auto flex flex-col bg-white items-center justify-start gap-4 p-5 shadow-md rounded-2xl`}
`;

const Row = styled.div`
  ${tw`w-full flex flex-row items-center justify-between`}
`;

const PlusContainer = styled.button`
  ${tw`bg-principalLight border-none rounded-[10px] p-[8px] flex items-center justify-center`}
`;

const Title = styled.span`
  ${tw`text-lg font-semibold text-texto`}
`;

const ListOfUsers = ({
  title,
  selectedUsers,
  onAddClick,
  onRemove,
  onEdit,
  isTribunal = false,
}: Props) => {
  const { push } = useRouter();

  return (
    <Container>
      <Row>
        <Title>{title}</Title>
        {onAddClick && (
          <PlusContainer onClick={() => onAddClick()}>
            <BsPlusCircleFill size={26} color="#4318FF" />
          </PlusContainer>
        )}
      </Row>
      {selectedUsers?.map((item, index) => {
        const optionsToItem: OptionsItem[] = [
          onRemove && {
            text: "Eliminar",
            onClick: () => onRemove(item),
          },
          onEdit && {
            text: "Editar",
            onClick: () => {
              onEdit(item);
            },
          },
        ];

        return (
          <div
            onClick={() => push(isTribunal ? appRoutes.userProfilePage(item?.userId) : "#")}
            className="w-full"
            key={`userInfoLine-${index}`}
          >
            <UserInfoLine
              className="shadow-md w-full rounded-2xl p-4 cursor-pointer"
              userImage={item?.imageUrl}
              userName={item?.name}
              userlastName={item?.lastName}
              withDot={
                (onRemove !== undefined && onRemove !== null) ||
                (onEdit !== undefined && onEdit !== null)
              }
              options={optionsToItem}
              label={item?.label}
            />
          </div>
        );
      })}
    </Container>
  );
};

export default ListOfUsers;
