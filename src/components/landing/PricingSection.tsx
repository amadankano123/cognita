import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Check,
  X,
  Star,
  Building2,
  GraduationCap,
  Sparkles,
  FileText,
  Users,
  Shield,
  BarChart3,
  Bot,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const individualPlans = [
  {
    name: "Cognita Basic",
    monthly: 7500,
    annual: 75000, // 7500 * 10 (2 months free with annual)
    tagline: "For students exploring research tools",
    features: [
      "1 active project",
      "10 AI credits per month",
      "Structured academic editor",
      "Manual reference manager",
      "5 AI reviews per month",
      "Basic DOCX export",
      "Descriptive statistics",
      "5MB dataset limit",
    ],
    cta: "Start Free",
    popular: false,
  },
  {
    name: "Cognita Pro",
    monthly: 22000,
    annual: 220000, // 22000 * 10 (2 months free with annual)
    tagline: "For serious researchers & postgraduate students",
    features: [
      "Unlimited projects",
      "50 AI credits per month",
      "Full section builder",
      "Unlimited AI reviewer mode",
      "Rewrite suggestions",
      "Regression, ANOVA, statistics tools",
      "Citation integrity checker",
      "Advanced export (DOCX, PDF, LaTeX)",
      "Collaboration (up to 3 users)",
      "100MB dataset upload",
    ],
    cta: "Upgrade to Pro",
    popular: true,
  },
  {
    name: "Cognita Premium",
    monthly: 45000,
    annual: 450000, // 45000 * 10 (2 months free with annual)
    tagline: "For advanced research & grant applications",
    features: [
      "Everything in Pro",
      "150 AI credits per month",
      "Plagiarism similarity checks (monthly credits)",
      "AI coherence scoring",
      "Grant proposal templates",
      "Journal-specific formatting",
      "Unlimited collaborators",
      "Priority AI processing",
      "Ethics & risk alerts",
    ],
    cta: "Go Premium",
    popular: false,
  },
];

const institutionalPlans = [
  {
    name: "Department Plan",
    price: "₦50,000",
    priceSuffix: "per user/year",
    note: "Minimum 25 users • Billed annually",
    features: [
      "Pro access for all users",
      "100 AI credits per user/month",
      "Institutional dashboard",
      "Integrity monitoring",
      "AI usage tracking",
      "Department analytics",
      "Compliance indicators",
    ],
    cta: "Request Department Demo",
    icon: Building2,
  },
  {
    name: "University Plan",
    price: "Custom Pricing",
    priceSuffix: "On demand",
    note: "Agreement with Platinum Edu-Tech Sales Team",
    features: [
      "Premium access for all users",
      "University-wide dashboard",
      "AI governance controls",
      "Research output analytics",
      "Grant tracking",
      "Custom thesis templates",
      "Audit logs & compliance tools",
      "Priority support",
    ],
    cta: "Contact Sales",
    icon: GraduationCap,
  },
];

const comparisonData = [
  {
    feature: "AI Reviewer",
    basic: "Limited",
    pro: "Unlimited",
    premium: "Advanced",
    institution: "Unlimited + Governance",
  },
  {
    feature: "Statistics",
    basic: "Basic",
    pro: "Full",
    premium: "Full",
    institution: "Full",
  },
  {
    feature: "Plagiarism",
    basic: false,
    pro: false,
    premium: "Limited",
    institution: "Full",
  },
  {
    feature: "Collaboration",
    basic: false,
    pro: "Limited",
    premium: "Unlimited",
    institution: "Unlimited",
  },
  {
    feature: "Institution Dashboard",
    basic: false,
    pro: false,
    premium: false,
    institution: true,
  },
  {
    feature: "AI Governance",
    basic: false,
    pro: false,
    premium: false,
    institution: true,
  },
];

const faqs = [
  {
    q: "Can I switch plans anytime?",
    a: "Yes! You can upgrade or downgrade your plan at any time. When upgrading, you'll be charged the prorated difference. When downgrading, the remaining balance is credited to your account.",
  },
  {
    q: "Do students get discounts?",
    a: "Students with a valid .edu email address receive an additional 15% off any paid plan. Contact our support team with your university email for verification.",
  },
  {
    q: "Is institutional pricing customizable?",
    a: "Absolutely. Institutional plans are fully customizable based on the number of users, departments, and specific compliance needs. Contact our sales team for a tailored quote.",
  },
  {
    q: "Does Cognita replace SPSS and Turnitin?",
    a: "Cognita integrates statistical analysis and plagiarism checking into one platform, reducing the need for separate tools. While it covers most common use cases, some specialized analyses may still require dedicated software.",
  },
  {
    q: "Is data secure?",
    a: "Yes. All data is encrypted at rest and in transit. We comply with GDPR and institutional data governance standards. Your research data is never used for training AI models.",
  },
];

function ComparisonCell({ value }: { value: string | boolean }) {
  if (value === true) return <Check className="h-4 w-4 text-primary mx-auto" />;
  if (value === false) return <X className="h-4 w-4 text-muted-foreground/40 mx-auto" />;
  return <span className="text-sm">{value}</span>;
}

const PricingSection = () => {
  const [annual, setAnnual] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      {/* Individual Plans */}
      <section className="max-w-6xl mx-auto px-6 py-24" id="pricing">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-3">
            Simple, Transparent Pricing
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Choose a plan that fits your research journey — from student thesis
            to institutional research governance.
          </p>
        </div>

        {/* Billing Toggle */}
        <div className="flex items-center justify-center gap-3 mb-12">
          <span
            className={`text-sm font-medium ${!annual ? "text-foreground" : "text-muted-foreground"}`}
          >
            Monthly
          </span>
          <Switch checked={annual} onCheckedChange={setAnnual} />
          <span
            className={`text-sm font-medium ${annual ? "text-foreground" : "text-muted-foreground"}`}
          >
            Annual
          </span>
          {annual && (
            <Badge variant="secondary" className="ml-1 text-xs bg-accent text-accent-foreground">
              Save 20%
            </Badge>
          )}
        </div>

        {/* Pricing Cards */}
        <div className="grid gap-6 md:grid-cols-3 items-start">
          {individualPlans.map((plan) => {
            const price = annual ? plan.annual : plan.monthly;
            const period = annual ? "/year" : "/mo";
            return (
              <div
                key={plan.name}
                className={`relative rounded-2xl border bg-card p-7 flex flex-col transition-shadow ${
                  plan.popular
                    ? "border-primary shadow-elevated ring-1 ring-primary/20 md:scale-105 z-10"
                    : "border-border shadow-card"
                }`}
              >
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground">
                    <Star className="h-3 w-3 mr-1" /> Most Popular
                  </Badge>
                )}
                <h3 className="font-display text-xl font-semibold mb-1">{plan.name}</h3>
                <p className="text-sm text-muted-foreground mb-5">{plan.tagline}</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold tracking-tight">
                    ₦{price.toLocaleString()}
                  </span>
                  {price > 0 && (
                    <span className="text-muted-foreground text-sm ml-1">{period}</span>
                  )}
                </div>
                <ul className="flex-1 space-y-2.5 mb-7">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm">
                      <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  className={`w-full ${plan.popular ? "" : "variant"}`}
                  variant={plan.popular ? "default" : "outline"}
                  onClick={() => navigate("/auth")}
                >
                  {plan.cta}
                </Button>
              </div>
            );
          })}
        </div>
      </section>

      {/* Institutional Plans */}
      <section className="bg-muted/50 border-t border-border">
        <div className="max-w-5xl mx-auto px-6 py-24">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent text-accent-foreground text-sm font-medium mb-4">
              <Building2 className="h-4 w-4" /> Institutional
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-3">
              For Universities & Research Institutions
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Govern, monitor, and elevate research output across your
              institution.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 max-w-3xl mx-auto">
            {institutionalPlans.map((plan) => (
              <div
                key={plan.name}
                className="rounded-2xl border border-border bg-card p-7 shadow-card flex flex-col"
              >
                <div className="h-11 w-11 rounded-lg bg-accent flex items-center justify-center mb-4">
                  <plan.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-display text-xl font-semibold mb-1">{plan.name}</h3>
                <div className="mb-1">
                  <span className="text-2xl font-bold">{plan.price}</span>
                  {plan.priceSuffix && (
                    <span className="text-sm text-muted-foreground ml-1">
                      {plan.priceSuffix}
                    </span>
                  )}
                </div>
                {plan.note && (
                  <p className="text-xs text-muted-foreground mb-5">{plan.note}</p>
                )}
                <ul className="flex-1 space-y-2.5 mb-7">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm">
                      <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <Button variant="outline" className="w-full">
                  {plan.cta}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="max-w-5xl mx-auto px-6 py-24">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">
          Compare Plans
        </h2>
        <div className="rounded-xl border border-border bg-card overflow-hidden shadow-card">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="font-semibold">Feature</TableHead>
                <TableHead className="text-center font-semibold">Basic</TableHead>
                <TableHead className="text-center font-semibold">Pro</TableHead>
                <TableHead className="text-center font-semibold">Premium</TableHead>
                <TableHead className="text-center font-semibold">Institution</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {comparisonData.map((row) => (
                <TableRow key={row.feature}>
                  <TableCell className="font-medium">{row.feature}</TableCell>
                  <TableCell className="text-center">
                    <ComparisonCell value={row.basic} />
                  </TableCell>
                  <TableCell className="text-center">
                    <ComparisonCell value={row.pro} />
                  </TableCell>
                  <TableCell className="text-center">
                    <ComparisonCell value={row.premium} />
                  </TableCell>
                  <TableCell className="text-center">
                    <ComparisonCell value={row.institution} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-3xl mx-auto px-6 pb-24">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">
          Frequently Asked Questions
        </h2>
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, i) => (
            <AccordionItem key={i} value={`faq-${i}`}>
              <AccordionTrigger className="text-left">{faq.q}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>
    </>
  );
};

export default PricingSection;
