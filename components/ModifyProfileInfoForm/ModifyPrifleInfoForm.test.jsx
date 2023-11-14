import { render, screen } from "@testing-library/react";
import ModifyProfileInfoForm from "./ModifyProfileInfoForm";

var normalErrors = [];
var userInfo = {
    roles: ['Admin']
};

const customRender = () => {
  render(
    <ModifyProfileInfoForm normalErrors={normalErrors} userInfo={userInfo} />
  );
};

describe("ModifyProfileInfoForm component", () => {
  beforeEach(() => {
    customRender();
  });

  it("should render the correct container", () => {
    const container = screen.getByTestId("ModifyProfileInfoForm");
    expect(container).toBeInTheDocument();
  });
});
