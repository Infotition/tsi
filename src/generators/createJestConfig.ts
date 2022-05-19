import { Config } from '@jest/types';
import { appRoot } from '../utils/constants';

export const createJestConfig = (setupPath: string): Config.InitialOptions => ({
  clearMocks: true,
  coverageDirectory: 'coverage',
  coverageProvider: 'v8',
  testEnvironment: 'jest-environment-jsdom',
  moduleFileExtensions: ['ts', 'tsx', 'js'],
  testPathIgnorePatterns: ['node_modules/'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
    '^.+\\.(png|jpg|ttf|woff|woff2)$': 'jest-transform-stub',
  },
  moduleNameMapper: {
    '^.+\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  collectCoverageFrom: [
    '<rootDir>/src/**/*.{ts,tsx,js,jsx}',
    '!<rootDir>/src/**/*.{types,stories}.{ts,tsx,js,jsx}',
  ],
  testMatch: ['<rootDir>/**/*.test.(ts|tsx)'],
  setupFilesAfterEnv: [setupPath],
  rootDir: appRoot,
});
