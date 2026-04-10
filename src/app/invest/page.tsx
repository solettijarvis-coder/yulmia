import { ShieldCheck, DollarSign, FileText, Users, ArrowRight, CheckCircle } from "lucide-react";
import Link from "next/link";

const steps = [
  {
    step: 1,
    title: "Invest in a Qualifying Business",
    description:
      "Purchase an investment property or start a real estate services business in South Florida. Minimum investment typically starts at $100K-$150K, with stronger applications at $200K+.",
    icon: DollarSign,
  },
  {
    step: 2,
    title: "Structure as Active Enterprise",
    description:
      "Passive real estate investment alone doesn't qualify. YULMIA helps you structure your investment as an active business — property management, renovation, or investment services.",
    icon: FileText,
  },
  {
    step: 3,
    title: "File E-2 Visa Application",
    description:
      "Work with our recommended immigration attorneys to prepare and file your E-2 Treaty Investor Visa application. Processing for Canadians typically takes 2-6 months.",
    icon: ShieldCheck,
  },
  {
    step: 4,
    title: "Relocate & Manage",
    description:
      "Once approved, relocate to South Florida and actively manage your investment. YULMIA provides ongoing property management support and business infrastructure.",
    icon: Users,
  },
];

const propertyTypes = [
  {
    type: "Single Family Home",
    minInvestment: "$200K+",
    e2Viability: "Good",
    notes: "Requires active management component. Strongest when combined with property management business.",
  },
  {
    type: "Duplex / Triplex",
    minInvestment: "$250K+",
    e2Viability: "Strong",
    notes: "Owner can live in one unit, rent others. Demonstrates active enterprise clearly.",
  },
  {
    type: "Multifamily (5+ units)",
    minInvestment: "$500K+",
    e2Viability: "Excellent",
    notes: "Clear business enterprise with employees. Strongest E-2 application category.",
  },
  {
    type: "Distressed + Renovation",
    minInvestment: "$150K+ purchase, $50K+ reno",
    e2Viability: "Strong",
    notes: "Active development demonstrates at-risk investment and business activity.",
  },
  {
    type: "Commercial Property",
    minInvestment: "$300K+",
    e2Viability: "Good",
    notes: "Requires tenant management or business operations. Clear enterprise structure.",
  },
];

export default function InvestPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        <div className="relative mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-4 py-1.5 text-sm text-primary mb-6">
            <ShieldCheck className="h-4 w-4" />
            For Canadian & International Investors
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-foreground leading-tight">
            E-2 Visa Through{" "}
            <span className="text-gold-gradient">Property Investment</span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
            Canadian citizens can use real estate investment as a pathway to live and work in the United States.
            YULMIA helps you identify E-2 eligible properties and structure your investment for visa success.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/search"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors text-lg"
            >
              Find E-2 Eligible Properties
              <ArrowRight className="h-5 w-5" />
            </Link>
            <a
              href="#process"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl border border-border bg-card text-foreground font-semibold hover:border-primary/50 transition-colors text-lg"
            >
              How It Works
            </a>
          </div>
        </div>
      </section>

      {/* Process */}
      <section id="process" className="py-20 px-4 sm:px-6 lg:px-8 bg-card/50">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-foreground text-center">
            How It Works
          </h2>
          <p className="mt-3 text-center text-muted-foreground">
            From investment to E-2 visa approval
          </p>

          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step) => (
              <div
                key={step.step}
                className="relative p-6 rounded-xl border border-border bg-card"
              >
                <div className="text-xs font-bold text-primary mb-3">
                  STEP {step.step}
                </div>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <step.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-serif font-semibold text-foreground">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Property Types Table */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-foreground text-center">
            E-2 Eligible Property Types
          </h2>
          <p className="mt-3 text-center text-muted-foreground">
            Investment thresholds and E-2 viability by property type
          </p>

          <div className="mt-10 overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Property Type</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Min. Investment</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">E-2 Viability</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Notes</th>
                </tr>
              </thead>
              <tbody>
                {propertyTypes.map((pt) => (
                  <tr key={pt.type} className="border-b border-border/50 hover:bg-muted/50 transition-colors">
                    <td className="py-3 px-4 text-sm font-medium text-foreground">{pt.type}</td>
                    <td className="py-3 px-4 text-sm text-primary font-semibold">{pt.minInvestment}</td>
                    <td className="py-3 px-4">
                      <span className={`text-sm font-medium ${
                        pt.e2Viability === "Excellent" ? "text-success" :
                        pt.e2Viability === "Strong" ? "text-primary" : "text-warning"
                      }`}>
                        {pt.e2Viability}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-muted-foreground">{pt.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Key Requirements */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-card/50">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-foreground text-center">
            E-2 Visa Key Requirements
          </h2>

          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              { title: "Canadian Citizenship", desc: "Canada is an E-2 treaty country with one of the highest approval rates (~85-90%)." },
              { title: "Substantial Investment", desc: "No fixed minimum, but $100K+ is typical. Stronger applications show $200K+ at risk." },
              { title: "Active Enterprise", desc: "The investment must be active, not passive. Property management, renovation, or services business qualifies." },
              { title: "At-Risk Capital", desc: "Your investment must be at risk in a real commercial enterprise. Funds in a bank account don't qualify." },
              { title: "Not Marginal", desc: "The enterprise must have the capacity to generate more than minimal income and employ US workers." },
              { title: "Intent to Depart", desc: "You must intend to depart the US when the E-2 status ends (though renewals are common)." },
            ].map((req) => (
              <div key={req.title} className="flex items-start gap-3 p-4 rounded-xl border border-border bg-card">
                <CheckCircle className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                <div>
                  <h3 className="font-semibold text-foreground text-sm">{req.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{req.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-serif font-bold text-foreground">
            Ready to Explore E-2 Eligible Properties?
          </h2>
          <p className="mt-4 text-muted-foreground">
            Our team can help you identify investment properties that qualify for the E-2 visa and connect you with experienced immigration attorneys.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/search"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors"
            >
              Browse Investment Properties
            </Link>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl border border-border bg-card text-foreground font-semibold hover:border-primary/50 transition-colors"
            >
              Schedule a Consultation
            </a>
          </div>
          <p className="mt-6 text-xs text-muted-foreground">
            YULMIA is not a law firm and does not provide legal or immigration advice.
            E-2 visa eligibility should be confirmed with a qualified immigration attorney.
          </p>
        </div>
      </section>
    </div>
  );
}