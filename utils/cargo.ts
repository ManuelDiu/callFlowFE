import { Cargo } from "types/cargo";
import { DropDownItem } from "./utils";


export const formatCargosToDropdown = (cargos: Cargo[] = []): DropDownItem[] => {
    return cargos?.map((cargo) => {
        return {
            label: cargo?.nombre,
            value: cargo?.id,
        }
    })
}