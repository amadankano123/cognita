export type ProjectType =
  | "Thesis"
  | "Dissertation"
  | "Research Proposal"
  | "Progress Report"
  | "Final Report"
  | "Journal Article"
  | "Review Article"
  | "Conference Paper"
  | "Grant Proposal";

export const PROJECT_TYPES: ProjectType[] = [
  "Thesis",
  "Dissertation",
  "Research Proposal",
  "Progress Report",
  "Final Report",
  "Journal Article",
  "Review Article",
  "Conference Paper",
  "Grant Proposal",
];

export interface TemplateSectionDef {
  key: string;
  title: string;
  mandatory: boolean;
  children?: TemplateSectionDef[];
}

export const SECTION_TEMPLATES: Record<ProjectType, TemplateSectionDef[]> = {
  Thesis: [
    { key: "title-page", title: "Title Page", mandatory: true },
    { key: "declaration", title: "Declaration", mandatory: true },
    { key: "dedication", title: "Dedication", mandatory: false },
    { key: "acknowledgements", title: "Acknowledgements", mandatory: false },
    { key: "abstract", title: "Abstract", mandatory: true },
    { key: "toc", title: "Table of Contents", mandatory: true },
    { key: "list-of-figures", title: "List of Figures", mandatory: false },
    { key: "list-of-tables", title: "List of Tables", mandatory: false },
    { key: "list-of-abbreviations", title: "List of Abbreviations", mandatory: false },
    {
      key: "ch1-introduction", title: "Chapter 1: Introduction", mandatory: true, children: [
        { key: "background", title: "1.1 Background of the Study", mandatory: true },
        { key: "statement-of-problem", title: "1.2 Statement of the Problem", mandatory: true },
        { key: "research-questions", title: "1.3 Research Questions", mandatory: true },
        { key: "aim-objectives", title: "1.4 Aim and Objectives", mandatory: true },
        { key: "justification", title: "1.5 Justification / Rationale", mandatory: true },
        { key: "hypothesis", title: "1.6 Research Hypothesis", mandatory: false },
        { key: "scope", title: "1.7 Scope and Delimitations", mandatory: true },
        { key: "definition-of-terms", title: "1.8 Definition of Key Terms", mandatory: false },
      ],
    },
    {
      key: "ch2-literature-review", title: "Chapter 2: Literature Review", mandatory: true, children: [
        { key: "theoretical-framework", title: "2.1 Theoretical Framework", mandatory: true },
        { key: "conceptual-framework", title: "2.2 Conceptual Framework", mandatory: false },
        { key: "empirical-review", title: "2.3 Empirical Review", mandatory: true },
        { key: "research-gap", title: "2.4 Research Gap", mandatory: true },
      ],
    },
    {
      key: "ch3-methodology", title: "Chapter 3: Methodology", mandatory: true, children: [
        { key: "research-design", title: "3.1 Research Design", mandatory: true },
        { key: "population-sampling", title: "3.2 Population and Sampling", mandatory: true },
        { key: "data-collection", title: "3.3 Data Collection Methods", mandatory: true },
        { key: "data-analysis", title: "3.4 Data Analysis", mandatory: true },
        { key: "validity-reliability", title: "3.5 Validity and Reliability", mandatory: true },
        { key: "ethical-considerations", title: "3.6 Ethical Considerations", mandatory: true },
      ],
    },
    {
      key: "ch4-results", title: "Chapter 4: Results and Findings", mandatory: true, children: [
        { key: "descriptive-stats", title: "4.1 Descriptive Statistics", mandatory: true },
        { key: "inferential-stats", title: "4.2 Inferential Statistics", mandatory: false },
        { key: "hypothesis-testing", title: "4.3 Hypothesis Testing", mandatory: false },
      ],
    },
    {
      key: "ch5-discussion", title: "Chapter 5: Discussion", mandatory: true, children: [
        { key: "discussion-findings", title: "5.1 Discussion of Findings", mandatory: true },
        { key: "implications", title: "5.2 Implications", mandatory: true },
        { key: "limitations", title: "5.3 Limitations", mandatory: true },
      ],
    },
    {
      key: "ch6-conclusion", title: "Chapter 6: Conclusion and Recommendations", mandatory: true, children: [
        { key: "conclusion", title: "6.1 Conclusion", mandatory: true },
        { key: "recommendations", title: "6.2 Recommendations", mandatory: true },
        { key: "future-research", title: "6.3 Suggestions for Future Research", mandatory: false },
      ],
    },
    { key: "references", title: "References", mandatory: true },
    { key: "appendices", title: "Appendices", mandatory: false },
  ],

  Dissertation: [
    { key: "title-page", title: "Title Page", mandatory: true },
    { key: "copyright", title: "Copyright Page", mandatory: true },
    { key: "approval-page", title: "Approval Page", mandatory: true },
    { key: "declaration", title: "Declaration of Originality", mandatory: true },
    { key: "dedication", title: "Dedication", mandatory: false },
    { key: "acknowledgements", title: "Acknowledgements", mandatory: false },
    { key: "abstract", title: "Abstract", mandatory: true },
    { key: "toc", title: "Table of Contents", mandatory: true },
    { key: "list-of-figures", title: "List of Figures", mandatory: false },
    { key: "list-of-tables", title: "List of Tables", mandatory: false },
    { key: "list-of-abbreviations", title: "List of Abbreviations", mandatory: false },
    {
      key: "ch1-introduction", title: "Chapter 1: Introduction", mandatory: true, children: [
        { key: "background", title: "1.1 Background and Context", mandatory: true },
        { key: "problem-statement", title: "1.2 Problem Statement", mandatory: true },
        { key: "research-questions", title: "1.3 Research Questions", mandatory: true },
        { key: "aim-objectives", title: "1.4 Aim and Objectives", mandatory: true },
        { key: "significance", title: "1.5 Significance of the Study", mandatory: true },
        { key: "hypothesis", title: "1.6 Research Hypothesis", mandatory: false },
        { key: "scope", title: "1.7 Scope and Limitations", mandatory: true },
        { key: "chapter-outline", title: "1.8 Chapter Outline", mandatory: false },
      ],
    },
    {
      key: "ch2-literature-review", title: "Chapter 2: Literature Review", mandatory: true, children: [
        { key: "theoretical-framework", title: "2.1 Theoretical Framework", mandatory: true },
        { key: "conceptual-framework", title: "2.2 Conceptual Framework", mandatory: true },
        { key: "review-of-related-literature", title: "2.3 Review of Related Literature", mandatory: true },
        { key: "critical-analysis", title: "2.4 Critical Analysis and Gaps", mandatory: true },
        { key: "summary", title: "2.5 Summary of Literature", mandatory: false },
      ],
    },
    {
      key: "ch3-methodology", title: "Chapter 3: Research Methodology", mandatory: true, children: [
        { key: "research-philosophy", title: "3.1 Research Philosophy", mandatory: true },
        { key: "research-approach", title: "3.2 Research Approach", mandatory: true },
        { key: "research-design", title: "3.3 Research Design", mandatory: true },
        { key: "population-sampling", title: "3.4 Population and Sampling Strategy", mandatory: true },
        { key: "data-collection", title: "3.5 Data Collection Instruments", mandatory: true },
        { key: "data-analysis", title: "3.6 Data Analysis Procedures", mandatory: true },
        { key: "validity-reliability", title: "3.7 Validity, Reliability, Trustworthiness", mandatory: true },
        { key: "ethical-considerations", title: "3.8 Ethical Considerations", mandatory: true },
      ],
    },
    {
      key: "ch4-results", title: "Chapter 4: Presentation of Findings", mandatory: true, children: [
        { key: "demographic-profile", title: "4.1 Demographic Profile", mandatory: false },
        { key: "quantitative-findings", title: "4.2 Quantitative Findings", mandatory: true },
        { key: "qualitative-findings", title: "4.3 Qualitative Findings", mandatory: false },
        { key: "hypothesis-testing", title: "4.4 Hypothesis Testing", mandatory: false },
      ],
    },
    {
      key: "ch5-discussion", title: "Chapter 5: Discussion of Findings", mandatory: true, children: [
        { key: "discussion", title: "5.1 Discussion", mandatory: true },
        { key: "comparison-literature", title: "5.2 Comparison with Existing Literature", mandatory: true },
        { key: "theoretical-implications", title: "5.3 Theoretical Implications", mandatory: true },
        { key: "practical-implications", title: "5.4 Practical Implications", mandatory: true },
      ],
    },
    {
      key: "ch6-conclusion", title: "Chapter 6: Conclusion, Recommendations & Future Work", mandatory: true, children: [
        { key: "conclusion", title: "6.1 Conclusion", mandatory: true },
        { key: "recommendations", title: "6.2 Recommendations", mandatory: true },
        { key: "limitations", title: "6.3 Limitations of the Study", mandatory: true },
        { key: "future-work", title: "6.4 Directions for Future Research", mandatory: true },
      ],
    },
    { key: "references", title: "References / Bibliography", mandatory: true },
    { key: "appendices", title: "Appendices", mandatory: false },
    { key: "glossary", title: "Glossary", mandatory: false },
  ],

  "Research Proposal": [
    { key: "title-page", title: "Title Page", mandatory: true },
    { key: "abstract", title: "Abstract / Summary", mandatory: true },
    {
      key: "introduction", title: "Introduction", mandatory: true, children: [
        { key: "background", title: "Background of the Study", mandatory: true },
        { key: "problem-statement", title: "Problem Statement", mandatory: true },
        { key: "research-questions", title: "Research Questions", mandatory: true },
        { key: "aim-objectives", title: "Aim and Objectives", mandatory: true },
        { key: "justification", title: "Justification / Significance", mandatory: true },
        { key: "hypothesis", title: "Hypothesis", mandatory: false },
        { key: "scope", title: "Scope and Delimitations", mandatory: true },
      ],
    },
    {
      key: "literature-review", title: "Literature Review", mandatory: true, children: [
        { key: "theoretical-framework", title: "Theoretical Framework", mandatory: true },
        { key: "empirical-review", title: "Empirical Review", mandatory: true },
        { key: "research-gap", title: "Identified Research Gaps", mandatory: true },
      ],
    },
    {
      key: "methodology", title: "Proposed Methodology", mandatory: true, children: [
        { key: "research-design", title: "Research Design", mandatory: true },
        { key: "population-sampling", title: "Population and Sampling", mandatory: true },
        { key: "data-collection", title: "Data Collection Methods", mandatory: true },
        { key: "data-analysis", title: "Data Analysis Plan", mandatory: true },
        { key: "ethical-considerations", title: "Ethical Considerations", mandatory: true },
      ],
    },
    { key: "timeline", title: "Work Plan / Timeline", mandatory: true },
    { key: "budget", title: "Budget Estimate", mandatory: false },
    { key: "references", title: "References", mandatory: true },
    { key: "appendices", title: "Appendices", mandatory: false },
  ],

  "Progress Report": [
    { key: "title-page", title: "Title Page", mandatory: true },
    { key: "executive-summary", title: "Executive Summary", mandatory: true },
    {
      key: "project-overview", title: "Project Overview", mandatory: true, children: [
        { key: "objectives-recap", title: "Objectives Recap", mandatory: true },
        { key: "scope", title: "Scope and Timeline", mandatory: true },
      ],
    },
    {
      key: "progress-update", title: "Progress Update", mandatory: true, children: [
        { key: "tasks-completed", title: "Tasks Completed", mandatory: true },
        { key: "tasks-in-progress", title: "Tasks In Progress", mandatory: true },
        { key: "tasks-pending", title: "Pending Tasks", mandatory: true },
        { key: "milestones", title: "Milestones Achieved", mandatory: true },
      ],
    },
    {
      key: "challenges", title: "Challenges and Risks", mandatory: true, children: [
        { key: "issues-encountered", title: "Issues Encountered", mandatory: true },
        { key: "mitigation", title: "Mitigation Strategies", mandatory: true },
      ],
    },
    { key: "preliminary-findings", title: "Preliminary Findings", mandatory: false },
    { key: "revised-timeline", title: "Revised Timeline", mandatory: false },
    { key: "next-steps", title: "Next Steps", mandatory: true },
    { key: "appendices", title: "Appendices", mandatory: false },
  ],

  "Final Report": [
    { key: "title-page", title: "Title Page", mandatory: true },
    { key: "acknowledgements", title: "Acknowledgements", mandatory: false },
    { key: "executive-summary", title: "Executive Summary", mandatory: true },
    { key: "toc", title: "Table of Contents", mandatory: true },
    {
      key: "introduction", title: "Introduction", mandatory: true, children: [
        { key: "background", title: "Background", mandatory: true },
        { key: "objectives", title: "Objectives", mandatory: true },
        { key: "scope", title: "Scope", mandatory: true },
      ],
    },
    {
      key: "literature-review", title: "Literature Review", mandatory: true, children: [
        { key: "theoretical-framework", title: "Theoretical Framework", mandatory: true },
        { key: "related-work", title: "Related Work", mandatory: true },
      ],
    },
    {
      key: "methodology", title: "Methodology", mandatory: true, children: [
        { key: "research-design", title: "Research Design", mandatory: true },
        { key: "data-collection", title: "Data Collection", mandatory: true },
        { key: "data-analysis", title: "Data Analysis", mandatory: true },
      ],
    },
    {
      key: "results", title: "Results", mandatory: true, children: [
        { key: "key-findings", title: "Key Findings", mandatory: true },
        { key: "data-presentation", title: "Data Presentation", mandatory: true },
      ],
    },
    {
      key: "discussion", title: "Discussion", mandatory: true, children: [
        { key: "interpretation", title: "Interpretation of Results", mandatory: true },
        { key: "implications", title: "Implications", mandatory: true },
        { key: "limitations", title: "Limitations", mandatory: true },
      ],
    },
    {
      key: "conclusion", title: "Conclusion and Recommendations", mandatory: true, children: [
        { key: "summary", title: "Summary of Findings", mandatory: true },
        { key: "recommendations", title: "Recommendations", mandatory: true },
        { key: "future-work", title: "Future Work", mandatory: false },
      ],
    },
    { key: "references", title: "References", mandatory: true },
    { key: "appendices", title: "Appendices", mandatory: false },
  ],

  "Journal Article": [
    { key: "title", title: "Title", mandatory: true },
    { key: "abstract", title: "Abstract", mandatory: true },
    { key: "keywords", title: "Keywords", mandatory: true },
    {
      key: "introduction", title: "Introduction", mandatory: true, children: [
        { key: "background", title: "Background", mandatory: true },
        { key: "problem-statement", title: "Problem Statement", mandatory: true },
        { key: "objectives", title: "Objectives", mandatory: true },
      ],
    },
    { key: "literature-review", title: "Literature Review", mandatory: true },
    {
      key: "methodology", title: "Methodology", mandatory: true, children: [
        { key: "research-design", title: "Research Design", mandatory: true },
        { key: "data-collection", title: "Data Collection", mandatory: true },
        { key: "data-analysis", title: "Data Analysis", mandatory: true },
      ],
    },
    { key: "results", title: "Results", mandatory: true },
    { key: "discussion", title: "Discussion", mandatory: true },
    { key: "conclusion", title: "Conclusion", mandatory: true },
    { key: "acknowledgements", title: "Acknowledgements", mandatory: false },
    { key: "references", title: "References", mandatory: true },
    { key: "appendices", title: "Supplementary Material", mandatory: false },
  ],

  "Review Article": [
    { key: "title", title: "Title", mandatory: true },
    { key: "abstract", title: "Abstract", mandatory: true },
    { key: "keywords", title: "Keywords", mandatory: true },
    {
      key: "introduction", title: "Introduction", mandatory: true, children: [
        { key: "scope-of-review", title: "Scope of Review", mandatory: true },
        { key: "objectives", title: "Objectives", mandatory: true },
      ],
    },
    {
      key: "search-methodology", title: "Search Methodology", mandatory: true, children: [
        { key: "search-strategy", title: "Search Strategy", mandatory: true },
        { key: "inclusion-exclusion", title: "Inclusion / Exclusion Criteria", mandatory: true },
        { key: "quality-assessment", title: "Quality Assessment", mandatory: false },
      ],
    },
    {
      key: "thematic-review", title: "Thematic Review", mandatory: true, children: [
        { key: "theme-1", title: "Theme 1", mandatory: true },
        { key: "theme-2", title: "Theme 2", mandatory: false },
        { key: "theme-3", title: "Theme 3", mandatory: false },
      ],
    },
    { key: "critical-analysis", title: "Critical Analysis and Synthesis", mandatory: true },
    { key: "research-gaps", title: "Identified Research Gaps", mandatory: true },
    { key: "conclusion", title: "Conclusion and Future Directions", mandatory: true },
    { key: "references", title: "References", mandatory: true },
  ],

  "Conference Paper": [
    { key: "title", title: "Title", mandatory: true },
    { key: "abstract", title: "Abstract", mandatory: true },
    { key: "keywords", title: "Keywords", mandatory: true },
    { key: "introduction", title: "Introduction", mandatory: true },
    { key: "related-work", title: "Related Work", mandatory: true },
    {
      key: "methodology", title: "Methodology / Approach", mandatory: true, children: [
        { key: "system-design", title: "System Design", mandatory: true },
        { key: "implementation", title: "Implementation Details", mandatory: false },
      ],
    },
    {
      key: "experiments", title: "Experiments and Results", mandatory: true, children: [
        { key: "experimental-setup", title: "Experimental Setup", mandatory: true },
        { key: "results", title: "Results", mandatory: true },
        { key: "comparison", title: "Comparison with Baselines", mandatory: false },
      ],
    },
    { key: "discussion", title: "Discussion", mandatory: true },
    { key: "conclusion", title: "Conclusion and Future Work", mandatory: true },
    { key: "acknowledgements", title: "Acknowledgements", mandatory: false },
    { key: "references", title: "References", mandatory: true },
  ],

  "Grant Proposal": [
    { key: "cover-page", title: "Cover Page", mandatory: true },
    { key: "executive-summary", title: "Executive Summary", mandatory: true },
    {
      key: "project-description", title: "Project Description", mandatory: true, children: [
        { key: "background", title: "Background and Rationale", mandatory: true },
        { key: "problem-statement", title: "Problem Statement", mandatory: true },
        { key: "objectives", title: "Goals and Objectives", mandatory: true },
        { key: "significance", title: "Significance and Innovation", mandatory: true },
      ],
    },
    {
      key: "methodology", title: "Research Plan / Methodology", mandatory: true, children: [
        { key: "approach", title: "Approach", mandatory: true },
        { key: "timeline", title: "Timeline and Milestones", mandatory: true },
        { key: "expected-outcomes", title: "Expected Outcomes", mandatory: true },
      ],
    },
    {
      key: "budget", title: "Budget", mandatory: true, children: [
        { key: "budget-narrative", title: "Budget Narrative", mandatory: true },
        { key: "budget-justification", title: "Budget Justification", mandatory: true },
      ],
    },
    { key: "team", title: "Team and Personnel", mandatory: true },
    { key: "facilities", title: "Facilities and Equipment", mandatory: false },
    { key: "impact", title: "Impact and Dissemination Plan", mandatory: true },
    { key: "ethical-review", title: "Ethical Review and Compliance", mandatory: true },
    { key: "references", title: "References", mandatory: true },
    { key: "appendices", title: "Appendices / Supporting Documents", mandatory: false },
  ],
};

// Helper: flatten template into Section[] for the project
let sectionCounter = 0;
export function templateToSections(projectType: ProjectType): { id: string; title: string; order: number; content: string }[] {
  sectionCounter = 0;
  const template = SECTION_TEMPLATES[projectType];
  const result: { id: string; title: string; order: number; content: string }[] = [];
  for (const sec of template) {
    sectionCounter++;
    result.push({ id: `tmpl-${sec.key}`, title: sec.title, order: sectionCounter, content: "" });
    if (sec.children) {
      for (const child of sec.children) {
        sectionCounter++;
        result.push({ id: `tmpl-${child.key}`, title: child.title, order: sectionCounter, content: "" });
      }
    }
  }
  return result;
}

// Map old sections to new template by fuzzy title matching
export function mapSectionsToTemplate(
  oldSections: { id: string; title: string; content: string }[],
  newSections: { id: string; title: string; order: number; content: string }[]
): { id: string; title: string; order: number; content: string }[] {
  const normalize = (t: string) => t.replace(/^[\d.]+\s*/, "").replace(/^chapter\s*\d+:\s*/i, "").toLowerCase().trim();
  return newSections.map(ns => {
    const match = oldSections.find(os => {
      const normOld = normalize(os.title);
      const normNew = normalize(ns.title);
      return normOld === normNew || normOld.includes(normNew) || normNew.includes(normOld);
    });
    return match ? { ...ns, content: match.content } : ns;
  });
}
