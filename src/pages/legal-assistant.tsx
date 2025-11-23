import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { Scale, ArrowLeft, AlertTriangle, Download, Copy, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { LegalDisclaimer } from "@/components/safety/legal-disclaimer";
import { DisclaimerDialog } from "@/components/safety/disclaimer-dialog";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { apiClient } from "@/lib/api-client";

export default function LegalAssistant() {
  const navigate = useNavigate();
  const [originalText, setOriginalText] = useState("");
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const [disclaimerAccepted, setDisclaimerAccepted] = useState(false);
  const [copied, setCopied] = useState(false);

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({ api: "/api/ai/chat" }),
  });

  const saveDraftMutation = useMutation({
    mutationFn: async (data: {
      originalText: string;
      rewrittenText: string;
      riskHighlights?: string;
    }) => {
      const res = await apiClient.drafts.$post({ json: data });
      return res.json();
    },
  });

  const handleRewrite = async () => {
    if (!originalText.trim()) return;
    
    if (!disclaimerAccepted) {
      setShowDisclaimer(true);
      return;
    }

    await sendMessage({
      text: `You are a Family Law King's Counsel in Australia. Rewrite this message in a calm, professional, court-safe tone. Highlight any potential legal risks or inflammatory language.

Original message:
${originalText}

Provide:
1. The rewritten version
2. A list of any legal risks or concerns identified`,
    });
  };

  const handleExport = () => {
    if (!disclaimerAccepted) {
      setShowDisclaimer(true);
      return;
    }

    const latestMessage = messages[messages.length - 1];
    const messageText = (latestMessage as any)?.text || (latestMessage as any)?.content;
    if (latestMessage?.role === "assistant" && typeof messageText === "string") {
      saveDraftMutation.mutate({
        originalText,
        rewrittenText: messageText,
      });

      const element = document.createElement("a");
      const file = new Blob([messageText], { type: "text/plain" });
      element.href = URL.createObjectURL(file);
      element.download = `rewritten-${Date.now()}.txt`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }
  };

  const handleCopy = () => {
    const latestMessage = messages[messages.length - 1];
    const messageText = (latestMessage as any)?.text || (latestMessage as any)?.content;
    if (latestMessage?.role === "assistant" && typeof messageText === "string") {
      navigator.clipboard.writeText(messageText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const disclaimers = [
    "I understand this is not legal advice and I should consult a qualified solicitor.",
    "I acknowledge that AI-generated content may contain errors or inaccuracies.",
    "I will review and adapt the rewritten text to my specific situation before using it.",
  ];

  const latestMessage = messages[messages.length - 1];
  const messageText = (latestMessage as any)?.text || (latestMessage as any)?.content;
  const isGenerating = status === "streaming";

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
                <Scale className="h-8 w-8 text-primary" />
                AI Legal Assistant
              </h1>
              <p className="text-muted-foreground mt-1">
                Rewrite communications in a calm, court-safe tone
              </p>
            </div>
          </div>

          <LegalDisclaimer />

          <Card>
            <CardHeader>
              <CardTitle>Original Message</CardTitle>
              <CardDescription>
                Paste your email, text, or letter below. The AI will rewrite it in a professional tone.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Paste your original message here..."
                value={originalText}
                onChange={(e) => setOriginalText(e.target.value)}
                rows={8}
                className="font-mono text-sm"
              />
              <Button
                onClick={handleRewrite}
                disabled={!originalText.trim() || isGenerating}
                className="w-full"
              >
                {isGenerating ? "Rewriting..." : "Rewrite Message"}
              </Button>
            </CardContent>
          </Card>

          {messages.length > 0 && latestMessage?.role === "assistant" && typeof messageText === "string" && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-accent">Rewritten Version</CardTitle>
                    <CardDescription>Review and adapt as needed</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={handleCopy}>
                      {copied ? (
                        <>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4 mr-2" />
                          Copy
                        </>
                      )}
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleExport}>
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 border rounded-lg bg-muted/30">
                  <pre className="whitespace-pre-wrap text-sm font-sans">
                    {messageText}
                  </pre>
                </div>

                <div className="flex items-start gap-2 p-4 border border-destructive/30 bg-destructive/5 rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
                  <div className="text-sm">
                    <p className="font-medium text-foreground mb-1">Important Reminder</p>
                    <p className="text-muted-foreground">
                      Always review the rewritten text carefully. This tool is designed to assist, not replace, 
                      your judgment or legal counsel. Adapt it to your specific situation.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {messages.length === 0 && (
            <Card className="border-dashed">
              <CardContent className="py-12 text-center">
                <Scale className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Your rewritten message will appear here
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <DisclaimerDialog
        open={showDisclaimer}
        onOpenChange={setShowDisclaimer}
        onAccept={() => {
          setDisclaimerAccepted(true);
          setShowDisclaimer(false);
        }}
        title="Legal Assistant Disclaimer"
        disclaimers={disclaimers}
      />
    </div>
  );
}
