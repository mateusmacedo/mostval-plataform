import { render } from '@testing-library/react';

import NextCore from './next-core';

describe('NextCore', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<NextCore />);
    expect(baseElement).toBeTruthy();
  });
});
