import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, ChevronRight, Info, Check, AlertTriangle, Lightbulb, ArrowRight } from "lucide-react";

interface Variable {
  name: string;
  type: string;
  role: string;
}

interface TestRecommendation {
  id: string;
  name: string;
  category: "parametric" | "non-parametric" | "descriptive";
  confidence: "high" | "medium" | "low";
  reasoning: string;
  assumptions: string[];
  variables: string[];
  warnings?: string[];
}

interface Props {
  researchType: string;
  studyDesign: string;
  researchQuestion: string;
  variables: Variable[];
  onSelectTest: (test: TestRecommendation) => void;
}

function generateRecommendations(props: Props): TestRecommendation[] {
  const { variables, studyDesign } = props;
  const dvs = variables.filter(v => v.role === "dependent");
  const ivs = variables.filter(v => v.role === "independent" || v.role === "grouping");
  const hasContinuousDV = dvs.some(v => v.type === "Continuous");
  const hasCategoricalIV = ivs.some(v => v.type === "Categorical" || v.type === "Nominal");
  const ivCount = ivs.length;
  const results: TestRecommendation[] = [];

  // Always suggest descriptive first
  results.push({
    id: "desc",
    name: "Descriptive Statistics",
    category: "descriptive",
    confidence: "high",
    reasoning: "A foundational step for any analysis — summarise central tendency, dispersion, and distribution shape before running inferential tests.",
    assumptions: ["No specific assumptions required"],
    variables: variables.map(v => v.name),
  });

  if (hasContinuousDV && hasCategoricalIV) {
    if (ivCount === 1) {
      const groups = ivs[0];
      results.push({
        id: "ttest",
        name: "Independent Samples t-Test",
        category: "parametric",
        confidence: "high",
        reasoning: `You have a continuous dependent variable (${dvs[0]?.name}) and a categorical grouping variable (${groups?.name}). A t-test is appropriate for comparing means between two groups.`,
        assumptions: ["Normal distribution of DV in each group", "Homogeneity of variances (Levene's test)", "Independence of observations"],
        variables: [dvs[0]?.name, groups?.name].filter(Boolean) as string[],
      });
      results.push({
        id: "mannwhitney",
        name: "Mann–Whitney U Test",
        category: "non-parametric",
        confidence: "medium",
        reasoning: "A non-parametric alternative if the normality assumption is violated. Recommended when sample sizes are small or data is ordinal.",
        assumptions: ["Independence of observations", "Similar distribution shapes between groups"],
        variables: [dvs[0]?.name, groups?.name].filter(Boolean) as string[],
        warnings: ["Use this if your data violates the normality assumption for the t-test."],
      });
    }
    if (ivCount >= 1) {
      results.push({
        id: "anova",
        name: "One-Way ANOVA",
        category: "parametric",
        confidence: ivCount === 1 ? "high" : "medium",
        reasoning: "ANOVA is appropriate when comparing means across more than two independent groups. It tests whether at least one group mean differs significantly.",
        assumptions: ["Normal distribution in each group", "Homogeneity of variances", "Independence of observations", "At least 3 groups in the grouping variable"],
        variables: [dvs[0]?.name, ...ivs.map(v => v.name)].filter(Boolean) as string[],
      });
      results.push({
        id: "kruskal",
        name: "Kruskal–Wallis Test",
        category: "non-parametric",
        confidence: "medium",
        reasoning: "Non-parametric alternative to ANOVA when normality cannot be assumed. Compares distributions across multiple groups.",
        assumptions: ["Independence of observations", "Ordinal or continuous DV"],
        variables: [dvs[0]?.name, ...ivs.map(v => v.name)].filter(Boolean) as string[],
      });
    }
  }

  if (hasContinuousDV && ivs.some(v => v.type === "Continuous")) {
    results.push({
      id: "pearson",
      name: "Pearson Correlation",
      category: "parametric",
      confidence: "high",
      reasoning: "Both variables are continuous. Pearson's r measures the strength and direction of the linear relationship between them.",
      assumptions: ["Linear relationship", "Bivariate normality", "No significant outliers"],
      variables: [dvs[0]?.name, ivs.find(v => v.type === "Continuous")?.name].filter(Boolean) as string[],
    });
    results.push({
      id: "spearman",
      name: "Spearman Correlation",
      category: "non-parametric",
      confidence: "medium",
      reasoning: "Non-parametric alternative to Pearson. Based on ranks rather than raw values. Use when linearity or normality is questionable.",
      assumptions: ["Monotonic relationship", "Ordinal or continuous data"],
      variables: [dvs[0]?.name, ivs.find(v => v.type === "Continuous")?.name].filter(Boolean) as string[],
    });
    results.push({
      id: "regression",
      name: "Linear Regression",
      category: "parametric",
      confidence: "high",
      reasoning: `Regression models the predictive relationship between ${ivs.map(v => v.name).join(", ")} and ${dvs[0]?.name}. It quantifies how much variance in the DV is explained by the IV(s).`,
      assumptions: ["Linearity", "Independence of residuals", "Homoscedasticity", "Normality of residuals", "No multicollinearity (if multiple IVs)"],
      variables: [dvs[0]?.name, ...ivs.filter(v => v.type === "Continuous").map(v => v.name)].filter(Boolean) as string[],
    });
  }

  if (ivs.some(v => v.type === "Categorical") && dvs.some(v => v.type === "Categorical" || v.type === "Nominal")) {
    results.push({
      id: "chisquare",
      name: "Chi-Square Test of Independence",
      category: "non-parametric",
      confidence: "high",
      reasoning: "Both variables are categorical. Chi-square tests whether there is a significant association between them.",
      assumptions: ["Expected frequency ≥ 5 in each cell", "Independence of observations"],
      variables: [dvs[0]?.name, ivs[0]?.name].filter(Boolean) as string[],
    });
  }

  return results;
}

const confidenceColor: Record<string, string> = {
  high: "bg-success/10 text-success border-success/30",
  medium: "bg-warning/10 text-warning border-warning/30",
  low: "bg-destructive/10 text-destructive border-destructive/30",
};

const categoryLabel: Record<string, string> = {
  parametric: "Parametric",
  "non-parametric": "Non-Parametric",
  descriptive: "Descriptive",
};

const AITestAdvisor = (props: Props) => {
  const recommendations = generateRecommendations(props);
  const [expanded, setExpanded] = useState<string | null>(recommendations[0]?.id || null);

  return (
    <Card className="shadow-card overflow-hidden">
      <div className="p-5 border-b border-border bg-accent/20">
        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="h-5 w-5 text-primary" />
          <h3 className="font-display font-semibold">AI Statistical Advisor</h3>
        </div>
        <p className="text-sm text-muted-foreground">
          Based on your research context, variables, and dataset structure, the following tests are recommended.
        </p>
      </div>

      <div className="divide-y divide-border">
        {recommendations.map((rec, idx) => {
          const isExpanded = expanded === rec.id;
          const isTop = idx === 1; // first inferential test
          return (
            <div key={rec.id} className={`transition-colors ${isExpanded ? "bg-primary/[0.02]" : ""}`}>
              <button
                onClick={() => setExpanded(isExpanded ? null : rec.id)}
                className="w-full text-left px-5 py-4 flex items-center gap-3"
              >
                <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${
                  isTop ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                }`}>
                  {idx + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium text-sm">{rec.name}</span>
                    <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                      {categoryLabel[rec.category]}
                    </Badge>
                    {isTop && (
                      <Badge className="bg-primary text-primary-foreground text-[10px] px-1.5 py-0">
                        Recommended
                      </Badge>
                    )}
                  </div>
                </div>
                <Badge variant="outline" className={`text-[10px] shrink-0 ${confidenceColor[rec.confidence]}`}>
                  {rec.confidence} confidence
                </Badge>
              </button>

              {isExpanded && (
                <div className="px-5 pb-5 animate-fade-in">
                  <div className="ml-11 space-y-3">
                    <div className="bg-accent/30 rounded-lg p-3 flex gap-2">
                      <Lightbulb className="h-4 w-4 text-accent-foreground mt-0.5 shrink-0" />
                      <p className="text-sm text-accent-foreground leading-relaxed">{rec.reasoning}</p>
                    </div>

                    <div>
                      <h5 className="text-xs font-semibold text-muted-foreground uppercase mb-1.5">Assumptions</h5>
                      <ul className="space-y-1">
                        {rec.assumptions.map((a, i) => (
                          <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                            <Check className="h-3 w-3 mt-0.5 text-success shrink-0" />
                            {a}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {rec.warnings && rec.warnings.length > 0 && (
                      <div className="bg-warning/10 rounded-lg p-3 flex gap-2">
                        <AlertTriangle className="h-4 w-4 text-warning mt-0.5 shrink-0" />
                        <p className="text-xs text-warning">{rec.warnings[0]}</p>
                      </div>
                    )}

                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs text-muted-foreground">Variables:</span>
                      {rec.variables.map(v => (
                        <Badge key={v} variant="secondary" className="text-[10px]">{v}</Badge>
                      ))}
                    </div>

                    <Button size="sm" onClick={() => props.onSelectTest(rec)}>
                      Run {rec.name} <ArrowRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export type { TestRecommendation, Variable };
export default AITestAdvisor;
