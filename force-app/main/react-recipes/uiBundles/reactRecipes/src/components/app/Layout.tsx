import { useEffect, useState, type ReactNode } from 'react';
import { useLocation, useSearchParams } from 'react-router';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';
import CodeBlock from './CodeBlock';
import RecipeFlavorChips from './RecipeFlavorChips';
import {
  getCategoryFramework,
  getCategoryHosting,
} from '@/recipeRegistry';
export interface RecipeItem {
  name: string;
  description?: string;
  component: ReactNode;
  source: string;
}

interface LayoutProps {
  header: string;
  recipes?: RecipeItem[];
}

/**
 * Tracks whether the viewport is at the `lg` breakpoint (>=1024px) or wider.
 * The preview|code column split and its expand/collapse animation are a
 * desktop-only affordance; on smaller screens the panels stack vertically, so
 * we must NOT apply the inline `grid-template-columns` there (inline styles
 * would otherwise override the responsive Tailwind classes).
 */
function useIsDesktop() {
  const query = '(min-width: 1024px)';
  const [isDesktop, setIsDesktop] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(query).matches
  );
  useEffect(() => {
    const mq = window.matchMedia(query);
    const onChange = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    setIsDesktop(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);
  return isDesktop;
}

export default function Layout({ header, recipes = [] }: LayoutProps) {
  const { pathname } = useLocation();
  const hosting = getCategoryHosting(pathname);
  const framework = getCategoryFramework(pathname);
  const categoryFlavors =
    hosting && framework ? [{ hosting, framework }] : [];
  const [searchParams, setSearchParams] = useSearchParams();
  // Derive initial index from ?recipe param; track the param we last consumed
  // to detect new search navigations without using setState in an effect.
  const recipeParam = searchParams.get('recipe');
  const [state, setState] = useState(() => {
    const idx = recipeParam ? parseInt(recipeParam, 10) : 0;
    return {
      selectedIndex: idx >= 0 && idx < recipes.length ? idx : 0,
      consumedParam: recipeParam,
    };
  });

  let { selectedIndex } = state;

  // When the ?recipe param changes (e.g. from search), update the selection.
  // This runs during render (not in an effect) so there's no cascading setState.
  if (recipeParam !== null && recipeParam !== state.consumedParam) {
    const idx = parseInt(recipeParam, 10);
    if (idx >= 0 && idx < recipes.length) {
      selectedIndex = idx;
    }
    setState({ selectedIndex, consumedParam: recipeParam });
    setSearchParams({}, { replace: true });
  }

  const [codeExpanded, setCodeExpanded] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const isDesktop = useIsDesktop();
  const selected = recipes[selectedIndex];

  // Collapse code when switching recipes
  function selectRecipe(i: number) {
    setState((s) => ({ ...s, selectedIndex: i }));
    setCodeExpanded(false);
  }

  return (
    <div className="py-4">
      {/* Page Header */}
      {header && (
        <div className="mb-5">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-semibold tracking-tight">{header}</h1>
            {categoryFlavors.length > 0 && (
              <RecipeFlavorChips flavors={categoryFlavors} />
            )}
          </div>
          <div className="mt-1.5 h-0.5 w-12 rounded-full bg-primary" />
        </div>
      )}

      {/* Responsive layout: stacked on mobile, sidebar | main on desktop */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,4fr)]">
        {/* Sidebar — a horizontal scroll strip on mobile, a sticky column on desktop */}
        <nav
          className="rounded-lg border border-primary/70 bg-card p-2 lg:sticky lg:top-20 lg:h-[calc(100vh-12rem)] lg:overflow-y-auto"
          aria-label="Recipes"
        >
          <ul className="flex gap-1 overflow-x-auto lg:block lg:space-y-0.5 lg:overflow-x-visible">
            {recipes.map((recipe, i) => (
              <li key={recipe.name} className="shrink-0 lg:shrink">
                <button
                  onClick={() => selectRecipe(i)}
                  className={cn(
                    'whitespace-nowrap text-left px-3 py-2 text-sm rounded-md transition-colors lg:w-full',
                    i === selectedIndex
                      ? 'bg-primary text-primary-foreground font-medium shadow-sm'
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                  )}
                >
                  {recipe.name}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Recipe + Code */}
        {selected ? (
          <div
            className={cn(
              'grid grid-cols-1 gap-5 lg:items-start',
              isTransitioning && isDesktop &&
                'transition-[grid-template-columns,gap] duration-300 ease-in-out'
            )}
            style={
              isDesktop
                ? {
                    gridTemplateColumns: codeExpanded
                      ? '0fr minmax(0,1fr)'
                      : 'minmax(0,1fr) minmax(0,1fr)',
                    gap: codeExpanded ? '0px' : '1.25rem',
                  }
                : undefined
            }
          >
            <div
              className={cn(
                'min-w-0 overflow-hidden rounded-xl lg:sticky lg:top-20 lg:h-[calc(100vh-12rem)]',
                isTransitioning && isDesktop && 'transition-opacity duration-300',
                codeExpanded && isDesktop
                  ? 'opacity-0 pointer-events-none'
                  : 'opacity-100 lg:overflow-y-auto'
              )}
            >
              <Card className="min-h-full border-primary/70 shadow-none">
                <CardHeader>
                  <CardTitle>{selected.name}</CardTitle>
                  {selected.description && (
                    <CardDescription>{selected.description}</CardDescription>
                  )}
                </CardHeader>
                <CardContent className="slds-card__body_inner">
                  {selected.component}
                </CardContent>
              </Card>
            </div>

            {/* Code — container always mounted, content fades in */}
            <div className="h-[60vh] lg:sticky lg:top-20 lg:h-[calc(100vh-12rem)]" style={{ contain: 'layout style' }}>
              <CodeBlock
                source={selected.source}
                expanded={codeExpanded}
                onToggleExpand={() => {
                  setIsTransitioning(true);
                  setCodeExpanded((v) => !v);
                  setTimeout(() => setIsTransitioning(false), 300);
                }}
              />
            </div>
          </div>
        ) : (
          <p className="text-muted-foreground text-sm">No recipes yet.</p>
        )}
      </div>
    </div>
  );
}
