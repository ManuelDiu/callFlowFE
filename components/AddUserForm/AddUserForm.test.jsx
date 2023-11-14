import { render, screen } from "@testing-library/react";
import AddUserForm from "./AddUserForm";
import { Provider } from "react-redux";
import store from "@/store/store";

var mocksetFile = jest.fn();
var mocknormalErrors = [];
var mockselectedUser = null;

const customRender = () => {
  render(
    <Provider store={store}>
      <AddUserForm
        setFile={mocksetFile}
        normalErrors={mocknormalErrors}
        selectedUser={mockselectedUser}
      />
    </Provider>
  );
};

describe("AddUserForm", () => {
  beforeEach(() => {
    customRender();
  });

  it("should render the correct component", () => {
    const container = screen.getByTestId("Container");
    expect(container).toBeInTheDocument();
  });
});
