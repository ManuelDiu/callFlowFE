import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AddFilePostulanteModal from "./AddFilePostulanteModal";
import store from "@/store/store";

// Mocking Apollo Client
jest.mock("@apollo/client", () => ({
  ...jest.requireActual("@apollo/client"),
  useQuery: jest.fn(() => ({
    data: {
      listTiposArchivo: [
        { id: 1, nombre: "Tipo1", origen: "postulante" },
        { id: 2, nombre: "Tipo2", origen: "postulante" },
      ],
    },
    loading: false,
  })),
}));

// Mocking other dependencies
jest.mock("@/hooks/useUploadImage", () => ({
  __esModule: true,
  default: {
    handleUpload: jest.fn(() => "mocked-file-link"),
  },
}));

jest.mock("react-hot-toast", () => ({
  __esModule: true,
  default: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

jest.mock("next/router", () => ({
  useRouter: () => ({
    query: {},
  }),
}));

// Mocking ModalConfirmation component
jest.mock("../Modal/components/ModalConfirmation", () => ({
  __esModule: true,
  default: jest.fn(() => <div />),
}));

describe("AddFilePostulanteModal component", () => {
  it("renders without crashing", () => {
    render(
      <AddFilePostulanteModal
        setOpen={() => {}}
        archivos={[]}
        postulanteId={1}
        llamadoId={2}
      />
    );
    // Add more assertions based on your component structure
  });

  it("handles file upload and submission correctly", async () => {
    render(
      <AddFilePostulanteModal
        setOpen={() => {}}
        archivos={[]}
        postulanteId={1}
        llamadoId={2}
      />
    );

    // Simulate user interaction with the file input
    const fileInput = screen.getByLabelText(/selecciona un archivo/i);
    const file = new File(["file content"], "file.txt", { type: "text/plain" });
    fireEvent.change(fileInput, { target: { files: [file] } });

    // Fill in other required fields
    userEvent.type(screen.getByLabelText(/nombre/i), "Test File");
    userEvent.click(screen.getByText(/agregar/i));

    // Wait for the asynchronous operations to complete
    await waitFor(() => {
      // Add assertions based on your component's expected behavior
      expect(
        screen.getByText(/archivo agregado correctamente/i)
      ).toBeInTheDocument();
    });
  });

  it("handles validation for existing file type correctly", async () => {
    // Mocking Apollo Client to include an existing file type in the response
    jest.mock("@apollo/client", () => ({
      ...jest.requireActual("@apollo/client"),
      useQuery: jest.fn(() => ({
        data: {
          listTiposArchivo: [
            { id: 1, nombre: "Tipo1", origen: "postulante" },
            { id: 2, nombre: "Tipo2", origen: "postulante" },
            { id: 3, nombre: "ExistingType", origen: "postulante" },
          ],
        },
        loading: false,
      })),
    }));

    render(
      <AddFilePostulanteModal
        setOpen={() => {}}
        archivos={[{ tipoArchivo: { nombre: "ExistingType" } }]}
        postulanteId={1}
        llamadoId={2}
      />
    );

    // Simulate user interaction with the file input
    const fileInput = screen.getByLabelText(/selecciona un archivo/i);
    const file = new File(["file content"], "file.txt", { type: "text/plain" });
    fireEvent.change(fileInput, { target: { files: [file] } });

    // Fill in other required fields
    userEvent.type(screen.getByLabelText(/nombre/i), "Test File");
    userEvent.click(screen.getByText(/agregar/i));

    // Wait for the asynchronous operations to complete
    await waitFor(() => {
      // Add assertions based on your component's expected behavior
      expect(
        screen.getByText(
          /estas seguro que deseas agregar este tipo de archivo/i
        )
      ).toBeInTheDocument();
    });
  });
});
