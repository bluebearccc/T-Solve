import { render, screen } from '@testing-library/react';
import { StatusTag } from './StatusTag';
import { STATUS_TAGS, type StatusTagStatus } from './status-tags';

describe('StatusTag', () => {
  it('has exactly the 15 statuses of the Figma kit, without the retired ones', () => {
    expect(Object.keys(STATUS_TAGS)).toHaveLength(15);
    expect(Object.values(STATUS_TAGS).map((s) => s.label)).not.toContain('Deferred');
  });

  it.each(Object.entries(STATUS_TAGS))('shows %s as "%o"', (status, { label }) => {
    render(<StatusTag status={status as StatusTagStatus} />);
    expect(screen.getByText(label)).toBeInTheDocument();
  });
});
