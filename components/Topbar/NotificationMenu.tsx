import React from "react";
import styled from "styled-components";
import tw from "twin.macro";
import Notification from "../Notification/Notification";

const notifications: NotificationItem[] = [
  {
    title: "¡Acción requerida!",
    time: "hace 3 días",
    text:
      "El miembro del tribunal Jael cambió el estado del postulante Manuel de “No Cumple Requisitos“ a “Cumple Requisitos“ en el llamado “Llamado Pasantes UTEC”.",
    usesButtons: true,
  },
  {
    title: "¡Acción requerida!",
    time: "hace 6 días",
    text:
      "El miembro del tribunal Cristian cambió el estado del llamado ”Llamado Encargado React” de “Entevistas listas para coordinar” a “Entrevistas coordinadas”.",
    usesButtons: true,
  },
  {
    title: "¡Acción requerida!",
    time: "hace 10 días",
    text:
      "El miembro del tribunal Elisa cambió el estado del postulante Jose de No Cumple Requisitos a Cumple Requisitos en el llamado “Llamado Pasantes UTEC”.",
    usesButtons: true,
  },
  {
    title: "¡Acción requerida!",
    time: "hace 10 días",
    text:
      "El miembro del tribunal Elisa cambió el estado del postulante Jose de No Cumple Requisitos a Cumple Requisitos en el llamado “Llamado Pasantes UTEC”.",
    usesButtons: true,
  },
  {
    title: "¡Acción requerida!",
    time: "hace 10 días",
    text:
      "El miembro del tribunal Elisa cambió el estado del postulante Jose de No Cumple Requisitos a Cumple Requisitos en el llamado “Llamado Pasantes UTEC”.",
    usesButtons: true,
  },
];

type NotificationItem = {
  title: string;
  time: Date | string;
  text: string;
  usesButtons: boolean;
};

type NotificationMenuProps = {
  showNotificationMenu: boolean;
  // items: NotificationItem[];
};

const Divider = styled.div(() => [
  tw`h-0 my-2.5 mx-12 border border-solid border-gray-200 `,
]);

const NotificationMenu = ({ showNotificationMenu }: NotificationMenuProps) => {
  return (
    <>
      <div
        className={
          (showNotificationMenu ? "block " : "hidden ") +
          "flex flex-col p-4 overflow-y-scroll rounded-xl transition-all bg-[#FAFAFF] absolute top-[90px] right-[20px] text-base z-10 float-right list-none text-left shadow-lg min-w-[650px] max-w-[650px] max-h-[595px]"
        }
      >
        {notifications?.map((item: NotificationItem, index) => (
          <div key={index}>
            <Notification
              title={item.title}
              time={item.time}
              text={item.text}
              usesButtons={item.usesButtons}
            />
            {index + 1 < notifications.length && <Divider />}
          </div>
        ))}
      </div>
    </>
  );
};

export default NotificationMenu;
