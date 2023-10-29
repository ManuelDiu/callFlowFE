import Image from "next/image";
import styled from "styled-components";
import tw from "twin.macro";
import { SlOptionsVertical } from "react-icons/sl";
import { useState } from "react";
import { OptionsItem } from "@/utils/utils";
import { DEFAULT_USER_IMAGE } from "@/utils/userUtils";
import clsx from "clsx";

interface Props {
  userName?: string;
  userlastName?: string;
  userImage: string | undefined;
  className?: string;
  label?: any;
  labelClass?: string;
  withDot?: boolean;
  options?: OptionsItem[];
}

const Container = styled.div`
  ${tw`w-full max-w-[230px] h-auto max-w-full relative overflow-visible flex flex-row items-center justify-start gap-1`}
`;

const ImageContainer = styled.div`
  ${tw`relative min-w-[50px] w-[50px] h-[50px] rounded-full flex items-center justify-center overflow-hidden`}
`;

const TextContainer = styled.div`
  ${tw`w-full max-w-full overflow-hidden truncate flex-grow h-auto flex flex-col items-start mt-[2px] max-w-full overflow-hidden justify-center`}
`;

const Name = styled.span`
  ${tw`text-[18px] !max-w-[160px] truncate overflow-hidden text-texto font-bold leading-[16px] max-w-full w-full flex-grow truncate overflow-hidden`}
`;

const LastName = styled.span`
  ${tw`text-[14px] !max-w-[160px] truncate overflow-hidden text-textogris font-bold max-w-full truncate overflow-hidden`}
`;

const DotContainer = styled.button`
  ${tw`w-auto h-auto relative`}
`;

const OptionsContainer = styled.div`
  ${tw`w-[250px] bg-white absolute right-0 p-4 rounded-lg top-full shadow-md border border-textogris h-auto flex flex-col items-center justify-start gap-1`}
`;

const OptionLabel = styled.p`
  ${tw`w-full h-auto flex font-semibold flex-row text-texto items-center justify-start px-2 py-1  transition-all rounded-lg`}
`;

const UserInfoLine = ({
  label,
  labelClass,
  userImage,
  userName,
  userlastName,
  className,
  withDot = false,
  options,
}: Props) => {
  const [openOptions, setOpenOptions] = useState(false);

  const handleClickItem = (itm: any) => {
    itm?.onClick()
    setOpenOptions(false);
  }

  return (
    <Container className={className}>
      <ImageContainer>
        <img
          className="w-full h-full rounded-full object-fill"
          src={userImage !== "" && userImage !== null ? userImage : DEFAULT_USER_IMAGE}
        />
      </ImageContainer>
      <TextContainer>
        <Name>{userName}</Name>
        <LastName>{userlastName}</LastName>
      </TextContainer>
      {withDot && (
        <DotContainer>
          {openOptions && (
            <OptionsContainer className="modalOpen">
              {options?.map((opt, index) => {
                return (
                  <OptionLabel
                    className="transition-all bg-transparent hover:bg-slate-100"
                    key={`opt-${index}`}
                    onClick={() => opt?.onClick && handleClickItem(opt)}
                  >
                    {opt?.text}
                  </OptionLabel>
                );
              })}
            </OptionsContainer>
          )}
          <SlOptionsVertical
            onClick={() => setOpenOptions(!openOptions)}
            color="#A3AED0"
            size={20}
          />
        </DotContainer>
      )}
      {label && <div className={clsx("absolute right-4 top-4", labelClass)}>
        {label}
        </div>}
    </Container>
  );
};

export default UserInfoLine;
