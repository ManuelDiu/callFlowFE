import { Topbar } from "@/components/CheckTokenWrapper/CheckTokenWrapper";
import OptionSelector from "@/components/OptionSelector/OptionSelector";
import Breadcrumb from "@/components/Topbar/Breadcrumb";
import ProfileBar from "@/components/Topbar/ProfileBar";
import appRoutes from "@/routes/appRoutes";
import { OptionSelectorItem } from "@/utils/utils";
import Link from "next/link";
import { useEffect, useState } from "react";
import styled from "styled-components";
import tw from "twin.macro";
import { TbTemplate } from "react-icons/tb";
import { MdAddHome } from "react-icons/md";
import { useQuery } from "@apollo/client";
import { listarTemplates } from "@/controllers/templateController";
import { useGlobal } from "@/hooks/useGlobal";
import { TemplateList } from "types/template";
import ColorBadge from "@/components/ColorBadge/ColorBadge";
import Checkbox from "@/components/Inputs/Checkbox";
import Button from "@/components/Buttons/Button";
import OneLineError from "@/components/OneLineError/OneLineError";
import { useRouter } from "next/router";

const Content = styled.div`
  ${tw`w-full transition-all p-5 h-auto flex flex-col items-center justify-center`}
`;

const Container = styled.div`
  ${tw`w-full h-auto bg-white rounded-[20px] shadow-md p-5 flex flex-col items-start justify-start gap-4`}
`;

const Title = styled.span`
  ${tw`text-[30px] font-semibold text-texto`}
`;

const Description = styled.span`
  ${tw`text-base font-semibold text-left text-textogris`}
`;

const ListTemplates = styled.div`
  ${tw`w-full mt-5 h-auto flex flex-row items-center justify-start gap-2 flex-wrap`}
`;

const TemplateItem = styled.div<{ selected: boolean }>`
  ${tw`w-[250px] border p-4 gap-1 h-[200px] transition-all flex shadow-md rounded-lg bg-white flex flex-col items-center justify-center`}
  ${({ selected }) =>
    selected ? tw`border-principal` : tw`border-textogris/10`}
`;

const TitleTemplate = styled.div`
  ${tw`text-texto text-base font-bold max-w-full truncate overflow-hidden`}
`;

const TitleCargo = styled.div`
  ${tw`text-textogris text-[14px] font-semibold max-w-full truncate overflow-hidden`}
`;

const TextEtapas = styled.div`
  ${tw`text-textogris text-[12px] font-medium`}
`;

const options: OptionSelectorItem[] = [
  {
    label: "Usar un template",
    value: 0,
    image: <TbTemplate color="#4318FF" size={50} />,
  },
  {
    label: "Crearlo desde cero",
    value: 1,
    image: <MdAddHome color="#4318FF" size={50} />,
  },
];

const SelectTemplate = () => {
  const [selectedOpt, setSelectedOpt] = useState<
    OptionSelectorItem | undefined
  >();
  const [selectedTemplate, setSelectedTemplate] = useState<
    TemplateList | undefined
  >();
  const { handleSetLoading, handleSetTemplate, handleClearTemplate } = useGlobal();
  const { data, loading: loadingTemplates } = useQuery(listarTemplates);
  const [error, setError] = useState<string | undefined>();
    const { push } = useRouter();

  const templates = data?.listarTemplates as TemplateList[];

  useEffect(() => {
    handleSetLoading(loadingTemplates);
  }, [loadingTemplates]);

  useEffect(() => {
    if (selectedTemplate) {
        setError(undefined)
    }
  }, [selectedTemplate])

  const handleSubmit = () => {
    if (selectedOpt?.value === 0 && !selectedTemplate) {
      setError("Debes seleccioanr un template");
      return;
    }
    if (!selectedOpt) {
      setError("Debes seleccioanr una opcion");
      return;
    }
    if (selectedOpt?.value === 0 && selectedTemplate) {
        handleSetTemplate(selectedTemplate);
    } else {
      handleClearTemplate();
    }
    push(appRoutes.agregarLlamado());
  };

  return (
    <Content>
      <Topbar>
        <Breadcrumb title="Crear llamado" />
        <ProfileBar />
      </Topbar>
      <Container>
        <Title>Selecciona como quieres crear el llamado</Title>
        <Description>
          Selecciona como quieres crear el llamado, si usas un template , no
          tendras que generar las etapas nuevamente, en caso contrario puedes
          generar el llamado desde cero. Si el template no existe ,{" "}
          <Link href={appRoutes.agregarTemplate()}>
            <span className="text-principal cursor-pointer">crealo aqui</span>
          </Link>
        </Description>

        <OptionSelector
          onChange={(val: any) => setSelectedOpt(val)}
          isInvalid={selectedOpt === null}
          options={options}
        />

        {selectedOpt?.value === 0 && (
          <Title className="mt-10">Lista de templates</Title>
        )}
        {selectedOpt?.value === 0 && (
          <ListTemplates>
            {templates?.map((template) => {
              if (!template?.activo) {
                return;
              }
              const selected = template?.id === selectedTemplate?.id;
              return (
                <TemplateItem selected={selected} key={template?.id}>
                  <ColorBadge
                    className="!w-[50px] !rounded-lg !h-[50px] !min-w-[50px]"
                    color={template?.color}
                  />
                  <TitleTemplate>{template?.nombre}</TitleTemplate>
                  <TitleCargo>
                    {template.cargo?.nombre || "Sin cargo"}
                  </TitleCargo>
                  <TextEtapas>Etapas: {template?.etapas}</TextEtapas>
                  <div>
                    <Checkbox
                      value={selectedTemplate?.id === template?.id}
                      setValue={(val?: any) =>
                        val
                          ? setSelectedTemplate(template)
                          : setSelectedTemplate(undefined)
                      }
                    />
                  </div>
                </TemplateItem>
              );
            })}
          </ListTemplates>
        )}
        {error && (
          <div className="my-4">
            <OneLineError message={error} />
          </div>
        )}
        <div className="w-full flex flex-row items-center justify-end">
          <Button
            action={() => handleSubmit()}
            variant="fill"
            className="!px-10 py-2"
            text="Continuar"
          />
        </div>
      </Container>
    </Content>
  );
};

export default SelectTemplate;
