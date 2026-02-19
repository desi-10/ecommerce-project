interface SummaryCard {
  title: string;
  value: string;
  subtitle?: string;
}

interface SummaryCardsProps {
  cards: SummaryCard[];
}

export function SummaryCards({ cards }: SummaryCardsProps) {
  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <article
          key={card.title}
          className="rounded-xl border bg-white p-4 shadow-sm dark:bg-neutral-950"
        >
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            {card.title}
          </p>
          <p className="mt-3 text-2xl font-semibold">{card.value}</p>
          {card.subtitle ? (
            <p className="mt-2 text-xs text-muted-foreground">{card.subtitle}</p>
          ) : null}
        </article>
      ))}
    </section>
  );
}
