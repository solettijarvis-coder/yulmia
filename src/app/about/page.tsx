export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-4xl sm:text-5xl font-serif font-bold text-foreground">
            About <span className="text-gold-gradient">YULMIA</span>
          </h1>
          <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
            YUL (Montreal) + MIA (Miami). We bridge Canadian and international investors
            to South Florida&apos;s best investment properties.
          </p>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            While every other platform drowns you in condo listings, we focus exclusively
            on what matters to investors: houses, multifamily properties, and distressed
            opportunities. Every property on YULMIA comes with AI-powered investment
            analysis — cap rates, cash flow projections, and honest risk assessments.
          </p>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            For our Canadian clients, we offer something no one else does: a clear pathway
            to E-2 Treaty Investor Visa eligibility through strategic property investment.
            We identify qualifying properties, help structure active business enterprises,
            and connect you with immigration attorneys who specialize in cross-border
            investment visas.
          </p>
        </div>
      </section>
    </div>
  );
}