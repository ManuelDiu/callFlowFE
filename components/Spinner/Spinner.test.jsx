import { render, screen } from "@testing-library/react";
import Spinner from "./Spinner";
import { Provider } from "react-redux";
import store from "@/store/store";

const customRender = () => {
  render(<Spinner />);
};

describe("Spinner component", () => {
  beforeEach(() => {
    customRender();
  });

  it("should render the correct container", () => {
    const container = screen.getByTestId("Spinner");
    expect(container).toBeInTheDocument();
  });
});
