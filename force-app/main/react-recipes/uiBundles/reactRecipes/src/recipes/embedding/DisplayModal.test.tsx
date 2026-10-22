import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import DisplayModal from './DisplayModal';
import { getViewSDK } from '@salesforce/platform-sdk';

vi.mock('@salesforce/platform-sdk', () => ({ getViewSDK: vi.fn() }));

function mockView(view: unknown) {
  (getViewSDK as ReturnType<typeof vi.fn>).mockResolvedValue(view);
}

describe('DisplayModal', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('opens the default modal and shows the close result', async () => {
    const user = userEvent.setup();
    const displayModal = vi
      .fn()
      .mockResolvedValue({ closeResult: 'dismissed' });
    mockView({ displayModal });

    render(<DisplayModal />);
    await user.click(screen.getByRole('button', { name: 'Open modal' }));

    expect(displayModal).toHaveBeenCalledWith({
      componentReference: 'default',
      size: 'small',
      label: 'Hello from the guest',
      params: {
        heading: 'Hello from the guest',
        content:
          'This modal is owned by the host and was requested by the guest.',
      },
    });
    expect(await screen.findByRole('status')).toHaveTextContent(
      'Modal closed. Result: {"closeResult":"dismissed"}'
    );
  });

  it('shows the pending state until the modal closes', async () => {
    const user = userEvent.setup();
    let close: (value: unknown) => void = () => undefined;
    mockView({
      displayModal: vi.fn(() => new Promise(resolve => (close = resolve))),
    });

    render(<DisplayModal />);
    await user.click(screen.getByRole('button', { name: 'Open modal' }));
    expect(screen.getByRole('status')).toHaveTextContent(
      'Modal open — waiting for the user to close it…'
    );

    close({ closeResult: 1 });
    expect(await screen.findByText(/Modal closed/)).toBeInTheDocument();
  });

  it.each(['medium', 'large'])('sends size %s', async size => {
    const user = userEvent.setup();
    const displayModal = vi.fn().mockResolvedValue(undefined);
    mockView({ displayModal });

    render(<DisplayModal />);
    await user.selectOptions(screen.getByLabelText('Size'), size);
    await user.click(screen.getByRole('button', { name: 'Open modal' }));

    expect(displayModal).toHaveBeenCalledWith(
      expect.objectContaining({ size })
    );
  });

  it('shows the host rejection for an unregistered modal', async () => {
    const user = userEvent.setup();
    const displayModal = vi.fn().mockRejectedValue(new Error('INVALID_PARAMS'));
    mockView({ displayModal });

    render(<DisplayModal />);
    await user.click(screen.getByRole('button', { name: /Unregistered/ }));

    expect(displayModal).toHaveBeenCalledWith(
      expect.objectContaining({ componentReference: 'unknown' })
    );
    expect(await screen.findByRole('status')).toHaveTextContent(
      'Modal failed: INVALID_PARAMS'
    );
  });

  it('sends non-cloneable params so the SDK can reject them', async () => {
    const user = userEvent.setup();
    const displayModal = vi
      .fn()
      .mockRejectedValue(new Error('options must be structured-cloneable'));
    mockView({ displayModal });

    render(<DisplayModal />);
    await user.click(screen.getByRole('button', { name: /Not cloneable/ }));

    const { params } = displayModal.mock.calls[0][0];
    expect(typeof params.onClose).toBe('function');
    expect(await screen.findByRole('status')).toHaveTextContent(
      'Modal failed: options must be structured-cloneable'
    );
  });

  it('reports when displayModal is unavailable', async () => {
    const user = userEvent.setup();
    mockView({});

    render(<DisplayModal />);
    await user.click(screen.getByRole('button', { name: 'Open modal' }));

    expect(await screen.findByRole('status')).toHaveTextContent(
      'displayModal is not available on this surface.'
    );
  });

  it('has no accessibility violations', async () => {
    mockView({});
    const { container } = render(<DisplayModal />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
