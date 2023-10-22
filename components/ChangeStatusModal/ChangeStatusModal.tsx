import { FullLlamadoInfo } from "types/llamado";
import Modal from "../Modal/Modal";
import styled from "styled-components";
import tw from "twin.macro";
import { ORDER_LLAMADO_STATUS } from "@/utils/llamadoUtils";
import Dropdown from "../Inputs/Dropdown";
import { useState } from "react";
import { EstadoLlamadoEnum } from "@/enums/EstadoLlamadoEnum";
import { formatEstadosToLlamado, formatEtapasForDropdown } from "@/utils/etapa";
import OneLineError from "../OneLineError/OneLineError";
import ModalConfirmation from "../Modal/components/ModalConfirmation";
import { useMutation } from "@apollo/client";
import {
  cambiarEstadoLlamado,
  getLlamadoInfoById,
} from "@/controllers/llamadoController";
import { toast } from "react-toastify";
import { useGlobal } from "@/hooks/useGlobal";
import { Roles } from "@/enums/Roles";

const Container = styled.div`
  ${tw`w-full h-auto flex flex-col items-start justify-start gap-4`}
`;

interface Props {
  setOpen: any;
  llamadoInfo: FullLlamadoInfo;
  onOpenDisponibilidad: any;
}

const ChnageStatusModal = ({ setOpen, llamadoInfo, onOpenDisponibilidad }: Props) => {
  const etapas = llamadoInfo?.etapas;
  const etapaActual = llamadoInfo?.etapaActual;
  const estadoActual = llamadoInfo?.estadoActual;
  const estados = ORDER_LLAMADO_STATUS;
  const [error, setError] = useState<string | null>(null);
  const [openConfirmationModal, setOpenConfirmationModal] = useState(false);
  const [selectedEtapa, setSelectedEtapa] = useState<number>(
    etapaActual?.id || 0
  );
  const [selectedEstado, setSelectedEstado] = useState<EstadoLlamadoEnum>(
    estadoActual?.nombre as EstadoLlamadoEnum
  );
  const [handleChangeStatus] = useMutation(cambiarEstadoLlamado);
  const { handleSetLoading, userInfo } = useGlobal();
  const isAdmin = userInfo?.roles?.includes(Roles.admin) || false;

  const handleSubmit = async () => {
    const dataToSend = {
      llamadoId: llamadoInfo?.id,
      etapa: Number(selectedEtapa || "0"),
      estado: selectedEstado,
    };
    handleSetLoading(true);
    const resp = await handleChangeStatus({
      variables: {
        info: dataToSend,
      },
      refetchQueries: [
        {
          query: getLlamadoInfoById,
          variables: {
            llamadoId: Number(llamadoInfo?.id),
          },
        },
      ],
    });
    if (resp?.data?.cambiarEstadoLlamado?.ok === true) {
      toast.success("Se cambio el estado correctamente");
      handleSetLoading(false);
      setOpen(false);
      if (dataToSend.estado === EstadoLlamadoEnum.listoParaEntrevistas) {
        onOpenDisponibilidad("Antes de irte....No olvides agregar una disponibilidad para las entrevistas")
      }
    } else {
      toast.error(
        resp?.data?.cambiarEstadoLlamado?.message ||
          "Error al cambiar el estado del llamado"
      );
      handleSetLoading(false);
    }
    //send backend
  };

  const handleNext = () => {
    if (!selectedEtapa || !selectedEstado) {
      setError("Debes seleccionar una etapa y un estado para continuar");
      return;
    }
    setError(null);
    setOpenConfirmationModal(true);
  };

  const handleRenderContent = () => {
    return (
      <Container>
        <Dropdown
          defaultValue={[]}
          label="Seleccione una etapa"
          //   isInvalid={formSubmitted && !selectedFileType}
          placeholder="Seleccione la nueva etapa a transicionar"
          onChange={(val: any) => setSelectedEtapa(val?.value)}
          required
          items={formatEtapasForDropdown(etapas, etapaActual)}
        />

        <Dropdown
          defaultValue={[]}
          label="Seleccione un estado"
          //   isInvalid={formSubmitted && !selectedFileType}
          placeholder="Seleccione el nuevo estado a transicionar"
          onChange={(val: any) => setSelectedEstado(val?.value)}
          required
          items={formatEstadosToLlamado(
            estados,
            estadoActual?.nombre as EstadoLlamadoEnum,
            isAdmin
          )}
        />
        {error && <OneLineError message={error} />}
      </Container>
    );
  };

  return (
    <>
      <Modal
        textok={"Cambiar estado"}
        description="Permite transicional el estado del llamado asi como la etapa en la cual se encuentra el mismo"
        textcancel="Cancelar"
        onSubmit={() => handleNext()}
        onCancel={() => setOpen(false)}
        setOpen={setOpen}
        content={handleRenderContent()}
        title="Transicionar estado del llamado"
        className="!overflow-visible"
      />
           {openConfirmationModal && (
        <ModalConfirmation
          variant="red"
          textok="Si, cambiar"
          textcancel="Cancelar"
          onSubmit={() => handleSubmit()}
          onCancel={() => setOpenConfirmationModal(false)}
          setOpen={setOpenConfirmationModal}
          title="Estas seguro que deseas cambiar el estado del llamado?"
          description={`No podras volver a un estado anterior del llamado , por lo tanto ,asegurate que la informacion hasta este estado sea correcta`}
        />
      )}
    </>
  );
};

export default ChnageStatusModal;
