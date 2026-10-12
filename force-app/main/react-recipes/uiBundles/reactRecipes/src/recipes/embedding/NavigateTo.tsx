/**
 * Navigate To — guest asks the host to navigate
 *
 * viewSDK.navigateTo() sends a `ui/navigate-to` request over the bridge and the
 * host performs real Lightning navigation (lightning/navigation). Pass a
 * PageReference to target a Lightning page, or a URL string, which navigates as a
 * `standard__webPage`.
 *
 * The guest lives in a sandboxed iframe and can't navigate the Salesforce shell
 * itself; this is how it asks the host to.
 *
 * @see DisplayToast, DisplayModal
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
import type { PageReference } from '@salesforce/platform-sdk';

const TARGETS: { label: string; destination: string | PageReference }[] = [
  {
    label: 'Account list',
    destination: {
      type: 'standard__objectPage',
      attributes: { objectApiName: 'Account', actionName: 'list' },
    },
  },
  {
    label: 'Home page',
    destination: {
      type: 'standard__namedPage',
      attributes: { pageName: 'home' },
    },
  },
  {
    label: 'URL string (/lightning/page/home)',
    destination: '/lightning/page/home',
  },
];

export default function NavigateTo() {
  const [status, setStatus] = useState<string | null>(null);

  async function go(destination: string | PageReference) {
    setStatus(null);
    try {
      const sdk = await getViewSDK();
      if (!sdk.navigateTo) {
        setStatus('navigateTo is not available on this surface.');
        return;
      }
      await sdk.navigateTo(destination);
      setStatus('Host started navigation.');
    } catch (err) {
      setStatus(
        `Navigation failed: ${err instanceof Error ? err.message : String(err)}`
      );
    }
  }

  return (
    <div className="p-4">
      <Card className="max-w-md">
        <CardHeader>
          <CardTitle className="text-lg">Navigate To</CardTitle>
          <CardDescription>
            Each button calls viewSDK.navigateTo(); the host navigates the
            Salesforce page.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-wrap gap-2">
            {TARGETS.map(t => (
              <Button
                key={t.label}
                variant="outline"
                onClick={() => go(t.destination)}
              >
                {t.label}
              </Button>
            ))}
          </div>
          {status && (
            <p role="status" className="text-muted-foreground text-xs">
              {status}
            </p>
          )}
        </CardContent>
      </Card>
      <a
        href="https://github.com/trailheadapps/multiframework-recipes/blob/main/force-app/main/react-recipes/uiBundles/reactRecipes/src/recipes/embedding/NavigateTo.tsx"
        target="_blank"
        rel="noopener noreferrer"
        className="text-muted-foreground hover:text-primary mt-3 inline-flex items-center gap-1 text-xs"
      >
        Guest (NavigateTo.tsx)
        <ExternalLink className="size-3" aria-hidden />
      </a>
    </div>
  );
}
