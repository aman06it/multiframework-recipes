import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import DisplayToast from './DisplayToast';
import { getViewSDK } from '@salesforce/platform-sdk';

vi.mock('@salesforce/platform-sdk', () => ({ getViewSDK: vi.fn() }));

function mockView(view: unknown) {
  (getViewSDK as ReturnType<typeof vi.fn>).mockResolvedValue(view);
}

describe('DisplayToast', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('shows a dismissible toast at the chosen level by default', async () => {
    const user = userEvent.setup();
    const displayToast = vi.fn().mockResolvedValue(undefined);
    mockView({ displayToast });

    render(<DisplayToast />);
    await user.click(screen.getByRole('button', { name: 'success' }));

    expect(displayToast).toHaveBeenCalledWith({
      title: 'A success toast',
      message: 'Shown by the host on behalf of the guest.',
      level: 'success',
      mode: 'dismissible',
    });
    expect(await screen.findByRole('status')).toHaveTextContent(
      'Host showed the success toast (dismissible).'
    );
  });

  it('sends mode sticky', async () => {
    const mode = 'sticky';
    const user = userEvent.setup();
    const displayToast = vi.fn().mockResolvedValue(undefined);
    mockView({ displayToast });

    render(<DisplayToast />);
    await user.selectOptions(screen.getByLabelText('Mode'), mode);
    await user.click(screen.getByRole('button', { name: 'warning' }));

    expect(displayToast).toHaveBeenCalledWith(
      expect.objectContaining({ level: 'warning', mode })
    );
  });

  it('shows the error when the toast fails', async () => {
    const user = userEvent.setup();
    mockView({ displayToast: vi.fn().mockRejectedValue(new Error('boom')) });

    render(<DisplayToast />);
    await user.click(screen.getByRole('button', { name: 'error' }));

    expect(await screen.findByRole('status')).toHaveTextContent(
      'Toast failed: boom'
    );
  });

  it('reports when displayToast is unavailable', async () => {
    const user = userEvent.setup();
    mockView({});

    render(<DisplayToast />);
    await user.click(screen.getByRole('button', { name: 'info' }));

    expect(await screen.findByRole('status')).toHaveTextContent(
      'displayToast is not available on this surface.'
    );
  });

  it('has no accessibility violations', async () => {
    mockView({});
    const { container } = render(<DisplayToast />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
