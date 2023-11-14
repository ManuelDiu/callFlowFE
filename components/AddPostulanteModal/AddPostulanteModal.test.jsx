import { render, screen } from "@testing-library/react";
import AddPostulanteModal from "./AddPostulanteModal";
import { Provider } from "react-redux";
import store from "@/store/store";

var mockSetOpen = jest.fn();
var mockAddPostulanteToList = jest.fn();
var mockSelectedUsers = null;

const customRender = () => {
  render(
    <Provider store={store}>
    <AddPostulanteModal
      setOpen={mockSetOpen}
      addPostulanteToList={mockAddPostulanteToList}
      selectedUsers={mockSelectedUsers}
    />
    </Provider>

  );
};

describe("AddPostulanteModal", () => {
  beforeEach(() => {
    customRender();
  });

  it("should render the correct component", () => {
    const container = screen.getByTestId("Container");
    expect(container).toBeInTheDocument();
  });
});
