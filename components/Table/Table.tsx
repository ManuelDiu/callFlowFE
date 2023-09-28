import styled from "styled-components";
import tw from "twin.macro";
import { ColumnItem } from "types/table";
import Text from "./components/Text";
import NotFoundImage from "@/public/images/NotFound.svg";
import Image from "next/image";
import { useRouter } from "next/router";
interface PropsTable {
  cols: ColumnItem[];
  title: string;
  data?: any[];
  others?: any;
}

const Container = styled.div`
  ${tw`w-full h-auto flex overflow-hidden pt-4 pb-4 flex-col gap-3 items-start justify-start bg-white shadow-md rounded-[20px]`}
`;

const Title = styled.span`
  ${tw`text-texto px-4 text-2xl font-bold max-w-full truncate`}
`;

const HeaderRow = styled.div`
  ${tw`w-full px-4 border-b-2 border-borders2 w-fit min-w-full h-auto py-2 flex flex-row items-center justify-center gap-x-2 bg-white`}
`;

const ColItem = styled.div`
  ${tw`w-full gap-2 flex flex-row items-center justify-start flex-grow h-auto max-h-[50px] h-[50px]`}
`;

const ColTitle = styled.span`
  ${tw`text-textogris text-sm font-semibold`}
`;

const Content = styled.div`
  ${tw`w-full max-h-full overflow-auto px-4 h-auto flex flex-col items-center justify-start`}
`;

const Row = styled.div`
  ${tw`w-full py-4 transition-all px-1 rounded-md flex flex-row max-w-full items-center py-4`}
`;

const Cell = styled.div`
  ${tw`w-full h-full flex flex-col max-w-full truncate overflow-hidden bg-transparent pl-2`}
`;

const Table = ({ cols, title, data = [], others }: PropsTable) => {
  const { push } = useRouter();

  return (
    <Container>
      <Title>{title}</Title>
      <HeaderRow>
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
                  item?.action
                    ? item.action()
                    : item?.href
                    ? push(item?.href || "#")
                    : null
                }
                className={item?.href || (item?.action && "itemRowTable cursor-pointer")}
                key={`row-${index}`}
              >
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
