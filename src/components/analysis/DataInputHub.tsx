import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useProject } from "@/context/ProjectContext";
import { Progress } from "@/components/ui/progress";
import {
  Upload, FileSpreadsheet, PenLine, Camera, Database, Check,
  ArrowRight, Plus, Trash2, ScanLine, Sparkles, AlertCircle,
} from "lucide-react";

interface Props {
  onDataReady: () => void;
}

const DataInputHub = ({ onDataReady }: Props) => {
  const { project, uploadDataset } = useProject();
  const [activeTab, setActiveTab] = useState("upload");
  const [manualRows, setManualRows] = useState<Record<string, string>[]>([{ col1: "", col2: "", col3: "" }]);
  const [manualCols, setManualCols] = useState(["Variable 1", "Variable 2", "Variable 3"]);
  const [ocrStep, setOcrStep] = useState<"upload" | "processing" | "verify" | "done">("upload");
  const [ocrImage, setOcrImage] = useState<string | null>(null);

  const addManualRow = () => setManualRows(prev => [...prev, Object.fromEntries(manualCols.map((_, i) => [`col${i + 1}`, ""]))]);
  const addManualCol = () => {
    const newName = `Variable ${manualCols.length + 1}`;
    setManualCols(prev => [...prev, newName]);
    setManualRows(prev => prev.map(r => ({ ...r, [`col${manualCols.length + 1}`]: "" })));
  };

  const simulateOCR = () => {
    setOcrStep("processing");
    setTimeout(() => setOcrStep("verify"), 2500);
  };

  const confirmOCR = () => {
    setOcrStep("done");
    uploadDataset();
    onDataReady();
  };

  const [showImportTabs, setShowImportTabs] = useState(false);

  if (project.dataset.uploaded && !showImportTabs) {
    return (
      <Card className="shadow-card">
        <div className="p-5 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-success/10 flex items-center justify-center">
              <Check className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="font-medium text-sm">{project.dataset.name}</p>
              <p className="text-xs text-muted-foreground">
                {project.dataset.columns.length} variables · {project.dataset.previewRows.length} observations
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setShowImportTabs(true)}>
              <Plus className="h-4 w-4 mr-1" /> Add More Data
            </Button>
            <Button size="sm" onClick={onDataReady}>
              Proceed to Analysis <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>

        {/* Column summary */}
        <div className="p-4 border-b border-border">
          <h4 className="text-xs font-semibold text-muted-foreground uppercase mb-2">Variables Detected</h4>
          <div className="flex flex-wrap gap-2">
            {project.dataset.columns.map(col => (
              <Badge key={col.name} variant="secondary" className="text-xs font-medium">
                {col.name}
                <span className="text-muted-foreground ml-1">({col.type})</span>
              </Badge>
            ))}
          </div>
        </div>

        {/* Preview table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                {project.dataset.columns.map(col => (
                  <th key={col.name} className="text-left p-3 text-xs font-medium text-muted-foreground">{col.name}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {project.dataset.previewRows.map((row, i) => (
                <tr key={i} className="hover:bg-muted/30">
                  {project.dataset.columns.map(col => (
                    <td key={col.name} className="p-3 text-xs font-mono">{String(row[col.name])}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    );
  }

  return (
    <Card className="shadow-card overflow-hidden">
      <div className="p-5 border-b border-border">
        <h3 className="font-display font-semibold mb-1">Add Your Data</h3>
        <p className="text-sm text-muted-foreground">Choose how you'd like to input your research data for analysis.</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="border-b border-border px-5">
          <TabsList className="bg-transparent h-auto p-0 gap-0">
            <TabsTrigger value="upload" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-4 py-3 text-sm">
              <FileSpreadsheet className="h-4 w-4 mr-2" /> CSV / Excel
            </TabsTrigger>
            <TabsTrigger value="manual" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-4 py-3 text-sm">
              <PenLine className="h-4 w-4 mr-2" /> Manual Entry
            </TabsTrigger>
            <TabsTrigger value="handwritten" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-4 py-3 text-sm">
              <Camera className="h-4 w-4 mr-2" /> Handwritten / OCR
            </TabsTrigger>
          </TabsList>
        </div>

        {/* CSV / Excel Upload */}
        <TabsContent value="upload" className="p-6 mt-0">
          <div className="border-2 border-dashed border-primary/30 rounded-xl p-10 text-center hover:border-primary/50 transition-colors cursor-pointer">
            <Upload className="h-12 w-12 text-primary/60 mx-auto mb-4" />
            <h4 className="font-display font-semibold mb-1">Upload Dataset</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Drag and drop your CSV or Excel file, or click to browse
            </p>
            <p className="text-xs text-muted-foreground mb-4">
              Supported: .csv, .xlsx, .xls · Max 100MB
            </p>
            <Button onClick={() => { uploadDataset(); onDataReady(); }}>
              <Database className="h-4 w-4 mr-2" /> Upload Demo CSV
            </Button>
          </div>
        </TabsContent>

        {/* Manual Data Entry */}
        <TabsContent value="manual" className="p-6 mt-0">
          <div className="mb-4">
            <p className="text-sm text-muted-foreground mb-3">
              Enter your data directly using the structured form below. Ideal for small datasets from surveys or experiments.
            </p>
          </div>
          <div className="overflow-x-auto border border-border rounded-lg mb-4">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/50 border-b border-border">
                  <th className="p-2 text-xs text-muted-foreground w-10">#</th>
                  {manualCols.map((col, i) => (
                    <th key={i} className="p-2">
                      <Input
                        value={col}
                        onChange={e => {
                          const next = [...manualCols];
                          next[i] = e.target.value;
                          setManualCols(next);
                        }}
                        className="h-7 text-xs font-semibold"
                      />
                    </th>
                  ))}
                  <th className="p-2 w-10">
                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={addManualCol}>
                      <Plus className="h-3.5 w-3.5" />
                    </Button>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {manualRows.map((row, ri) => (
                  <tr key={ri} className="hover:bg-muted/30">
                    <td className="p-2 text-xs text-muted-foreground text-center">{ri + 1}</td>
                    {manualCols.map((_, ci) => (
                      <td key={ci} className="p-2">
                        <Input
                          value={row[`col${ci + 1}`] || ""}
                          onChange={e => {
                            const next = [...manualRows];
                            next[ri] = { ...next[ri], [`col${ci + 1}`]: e.target.value };
                            setManualRows(next);
                          }}
                          className="h-7 text-xs font-mono"
                          placeholder="—"
                        />
                      </td>
                    ))}
                    <td className="p-2">
                      <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-muted-foreground" onClick={() => setManualRows(prev => prev.filter((_, i) => i !== ri))} disabled={manualRows.length <= 1}>
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={addManualRow}><Plus className="h-4 w-4 mr-1" /> Add Row</Button>
            <Button size="sm" onClick={() => { uploadDataset(); onDataReady(); }}>
              <Check className="h-4 w-4 mr-1" /> Save & Continue
            </Button>
          </div>
        </TabsContent>

        {/* Handwritten / OCR */}
        <TabsContent value="handwritten" className="p-6 mt-0">
          {ocrStep === "upload" && (
            <div>
              <div className="bg-accent/30 rounded-lg p-4 flex gap-3 mb-5">
                <Sparkles className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-medium">AI-Powered Handwriting Recognition</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Upload photos or scans of handwritten data sheets — laboratory notebooks, survey forms, or field records.
                    Our AI will extract the values and organise them into structured tables for you to verify.
                  </p>
                </div>
              </div>
              <div className="border-2 border-dashed border-primary/30 rounded-xl p-10 text-center hover:border-primary/50 transition-colors cursor-pointer">
                <Camera className="h-12 w-12 text-primary/60 mx-auto mb-4" />
                <h4 className="font-display font-semibold mb-1">Upload Handwritten Data</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Take a photo or upload a scan of your data sheet
                </p>
                <p className="text-xs text-muted-foreground mb-4">
                  Supported: .jpg, .png, .pdf, .heic · Max 20MB
                </p>
                <Button onClick={simulateOCR}>
                  <ScanLine className="h-4 w-4 mr-2" /> Upload & Extract
                </Button>
              </div>
            </div>
          )}

          {ocrStep === "processing" && (
            <div className="text-center py-12">
              <ScanLine className="h-12 w-12 text-primary mx-auto mb-4 animate-pulse" />
              <h4 className="font-display font-semibold mb-2">Extracting Data…</h4>
              <p className="text-sm text-muted-foreground mb-4">AI is reading your handwritten values and structuring them into a table.</p>
              <div className="max-w-xs mx-auto">
                <Progress value={65} className="h-2" />
              </div>
            </div>
          )}

          {ocrStep === "verify" && (
            <div>
              <div className="bg-warning/10 rounded-lg p-4 flex gap-3 mb-5">
                <AlertCircle className="h-5 w-5 text-warning mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-warning">Please Verify Extracted Data</p>
                  <p className="text-xs text-warning/80 mt-1">
                    Review the values below and correct any misread entries before proceeding.
                  </p>
                </div>
              </div>

              <div className="overflow-x-auto border border-border rounded-lg mb-4">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted/50 border-b border-border">
                      <th className="p-3 text-xs text-muted-foreground text-left">Sample ID</th>
                      <th className="p-3 text-xs text-muted-foreground text-left">Measurement 1</th>
                      <th className="p-3 text-xs text-muted-foreground text-left">Measurement 2</th>
                      <th className="p-3 text-xs text-muted-foreground text-left">Group</th>
                      <th className="p-3 text-xs text-muted-foreground text-center">Confidence</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {[
                      { id: "S001", m1: "23.5", m2: "18.2", g: "Control", conf: 98 },
                      { id: "S002", m1: "31.7", m2: "24.1", g: "Treatment", conf: 95 },
                      { id: "S003", m1: "19.3", m2: "15.8", g: "Control", conf: 87 },
                      { id: "S004", m1: "28.6", m2: "22.9", g: "Treatment", conf: 72 },
                      { id: "S005", m1: "25.1", m2: "20.4", g: "Control", conf: 96 },
                    ].map(row => (
                      <tr key={row.id} className={`hover:bg-muted/30 ${row.conf < 80 ? "bg-warning/5" : ""}`}>
                        <td className="p-3"><Input defaultValue={row.id} className="h-7 text-xs font-mono w-20" /></td>
                        <td className="p-3"><Input defaultValue={row.m1} className="h-7 text-xs font-mono w-20" /></td>
                        <td className="p-3"><Input defaultValue={row.m2} className="h-7 text-xs font-mono w-20" /></td>
                        <td className="p-3"><Input defaultValue={row.g} className="h-7 text-xs font-mono w-24" /></td>
                        <td className="p-3 text-center">
                          <Badge variant="outline" className={`text-[10px] ${row.conf >= 90 ? "text-success border-success/30" : "text-warning border-warning/30"}`}>
                            {row.conf}%
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setOcrStep("upload")}>Re-upload</Button>
                <Button size="sm" onClick={confirmOCR}>
                  <Check className="h-4 w-4 mr-1" /> Confirm & Save Dataset
                </Button>
              </div>
            </div>
          )}

          {ocrStep === "done" && (
            <div className="text-center py-12">
              <Check className="h-12 w-12 text-success mx-auto mb-4" />
              <h4 className="font-display font-semibold mb-2">Dataset Saved</h4>
              <p className="text-sm text-muted-foreground">Your handwritten data has been extracted and verified.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default DataInputHub;
