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
  ${tw`relative min-w-[35px] w-[35px] h-[35px] rounded-full flex items-center justify-center overflow-hidden`}
`;

const TextContainer = styled.div`
  ${tw`w-full flex-grow h-auto flex flex-col items-start mt-[2px] justify-center`}
`;

const Name = styled.span`
  ${tw`text-sm text-texto font-bold leading-[12px] max-w-full truncate overflow-hidden`}
`;

const LastName = styled.span`
  ${tw`text-[10px] text-textogris font-bold max-w-full truncate overflow-hidden`}
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
