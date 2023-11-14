import React from "react";
import styled from "styled-components";
import tw from "twin.macro";
import Button from "@/components/Buttons/Button";

type NotificationItem = {
  title: string;
  time: Date | string;
  text: string;
  usesButtons?: boolean;
};

const MainContainer = styled.div(() => [
  tw`flex flex-col gap-3 py-4 px-5 rounded-3xl shadow-md text-sm font-normal block w-full whitespace-nowrap bg-white `,
]);

const TitleAndTimestampContainer = styled.div(() => [
  tw`flex justify-between items-center pr-3 `,
]);

const TextAndButtonsContainer = styled.div(() => [tw`flex gap-5 justify-between `]);

const ButtonsContainer = styled.div(() => [tw`flex flex-col gap-2 `]);

// TODO: Dinamizar el uso de botones en la notificación.
const Notification = ({
  title,
  time,
  text,
  usesButtons = false,
}: NotificationItem) => {
  return (
    <MainContainer data-testid="Notification">
      <TitleAndTimestampContainer>
        <span className="font-black text-2xl text-texto">{title}</span>
        <span className="text-textogris">{time as string}</span>
      </TitleAndTimestampContainer>
      <TextAndButtonsContainer>
        <p className="whitespace-normal">{text}</p>
        {usesButtons && <ButtonsContainer>
          <Button text="Aceptar" variant="green" rounded="large" />
          <Button text="Cancelar" variant="red" rounded="large" />
        </ButtonsContainer>}
      </TextAndButtonsContainer>
    </MainContainer>
  );
};

export default Notification;
