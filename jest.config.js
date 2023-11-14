module.exports = {
  setupFilesAfterEnv: ['./jest.setup.js'],
  testMatch: ["**/__tests__/**/*.[jt]s?(x)", "**/?(*.)+(spec|test).[jt]s?(x)"],
  transform: {
    "^.+\\.(js|jsx|ts|tsx|mjs)$": "babel-jest",
  },
  testEnvironment: "jest-environment-jsdom",
  moduleNameMapper: {
    "^.+\\.(svg)$": "<rootDir>/__mocks__/svg.tsx",
    "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$":
    "<rootDir>/__mocks__/fileMock.js",
    "\\.(css|less|scss)$": "<rootDir>/specs/__mocks__/styleMock.js",
    "@/components/(.*)$": "<rootDir>/components/$1",
    "@/enums/(.*)$": "<rootDir>/enums/$1",
    "@/forms/(.*)$": "<rootDir>/forms/$1",
    "@/pages/(.*)$": "<rootDir>/pages/$1",
    "@/public/(.*)$": "<rootDir>/public/$1",
    "^@/routes/(.*)$": "<rootDir>/routes/$1",
    "@/styles/(.*)$": "<rootDir>styles/$1",
    "@/store/(.*)$": "<rootDir>store/$1",
    "@/utils/(.*)$": "<rootDir>/utils/$1",
    "@/controllers/(.*)$": "<rootDir>controllers/$1",
    "@/hooks/(.*)$": "<rootDir>hooks/$1",
  },
  moduleFileExtensions: ["js", "jsx", 'ts', 'tsx'],
};
