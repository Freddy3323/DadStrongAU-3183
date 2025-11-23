import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AlertTriangle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

export default function Disclaimer() {
  const navigate = useNavigate();
  const [acceptedItems, setAcceptedItems] = useState({
    notLegalAdvice: false,
    consultLawyer: false,
    emotionalSafety: false,
    privacyPolicy: false,
  });

  const allAccepted = Object.values(acceptedItems).every((v) => v);

  const disclaimers = [
    {
      key: "notLegalAdvice",
      title: "This app does not provide legal advice",
      description:
        "The AI tools and templates are educational resources only. Always consult a qualified family law solicitor for legal advice specific to your situation.",
    },
    {
      key: "consultLawyer",
      title: "Professional legal representation is essential",
      description:
        "For matters involving court proceedings, AVOs, or custody disputes, you must seek independent legal advice from a registered solicitor in your jurisdiction.",
    },
    {
      key: "emotionalSafety",
      title: "This is not a crisis service",
      description:
        "If you are in immediate danger or experiencing a mental health crisis, please contact emergency services (000) or crisis support lines like Lifeline (13 11 14).",
    },
    {
      key: "privacyPolicy",
      title: "Your data is encrypted and private",
      description:
        "All journal entries and communications are stored securely. We never share your personal information. By using this app, you agree to our privacy policy.",
    },
  ];

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="max-w-3xl w-full p-8 space-y-6">
        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <div className="p-4 bg-destructive/10 rounded-full">
              <AlertTriangle className="h-8 w-8 text-destructive" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-foreground">
            Important Information
          </h1>
          <p className="text-muted-foreground">
            Please read and acknowledge these important points before continuing.
          </p>
        </div>

        <div className="space-y-4">
          {disclaimers.map(({ key, title, description }) => (
            <div
              key={key}
              className="border rounded-lg p-4 space-y-3 transition-colors"
            >
              <div className="flex items-start gap-3">
                <Checkbox
                  id={key}
                  checked={acceptedItems[key as keyof typeof acceptedItems]}
                  onCheckedChange={(checked) =>
                    setAcceptedItems((prev) => ({ ...prev, [key]: checked }))
                  }
                  className="mt-1"
                />
                <div className="flex-1 space-y-2">
                  <Label
                    htmlFor={key}
                    className="text-sm font-medium cursor-pointer flex items-center gap-2"
                  >
                    {title}
                    {acceptedItems[key as keyof typeof acceptedItems] && (
                      <CheckCircle2 className="h-4 w-4 text-accent" />
                    )}
                  </Label>
                  <p className="text-sm text-muted-foreground">{description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => navigate("/")}
          >
            Back
          </Button>
          <Button
            className="flex-1"
            disabled={!allAccepted}
            onClick={() => navigate("/onboarding/profile")}
          >
            I Understand & Agree
          </Button>
        </div>
      </Card>
    </div>
  );
}
