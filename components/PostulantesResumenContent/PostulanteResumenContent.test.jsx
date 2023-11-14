import { render, screen } from "@testing-library/react";
import PostulanteResumenContent from "./PostulantesResumenContent";

var llamadoInfo = {
    etapas: [],
};

const customRender = () => {
  render(<PostulanteResumenContent llamadoInfo={llamadoInfo} />);
};

describe("PostulanteResumenContent component", () => {
  beforeEach(() => {
    customRender();
  });

  it("should render the correct container", () => {
    const container = screen.getByTestId("PostulanteResumenContent");
    expect(container).toBeInTheDocument();
  });
});
