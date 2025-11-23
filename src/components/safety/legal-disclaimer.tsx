import { AlertTriangle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function LegalDisclaimer() {
  return (
    <Alert className="border-destructive/50 bg-destructive/10">
      <AlertTriangle className="h-4 w-4 text-destructive" />
      <AlertDescription className="text-sm text-foreground">
        This app does not provide legal advice. Always consult a qualified family law solicitor.
      </AlertDescription>
    </Alert>
  );
}
