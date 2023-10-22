import styled from "styled-components";
import Modal from "../Modal/Modal";
import tw from "twin.macro";
import Table from "../Table/Table";
import { Columns, formatDisponibilidadColumns } from "@/utils/disponibilidad";
import Button from "../Buttons/Button";
import { useEffect, useState } from "react";
import AgregarDisponibilidadModal from "./components/AgregarDisponibilidadModal";
import { useMutation, useQuery } from "@apollo/client";
import {
  borrarDisponibilidad,
  listarDisponibilidad,
} from "@/controllers/disponibilidadController";
import { useGlobal } from "@/hooks/useGlobal";
import { DisponibilidadList } from "types/disponibilidad";
import { toast } from "react-toastify";
import ActionsList from "../Table/components/ActionsList";
import Text from "../Table/components/Text";

interface Props {
  setOpen: any;
  isMiembro: boolean;
  llamadoId?: number;
  title: string;
}

const ContainerModal = styled.div`
  ${tw`w-full h-auto flex flex-col items-end justify-center gap-4`}
`;

const VerDisponibilidadModal = ({ setOpen, isMiembro, llamadoId , title}: Props) => {
  const [addOpen, setAddOpen] = useState(false);
  const { data, loading: loadingDisponibilidad } = useQuery<{
    listarDisponibilidad: DisponibilidadList[];
  }>(listarDisponibilidad, {
    variables: {
      llamadoId: llamadoId,
    },
  });
  const { handleSetLoading } = useGlobal();
  const disponibilidad = data?.listarDisponibilidad || [];
  const [handleBorrarDisponibilidad] = useMutation(borrarDisponibilidad);

  const handleDeleteDisponibilidad = async (disponibilidadId: number) => {
    try {
      const resp = await handleBorrarDisponibilidad({
        variables: {
          disponibilidadId: disponibilidadId,
        },
        refetchQueries: [
          {
            query: listarDisponibilidad,
            variables: {
              llamadoId: Number(llamadoId),
            },
          },
        ],
      });
      if (resp?.data?.borrarDisponibilidad?.ok) {
        toast.success("Disponibilidad eliminada correctamente");
      } else {
        toast.error("Errro al eliminar disponibilidad");
      }
    } catch (error: any) {
      toast.error(error?.message || "Errro al eliminar disponibilidad");
    }
  };
  const disponibilidades = formatDisponibilidadColumns(disponibilidad);

  const dataToUse = disponibilidades?.map((item: any) => {
    return {
      ...item,
      actions: (
        <div className="w-full h-auto flex flex-row items-center justify-end">
          {isMiembro ? <ActionsList
            onDelete={() => {
              handleDeleteDisponibilidad(item?.id);
            }}
            actions={["delete"]}
          />: <Text text="Sin acciones" className="w-full text-center" />}
        </div>
      ),
    };
  });

  useEffect(() => {
    handleSetLoading(loadingDisponibilidad);
  }, [loadingDisponibilidad]);

  const handleRenderContent = () => {
    return (
      <ContainerModal>
        {isMiembro && (
          <Button
            action={() => setAddOpen(!addOpen)}
            variant="outline"
            text="Agregar nueva disponibilidad"
          />
        )}
        <Table
          title="Disponibilidad de todos los miembros"
          cols={Columns}
          data={dataToUse}
        />
      </ContainerModal>
    );
  };

  return (
    <>
      <Modal
        textok={"Cerrar"}
        description="Permite ver la disponibilidad por todos los miembros del tribunal, clickea en un miembro del tribunal para ver su disponibilidad, clickea en un dia para ver el horario, si clickeas en el nombre te redirigiremos a su perfil para poder enviarle un email/mensaje."
        onSubmit={() => setOpen(false)}
        setOpen={setOpen}
        content={handleRenderContent()}
        title={title || "Ver disponibilidad tribunal"}
        className=""
      />
      {addOpen && (
        <AgregarDisponibilidadModal
          llamadoId={llamadoId}
          setOpen={setAddOpen}
        />
      )}
    </>
  );
};

export default VerDisponibilidadModal;
