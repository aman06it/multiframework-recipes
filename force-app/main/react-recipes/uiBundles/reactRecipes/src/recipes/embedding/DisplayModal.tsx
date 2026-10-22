/**
 * Display Modal — guest asks the host to open a modal
 *
 * viewSDK.displayModal() sends a `ui/display-modal` request and the host opens a
 * Lightning modal (lightning/modal). `componentReference` selects the modal —
 * "default" is the built-in heading/content modal — and `params` are passed to it
 * as attributes. Any other value is rejected with INVALID_PARAMS.
 *
 * Unlike a toast, the promise stays pending until the user closes the modal, then
 * resolves with `{ closeResult }`.
 *
 * @see NavigateTo, DisplayToast
 */
import { useState } from 'react';
import { ExternalLink } from 'lucide-react';
import { getViewSDK } from '@salesforce/platform-sdk';
import type { ModalOptions } from '@salesforce/platform-sdk';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const SIZES: NonNullable<ModalOptions['size']>[] = ['small', 'medium', 'large'];

export default function DisplayModal() {
  const [size, setSize] = useState<(typeof SIZES)[number]>('small');
  const [status, setStatus] = useState<string | null>(null);

  async function open(overrides: Partial<ModalOptions> = {}) {
    setStatus('Modal open — waiting for the user to close it…');
    try {
      const sdk = await getViewSDK();
      if (!sdk.displayModal) {
        setStatus('displayModal is not available on this surface.');
        return;
      }
      const result = await sdk.displayModal({
        componentReference: 'default',
        size,
        label: 'Hello from the guest',
        params: {
          heading: 'Hello from the guest',
          content:
            'This modal is owned by the host and was requested by the guest.',
        },
        ...overrides,
      });
      setStatus(`Modal closed. Result: ${JSON.stringify(result ?? null)}`);
    } catch (err) {
      setStatus(
        `Modal failed: ${err instanceof Error ? err.message : String(err)}`
      );
    }
  }

  return (
    <div className="p-4">
      <Card className="max-w-md">
        <CardHeader>
          <CardTitle className="text-lg">Display Modal</CardTitle>
          <CardDescription>
            Calls viewSDK.displayModal(); the host opens a Lightning modal and
            the promise resolves when it closes.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <label className="flex items-center gap-2 text-sm">
            Size
            <select
              value={size}
              onChange={e => setSize(e.target.value as typeof size)}
              className="border-input rounded border px-2 py-1"
            >
              {SIZES.map(s => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>
          <div className="flex flex-wrap gap-2">
            <Button onClick={() => open()}>Open modal</Button>
            {/* Only "default" is supported; the host rejects anything else. */}
            <Button
              variant="outline"
              onClick={() => open({ componentReference: 'unknown' })}
            >
              Unregistered modal (expect error)
            </Button>
            {/* A function can't cross the host boundary; rejected up front. */}
            <Button
              variant="outline"
              onClick={() => open({ params: { onClose: () => undefined } })}
            >
              Not cloneable (expect error)
            </Button>
          </div>
          {status && (
            <p role="status" className="text-muted-foreground text-xs">
              {status}
            </p>
          )}
        </CardContent>
      </Card>
      <a
        href="https://github.com/trailheadapps/multiframework-recipes/blob/main/force-app/main/react-recipes/uiBundles/reactRecipes/src/recipes/embedding/DisplayModal.tsx"
        target="_blank"
        rel="noopener noreferrer"
        className="text-muted-foreground hover:text-primary mt-3 inline-flex items-center gap-1 text-xs"
      >
        Guest (DisplayModal.tsx)
        <ExternalLink className="size-3" aria-hidden />
      </a>
    </div>
  );
}
