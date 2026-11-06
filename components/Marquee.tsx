"use client";

const items = [
  "The Fab Vault",
  "Curated goods",
  "Lagos",
  "Archive 001",
  "One of one",
  "No restocks",
];

function Rail({
  reverse = false,
  serif = false,
  tone = "ink",
}: {
  reverse?: boolean;
  serif?: boolean;
  tone?: "ink" | "paper";
}) {
  // Two identical halves. Translating exactly -50% loops with no seam.
  const half = [...items, ...items, ...items];
  const sequence = [...half, ...half];

  const text = tone === "ink" ? "text-ink/70" : "text-paper/70";
  const dot = tone === "ink" ? "text-ink/25" : "text-paper/30";
  const border = tone === "ink" ? "border-ink/12" : "border-paper/15";

  return (
    <div
      className={`rail-paused relative flex overflow-hidden border-y ${border} py-3`}
    >
      <div
        className={`rail ${reverse ? "rail-reverse" : "rail-forward"} items-center`}
      >
        {sequence.map((item, index) => (
          <span key={`${item}-${index}`} className="flex items-center">
            <span
              className={`whitespace-nowrap px-6 ${
                serif
                  ? "font-serif text-[13px] uppercase tracking-[0.2em]"
                  : "font-sans text-[9px] uppercase tracking-[0.42em]"
              } ${text}`}
            >
              {item}
            </span>
            <span aria-hidden className={`text-[8px] ${dot}`}>
              &#9670;
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}

export function Marquee({
  reverse = false,
  serif = false,
  tone = "ink",
  double = false,
}: {
  reverse?: boolean;
  serif?: boolean;
  tone?: "ink" | "paper";
  double?: boolean;
}) {
  if (double) {
    return (
      <div className="bg-ink py-0">
        <Rail tone="paper" />
        <Rail tone="paper" reverse serif />
      </div>
    );
  }

  return <Rail reverse={reverse} serif={serif} tone={tone} />;
}
