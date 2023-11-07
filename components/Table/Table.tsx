import styled from "styled-components";
import tw from "twin.macro";
import { ColumnItem } from "types/table";
import Text from "./components/Text";
import NotFoundImage from "@/public/images/NotFound.svg";
import Image from "next/image";
import { useRouter } from "next/router";
import Checkbox from "../Inputs/Checkbox";
import MobileTable from "./components/MobileTable";
import { useWindowDimensions } from "@/hooks/useWindowDimensions";
import Dropdown from "../Inputs/Dropdown";
import { range } from "ramda";

interface PropsTable {
  cols: ColumnItem[];
  title: string;
  data?: any[];
  others?: any;
  multiDisabled?: boolean;
  selectedItems?: any;
  setSelectedItems?: any;
  withPagination?: boolean;
  currentPage?: number;
  setCurrentPage?: any;
  totalPages?: number;
  offset?: number;
}

const Container = styled.div`
  ${tw`w-full h-auto transition-all flex overflow-visible pt-4 pb-4 flex-col gap-3 items-start justify-start bg-white shadow-md rounded-[20px]`}
`;

const Title = styled.span`
  ${tw`text-texto transition-all px-4 text-2xl font-bold max-w-full truncate`}
`;

const HeaderRow = styled.div`
  ${tw`w-full transition-all px-4 border-b-2 border-borders2 w-fit min-w-full h-auto py-2 flex flex-row items-center justify-center gap-x-2 bg-white`}
`;

const ColItem = styled.div`
  ${tw`w-full transition-all gap-2 flex flex-row items-center justify-start flex-grow h-auto max-h-[50px] h-[50px]`}
`;

const ColTitle = styled.span`
  ${tw`text-textogris text-sm font-semibold transition-all`}
`;

const Content = styled.div`
  ${tw`w-full transition-all max-h-full overflow-auto px-4 h-auto flex flex-col items-center justify-start`}
`;

const Row = styled.div`
  ${tw`w-full select-none py-4 transition-all px-1 rounded-md flex flex-row max-w-full items-center py-4`}
`;

const Cell = styled.div`
  ${tw`w-full h-full transition-all flex flex-col max-w-full truncate overflow-hidden bg-transparent pl-2`}
`;

const CellSelect = styled.div<{ isExpanded: boolean }>`
  ${tw`transition-all overflow-hidden`}
  ${({ isExpanded }) =>
    isExpanded
      ? tw`min-w-[50px] w-[50px] opacity-[100]`
      : tw`w-[0px] opacity-0`}
`;

const Table = ({
  cols,
  title,
  data = [],
  others,
  multiDisabled,
  setSelectedItems,
  selectedItems,
  withPagination,
  totalPages,
  currentPage,
  setCurrentPage,
  offset,
}: PropsTable) => {
  const { push } = useRouter();
  const { isMobile } = useWindowDimensions();

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

  if (isMobile) {
    return (
      <MobileTable
        cols={cols}
        title={title}
        data={data}
        others={others}
        multiDisabled={multiDisabled}
        setSelectedItems={setSelectedItems}
        selectedItems={selectedItems}
        withPagination={withPagination}
        currentPage={currentPage}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
      />
    );
  }

  return (
    <Container>
      {withPagination && (
        <div className=" w-full h-auto flex flex-col items-start justify-start gap-4">
          <span>
            Estas viendo la pagina {currentPage}/{totalPages}
          </span>
          <div className="w-full">
            <Dropdown
              multiSelect={false}
              defaultValue={[]}
              placeholder="Seleccione una pagina"
              onChange={(val: any) => val && setCurrentPage(val?.value)}
              required
              items={range(1, (totalPages || 0) + 1)?.map((item) => {
                return {
                  label: (
                    <span key={`paginationDropdownItem-${item}`}>
                      Pagina {item}
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
      <HeaderRow>
        {multiDisabled && <CellSelect isExpanded={multiDisabled} />}
        {cols?.map((col) => {
          return (
            <ColItem
              className={
                col?.customWidth ? `w-[${col?.customWidth}]!` : "!w-full"
              }
              key={col?.key}
            >
              {col?.icon}
              <ColTitle>{col?.title}</ColTitle>
            </ColItem>
          );
        })}
      </HeaderRow>
      <Content>
        {data?.length > 0 ? (
          data?.map((item, index) => {
            return (
              <Row
                onClick={() =>
                  item?.action && !multiDisabled
                    ? item.action()
                    : item?.href && !multiDisabled
                    ? push(item?.href || "#")
                    : null
                }
                className={
                  (item?.href || item?.action) && "itemRowTable !cursor-pointer"
                }
                key={`row-${index}`}
              >
                <CellSelect isExpanded={multiDisabled || false}>
                  <Checkbox
                    value={
                      selectedItems?.find(
                        (itm: any) => itm?.id === item?.id
                      ) !== undefined
                    }
                    setValue={(val: any) => handleAddItem(val, item)}
                  />
                </CellSelect>

                {cols?.map((col, indexCol) => {
                  return (
                    <Cell key={`cell-${index}-${indexCol}`}>
                      {item[col?.key]}
                    </Cell>
                  );
                })}
              </Row>
            );
          })
        ) : (
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
      </Content>
      {others}
    </Container>
  );
};

export default Table;
