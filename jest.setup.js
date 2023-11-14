import '@testing-library/jest-dom';
import { jest } from '@jest/globals';
import { useFormContext } from 'react-hook-form';

jest.mock('@apollo/client', () => ({
  ...jest.requireActual('@apollo/client'),
  _client: {
    gql: jest.fn()
  },
  gql: jest.fn(),
  useQuery: jest.fn(() => ({ data: {}, loading: false })),
  useMutation: jest.fn(() => [jest.fn(), { loading: false }]),
}));

jest.mock("next/router", () => ({
  ...jest.requireActual("next/router"),
  useRouter: jest.fn(() => ({
    query: {},
    pathname: "",
    push: jest.fn(),
  })),
}));

jest.mock("react-hook-form", () => ({
  ...jest.requireActual("react-hook-form"),
  useFormContext: jest.fn(),
  useController: jest.fn(),
}));

useFormContext.mockReturnValue({
  handleSubmit: jest.fn(),
  register: jest.fn(),
  setValue: jest.fn(),
  formState: { errors: {} },
  watch: jest.fn(),
  getValues: jest.fn(),
});