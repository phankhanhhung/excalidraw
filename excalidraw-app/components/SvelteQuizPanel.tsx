import { useEffect, useRef } from "react";

export const SvelteQuizPanel = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) {
      return;
    }
    let component: { $destroy(): void } | undefined;

    import("./SvelteQuiz.svelte").then(({ default: SvelteQuiz }) => {
      if (containerRef.current) {
        component = new (SvelteQuiz as any)({
          target: containerRef.current,
          props: {},
        });
      }
    });

    return () => {
      component?.$destroy();
    };
  }, []);

  return <div ref={containerRef} />;
};
