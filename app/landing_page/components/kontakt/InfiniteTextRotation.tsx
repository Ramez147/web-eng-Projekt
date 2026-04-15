export function InfiniteTextRotation() {
  const words = ["creator", "maker", "creative", "visionary"];

  return (
    <section className="w-full py-2 md:py-3">
      <h2 className="flex flex-wrap items-baseline gap-x-3 gap-y-1 text-3xl font-black tracking-tight text-balance sm:text-4xl md:text-5xl lg:text-6xl">
        <span className="text-foreground/90">The perfect choice for any</span>

        <span className="relative inline-flex h-[1.15em] min-w-[10ch] overflow-hidden align-bottom">
          {words.map((word, index) => (
            <span
              key={word}
              className="infinite-rotating-word absolute inset-0 whitespace-nowrap bg-linear-to-r from-indigo-600 via-blue-500 to-indigo-500 bg-clip-text text-transparent dark:from-indigo-400 dark:via-blue-300 dark:to-indigo-300"
              style={{ animationDelay: `${index * 2.7}s` }}
            >
              {word}
            </span>
          ))}
        </span>
      </h2>

      <p className="mt-2 text-sm font-medium text-muted-foreground/90 md:text-base">
        Built for ambitious teams shipping modern products.
      </p>

      <style jsx>{`
        .infinite-rotating-word {
          opacity: 0;
          transform: translateY(110%);
          animation: vertical-word-loop 10.8s cubic-bezier(0.22, 1, 0.36, 1) infinite;
          will-change: transform, opacity;
        }

        @keyframes vertical-word-loop {
          0% {
            opacity: 0;
            transform: translateY(110%);
          }
          7% {
            opacity: 1;
            transform: translateY(0);
          }
          20% {
            opacity: 1;
            transform: translateY(0);
          }
          27% {
            opacity: 0;
            transform: translateY(-110%);
          }
          100% {
            opacity: 0;
            transform: translateY(-110%);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .infinite-rotating-word {
            animation: none;
            opacity: 0;
            transform: none;
          }

          .infinite-rotating-word:first-child {
            opacity: 1;
          }
        }
      `}</style>
    </section>
  );
}
