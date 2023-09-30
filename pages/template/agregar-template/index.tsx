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
import { ColorResult, SwatchesPicker } from "react-color";
import { createLlamado } from "@/controllers/llamadoController";
import {
  crearTempalteForm,
  crearTemplateFormFields,
  crearTemplateValidationSchema,
} from "@/forms/CrearTempalteForm";
import { useGlobal } from "@/hooks/useGlobal";
import { formatCargosToDropdown } from "@/utils/cargo";
import { emptyEtapa } from "@/utils/etapa";
import { useMutation, useQuery } from "@apollo/client";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import styled from "styled-components";
import tw from "twin.macro";
import { Cargo } from "types/cargo";
import { CategoriaItem } from "types/categoria";
import { Etapa } from "types/etapa";
import { crearTemplate } from "@/controllers/templateController";

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

const ColorSelectContainer = styled.div<{isInvalid?: boolean}>`
  ${tw`w-full py-4 transition-all cursor-pointer border relative rounded-full shadow-md flex items-center justify-center`}
  ${({ isInvalid }) => isInvalid ? tw`border-red2` : tw`border-textogris` }
`;

const SwitcherContainer = styled.div`
  ${tw`w-auto h-auto absolute top-0 left-0`}
`;

const TextColor = styled.div`
  ${tw`px-4 py-2 rounded-lg transition-all shadow-md m-auto bg-black/30 text-white font-semibold uppercase`}
`;

const AgregarTemplate = () => {
  const { data: cargosData, loading: loadingCargos } = useQuery<{
    listarCargos: Cargo[];
  }>(listarCargosList);
  const agregarLlamadoForm = useForm<crearTempalteForm>({
    resolver: yupResolver(crearTemplateValidationSchema()),
  });
  const { handleSetLoading } = useGlobal();
  const [openSelector, setOpenSelector] = useState<boolean>(false);
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [etapas, setEtapas] = useState<Etapa[]>([]);
  const [handleCreateTemplate, { loading: loadingCreate }] =
    useMutation(crearTemplate);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  useEffect(() => {
    handleSetLoading(loadingCargos || loadingCreate);
  }, [loadingCargos, loadingCreate]);

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
    if (selectedColor) {
        setValue(crearTemplateFormFields.color, selectedColor)
    }
  }, [selectedColor])

  const handleNext = async (data: crearTempalteForm) => {
    let suggestionsItems = [];

    if (etapas?.length === 0) {
      suggestionsItems?.push("El template debe tener al menos una etapa");
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
        nombre: data?.nombre,
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
        color: data?.color,
        cargo: Number(data?.cargo),
      };
      try {
        const respose = await handleCreateTemplate({
          variables: {
            crearTemplateInfo2: dataToSend,
          },
        });
        if (respose?.data?.crearTemplate?.ok === true) {
          toast.success("Template creado correctamente");
        } else {
          toast.error(
            `Error al crear template, ${respose?.data?.crearTemplate?.message}`
          );
        }
      } catch (error: any) {
        toast.error(error?.message || "Error al crear template");
      }
    }
  };

  return (
    <Container>
      <Topbar>
        <Breadcrumb title="Agregar nuevo template" />
        <ProfileBar />
      </Topbar>

      <div className="sticky !w-full z-[10] pt-4 !right-0 top-0 flex items-center justify-start">
        <div className="flex w-fit p-4 rounded-full items-center bg-[#EFF4FB] shadow-md justify-end">
          <Button
            text="Guardar template"
            variant="fill"
            action={handleSubmit(handleNext)}
            className="!py-2 !text-base"
            sizeVariant="fit"
          />
        </div>
      </div>

      <SectionTitle>Datos del template</SectionTitle>
      <ContentInfo>
        <Row>
          <Input
            label="Nombre"
            placeholder="Ingrese un nombre"
            type="string"
            register={register}
            required
            isInvalid={!!errors[crearTemplateFormFields.nombre]?.message}
            inputFormName={crearTemplateFormFields.nombre}
          />
        </Row>
        <Dropdown
          defaultValue={[]}
          label="Cargo"
          isInvalid={!!errors[crearTemplateFormFields.cargo]?.message}
          placeholder="Seleccione un cargo"
          onChange={(val: any) =>
            setValue(crearTemplateFormFields.cargo, val?.value)
          }
          required
          items={formatCargosToDropdown(cargosData?.listarCargos)}
          inputFormName={crearTemplateFormFields.cargo}
        />
        <Row>
          <ColorSelectContainer isInvalid={!!errors[crearTemplateFormFields.color]} style={{ backgroundColor: selectedColor }} onClick={() => setOpenSelector(!openSelector)}>
            {openSelector && (
              <SwitcherContainer>
                <SwatchesPicker
                  onChange={(color: ColorResult) => setSelectedColor(color?.hex)}
                />
              </SwitcherContainer>
            )}
            <TextColor>{selectedColor || "No seleccionado"}</TextColor>
          </ColorSelectContainer>
        </Row>
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

      {suggestions?.length > 0 && (
        <Modal
          textok={"Revisar"}
          description="Oops..! parece que tienes items por revisar antes de crear el template"
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

export default AgregarTemplate;
