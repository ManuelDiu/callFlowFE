import { OptionSelectorItem } from "@/utils/utils";
import { useEffect, useState } from "react";
import styled from "styled-components";
import tw from "twin.macro";

const Container = styled.div`
  ${tw`w-auto h-auto flex w-full flex-row items-center justify-center gap-4`}
`;

const Item = styled.div<{ isSelected?: boolean; isInvalid?: boolean }>`
  ${tw`w-[300px] gap-2 h-[200px] flex flex-col items-center justify-center rounded-[16px] shadow-md bg-white border border-textogris ring-[1px] cursor-pointer ring-transparent transition-all`}
  ${({ isSelected, isInvalid }) =>
    isSelected
      ? tw`ring-principal`
      : isInvalid
      ? tw`ring-red2`
      : tw`ring-transparent hover:ring-principal`}
`;

const Title = styled.span`
  ${tw`text-texto text-base font-semibold max-w-full truncate overflow-hidden`}
`;

interface Props {
  options: OptionSelectorItem[];
  isInvalid?: boolean;
  onChange: any,
}

const OptionSelector = ({ options, isInvalid, onChange }: Props) => {
  const [selectedOption, setSelectedOption] = useState<
    OptionSelectorItem | undefined
  >();

  useEffect(() => {
    if (selectedOption) {
        onChange(selectedOption)
    }
  }, [selectedOption])

  return (
    <Container data-testid="OptionSelector">
      {options?.map((item, index) => {
        const isSelected = item?.value === selectedOption?.value;

        return (
          <Item
            onClick={() => setSelectedOption(item)}
            isSelected={isSelected}
            isInvalid={isInvalid}
            key={`item-${index}`}
          >
            {item?.image}
            <Title>{item?.label}</Title>
          </Item>
        );
      })}

    </Container>
  );
};

export default OptionSelector;
