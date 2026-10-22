import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import NavigateTo from './NavigateTo';
import { getViewSDK } from '@salesforce/platform-sdk';

vi.mock('@salesforce/platform-sdk', () => ({ getViewSDK: vi.fn() }));

function mockView(view: unknown) {
  (getViewSDK as ReturnType<typeof vi.fn>).mockResolvedValue(view);
}

describe('NavigateTo', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('sends a page reference with state', async () => {
    const user = userEvent.setup();
    const navigateTo = vi.fn().mockResolvedValue(undefined);
    mockView({ navigateTo });

    render(<NavigateTo />);
    await user.click(
      screen.getByRole('button', { name: /All Accounts filter/ })
    );

    expect(navigateTo).toHaveBeenCalledWith({
      type: 'standard__objectPage',
      attributes: { objectApiName: 'Account', actionName: 'list' },
      state: { filterName: 'AllAccounts' },
    });
    expect(await screen.findByRole('status')).toHaveTextContent(
      'Host started navigation.'
    );
  });

  it('sends a nested page reference for standard__app', async () => {
    const user = userEvent.setup();
    const navigateTo = vi.fn().mockResolvedValue(undefined);
    mockView({ navigateTo });

    render(<NavigateTo />);
    await user.click(
      screen.getByRole('button', { name: /App with nested page reference/ })
    );

    expect(navigateTo).toHaveBeenCalledWith({
      type: 'standard__app',
      attributes: {
        appTarget: 'standard__LightningSales',
        pageRef: {
          type: 'standard__objectPage',
          attributes: { objectApiName: 'Contact', actionName: 'home' },
        },
      },
    });
  });

  it('sends URL strings unchanged', async () => {
    const user = userEvent.setup();
    const navigateTo = vi.fn().mockResolvedValue(undefined);
    mockView({ navigateTo });

    render(<NavigateTo />);
    await user.click(screen.getByRole('button', { name: /Absolute URL/ }));

    expect(navigateTo).toHaveBeenCalledWith('https://www.salesforce.com');
  });

  it('shows the error when navigation is rejected', async () => {
    const user = userEvent.setup();
    mockView({
      navigateTo: vi
        .fn()
        .mockRejectedValue(
          new Error('navigateTo: options must be structured-cloneable')
        ),
    });

    render(<NavigateTo />);
    await user.click(screen.getByRole('button', { name: /Not cloneable/ }));

    expect(await screen.findByRole('status')).toHaveTextContent(
      'Navigation failed: navigateTo: options must be structured-cloneable'
    );
  });

  it('reports when navigateTo is unavailable', async () => {
    const user = userEvent.setup();
    mockView({});

    render(<NavigateTo />);
    await user.click(screen.getByRole('button', { name: 'Home page' }));

    expect(await screen.findByRole('status')).toHaveTextContent(
      'navigateTo is not available on this surface.'
    );
  });

  it('has no accessibility violations', async () => {
    mockView({});
    const { container } = render(<NavigateTo />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
