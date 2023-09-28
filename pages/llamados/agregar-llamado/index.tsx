import AddPostulanteModal from "@/components/AddPostulanteModal/AddPostulanteModal";
import AddTribunalModal from "@/components/AddTribunalModal/AddTribunalModal";
import Button from "@/components/Buttons/Button";
import { Topbar } from "@/components/CheckTokenWrapper/CheckTokenWrapper";
import EtapasList from "@/components/EtapasList/EtapasList";
import Checkbox from "@/components/Inputs/Checkbox";
import Dropdown from "@/components/Inputs/Dropdown";
import Input from "@/components/Inputs/Input";
import ListOfUsers from "@/components/ListOfUsers/ListOfUsers";
import Modal from "@/components/Modal/Modal";
import Breadcrumb from "@/components/Topbar/Breadcrumb";
import ProfileBar from "@/components/Topbar/ProfileBar";
import WarningLine from "@/components/WarningLine/WarningLine";
import { listarCargosList } from "@/controllers/cargoController";
import { createLlamado } from "@/controllers/llamadoController";
import { listarSolicitantes } from "@/controllers/userController";
import { ITR } from "@/enums/ITR";
import { TipoMiembro } from "@/enums/TipoMiembro";
import {
  crearLlamadoForm,
  crearLlamadoFormFields,
  crearLlamadoValidationSchema,
} from "@/forms/CrearLlamadoForm";
import { useGlobal } from "@/hooks/useGlobal";
import { formatCargosToDropdown } from "@/utils/cargo";
import { emptyEtapa } from "@/utils/etapa";
import { DEFAULT_USER_IMAGE, formatSolicitantes } from "@/utils/userUtils";
import { useMutation, useQuery } from "@apollo/client";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import styled from "styled-components";
import tw from "twin.macro";
import { Cargo } from "types/cargo";
import { Etapa } from "types/etapa";
import { Solicitante, SortUserInfo, TribunalInfo } from "types/usuario";

const Container = styled.div`
  ${tw`w-full px-5 pb-4 h-auto flex flex-col gap-5 items-center justify-start`}
`;

const SectionTitle = styled.h2`
  ${tw`text-2xl w-full text-left font-semibold text-texto`}
`;

const ContentInfo = styled.div`
  ${tw`w-full h-auto flex flex-col items-center bg-white rounded-[20px] justify-start gap-5 px-6 py-6 shadow-md`}
`;

const ListSuggestions = styled.div`
  ${tw`w-full h-auto gap-2 flex flex-col items-start justify-start`}
`;

const Row = styled.div`
  ${tw`flex w-full flex-row items-center justify-center gap-5`}
`;

const AgregarLlamado = () => {
  const { data: solicitantesData, loading: loadingSolicitantes } = useQuery<{
    listarSolicitantes: Solicitante[];
  }>(listarSolicitantes);
  const { data: cargosData, loading: loadingCargos } = useQuery<{
    listarCargos: Cargo[];
  }>(listarCargosList);
  const agregarLlamadoForm = useForm<crearLlamadoForm>({
    defaultValues: {
      enviarEmailTodos: false,
    },
    resolver: yupResolver(crearLlamadoValidationSchema()),
  });
  const { handleSetLoading } = useGlobal();
  const [etapas, setEtapas] = useState<Etapa[]>([]);
  const [selectedPostulantes, setSelectedPostulantes] = useState<
    SortUserInfo[]
  >([]);
  const [selectedTribunales, setSelectedTribunales] = useState<TribunalInfo[]>(
    []
  );
  const [handleCreateLlamado, { loading: loadingCreate }] =
    useMutation(createLlamado);
  const [openPostulantesModal, setOpenPostulantesModal] = useState(false);
  const [openTribunalModal, setOpenTribunalModal] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  useEffect(() => {
    handleSetLoading(loadingSolicitantes || loadingCargos || loadingCreate);
  }, [loadingSolicitantes, loadingCargos, loadingCreate]);

  const {
    formState: { errors },
    register,
    setValue,
    handleSubmit,
  } = agregarLlamadoForm;

  const handleAddEmptyEtapa = () => {
    setEtapas([
      ...etapas,
      {
        ...emptyEtapa,
        index: etapas?.length,
      },
    ]);
  };

  useEffect(() => {
    console.log(errors);
  }, [errors]);

  const handleNext = async (data: crearLlamadoForm) => {
    let suggestionsItems = [];

    if (selectedTribunales?.length === 0) {
      suggestionsItems?.push(
        "El llamado debe tener al menos un miembro del tribunal"
      );
    }
    if (
      !selectedTribunales?.find((item) => item?.type === TipoMiembro.titular)
    ) {
      suggestionsItems?.push("El llamado debe tener al menos un titular");
    }
    if (selectedPostulantes?.length === 0) {
      suggestionsItems?.push("El llamado debe tener al menos un postulante");
    }

    if (etapas?.length === 0) {
      suggestionsItems?.push("El llamado debe tener al menos una etapa");
    }

    let sumOfAllEtapas = 0;
    etapas?.forEach((item) => {
      if (item?.subetapas?.length === 0) {
        suggestionsItems?.push(
          `La etapa ${item?.nombre} no tiene ninguna subetapa`
        );
      }
      let sumOfSubetapas = 0;

      if (
        item?.nombre === "" ||
        item?.nombre === null ||
        item?.plazoDiasMaximo === 0 ||
        item?.plazoDiasMaximo === null ||
        item?.puntajeMinimo === 0 ||
        item?.puntajeMinimo === null
      ) {
        suggestionsItems?.push(
          `La etapa ${
            item?.nombre || ` en el indice ${item?.index}`
          } tiene valores invalidos`
        );
      }

      item?.subetapas?.forEach((subetapa) => {
        let sumOfRequisitos = 0;
        if (subetapa?.requisitos?.length === 0) {
          suggestionsItems?.push(
            `La subetapa ${
              subetapa?.nombre || `en el indice ${subetapa?.index}`
            } de la etapa ${
              item?.nombre || `en el indice ${item?.index}`
            }  no tiene ningun requisito`
          );
        }

        if (
          subetapa?.nombre === "" ||
          subetapa?.nombre === null ||
          subetapa?.puntajeMaximo === 0 ||
          subetapa?.puntajeMaximo === null
        ) {
          suggestionsItems?.push(
            `La subetapa ${
              subetapa?.nombre || `en el indice ${subetapa?.index}`
            }  de la etapa ${
              item?.nombre || `en el indice ${item?.index}`
            }  tiene valores invalidos`
          );
        }

        subetapa?.requisitos?.forEach((req) => {
          sumOfRequisitos += Number(req?.puntaje);
          if (
            req?.nombre === "" ||
            req?.nombre === null ||
            req?.puntaje === 0 ||
            req?.puntaje === null
          ) {
            suggestionsItems?.push(
              `El requisito ${
                req?.nombre || `con el indice ${req?.index}`
              } de la subetapa ${
                subetapa?.nombre || `en el indice${subetapa?.index}`
              } de la etaap ${item?.nombre} tiene valores invalidos`
            );
            return;
          }
        });
        if (Number(sumOfRequisitos) > Number(subetapa?.puntajeMaximo)) {
          suggestionsItems?.push(
            `La suma de los requisitos en la subetapa ${
              subetapa?.nombre || `en el indice ${subetapa?.index}`
            } no debe ser mayor a ${subetapa?.puntajeMaximo}`
          );
        }
        sumOfSubetapas += Number(sumOfRequisitos);
      });
      if (Number(sumOfSubetapas) < Number(item?.puntajeMinimo)) {
        suggestionsItems?.push(
          `El total de la etapa ${
            item?.nombre || `en el indice ${item?.index}`
          } no debe ser menor que ${item?.puntajeMinimo}`
        );
      }
      sumOfAllEtapas += Number(sumOfSubetapas);
    });

    if (Number(sumOfAllEtapas) !== 100) {
      suggestionsItems?.push("Error, la suma de todas las etapas debe ser 100");
    }

    if (suggestionsItems?.length > 0) {
      setSuggestions(suggestionsItems);
      return;
    } else {
      const dataToSend = {
        tribunales: selectedTribunales?.map((item) => ({
          id: Number(item?.id),
          type: item?.type,
          order: Number(item?.order),
        })),
        postulantes: selectedPostulantes?.map((item) => Number(item?.id)),
        llamadoInfo: data,
        etapas: etapas?.map((etapa) => {
          return {
            index: Number(etapa?.index),
            nombre: etapa?.nombre,
            plazoDiasMaximo: Number(etapa?.plazoDiasMaximo),
            puntajeMinimo: Number(etapa?.puntajeMinimo),
            subetapas: etapa?.subetapas?.map((subetapa) => ({
              index: Number(subetapa?.index),
              nombre: subetapa?.nombre,
              subtotal: Number(subetapa?.subtotal),
              puntajeMaximo: Number(subetapa?.puntajeMaximo),
              requisitos: subetapa?.requisitos?.map((req) => ({
                index: Number(req?.index),
                nombre: req?.nombre,
                puntaje: Number(req?.puntaje),
                excluyente: Boolean(req?.excluyente),
              })),
            })),
          };
        }),
      };
      console.log("data to send", dataToSend);
      try {
        const respose = await handleCreateLlamado({
          variables: {
            crearLlamadoInfo2: dataToSend,
          },
        });
        if (respose?.data?.crearLlamado?.ok === true) {
          toast.success("Llamado creado correctamente");
        } else {
          toast.error(`Error al crear llamado, ${respose?.data?.crearLlamado?.message}`);
        }
      } catch (error: any) {
        toast.error(error?.message || "Error al cerar llamado");
      }
    }
  };

  const handleAddPostulante = (data: SortUserInfo) => {
    setSelectedPostulantes([...selectedPostulantes, data]);
  };

  const handleAddTribunal = (data: TribunalInfo) => {
    setSelectedTribunales([...selectedTribunales, data]);
  };

  const handleRemovePostulante = (data: SortUserInfo) => {
    setSelectedPostulantes(
      selectedPostulantes?.filter((user) => user?.id !== data?.id)
    );
  };

  const handleRemoveTribunal = (data: TribunalInfo) => {
    setSelectedTribunales(
      selectedTribunales?.filter((user) => user?.id !== data?.id)
    );
  };

  return (
    <Container>
      <Topbar>
        <Breadcrumb title="Agregar nuevo llamado" />
        <ProfileBar />
      </Topbar>

      <div className="sticky !w-full z-[10] pt-4 !right-0 top-0 flex items-center justify-start">
        <div className="flex w-fit p-4 rounded-full items-center bg-[#EFF4FB] shadow-md justify-end">
          <Button
            text="Guardar llamado"
            variant="fill"
            action={handleSubmit(handleNext)}
            className="!py-2 !text-base"
            sizeVariant="fit"
          />
        </div>
      </div>

      <SectionTitle>Datos del llamado</SectionTitle>
      <ContentInfo>
        <Row>
          <Input
            label="Nombre"
            placeholder="Ingrese un nombre"
            type="string"
            register={register}
            required
            isInvalid={!!errors[crearLlamadoFormFields.nombre]?.message}
            inputFormName={crearLlamadoFormFields.nombre}
          />

          <Input
            label="Referencia"
            placeholder="Ingrese una referencia"
            type="string"
            register={register}
            required
            isInvalid={!!errors[crearLlamadoFormFields.referencia]?.message}
            inputFormName={crearLlamadoFormFields.referencia}
          />
        </Row>
        <Row>
          <Input
            label="Cantidad de horas"
            placeholder="Ingrese las cantidad de horas"
            type="number"
            register={register}
            required
            isInvalid={!!errors[crearLlamadoFormFields.cantidadHoras]?.message}
            inputFormName={crearLlamadoFormFields.cantidadHoras}
          />

          <Input
            label="Cupos"
            placeholder="Ingrese cantidad de cupos"
            type="number"
            register={register}
            required
            isInvalid={!!errors[crearLlamadoFormFields.cupos]?.message}
            inputFormName={crearLlamadoFormFields.cupos}
          />
        </Row>
        <Dropdown
          defaultValue={[]}
          label="ITR"
          isInvalid={!!errors[crearLlamadoFormFields.itr]?.message}
          placeholder="Seleccione un ITR"
          onChange={(val: any) =>
            setValue(crearLlamadoFormFields.itr, val?.value)
          }
          required
          items={[
            { label: "Suroeste", value: ITR.suroeste },
            { label: "Este", value: ITR.este },
            { label: "Norte", value: ITR.norte },
            { label: "Centro Sur", value: ITR.centrosur },
          ]}
          inputFormName={crearLlamadoFormFields.itr}
        />
        <Dropdown
          defaultValue={[]}
          label="Cargo"
          isInvalid={!!errors[crearLlamadoFormFields.cargo]?.message}
          placeholder="Seleccione un cargo"
          onChange={(val: any) =>
            setValue(crearLlamadoFormFields.cargo, val?.value)
          }
          required
          items={formatCargosToDropdown(cargosData?.listarCargos)}
          inputFormName={crearLlamadoFormFields.itr}
        />

        <Dropdown
          defaultValue={[]}
          label="Solicitante"
          isInvalid={!!errors[crearLlamadoFormFields.solicitante]?.message}
          placeholder="Seleccione un solicitante"
          onChange={(val: any) =>
            setValue(crearLlamadoFormFields.solicitante, val?.value)
          }
          required
          items={formatSolicitantes(solicitantesData?.listarSolicitantes)}
          inputFormName={crearLlamadoFormFields.solicitante}
        />
        <Checkbox
          label="Notificar a todos los miembros de CDP para el envio de emails."
          setValue={(val: any) =>
            setValue(crearLlamadoFormFields.enviarEmailTodos, val)
          }
          helperText="*De lo contrario, se notificará solamente a las personas relacionadas al llamado (ITR)*"
        />
      </ContentInfo>
      <Row>
        <SectionTitle>Etapas</SectionTitle>
        <Button
          text="Agregar etapa"
          variant="fill"
          action={() => handleAddEmptyEtapa()}
          className="!py-4 !text-lg"
          sizeVariant="fit"
        />
      </Row>
      {etapas?.length > 0 && (
        <EtapasList etapas={etapas} setEtapas={setEtapas} />
      )}

      <SectionTitle>Postulantes</SectionTitle>
      <ListOfUsers
        title="Listado de postulantes"
        onAddClick={() => setOpenPostulantesModal(!openPostulantesModal)}
        selectedUsers={selectedPostulantes}
        onRemove={(item: any) => handleRemovePostulante(item)}
      />
      {openPostulantesModal && (
        <AddPostulanteModal
          selectedUsers={selectedPostulantes}
          addPostulanteToList={handleAddPostulante}
          setOpen={setOpenPostulantesModal}
        />
      )}
      <SectionTitle>Tribunales</SectionTitle>
      <ListOfUsers
        title="Miembros del tribunal"
        selectedUsers={selectedTribunales}
        onAddClick={() => setOpenTribunalModal(!openTribunalModal)}
        onRemove={(item: any) => handleRemoveTribunal(item)}
      />
      {openTribunalModal && (
        <AddTribunalModal
          selectedTribunales={selectedTribunales}
          addTribunalToList={handleAddTribunal}
          setOpen={setOpenTribunalModal}
        />
      )}

      {suggestions?.length > 0 && (
        <Modal
          textok={"Revisar"}
          description="Permite agregar nuevos postulantes en un llamado, ya sea un nuevo postulante o uno ya existente en el sistema"
          onSubmit={() => setSuggestions([])}
          setOpen={() => setSuggestions([])}
          content={
            <ListSuggestions>
              {suggestions?.map((item, index) => {
                return (
                  <WarningLine message={item} key={`suggestion-${index}`} />
                );
              })}
            </ListSuggestions>
          }
          title="Tienes items por revisar"
          className="!mt-[20%]"
        />
      )}
    </Container>
  );
};

export default AgregarLlamado;
