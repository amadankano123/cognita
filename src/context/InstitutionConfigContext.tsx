import React, { createContext, useContext, useState, useCallback, useMemo } from "react";

/**
 * Institutional configuration & hierarchy engine.
 * Supports multi-faculty / multi-department structure and per-institution theming.
 */
export interface DepartmentNode {
  id: string;
  name: string;
  hodId?: string;
  pgCoordinatorId?: string;
}
export interface FacultyNode {
  id: string;
  name: string;
  deanId?: string;
  departments: DepartmentNode[];
}
export interface InstitutionTheme {
  primaryHsl: string;     // e.g. "224 64% 33%"
  accentHsl: string;
  logoUrl?: string;
  shortName: string;
}
export interface InstitutionConfig {
  id: string;
  name: string;
  shortName: string;
  vcId?: string;
  directorOfResearchId?: string;
  centralAdminId?: string;
  faculties: FacultyNode[];
  theme: InstitutionTheme;
  policies: {
    minIntegrityScore: number;
    requireEthicsReview: boolean;
    allowAiRewrite: boolean;
    allowAiGeneration: boolean;
    similarityThreshold: number;
    aiDetectionThreshold: number;
  };
}

const DEFAULT_CONFIG: InstitutionConfig = {
  id: "inst-greenfield",
  name: "Greenfield University",
  shortName: "GFU",
  vcId: "vc-001",
  directorOfResearchId: "dor-001",
  centralAdminId: "ca-001",
  theme: {
    primaryHsl: "224 64% 33%",
    accentHsl: "260 50% 45%",
    shortName: "GFU",
  },
  policies: {
    minIntegrityScore: 70,
    requireEthicsReview: true,
    allowAiRewrite: true,
    allowAiGeneration: false,
    similarityThreshold: 15,
    aiDetectionThreshold: 20,
  },
  faculties: [
    {
      id: "fac-sci", name: "Faculty of Sciences", deanId: "dean-001",
      departments: [
        { id: "dep-cs", name: "Computer Science", hodId: "hod-001", pgCoordinatorId: "pgc-001" },
        { id: "dep-bio", name: "Biology" },
        { id: "dep-chem", name: "Chemistry" },
        { id: "dep-phy", name: "Physics" },
        { id: "dep-env", name: "Environmental Science" },
      ],
    },
    {
      id: "fac-eng", name: "Faculty of Engineering",
      departments: [
        { id: "dep-eng", name: "Engineering" },
      ],
    },
    {
      id: "fac-soc", name: "Faculty of Social Sciences & Medicine",
      departments: [
        { id: "dep-soc", name: "Social Sciences" },
        { id: "dep-med", name: "Medicine" },
      ],
    },
  ],
};

interface Ctx {
  config: InstitutionConfig;
  updatePolicies: (p: Partial<InstitutionConfig["policies"]>) => void;
  updateTheme: (t: Partial<InstitutionTheme>) => void;
  allDepartments: DepartmentNode[];
}

const InstitutionConfigContext = createContext<Ctx | null>(null);

export const InstitutionConfigProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<InstitutionConfig>(DEFAULT_CONFIG);

  const updatePolicies = useCallback((p: Partial<InstitutionConfig["policies"]>) => {
    setConfig((prev) => ({ ...prev, policies: { ...prev.policies, ...p } }));
  }, []);
  const updateTheme = useCallback((t: Partial<InstitutionTheme>) => {
    setConfig((prev) => ({ ...prev, theme: { ...prev.theme, ...t } }));
  }, []);

  const allDepartments = useMemo(
    () => config.faculties.flatMap((f) => f.departments),
    [config]
  );

  return (
    <InstitutionConfigContext.Provider value={{ config, updatePolicies, updateTheme, allDepartments }}>
      {children}
    </InstitutionConfigContext.Provider>
  );
};

export const useInstitutionConfig = () => {
  const ctx = useContext(InstitutionConfigContext);
  if (!ctx) throw new Error("useInstitutionConfig must be used within InstitutionConfigProvider");
  return ctx;
};
