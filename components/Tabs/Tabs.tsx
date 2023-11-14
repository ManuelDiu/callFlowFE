import { TabItem } from "@/utils/utils";
import { useEffect, useState } from "react";
import styled from "styled-components";
import tw from "twin.macro";

const Container = styled.div`
  ${tw`w-full h-auto flex flex-col items-center justify-start gap-4`}
`;

const ListItems = styled.div`
  ${tw`w-full h-auto flex md:flex-row flex-col items-center justify-start md:gap-0 gap-4`}
`;

const Item = styled.span<{ isActive?: boolean }>`
  ${tw`px-[10px] md:w-auto w-full text-texto font-bold text-base py-2 text-center border-b-2 cursor-pointer border-transparent transition-all`}
  ${({ isActive }) =>
    isActive ? tw`border-principal` : tw`border-transparent`}
`;

interface Props {
  items: TabItem[];
}

const Tabs = ({ items }: Props) => {
  const [activeItem, setActiveItem] = useState<TabItem | undefined>(items[0]);

  useEffect(() => {
    if (activeItem && items) {
      const newItem = items?.find((itm) => itm?.index === activeItem?.index)
      if (newItem) {
        setActiveItem(newItem)
      }
    }
  }, [items])

  return (
    <Container data-testid="Tabs">
      <ListItems>
        {items?.map((item) => {
          const isActive = item?.index === activeItem?.index;
          return (
            <Item
              isActive={isActive}
              onClick={() => setActiveItem(item)}
              key={item?.index}
            >
              {item.title}
            </Item>
          );
        })}
      </ListItems>
      <div className="modalOpen w-full">{activeItem?.content}</div>
    </Container>
  );
};

export default Tabs;
