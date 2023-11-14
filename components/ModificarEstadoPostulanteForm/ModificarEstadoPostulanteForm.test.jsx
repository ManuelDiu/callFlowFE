import { render, screen } from "@testing-library/react";
import ModificarEstadoPostulanteForm from "./ModificarEstadoPostulanteForm";

var normalErrors = [];
var estadoActual = {}

const customRender = () => {
  render(
    <ModificarEstadoPostulanteForm
      normalErrors={normalErrors}
      estadoActual={estadoActual}
    />
  );
};

describe("ModificarEstadoPostulanteForm component", () => {
  beforeEach(() => {
    customRender();
  });

  it("should render the correct container", () => {
    const container = screen.getByTestId("ModificarEstadoPostulanteForm");
    expect(container).toBeInTheDocument();
  });
});
