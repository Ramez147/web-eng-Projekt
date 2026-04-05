export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="container flex min-h-screen items-center justify-center py-16">
        <div className="max-w-2xl rounded-3xl border bg-card p-8 shadow-sm">
          <p className="mb-4 w-fit rounded-full border border-primary/30 bg-primary/10 px-4 py-1 text-sm font-medium text-primary">
            Dashboard
          </p>
          <h1 className="text-3xl font-bold sm:text-4xl">
            Willkommen in deinem LoyaltyFlow Dashboard
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Deine Supabase-Session ist aktiv. Hier kannst du spaeter Metriken,
            Kunden und Kampagnen verwalten.
          </p>
        </div>
      </section>
    </main>
  );
}