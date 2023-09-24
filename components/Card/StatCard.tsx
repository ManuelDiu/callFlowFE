import styled from "styled-components";
import tw from "twin.macro";

import { IoMdStats } from "react-icons/io";

type StatisticsCardProps = {
  icon: any;
  title: string;
  content: any;
};

const Card = styled.div`
  ${tw`flex items-center justify-start w-full py-2 px-5 bg-white rounded-3xl shadow-lg`}
`;
const Icon = styled.div`
  ${tw`flex items-center justify-start p-5 bg-[#F4F7FE] rounded-full `}
`;
const Content = styled.div`
  ${tw`flex flex-col items-start justify-center p-5 `}
`;

const StatCard = ({ icon, title, content }: StatisticsCardProps) => {
  return (
    <Card>
      <Icon>
        {icon}
      </Icon>
      <Content>
        <span className="text-textogris text-base font-medium">{title}</span>
        <span className="text-texto text-2xl font-black">{content}</span>
      </Content>
    </Card>
  );
};

export default StatCard;
