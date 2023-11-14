import { render, screen } from "@testing-library/react";
import EditTribunalModal from "./EditTribunalModal";
import { Provider } from "react-redux";
import store from "@/store/store";

var mocksetOpen = jest.fn();
var mockselectedUser = null;
var mockllamadoId = 1;

const customRender = () => {
  render(
    <Provider store={store}>
      <EditTribunalModal
        setOpen={mocksetOpen}
        selectedUser={mockselectedUser}
        llamadoId={mockllamadoId}
      />
    </Provider>
  );
};

describe("EditTribunalModal", () => {
  beforeEach(() => {
    customRender();
  });

  it("should render the correct component", () => {
    const container = screen.getByTestId("Container");
    expect(container).toBeInTheDocument();
  });
});
