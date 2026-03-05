import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Building2 } from "lucide-react";
import { mockHodDepartment } from "@/data/mockHod";

const HodSettings = () => {
  const dept = mockHodDepartment;

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Department Settings</h1>
        <p className="text-muted-foreground text-sm">Configure your department details</p>
      </div>

      <Card className="p-6 space-y-5">
        <div className="flex items-center gap-2 mb-2">
          <Building2 className="h-5 w-5 text-primary" />
          <h2 className="font-semibold text-foreground">Department Information</h2>
        </div>

        <div>
          <Label>Department Name</Label>
          <Input defaultValue={dept.departmentName} />
        </div>
        <div>
          <Label>Faculty</Label>
          <Input defaultValue={dept.faculty} />
        </div>
        <div>
          <Label>Max Students per Supervisor</Label>
          <Input type="number" defaultValue="5" />
        </div>
        <div>
          <Label>Similarity Threshold (%)</Label>
          <Input type="number" defaultValue="25" />
        </div>
        <div>
          <Label>AI Detection Threshold (%)</Label>
          <Input type="number" defaultValue="30" />
        </div>
        <Button>Save Settings</Button>
      </Card>
    </div>
  );
};

export default HodSettings;
