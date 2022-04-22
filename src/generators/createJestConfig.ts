import { Config } from '@jest/types';
import { appRoot } from '../constants/paths';

export const createJestConfig = (): Config.InitialOptions => ({
  clearMocks: true,
  coverageDirectory: 'coverage',
  coverageProvider: 'v8',
  testEnvironment: 'jest-environment-jsdom',
  moduleFileExtensions: ['ts', 'tsx', 'js'],
  testPathIgnorePatterns: ['node_modules/'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
    '.+\\.(css|less|sass|scss|png|jpg|ttf|woff|woff2)$': 'jest-transform-stub',
  },
  collectCoverageFrom: ['<rootDir>/src/**/*.{ts,tsx,js,jsx}'],
  testMatch: ['<rootDir>/**/*.test.(ts|tsx)'],
  setupFilesAfterEnv: [`<rootDir>/node_modules/@infotition/tsi/lib/templates/jest.setup.ts`],
  rootDir: appRoot,
});
