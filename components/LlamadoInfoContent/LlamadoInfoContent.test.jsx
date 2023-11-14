import { render, screen } from "@testing-library/react";
import LlamadoInfoContent from "./LlamadoInfoContent";
import { Provider } from "react-redux";
import store from "@/store/store";

var mockLlamadoInfo = {};

const customRender = () => {
  render(
    <Provider store={store}>
      <LlamadoInfoContent llamadoInfo={mockLlamadoInfo} />
    </Provider>
  );
};

describe("LlamadoInfoContent component", () => {
  beforeEach(() => {
    customRender();
  });

  it("should render the correct container", () => {
    const container = screen.getByTestId("LlamadoInfoContent");
    expect(container).toBeInTheDocument();
  });
});
