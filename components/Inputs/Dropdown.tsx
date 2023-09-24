import React, { HTMLInputTypeAttribute, useEffect, useState } from "react";
import styled from "styled-components";
import tw from "twin.macro";
import { FiChevronDown } from "react-icons/fi";
import clsx from "clsx";
import { GrClose } from "react-icons/gr";
import Text from "../Table/components/Text";

const generarId = () => `input-${Math.random().toString(36).substring(2, 15)}`;

type Item = {
  label: string;
  value: string;
};

type InputProps = {
  label?: string;
  placeholder?: string;
  required?: boolean;
  variante?: ContainerVariant;
  inputFormName?: string;
  autoComplete?: string;
  className?: string;
  multiSelect?: boolean;
  items: Item[];
  onChange: any;
  defaultValue?: any;
  isInvalid?: boolean;
};

type ContainerVariant = "normal" | "checkbox" | "textarea";

interface ContainerProps {
  variant?: ContainerVariant;
}

const containerVariants = {
  normal: tw`bg-white text-black`,
  checkbox: tw`bg-yellow-500 text-red-500`,
  textarea: tw``,
};

const StyledInput = styled.input<ContainerProps>(() => [
  tw`flex h-full flex-grow w-full outline-none`,
  ({ variant = "normal" }) => containerVariants[variant], // Grab the variant style via a prop
]);

const InputContainer = styled.div<{ isInvalid?: boolean }>`
  ${tw`border-[1.5px] relative rounded-2xl flex ring ring-transparent flex-row items-center justify-start px-5 py-4 w-full transition-all ring-2 ring-transparent outline-none placeholder-textogris transition-all bg-white`}
  ${({ isInvalid }) => (isInvalid ? tw`border-red2` : tw`border-textogris`)}
`;

const ContainerExpanded = styled.div`
  ${tw`w-full max-h-[250px] z-50 overflow-auto absolute top-full shadow-md border p-4 bg-white rounded-md border-gray-300 flex flex-col items-center justify-start`}
`;

const DropdownItem = styled.div`
  ${tw`w-full h-auto px-2 py-1 rounded-md cursor-pointer transition-all bg-transparent text-texto`}
`;

const SelectedItems = styled.div`
  ${tw`w-full h-auto flex flex-row mt-1 items-center justify-start flex-wrap gap-2`}
`;

const LabelSelect = styled.div`
  ${tw`flex flex-grow w-full font-semibold text-[14px]`}
`;

const SelectedItemTag = styled.div`
  ${tw`px-3 py-2 font-semibold text-texto rounded-full text-[14px] flex flex-row items-center gap-1 bg-gray-100 w-fit`}
`;

const Dropdown = ({
  label,
  placeholder,
  required = false,
  inputFormName,
  autoComplete = "off",
  variante,
  multiSelect,
  isInvalid,
  onChange,
  items,
  defaultValue,
  ...otros
}: InputProps) => {
  const id = generarId();
  const [expanded, setExpanded] = useState(false);

  const defaultValuesFormatted =
    defaultValue && defaultValue?.length > 0
      ? defaultValue?.map((item: any) => {
          const val = items?.find((itm) => itm?.value === item);
          return val;
        })
      : [];

  const [selectedValues, setSelectedValues] = useState<any[]>(defaultValuesFormatted);
  const [query, setQuery] = useState("");

  const itemsWithId = items?.map((itm, index) => {
    return {
      ...itm,
      id: index,
    };
  });

  const hasQuery = query !== "" && query;
  const formatItems = hasQuery
    ? itemsWithId?.filter((item) =>
        item?.label?.toLowerCase()?.includes(query?.toLowerCase())
      )
    : itemsWithId;

  useEffect(() => {
    if (hasQuery) {
      setExpanded(true);
    }
  }, [query, hasQuery]);

  useEffect(() => {
    if (multiSelect) {
      onChange(selectedValues);
    } else {
      onChange(selectedValues[0]);
    }
  }, [selectedValues]);

  const handleToggleItem = (itm: any) => {
    const exists = selectedValues?.find((item) => item?.id === itm?.id);
    if (exists) {
      if (!multiSelect) {
        setSelectedValues([]);
      } else {
        const newItems = selectedValues?.filter((item) => item?.id !== itm?.id);
        setSelectedValues(newItems);
      }
    } else {
      if (!multiSelect) {
        setSelectedValues([itm]);
      } else {
        setSelectedValues([...selectedValues, itm]);
      }
    }
    setExpanded(false);
  };

  return (
    <div className="flex flex-col gap-1 w-full">
      <div className="flex flex-col w-full relative">
        {label && (
          <label
            htmlFor={id}
            className="text-md font-medium text-texto select-none"
          >
            {label}
            {required && <span className="text-principal">*</span>}
          </label>
        )}
        <InputContainer isInvalid={isInvalid}>
          {multiSelect ? (
            <StyledInput
              name={inputFormName}
              id={id}
              className="focus:ring-textogris"
              placeholder={placeholder}
              autoComplete={autoComplete}
              onChange={(e) => {
                const val = e?.target?.value;
                setQuery(val);
              }}
            />
          ) : (
            <LabelSelect
              className={
                selectedValues?.length > 0 ? "text-texto" : "text-textogris"
              }
            >
              {selectedValues?.length > 0
                ? selectedValues[0]?.label
                : placeholder}
            </LabelSelect>
          )}

          <button
            className="px-4 cursor-pointer border-0 outline-none"
            onClick={() => setExpanded(!expanded)}
          >
            <FiChevronDown
              className={clsx(
                "transition-all transform",
                expanded ? "rotate-180" : "rotate-0"
              )}
              onClick={() => setExpanded(!expanded)}
            />
          </button>
        </InputContainer>
        {expanded && (
          <ContainerExpanded className="modalOpen">
            {formatItems?.length > 0 ? (
              formatItems?.map((itm) => {
                return (
                  <DropdownItem
                    onClick={() => handleToggleItem(itm)}
                    className="hover:bg-gray-100"
                    key={itm?.value}
                  >
                    {itm?.label}
                  </DropdownItem>
                );
              })
            ) : (
              <Text text="Sin Resultados" />
            )}
          </ContainerExpanded>
        )}
      </div>
      {multiSelect && (
        <SelectedItems>
          {selectedValues?.map((item) => {
            return (
              <SelectedItemTag key={`${item?.id}-key`}>
                {item?.label}
                <GrClose
                  className="cursor-pointer"
                  onClick={() => handleToggleItem(item)}
                />
              </SelectedItemTag>
            );
          })}
        </SelectedItems>
      )}
    </div>
  );
};

export default Dropdown;
