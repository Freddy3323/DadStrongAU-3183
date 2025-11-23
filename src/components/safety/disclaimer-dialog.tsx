import { useState } from "react";
import { AlertTriangle, Shield } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface DisclaimerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAccept: () => void;
  title: string;
  disclaimers: string[];
}

export function DisclaimerDialog({
  open,
  onOpenChange,
  onAccept,
  title,
  disclaimers,
}: DisclaimerDialogProps) {
  const [checked, setChecked] = useState<boolean[]>(disclaimers.map(() => false));

  const allChecked = checked.every((c) => c);

  const handleAccept = () => {
    if (allChecked) {
      onAccept();
      setChecked(disclaimers.map(() => false));
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-destructive/10 rounded-full">
              <AlertTriangle className="h-5 w-5 text-destructive" />
            </div>
            <DialogTitle className="text-lg">{title}</DialogTitle>
          </div>
          <DialogDescription className="text-sm text-muted-foreground">
            Please read and acknowledge the following before proceeding:
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {disclaimers.map((disclaimer, index) => (
            <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
              <Checkbox
                id={`disclaimer-${index}`}
                checked={checked[index]}
                onCheckedChange={(value) => {
                  const newChecked = [...checked];
                  newChecked[index] = value as boolean;
                  setChecked(newChecked);
                }}
                className="mt-0.5"
              />
              <Label
                htmlFor={`disclaimer-${index}`}
                className="text-sm leading-relaxed cursor-pointer"
              >
                {disclaimer}
              </Label>
            </div>
          ))}
        </div>

        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleAccept}
            disabled={!allChecked}
            className="gap-2"
          >
            <Shield className="h-4 w-4" />
            I Understand & Agree
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
