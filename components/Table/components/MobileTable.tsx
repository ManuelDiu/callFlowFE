import clsx from "clsx";
import styled from "styled-components";
import tw from "twin.macro";
import { ColumnItem } from "types/table";
import NotFoundImage from "@/public/images/NotFound.svg";
import Text from "./Text";
import Checkbox from "@/components/Inputs/Checkbox";
import { useRouter } from "next/router";
import Dropdown from "@/components/Inputs/Dropdown";
import { range } from "ramda";

interface PropsTable {
  cols: ColumnItem[];
  title: string;
  data: any[];
  others?: any;
  multiDisabled?: boolean;
  selectedItems?: any;
  setSelectedItems?: any;
  withPagination: any;
  currentPage: any;
  totalPages: any;
  setCurrentPage: any;
}

const Container = styled.div`
  ${tw`w-full py-4 h-auto flex flex-col items-start justify-start gap-6 max-h-full`}
`;

const Title = styled.span`
  ${tw`text-texto transition-all px-4 text-2xl font-bold max-w-full truncate`}
`;

const Item = styled.div`
  ${tw`w-full border border-gray-300 h-auto flex flex-col items-start justify-start rounded-2xl overflow-hidden shadow-sm`}
`;

const ItemCol = styled.div`
  ${tw`w-full h-auto py-6 px-4 flex items-center gap-2 justify-start`}
`;

const ItemKey = styled.div`
  ${tw`flex items-center justify-start gap-2 w-[30%] overflow-hidden min-w-[30%] max-w-[30%]`}
`;

const ItemVal = styled.div`
  ${tw`flex !text-lg items-center justify-start gap-2 flex-grow max-w-full`}
`;

const MobileTable = ({
  cols,
  title,
  data,
  others,
  multiDisabled,
  selectedItems,
  setSelectedItems,
  withPagination,
currentPage,
totalPages,
setCurrentPage,
}: PropsTable) => {
  const { push } = useRouter();
  const handleAddItem = (val: any, selectedItem: any) => {
    if (val) {
      setSelectedItems([...selectedItems, selectedItem]);
    } else {
      const newItems = selectedItems?.filter(
        (itm: any) => itm?.id !== selectedItem?.id
      );
      setSelectedItems(newItems);
    }
  };

  return (
    <Container>
      {withPagination && data?.length > 0 && (
        <div className="w-full h-auto flex flex-col items-start justify-start gap-4">
          <span>
            Estás viendo la página {currentPage}/{totalPages}
          </span>
          <div className="w-full">
            <Dropdown
              multiSelect={false}
              defaultValue={[]}
              placeholder="Cambiar página"
              onChange={(val: any) => val && setCurrentPage(val?.value)}
              required
              items={range(1, (totalPages || 0) + 1)?.map((item) => {
                return {
                  label: (
                    <span key={`paginationDropdownItem-${item}`}>
                      Página {item}
                    </span>
                  ),
                  value: item,
                };
              })}
              //   inputFormName={crearLlamadoFormFields.solicitante}
            />
          </div>
        </div>
      )}
      <Title>{title}</Title>

      {data?.map((item, index) => {
        return (
          <Item
            onClick={() =>
              item?.action && !multiDisabled
                ? item.action()
                : item?.href && !multiDisabled
                ? push(item?.href || "#")
                : null
            }
            key={`mobileTable-index-${index}`}
          >
            {cols?.map((col, indexCol) => (
              <ItemCol
                className={clsx(
                  indexCol % 2 === 0 ? "bg-gray-900/1" : "bg-white"
                )}
                key={`indexCol-${indexCol}`}
              >
                <ItemKey>
                  {indexCol === 0 && multiDisabled && (
                    <Checkbox
                      value={
                        selectedItems?.find(
                          (itm: any) => itm?.id === item?.id
                        ) !== undefined
                      }
                      setValue={(val: any) => handleAddItem(val, item)}
                    />
                  )}
                  {col?.icon}
                  <span className="font-medium text-base text-gray-900">
                    {col?.title}
                  </span>
                </ItemKey>
                <ItemVal>{item[col?.key]}</ItemVal>
              </ItemCol>
            ))}
          </Item>
        );
      })}
      {data?.length === 0 && (
        <div className="w-full  h-auto flex flex-col items-center py-10 justify-center gap-4">
          <img
            src={NotFoundImage?.src}
            className="object-cover h-[300px] w-auto"
          />
          <Text
            className="!text-[20px] !leading-[24px] h-auto!"
            text={`Ooops..! , no se encontraron ${title}`}
          />
        </div>
      )}
    </Container>
  );
};

export default MobileTable;
