import styled from "styled-components";
import tw from "twin.macro";
import { ColumnItem } from "types/table";

interface PropsTable {
  cols: ColumnItem[];
  title: string;
  data?: any[];
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
  ${tw`w-full flex flex-row max-w-full items-center py-4`}
`;

const Cell = styled.div`
  ${tw`w-full h-full flex flex-col max-w-full truncate overflow-hidden pl-2`}
`;

const Table = ({ cols, title, data = [] }: PropsTable) => {
  return (
    <Container>
      <Title>{title}</Title>
      <HeaderRow>
        {cols?.map((col) => {
          return (
            <ColItem key={col?.key}>
              {col?.icon}
              <ColTitle>{col?.title}</ColTitle>
            </ColItem>
          );
        })}
      </HeaderRow>
      <Content>
        {data?.map((item, index) => {
          return (
            <Row key={`row-${index}`}>
              {cols?.map((col, indexCol) => {
                return (
                  <Cell key={`cell-${index}-${indexCol}`}>
                    {item[col?.key]}
                  </Cell>
                );
              })}
            </Row>
          );
        })}
      </Content>
    </Container>
  );
};

export default Table;
