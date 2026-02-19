const quotes = [
  {
    tool: "Zotero",
    line: "Zotero manages papers.",
    cognita: "Cognita manages thinking.",
  },
  {
    tool: "Turnitin",
    line: "Turnitin checks similarity.",
    cognita: "Cognita builds originality into writing.",
  },
  {
    tool: "SPSS",
    line: "SPSS analyzes data.",
    cognita: "Cognita connects data to reasoning and conclusions.",
  },
];

const ComparisonQuotesSection = () => (
  <section className="bg-primary text-primary-foreground">
    <div className="max-w-4xl mx-auto px-6 py-24">
      <div className="text-center mb-14">
        <p className="text-sm font-semibold uppercase tracking-widest text-primary-foreground/70 mb-3">Cognita vs Everything Else</p>
        <h2 className="text-3xl md:text-4xl font-bold">
          Beyond Point Solutions
        </h2>
      </div>

      <div className="space-y-6">
        {quotes.map((q) => (
          <div
            key={q.tool}
            className="rounded-xl bg-primary-foreground/10 border border-primary-foreground/15 p-6 md:p-8"
          >
            <p className="text-primary-foreground/60 text-lg mb-1">
              "{q.line}"
            </p>
            <p className="text-xl md:text-2xl font-display font-semibold">
              "{q.cognita}"
            </p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default ComparisonQuotesSection;
