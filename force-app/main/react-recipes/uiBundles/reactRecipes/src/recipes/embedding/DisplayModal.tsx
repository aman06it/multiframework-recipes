/**
 * Display Modal — guest asks the host to open a modal
 *
 * viewSDK.displayModal() sends a `ui/display-modal` request and the host opens a
 * Lightning modal (lightning/modal). `componentReference` names a modal the host
 * has registered — "default" is the built-in heading/content modal — and `params`
 * are passed to it as attributes. Unregistered components are rejected.
 *
 * Unlike a toast, the promise stays pending until the user closes the modal, then
 * resolves with `{ closeResult }`.
 *
 * @see NavigateTo, DisplayToast
 */
import { useState } from 'react';
import { ExternalLink } from 'lucide-react';
import { getViewSDK } from '@salesforce/platform-sdk';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function DisplayModal() {
  const [status, setStatus] = useState<string | null>(null);

  async function open() {
    setStatus('Modal open — waiting for the user to close it…');
    try {
      const sdk = await getViewSDK();
      if (!sdk.displayModal) {
        setStatus('displayModal is not available on this surface.');
        return;
      }
      const result = await sdk.displayModal({
        componentReference: 'default',
        size: 'small',
        label: 'Hello from the guest',
        params: {
          heading: 'Hello from the guest',
          content:
            'This modal is owned by the host and was requested by the guest.',
        },
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
          <Button onClick={open}>Open modal</Button>
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
