import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { User, Shield, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { apiClient } from "@/lib/api-client";
import { authClient } from "@/lib/auth";

export default function Profile() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    legalSituation: "",
    childDetails: "",
    emergencyContacts: "",
    underAvo: null as boolean | null,
  });

  const { data: session } = useQuery({
    queryKey: ["session"],
    queryFn: () => authClient.getSession(),
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      await apiClient.profile.$post({
        json: {
          ...formData,
          underAvo: formData.underAvo ?? undefined,
          onboardingCompleted: true,
        },
      });
    },
    onSuccess: () => {
      navigate("/dashboard");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveMutation.mutate();
  };

  if (!session) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-8">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Please sign in to continue.{" "}
              <button
                onClick={() => navigate("/signin")}
                className="text-primary hover:underline"
              >
                Go to sign in
              </button>
            </AlertDescription>
          </Alert>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full p-8 space-y-6">
        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <div className="p-3 bg-primary/10 rounded-full">
              <User className="h-6 w-6 text-primary" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-foreground">
            Create Your Profile
          </h1>
          <p className="text-muted-foreground">
            Help us personalize your experience. All information is optional and encrypted.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Your Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
              placeholder="Optional"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="legalSituation">
              Brief Description of Your Legal Situation
            </Label>
            <Textarea
              id="legalSituation"
              value={formData.legalSituation}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, legalSituation: e.target.value }))
              }
              placeholder="e.g., Custody dispute, property settlement, etc. (Optional)"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="childDetails">Children Details (Optional)</Label>
            <Textarea
              id="childDetails"
              value={formData.childDetails}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, childDetails: e.target.value }))
              }
              placeholder="Ages, names, or any relevant details (Optional)"
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="emergencyContacts">Emergency Contacts</Label>
            <Textarea
              id="emergencyContacts"
              value={formData.emergencyContacts}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, emergencyContacts: e.target.value }))
              }
              placeholder="Name and phone number of trusted contacts (Optional)"
              rows={2}
            />
          </div>

          <div className="space-y-3">
            <Label className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-destructive" />
              Are you currently under an AVO or legal order?
            </Label>
            <RadioGroup
              value={
                formData.underAvo === null
                  ? undefined
                  : formData.underAvo
                  ? "yes"
                  : "no"
              }
              onValueChange={(value: string) =>
                setFormData((prev) => ({
                  ...prev,
                  underAvo: value === "yes" ? true : value === "no" ? false : null,
                }))
              }
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="avo-yes" />
                <Label htmlFor="avo-yes" className="cursor-pointer">
                  Yes
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="avo-no" />
                <Label htmlFor="avo-no" className="cursor-pointer">
                  No
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => navigate("/onboarding/disclaimer")}
            >
              Back
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={saveMutation.isPending}
            >
              {saveMutation.isPending ? "Saving..." : "Continue to Dashboard"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
