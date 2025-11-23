import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Scale, BookOpen, Shield, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MentalHealthBanner } from "@/components/safety/mental-health-banner";
import { LegalDisclaimer } from "@/components/safety/legal-disclaimer";
import { authClient } from "@/lib/auth";
import { apiClient } from "@/lib/api-client";

export default function Home() {
  const navigate = useNavigate();

  const { data: session } = useQuery({
    queryKey: ["session"],
    queryFn: () => authClient.getSession(),
  });

  const { data: profileData } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const res = await apiClient.profile.$get();
      return res.json();
    },
    enabled: !!session,
  });

  const { data: journalsData } = useQuery({
    queryKey: ["journals"],
    queryFn: async () => {
      const res = await apiClient.journals.$get();
      return res.json();
    },
    enabled: !!session,
  });

  const recentEntries = journalsData?.entries?.slice(0, 3) || [];

  if (!session) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-16 max-w-6xl">
          <div className="text-center space-y-6 mb-16">
            <img
              src="/logos/shield-father.png"
              alt="DadStrong Logo"
              className="h-32 w-auto mx-auto"
            />
            <h1 className="text-4xl md:text-5xl font-bold text-foreground">
              DadStrong Australia
            </h1>
            <p className="text-xl text-accent font-medium">
              Stand strong. Stay safe. Be heard.
            </p>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Legal and emotional support for single fathers navigating family law in Australia.
              You don't have to face this alone.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Button size="lg" onClick={() => navigate("/onboarding/welcome")}>
                Get Started
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate("/signin")}>
                Sign In
              </Button>
            </div>
          </div>

          <div className="mb-12">
            <LegalDisclaimer />
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card>
              <CardHeader>
                <div className="p-3 bg-primary/10 rounded-full w-fit mb-2">
                  <Scale className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-lg">AI Legal Assistant</CardTitle>
                <CardDescription>
                  Rewrite communications in a calm, court-safe tone with risk highlighting
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="p-3 bg-accent/10 rounded-full w-fit mb-2">
                  <BookOpen className="h-6 w-6 text-accent" />
                </div>
                <CardTitle className="text-lg">Memoir & Journal</CardTitle>
                <CardDescription>
                  Document your journey with guided prompts and letters to your children
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="p-3 bg-secondary/10 rounded-full w-fit mb-2">
                  <Shield className="h-6 w-6 text-secondary" />
                </div>
                <CardTitle className="text-lg">AVO Response Toolkit</CardTitle>
                <CardDescription>
                  10-phase roadmap with templates and evidence checklists
                </CardDescription>
              </CardHeader>
            </Card>
          </div>

          <MentalHealthBanner />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Welcome back{profileData?.profile?.name ? `, ${profileData.profile.name}` : ""}
              </h1>
              <p className="text-muted-foreground">
                Your tools are ready when you need them
              </p>
            </div>
            <Button variant="ghost" onClick={() => navigate("/profile")}>
              Profile
            </Button>
          </div>

          <MentalHealthBanner />

          <div className="grid md:grid-cols-3 gap-6">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate("/legal-assistant")}>
              <CardHeader>
                <div className="p-3 bg-primary/10 rounded-full w-fit mb-2">
                  <Scale className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-lg">AI Legal Assistant</CardTitle>
                <CardDescription>
                  Rewrite messages in court-safe language
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full gap-2">
                  Open Tool
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate("/journal")}>
              <CardHeader>
                <div className="p-3 bg-accent/10 rounded-full w-fit mb-2">
                  <BookOpen className="h-6 w-6 text-accent" />
                </div>
                <CardTitle className="text-lg">Memoir & Journal</CardTitle>
                <CardDescription>
                  Document your journey and experiences
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full gap-2">
                  Write Entry
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate("/avo-toolkit")}>
              <CardHeader>
                <div className="p-3 bg-secondary/10 rounded-full w-fit mb-2">
                  <Shield className="h-6 w-6 text-secondary" />
                </div>
                <CardTitle className="text-lg">AVO Toolkit</CardTitle>
                <CardDescription>
                  Navigate legal proceedings with confidence
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full gap-2">
                  View Roadmap
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </div>

          {recentEntries.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Recent Journal Entries
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {recentEntries.map((entry: any) => (
                  <div
                    key={entry.id}
                    className="p-3 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => navigate(`/journal/${entry.id}`)}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <p className="text-sm font-medium">{new Date(entry.date).toLocaleDateString()}</p>
                      <p className="text-xs text-muted-foreground">{entry.entryType || "daily"}</p>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {entry.content}
                    </p>
                  </div>
                ))}
                <Button
                  variant="outline"
                  className="w-full gap-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate("/journal");
                  }}
                >
                  View All Entries
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          )}

          <LegalDisclaimer />
        </div>
      </div>
    </div>
  );
}

