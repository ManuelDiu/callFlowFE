import Image from "next/image";
import styled from "styled-components";
import tw from "twin.macro";

interface Props {
  userName?: string;
  userlastName?: string;
  userImage: string;
}

const Container = styled.div`
  ${tw`w-full h-auto max-w-full overflow-hidden flex flex-row items-center justify-start gap-1`}
`;

const ImageContainer = styled.div`
  ${tw`relative min-w-[50px] w-[50px] h-[50px] rounded-full flex items-center justify-center overflow-hidden`}
`;

const TextContainer = styled.div`
  ${tw`w-full flex-grow h-auto flex flex-col items-start mt-[2px] max-w-full overflow-hidden justify-center`}
`;

const Name = styled.span`
  ${tw`text-[18px] text-texto font-bold leading-[12px] max-w-full w-full flex-grow truncate overflow-hidden`}
`;

const LastName = styled.span`
  ${tw`text-[14px] text-textogris font-bold max-w-full truncate overflow-hidden`}
`;

const UserInfoLine = ({ userImage, userName, userlastName }: Props) => {
  return (
    <Container>
      <ImageContainer>
        <img
          className="w-full h-full rounded-full object-fill"
          src={userImage}
        />
      </ImageContainer>
      <TextContainer>
        <Name>{userName}</Name>
        <LastName>{userlastName}</LastName>
      </TextContainer>
    </Container>
  );
};

export default UserInfoLine;
