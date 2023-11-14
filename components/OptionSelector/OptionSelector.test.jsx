
import { render, screen } from "@testing-library/react";
import OptionSelector from "./OptionSelector";

var mockoptions = [];
var mockisInvalid = false;
var mockonChange = jest.fn();

const customRender = () => {
  render(<OptionSelector
    options={mockoptions}
    isInvalid={mockisInvalid}
    onChange={mockonChange}
  />);
};

describe("OptionSelector component", () => {
  beforeEach(() => {
    customRender();
  });

  it("should render the correct container", () => {
    const container = screen.getByTestId("OptionSelector");
    expect(container).toBeInTheDocument();
  });
});
