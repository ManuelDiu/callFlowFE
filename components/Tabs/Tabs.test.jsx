import { render, screen } from "@testing-library/react";
import Tabs from "./Tabs";
import { Provider } from "react-redux";
import store from "@/store/store";

var mockItems = [];

const customRender = () => {
  render(<Tabs items={mockItems} />);
};

describe("Tabs component", () => {
  beforeEach(() => {
    customRender();
  });

  it("should render the correct container", () => {
    const container = screen.getByTestId("Tabs");
    expect(container).toBeInTheDocument();
  });
});
