import { render, screen } from "@testing-library/react";
import LlamadoInfoCard from "./LlamadoInfoCard";
import { Provider } from "react-redux";
import store from "@/store/store";

var mockLlamadoInfo = {}

const customRender = () => {
  render(
    <Provider store={store}>
      <LlamadoInfoCard
        llamadoInfo={mockLlamadoInfo}
      />
    </Provider>
  );
};

describe("LlamadoInfo component", () => {
  beforeEach(() => {
    customRender();
  });

  it("should render the correct container", () => {
    const container = screen.getByTestId("LlamadoInfo");
    expect(container).toBeInTheDocument();
  });
});
