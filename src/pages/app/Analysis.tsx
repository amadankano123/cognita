import { useState, useCallback } from "react";
import PageHeader from "@/components/layout/PageHeader";
import { useProject } from "@/context/ProjectContext";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate, useParams } from "react-router-dom";
import ContextAwareIndicator from "@/components/layout/ContextAwareIndicator";
import ResearchContextSetup from "@/components/analysis/ResearchContextSetup";
import AITestAdvisor, { TestRecommendation } from "@/components/analysis/AITestAdvisor";
import StatisticalResultsPanel, { StatResult } from "@/components/analysis/StatisticalResultsPanel";
import {
  Database, Settings2, Sparkles, BarChart3, Check, ChevronRight,
  ArrowLeft, History, BookOpen,
} from "lucide-react";

type AnalysisStep = "context" | "recommend" | "results" | "history";

const MOCK_RESULTS: Record<string, StatResult> = {
  ttest: {
    testName: "Independent Samples t-Test",
    sampleSize: 5,
    degreesOfFreedom: "df = 3",
    testStatistic: { label: "t-statistic", value: 2.87 },
    pValue: 0.034,
    confidenceInterval: "[1.24, 8.76]",
    effectSize: { label: "Cohen's d", value: 1.42, interpretation: "Large effect" },
    assumptions: [
      { name: "Normality (Shapiro-Wilk)", met: true, note: "W = 0.94, p = 0.312 — normality not violated" },
      { name: "Homogeneity of variances (Levene's)", met: true, note: "F = 0.82, p = 0.421 — equal variances assumed" },
      { name: "Independence of observations", met: true, note: "Data collected from independent groups" },
    ],
    interpretation: "The independent samples t-test revealed a statistically significant difference between the control group (M = 22.63, SD = 3.12) and treatment group (M = 30.15, SD = 2.19), t(3) = 2.87, p = .034, d = 1.42. The large effect size indicates a substantial practical difference between groups.",
    plainExplanation: "The treatment group scored significantly higher than the control group. This difference is unlikely due to chance (p = 0.034) and the size of the difference is large enough to be practically meaningful.",
    draftResultsText: "An independent samples t-test was conducted to compare measurement values between the control and treatment conditions. There was a significant difference in scores for the control group (M = 22.63, SD = 3.12) and the treatment group (M = 30.15, SD = 2.19); t(3) = 2.87, p = .034, d = 1.42. These results suggest that the treatment had a significant positive effect on the measured outcome.",
    draftDiscussionText: "The significant difference observed between treatment and control groups (p = .034) supports the hypothesis that the intervention has a measurable impact. The large effect size (d = 1.42) indicates that the magnitude of this difference is practically meaningful and not merely a statistical artefact. These findings are consistent with prior work by Smith et al. (2023), who reported similar effect sizes in comparable experimental designs.",
    suggestedFollowUp: "Consider running a Mann–Whitney U test as a robustness check given the small sample size. A power analysis is recommended to determine whether the sample size is adequate for the observed effect.",
  },
  regression: {
    testName: "Linear Regression",
    sampleSize: 5,
    degreesOfFreedom: "df = 1, 3",
    testStatistic: { label: "R²", value: 0.82 },
    pValue: 0.002,
    confidenceInterval: "[0.58, 0.95]",
    effectSize: { label: "f²", value: 4.56, interpretation: "Very large effect" },
    assumptions: [
      { name: "Linearity", met: true, note: "Scatter plot shows approximate linear relationship" },
      { name: "Independence of residuals (Durbin-Watson)", met: true, note: "DW = 2.04 — no autocorrelation" },
      { name: "Homoscedasticity", met: true, note: "Residuals vs fitted plot shows constant variance" },
      { name: "Normality of residuals", met: false, note: "Shapiro-Wilk W = 0.88, p = 0.048 — slight departure from normality. Interpret with caution." },
    ],
    interpretation: "The linear regression model was statistically significant, F(1, 3) = 13.67, p = .002, R² = .82. The model explains 82% of the variance in the dependent variable. Each unit increase in the predictor variable is associated with a 0.94-unit increase in the outcome (β = 0.94, SE = 0.25).",
    plainExplanation: "The model predicts the outcome variable very well (82% accuracy). As the predictor increases, the outcome increases proportionally. This relationship is strong and statistically reliable.",
    draftResultsText: "A simple linear regression was calculated to predict the dependent variable based on the independent variable. A significant regression equation was found, F(1, 3) = 13.67, p = .002, with an R² of .82. The predictor variable was a significant contributor to the model (β = 0.94, p = .002).",
    draftDiscussionText: "The regression model explains a substantial proportion of the variance (R² = .82), indicating a strong predictive relationship between the variables. While the slight departure from normality in the residuals warrants cautious interpretation, the overall robustness of the model supports the conclusion that the predictor is a reliable indicator of the outcome variable.",
    suggestedFollowUp: "Consider bootstrapping confidence intervals to address the marginal normality violation. Also explore potential non-linear relationships or additional predictor variables.",
  },
  desc: {
    testName: "Descriptive Statistics",
    sampleSize: 5,
    testStatistic: { label: "Mean", value: 25.64 },
    pValue: 1.0,
    assumptions: [{ name: "No assumptions required", met: true, note: "Descriptive statistics do not require distributional assumptions." }],
    interpretation: "The sample (n = 5) has a mean of 25.64 (SD = 4.63), with values ranging from 19.3 to 31.7. The median (25.1) is close to the mean, suggesting approximate symmetry in the distribution.",
    plainExplanation: "The average value across your samples is about 25.6, with individual values typically varying about 4.6 units above or below that average.",
    draftResultsText: "Descriptive statistics were computed for the primary variables. The sample yielded a mean of 25.64 (SD = 4.63, range: 19.3–31.7, median: 25.1, n = 5).",
    draftDiscussionText: "The descriptive statistics indicate a moderately dispersed dataset with approximate symmetry, providing a foundation for subsequent inferential analyses.",
  },
  anova: {
    testName: "One-Way ANOVA",
    sampleSize: 5,
    degreesOfFreedom: "df = 1, 3",
    testStatistic: { label: "F-statistic", value: 8.24 },
    pValue: 0.012,
    effectSize: { label: "η²", value: 0.73, interpretation: "Large effect" },
    assumptions: [
      { name: "Normality per group", met: true, note: "Shapiro-Wilk test non-significant for both groups" },
      { name: "Homogeneity of variances", met: true, note: "Levene's test: F = 1.12, p = 0.35" },
      { name: "Independence", met: true, note: "Independent observations confirmed" },
    ],
    interpretation: "The one-way ANOVA revealed a statistically significant effect of group on the dependent variable, F(1, 3) = 8.24, p = .012, η² = .73. Post-hoc comparisons would be needed if more than two groups were compared.",
    plainExplanation: "There is a significant difference between the groups. The group variable explains about 73% of the variation in the outcome, which is a large effect.",
    draftResultsText: "A one-way ANOVA was conducted to examine the effect of group membership on the measured outcome. The analysis revealed a significant effect, F(1, 3) = 8.24, p = .012, η² = .73.",
    draftDiscussionText: "The significant ANOVA result (p = .012) confirms that group differences exist and account for a substantial proportion of variance (η² = .73). This finding aligns with the hypothesis and supports the theoretical framework proposed.",
  },
  mannwhitney: {
    testName: "Mann–Whitney U Test",
    sampleSize: 5,
    testStatistic: { label: "U-statistic", value: 1.0 },
    pValue: 0.083,
    effectSize: { label: "r", value: 0.63, interpretation: "Large effect" },
    assumptions: [
      { name: "Independence of observations", met: true, note: "Independent groups confirmed" },
      { name: "Similar distribution shapes", met: true, note: "Visual inspection suggests similar shapes" },
    ],
    interpretation: "The Mann–Whitney U test did not reveal a statistically significant difference between groups, U = 1.0, p = .083, r = .63. However, the large effect size suggests a meaningful practical difference that may reach significance with a larger sample.",
    plainExplanation: "The difference between groups is not statistically significant at the conventional threshold (p > 0.05), but the effect is large. A bigger sample might reveal a significant difference.",
    draftResultsText: "A Mann–Whitney U test was conducted to compare values between the two groups. The difference was not statistically significant, U = 1.0, p = .083, r = .63, though the large effect size warrants further investigation with a larger sample.",
    draftDiscussionText: "While the Mann–Whitney U test did not reach conventional significance (p = .083), the large effect size (r = .63) suggests that the lack of significance may be attributable to the limited sample size rather than the absence of a true effect.",
    suggestedFollowUp: "Increase sample size to at least 20 per group for adequate statistical power. Consider a paired design if observations can be matched.",
  },
  pearson: {
    testName: "Pearson Correlation",
    sampleSize: 5,
    degreesOfFreedom: "df = 3",
    testStatistic: { label: "r", value: 0.91 },
    pValue: 0.003,
    confidenceInterval: "[0.52, 0.99]",
    effectSize: { label: "r²", value: 0.83, interpretation: "Very large shared variance" },
    assumptions: [
      { name: "Linearity", met: true, note: "Scatter plot shows linear trend" },
      { name: "Bivariate normality", met: true, note: "Both variables approximately normally distributed" },
      { name: "No significant outliers", met: true, note: "No values beyond ±3 SD" },
    ],
    interpretation: "A Pearson correlation analysis revealed a strong positive linear relationship between the two variables, r(3) = .91, p = .003. The coefficient of determination (r² = .83) indicates that 83% of the variance in one variable is shared with the other.",
    plainExplanation: "There is a strong positive relationship between the two variables — as one increases, the other tends to increase as well. This relationship is statistically reliable.",
    draftResultsText: "A Pearson product-moment correlation was computed to assess the relationship between the two continuous variables. There was a strong, positive correlation, r(3) = .91, p = .003, r² = .83.",
    draftDiscussionText: "The strong positive correlation (r = .91) supports the theoretical prediction that the two variables are closely related. The shared variance of 83% suggests that these variables may reflect overlapping constructs.",
  },
  spearman: {
    testName: "Spearman Rank Correlation",
    sampleSize: 5,
    testStatistic: { label: "ρ", value: 0.90 },
    pValue: 0.037,
    assumptions: [
      { name: "Monotonic relationship", met: true, note: "Rank plot shows monotonic trend" },
      { name: "Ordinal or continuous data", met: true, note: "Both variables are continuous" },
    ],
    interpretation: "Spearman's rank correlation revealed a strong positive monotonic relationship, ρ(5) = .90, p = .037. This non-parametric measure confirms the association without assuming linearity or normality.",
    plainExplanation: "The two variables have a strong positive relationship based on their rankings — higher values on one tend to go with higher values on the other.",
    draftResultsText: "A Spearman rank-order correlation was computed. There was a strong, positive monotonic correlation between the two variables, ρ(5) = .90, p = .037.",
    draftDiscussionText: "The Spearman correlation (ρ = .90) provides non-parametric confirmation of the strong positive association observed in the Pearson analysis, strengthening confidence in the robustness of this relationship.",
  },
  kruskal: {
    testName: "Kruskal–Wallis Test",
    sampleSize: 5,
    degreesOfFreedom: "df = 1",
    testStatistic: { label: "H-statistic", value: 3.86 },
    pValue: 0.049,
    effectSize: { label: "ε²", value: 0.64, interpretation: "Large effect" },
    assumptions: [
      { name: "Independence", met: true, note: "Independent observations confirmed" },
      { name: "Ordinal or continuous DV", met: true, note: "DV is continuous" },
    ],
    interpretation: "The Kruskal–Wallis test indicated a statistically significant difference across groups, H(1) = 3.86, p = .049, ε² = .64.",
    plainExplanation: "There is a significant difference between the groups based on rank ordering. The effect is large.",
    draftResultsText: "A Kruskal–Wallis H test was conducted. The test revealed a significant difference, H(1) = 3.86, p = .049, ε² = .64.",
    draftDiscussionText: "The significant Kruskal–Wallis result (p = .049) provides non-parametric evidence for group differences, complementing the parametric ANOVA findings.",
  },
  chisquare: {
    testName: "Chi-Square Test of Independence",
    sampleSize: 5,
    degreesOfFreedom: "df = 1",
    testStatistic: { label: "χ²", value: 5.0 },
    pValue: 0.025,
    effectSize: { label: "Cramér's V", value: 0.71, interpretation: "Large association" },
    assumptions: [
      { name: "Expected frequency ≥ 5", met: false, note: "Some cells have expected counts < 5. Consider Fisher's Exact Test as an alternative." },
      { name: "Independence", met: true, note: "Observations are independent" },
    ],
    interpretation: "The chi-square test of independence revealed a significant association between the two categorical variables, χ²(1) = 5.0, p = .025, V = .71. However, the expected frequency assumption is violated; Fisher's Exact Test is recommended.",
    plainExplanation: "The two categorical variables are related — the category someone belongs to affects the likelihood of being in another category. However, the sample size is too small for this test to be fully reliable.",
    draftResultsText: "A chi-square test of independence was performed. The relationship between the variables was significant, χ²(1) = 5.0, p = .025, V = .71. Given the small expected frequencies, Fisher's Exact Test was also conducted (p = .031).",
    draftDiscussionText: "The significant chi-square result suggests an association between the categorical variables, though the violation of the expected frequency assumption means this finding should be confirmed with Fisher's Exact Test or a larger sample.",
    suggestedFollowUp: "Run Fisher's Exact Test as the primary test given the expected cell frequency violation. Increase sample size to meet the assumption.",
  },
};

const Analysis = () => {
  const { project, addAnalysisResult } = useProject();
  const navigate = useNavigate();
  const { projectId } = useParams();
  const pid = projectId || project.id;
  const nav = (path: string) => navigate(`/app/${pid}/${path}`);

  const [step, setStep] = useState<AnalysisStep>(
    project.dataset.uploaded ? "context" : "context"
  );
  const [researchContext, setResearchContext] = useState({
    researchType: project.methodologyType?.toLowerCase() || "quantitative",
    studyDesign: "",
    researchQuestion: "",
    hypotheses: "",
    variables: [] as { name: string; type: string; role: string }[],
  });

  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentResult, setCurrentResult] = useState<StatResult | null>(null);
  const [selectedTestName, setSelectedTestName] = useState("");

  const handleSelectTest = useCallback((test: TestRecommendation) => {
    setSelectedTestName(test.name);
    setStep("results");
    setRunning(true);
    setProgress(0);
    setCurrentResult(null);

    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setRunning(false);
          const mockKey = test.id as keyof typeof MOCK_RESULTS;
          setCurrentResult(MOCK_RESULTS[mockKey] || MOCK_RESULTS.desc);
          return 100;
        }
        return prev + Math.random() * 15 + 5;
      });
    }, 400);
  }, []);

  const handleSave = () => {
    if (!currentResult) return;
    addAnalysisResult({
      id: `a${Date.now()}`,
      title: currentResult.testName,
      type: currentResult.testName,
      status: "completed",
      summary: currentResult.interpretation,
      createdAt: new Date().toISOString().split("T")[0],
      rSquared: currentResult.testStatistic.value,
      pValue: currentResult.pValue,
      interpretation: currentResult.interpretation,
    });
  };

  const statusColors: Record<string, string> = {
    completed: "bg-success text-success-foreground",
    running: "bg-warning text-warning-foreground",
    pending: "bg-secondary text-secondary-foreground",
    failed: "bg-destructive text-destructive-foreground",
  };

  const steps: { key: AnalysisStep; label: string; icon: React.ElementType }[] = [
    { key: "context", label: "Research Context", icon: Settings2 },
    { key: "recommend", label: "AI Advisor", icon: Sparkles },
    { key: "results", label: "Results", icon: BarChart3 },
    { key: "history", label: "History", icon: History },
  ];

  if (!project.dataset.uploaded) {
    return (
      <div className="max-w-5xl animate-fade-in">
        <PageHeader title="Analysis Studio" subtitle="Upload a dataset first to begin analysis" breadcrumb={project.title} />
        <Card className="shadow-card p-10 text-center">
          <Database className="h-12 w-12 text-primary/50 mx-auto mb-4" />
          <h3 className="font-display font-semibold mb-2">No Dataset Available</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Go to Data & Analysis to upload or enter your research data before running statistical tests.
          </p>
          <Button onClick={() => nav("data")}>
            <Database className="h-4 w-4 mr-2" /> Go to Data & Analysis
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-5xl animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-3 mb-2">
        <PageHeader
          title="Analysis Studio"
          subtitle="AI-guided statistical analysis for your research"
          breadcrumb={project.title}
        />
        <ContextAwareIndicator />
      </div>

      {/* Step navigation */}
      <div className="flex gap-1 mb-6 bg-muted/50 rounded-lg p-1">
        {steps.map((s, i) => {
          const Icon = s.icon;
          const isActive = step === s.key;
          return (
            <button
              key={s.key}
              onClick={() => setStep(s.key)}
              className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-md text-sm font-medium transition-all ${
                isActive
                  ? "bg-card text-primary shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="h-4 w-4" />
              <span className="hidden sm:inline">{s.label}</span>
            </button>
          );
        })}
      </div>

      {/* Step content */}
      {step === "context" && (
        <ResearchContextSetup
          context={researchContext}
          onChange={setResearchContext}
          onComplete={() => setStep("recommend")}
        />
      )}

      {step === "recommend" && (
        <div className="space-y-4">
          {/* Context summary */}
          <Card className="shadow-card p-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-success/10 flex items-center justify-center">
                  <Check className="h-4 w-4 text-success" />
                </div>
                <div>
                  <p className="text-sm font-medium">Research Context Set</p>
                  <p className="text-xs text-muted-foreground">
                    {researchContext.researchType} · {researchContext.studyDesign || "Design not set"} · {researchContext.variables.filter(v => v.role !== "undecided").length} classified variables
                  </p>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setStep("context")}>
                Edit Context
              </Button>
            </div>
          </Card>

          <AITestAdvisor
            researchType={researchContext.researchType}
            studyDesign={researchContext.studyDesign}
            researchQuestion={researchContext.researchQuestion}
            variables={researchContext.variables}
            onSelectTest={handleSelectTest}
          />
        </div>
      )}

      {step === "results" && (
        <div className="space-y-4">
          <Button variant="ghost" size="sm" onClick={() => setStep("recommend")}>
            <ArrowLeft className="h-4 w-4 mr-1" /> Back to Recommendations
          </Button>

          <StatisticalResultsPanel
            result={currentResult}
            running={running}
            progress={progress}
            onSave={handleSave}
            onInsertIntoDocument={() => nav("editor")}
          />
        </div>
      )}

      {step === "history" && (
        <Card className="shadow-card">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <h3 className="font-display font-semibold">Analysis History</h3>
            <Badge variant="secondary" className="text-xs">
              {project.analysisResults.length} analyses
            </Badge>
          </div>
          {project.analysisResults.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              <History className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No analyses have been run yet.</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {project.analysisResults.map(a => (
                <div key={a.id} className="p-4 hover:bg-muted/30 transition-colors">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-medium text-sm">{a.title}</h4>
                    <Badge className={statusColors[a.status] + " text-xs"}>{a.status}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mb-1">{a.type} · {a.createdAt}</p>
                  {a.summary && <p className="text-sm text-muted-foreground leading-relaxed">{a.summary}</p>}
                  <div className="flex gap-2 mt-2">
                    <Button variant="ghost" size="sm" className="text-xs h-7" onClick={() => nav("editor")}>
                      <BookOpen className="h-3 w-3 mr-1" /> Insert into Document
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}
    </div>
  );
};

export default Analysis;
