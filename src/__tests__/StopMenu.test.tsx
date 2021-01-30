import React from 'react';
import { render } from '@testing-library/react';

import { StopMenu } from '../Components/StopMenu';

//jest.mock('../APIQuery');

describe('StopMenu', () => {
  it('renders without crashing', () => {
    render(
      <StopMenu
        type='nearestStops'
        data={[]}
        navigate={() => ({ type: 'NAVIGATE' })}
      />
    );
  });
});
