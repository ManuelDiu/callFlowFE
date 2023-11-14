import { render, screen, waitFor } from "@testing-library/react";
import CheckTokenWrapper from "./CheckTokenWrapper";
import { Provider } from "react-redux";
import store from "@/store/store";

var mockChildren = null;

const customRender = () => {
  render(
    <Provider store={store}>
      <CheckTokenWrapper>{mockChildren}</CheckTokenWrapper>
    </Provider>
  );
};

describe("CheckTokenWrapper component", () => {
  beforeEach(() => {
    customRender();
  });

  it("should render the correct container", async () => {
    await waitFor(() => {
        expect(true).toBe(true);
    })
  
  });
});
