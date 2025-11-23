import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, ArrowLeft, CheckCircle2, FileText, AlertTriangle, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LegalDisclaimer } from "@/components/safety/legal-disclaimer";
import { DisclaimerDialog } from "@/components/safety/disclaimer-dialog";

const AVO_PHASES = [
  {
    phase: 1,
    title: "Initial Allegation",
    description: "An AVO application has been made or you've received notice.",
    guidance: [
      "Do NOT contact the protected person",
      "Document everything - save all communications",
      "Seek legal advice immediately",
      "Do not react emotionally on social media",
    ],
  },
  {
    phase: 2,
    title: "Service & Documentation",
    description: "You've been officially served with AVO documents.",
    guidance: [
      "Read all documents carefully",
      "Note all court dates and deadlines",
      "Gather evidence: messages, emails, witnesses",
      "Start a detailed timeline of events",
    ],
  },
  {
    phase: 3,
    title: "Legal Representation",
    description: "Engage a solicitor who specializes in family law.",
    guidance: [
      "Find a solicitor experienced in AVOs",
      "Be completely honest with your lawyer",
      "Prepare a statement of your version of events",
      "Discuss potential outcomes and strategies",
    ],
  },
  {
    phase: 4,
    title: "Evidence Gathering",
    description: "Collect all relevant documentation and witness statements.",
    guidance: [
      "Text messages, emails, call logs",
      "Photos, videos, receipts",
      "Witness statements from family/friends",
      "Medical or police reports if relevant",
    ],
  },
  {
    phase: 5,
    title: "Court Preparation",
    description: "Prepare for your court appearance.",
    guidance: [
      "Dress professionally for court",
      "Arrive early and be respectful",
      "Speak calmly and stick to facts",
      "Follow your lawyer's advice exactly",
    ],
  },
  {
    phase: 6,
    title: "First Court Appearance",
    description: "Your initial appearance before the magistrate.",
    guidance: [
      "Listen carefully to all proceedings",
      "Do not interrupt or show emotion",
      "Answer questions truthfully and concisely",
      "Take notes if permitted",
    ],
  },
  {
    phase: 7,
    title: "Negotiation & Mediation",
    description: "Attempt to resolve the matter outside of a contested hearing.",
    guidance: [
      "Consider reasonable compromises",
      "Focus on protecting your relationship with children",
      "Understand the implications of consent orders",
      "Get everything in writing",
    ],
  },
  {
    phase: 8,
    title: "Final Hearing (if required)",
    description: "Present your case if the matter proceeds to a contested hearing.",
    guidance: [
      "Present evidence methodically",
      "Remain calm under cross-examination",
      "Trust your legal representation",
      "Be prepared for any outcome",
    ],
  },
  {
    phase: 9,
    title: "Order Compliance",
    description: "Understanding and complying with the final order.",
    guidance: [
      "Read the order carefully - understand every condition",
      "Comply fully, even if you disagree",
      "Keep a copy of the order accessible at all times",
      "Document your compliance",
    ],
  },
  {
    phase: 10,
    title: "Moving Forward",
    description: "Life after an AVO - rebuilding and protecting yourself.",
    guidance: [
      "Consider counseling for yourself and children",
      "Maintain detailed records of all interactions",
      "Focus on being the best parent you can be",
      "Know your rights regarding variation or discharge",
    ],
  },
];

const TEMPLATES = [
  {
    id: "neutral-communication",
    title: "Neutral Communication Template",
    description: "For necessary communication regarding children",
    phase: "Ongoing",
  },
  {
    id: "evidence-log",
    title: "Evidence Log Template",
    description: "Track and document all relevant evidence",
    phase: "Phase 4",
  },
  {
    id: "witness-statement",
    title: "Witness Statement Guide",
    description: "How to request and structure witness statements",
    phase: "Phase 4",
  },
  {
    id: "timeline-template",
    title: "Timeline of Events Template",
    description: "Chronological record of relevant incidents",
    phase: "Phase 2",
  },
];

export default function AVOToolkit() {
  const navigate = useNavigate();
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  const handleTemplateDownload = (templateId: string) => {
    setSelectedTemplate(templateId);
    setShowDisclaimer(true);
  };

  const handleDisclaimerAccept = () => {
    const template = TEMPLATES.find((t) => t.id === selectedTemplate);
    if (template) {
      const content = `DadStrong.au - ${template.title}\n\nThis template is for educational purposes only and does not constitute legal advice.\n\nConsult a qualified solicitor before using any templates in legal proceedings.\n\n---\n\n[Template content would go here]`;

      const element = document.createElement("a");
      const file = new Blob([content], { type: "text/plain" });
      element.href = URL.createObjectURL(file);
      element.download = `${template.id}.txt`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }
    setShowDisclaimer(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
                <Shield className="h-8 w-8 text-secondary" />
                AVO Response Toolkit
              </h1>
              <p className="text-muted-foreground mt-1">
                10-phase roadmap to navigate AVO proceedings
              </p>
            </div>
          </div>

          <LegalDisclaimer />

          <Card className="border-destructive/30 bg-destructive/5">
            <CardHeader>
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-destructive mt-1" />
                <div>
                  <CardTitle className="text-destructive">Critical Safety Notice</CardTitle>
                  <CardDescription className="text-foreground/80">
                    If you are subject to an AVO, you must comply with all conditions immediately. 
                    Breaching an AVO is a criminal offense. Seek urgent legal advice.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">10-Phase Roadmap</h2>
            <div className="grid gap-4">
              {AVO_PHASES.map((item) => (
                <Card key={item.phase}>
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-lg font-bold text-primary">{item.phase}</span>
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-xl mb-1">{item.title}</CardTitle>
                        <CardDescription>{item.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {item.guidance.map((point, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <CheckCircle2 className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">Templates & Resources</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {TEMPLATES.map((template) => (
                <Card key={template.id}>
                  <CardHeader>
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-accent/10 rounded-lg">
                        <FileText className="h-5 w-5 text-accent" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-lg">{template.title}</CardTitle>
                        <CardDescription>{template.description}</CardDescription>
                        <p className="text-xs text-muted-foreground mt-1">
                          Relevant to: {template.phase}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Button
                      variant="outline"
                      className="w-full gap-2"
                      onClick={() => handleTemplateDownload(template.id)}
                    >
                      <Download className="h-4 w-4" />
                      Download Template
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>

      <DisclaimerDialog
        open={showDisclaimer}
        onOpenChange={setShowDisclaimer}
        onAccept={handleDisclaimerAccept}
        title="Template Download Disclaimer"
        disclaimers={[
          "I understand these templates are educational resources only, not legal advice.",
          "I will consult a qualified solicitor before using any template in legal proceedings.",
          "I acknowledge that every legal situation is unique and requires professional guidance.",
        ]}
      />
    </div>
  );
}
