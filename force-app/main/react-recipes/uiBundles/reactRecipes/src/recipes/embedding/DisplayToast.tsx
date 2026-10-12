/**
 * Display Toast — guest asks the host to show a toast
 *
 * viewSDK.displayToast() sends a `ui/display-toast` request and the host shows a
 * native Lightning toast (lightning/toast). The promise resolves once the toast
 * is shown, not when the user dismisses it.
 *
 *   - `level`  info | success | warning | error   (toast variant)
 *   - `title`  optional heading above the message
 *   - `mode`   dismissible | pester | sticky      (how the toast dismisses)
 *
 * @see NavigateTo, DisplayModal
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
import type { MessageLevel } from '@salesforce/platform-sdk';

const LEVELS: MessageLevel[] = ['info', 'success', 'warning', 'error'];

export default function DisplayToast() {
  const [sticky, setSticky] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  async function show(level: MessageLevel) {
    setStatus(null);
    try {
      const sdk = await getViewSDK();
      if (!sdk.displayToast) {
        setStatus('displayToast is not available on this surface.');
        return;
      }
      await sdk.displayToast({
        title: `A ${level} toast`,
        message: 'Shown by the host on behalf of the guest.',
        level,
        mode: sticky ? 'sticky' : 'dismissible',
      });
      setStatus(`Host showed the ${level} toast.`);
    } catch (err) {
      setStatus(
        `Toast failed: ${err instanceof Error ? err.message : String(err)}`
      );
    }
  }

  return (
    <div className="p-4">
      <Card className="max-w-md">
        <CardHeader>
          <CardTitle className="text-lg">Display Toast</CardTitle>
          <CardDescription>
            Each button calls viewSDK.displayToast(); the host shows a native
            Lightning toast.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-wrap gap-2">
            {LEVELS.map(level => (
              <Button key={level} variant="outline" onClick={() => show(level)}>
                {level}
              </Button>
            ))}
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={sticky}
              onChange={e => setSticky(e.target.checked)}
            />
            Sticky (stays until closed)
          </label>
          {status && (
            <p role="status" className="text-muted-foreground text-xs">
              {status}
            </p>
          )}
        </CardContent>
      </Card>
      <a
        href="https://github.com/trailheadapps/multiframework-recipes/blob/main/force-app/main/react-recipes/uiBundles/reactRecipes/src/recipes/embedding/DisplayToast.tsx"
        target="_blank"
        rel="noopener noreferrer"
        className="text-muted-foreground hover:text-primary mt-3 inline-flex items-center gap-1 text-xs"
      >
        Guest (DisplayToast.tsx)
        <ExternalLink className="size-3" aria-hidden />
      </a>
    </div>
  );
}
