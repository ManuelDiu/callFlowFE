import styled from "styled-components";
import tw from "twin.macro";
import { TbEdit } from "react-icons/tb";
import { BiTrash } from "react-icons/bi";

type ActionType = "delete" | "edit";

interface Props {
  actions: ActionType[];
  onDelete?: any;
  onUpdate?: any;
}

const ButtonVariants = {
  delete: tw`border-red1`,
  edit: tw`border-green`,
};

const Container = styled.div`
  ${tw`w-full h-auto flex flex-row items-center justify-center gap-2`}
`;

const ItemContainer = styled.button<{ variant: ActionType }>`
  ${tw`w-auto h-auto p-1 border-2 rounded-full flex items-center justify-center`}
  ${({ variant }) => ButtonVariants[variant]}
`;

const ActionsList = ({ actions, onDelete, onUpdate }: Props) => {
  const getIcon = (action: ActionType) => {
    switch (action) {
      case "delete":
        return <BiTrash size={20} color="#FF1818" />;
      case "edit":
        return <TbEdit size={20} color="#37B63C" />;
    }
  };

  return (
    <Container>
      {actions?.map((itm) => {
        return (
          <ItemContainer onClick={() => {
            if (itm === "delete" && onDelete) {
                onDelete();
            }
            if (itm === "edit" && onUpdate) {
                onUpdate();
            }
          }} variant={itm} key={itm}>
            {getIcon(itm)}
          </ItemContainer>
        );
      })}
    </Container>
  );
};

export default ActionsList;
