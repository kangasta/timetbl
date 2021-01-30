import '@testing-library/jest-dom/extend-expect';

/*
// Fail tests on any warning
console.error = message => { // eslint-disable-line no-console
	throw new Error(message);
};
*/

// Clear mocks for each test
beforeEach(() => {
  jest.restoreAllMocks();
  jest.useFakeTimers();
});
