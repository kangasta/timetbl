import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

/*
// Fail tests on any warning
console.error = message => { // eslint-disable-line no-console
	throw new Error(message);
};
*/

// Clear mocks for each test
beforeEach(() => {
	jest.useFakeTimers();

	global.URLSearchParams = param_str => ({
		get: (param_name) => {
			const match = param_str.match(param_name + /=([^&/]+)/);
			if (!match) return null;
			return match[1];
		}
	});
});

afterEach(() => {
	jest.resetAllMocks();
});
