import { Archivo } from "types/llamado";

export type DropDownItem = {
  label: any;
  value: any;
  id?: any;
};


export type OptionsItem = {
  text: string;
  onClick: any;
};


export type OptionSelectorItem =  {
  label: string,
  value: any,
  image: any,
}

export type TabItem = {
  title: string,
  index: number,
  content: any,
}

export const getFileType = (archivo: Archivo): any => {
  const fileTipo = archivo.extension.split('/')[1] || "txt";
  return fileTipo;
}

