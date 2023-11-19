import React, { useEffect } from "react";
import styled from "styled-components";
import tw from "twin.macro";
import { useQuery } from "@apollo/client";
import { listarAllHistoriales } from "@/controllers/llamadoController";
import { HistorialLlamado as HistorialLlamadoType } from "types/llamado";
import { useGlobal } from "@/hooks/useGlobal";
import HistorialLlamadoWithInfiniteScroll from "../HistorialLlamado/HistorialLlamadoWithInfiniteScroll";

const notifications: NotificationItem[] = [
  {
    title: "¡Acción requerida!",
    time: "hace 3 días",
    text: "El miembro del tribunal Jael cambió el estado del postulante Manuel de “No Cumple Requisitos“ a “Cumple Requisitos“ en el llamado “Llamado Pasantes UTEC”.",
    usesButtons: true,
  },
  {
    title: "¡Acción requerida!",
    time: "hace 6 días",
    text: "El miembro del tribunal Cristian cambió el estado del llamado ”Llamado Encargado React” de “Entevistas listas para coordinar” a “Entrevistas coordinadas”.",
    usesButtons: true,
  },
  {
    title: "¡Acción requerida!",
    time: "hace 10 días",
    text: "El miembro del tribunal Elisa cambió el estado del postulante Jose de No Cumple Requisitos a Cumple Requisitos en el llamado “Llamado Pasantes UTEC”.",
    usesButtons: true,
  },
  {
    title: "¡Acción requerida!",
    time: "hace 10 días",
    text: "El miembro del tribunal Elisa cambió el estado del postulante Jose de No Cumple Requisitos a Cumple Requisitos en el llamado “Llamado Pasantes UTEC”.",
    usesButtons: true,
  },
  {
    title: "¡Acción requerida!",
    time: "hace 10 días",
    text: "El miembro del tribunal Elisa cambió el estado del postulante Jose de No Cumple Requisitos a Cumple Requisitos en el llamado “Llamado Pasantes UTEC”.",
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
  const { data, loading: loadingHistoriales } = useQuery<{
    listarAllHistoriales: HistorialLlamadoType[];
  }>(listarAllHistoriales, {
    fetchPolicy: "no-cache"
  });
  const { handleSetLoading } = useGlobal();
  const historiales = data?.listarAllHistoriales || [];

  useEffect(() => {
    handleSetLoading(loadingHistoriales);
  }, [loadingHistoriales]);

  return (
    <>
      <div
        className={
          (showNotificationMenu ? "block " : "hidden ") +
          "flex flex-col p-4 overflow-y-scroll rounded-xl transition-all bg-[#FAFAFF] absolute top-[40px] -right-[150%] md:right-[20px] text-base z-50 list-none text-left shadow-lg md:min-w-[650px] min-w-[320px] w-[calc(100vh - 10px)] md:max-w-[650px] max-w-[calc(100vh - 10px)] max-h-[595px]"
        }
      >
        {historiales?.length === 0 && !loadingHistoriales && (
          <span className="w-full text-left">
            No se encontró actividad reciente
          </span>
        )}
        {historiales?.length > 0 && <span className="font-semibold mb-4 text-gray-800 text-2xl">Notificaciones</span>}
        {historiales?.length > 0 && (
          <HistorialLlamadoWithInfiniteScroll historiales={historiales} />
        )}
      </div>
    </>
  );
};

export default NotificationMenu;
