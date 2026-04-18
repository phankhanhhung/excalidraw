import { useEffect, useRef } from "react";

export const SvelteQuizPanel = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) {
      return;
    }
    let component: { $destroy(): void } | undefined;
    let mounted = true;

    import("./SvelteQuiz.svelte").then(({ default: SvelteQuiz }) => {
      if (mounted && containerRef.current) {
        component = new (SvelteQuiz as any)({
          target: containerRef.current,
          props: {},
        });
      }
    });

    return () => {
      mounted = false;
      component?.$destroy();
    };
  }, []);

  return <div ref={containerRef} />;
};
