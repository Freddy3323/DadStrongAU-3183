import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { BookOpen, ArrowLeft, Plus, Heart, FileText, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MentalHealthBanner } from "@/components/safety/mental-health-banner";
import { apiClient } from "@/lib/api-client";

const GUIDED_PROMPTS = [
  "What happened today that might matter in court?",
  "How are my children doing? What did we do together?",
  "What communication occurred today and how did I respond?",
  "What am I grateful for today?",
  "What challenges did I face and how did I handle them?",
];

export default function Journal() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isWriting, setIsWriting] = useState(false);
  const [content, setContent] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [entryType, setEntryType] = useState("daily");
  const [promptUsed, setPromptUsed] = useState("");

  const { data: journalsData, isLoading } = useQuery({
    queryKey: ["journals"],
    queryFn: async () => {
      const res = await apiClient.journals.$get();
      return res.json();
    },
  });

  const createEntryMutation = useMutation({
    mutationFn: async (data: {
      content: string;
      date: string;
      entryType: string;
      promptUsed?: string;
    }) => {
      const res = await apiClient.journals.$post({ json: data });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["journals"] });
      setIsWriting(false);
      setContent("");
      setPromptUsed("");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    createEntryMutation.mutate({
      content,
      date,
      entryType,
      promptUsed: promptUsed || undefined,
    });
  };

  const handlePromptClick = (prompt: string) => {
    setPromptUsed(prompt);
    setContent((prev) => (prev ? `${prev}\n\n${prompt}\n\n` : `${prompt}\n\n`));
  };

  const entries = journalsData?.entries || [];

  if (isWriting) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => setIsWriting(false)}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-foreground">New Journal Entry</h1>
              </div>
            </div>

            <MentalHealthBanner />

            <Card>
              <CardHeader>
                <CardTitle>Guided Prompts</CardTitle>
                <CardDescription>Click a prompt to add it to your entry</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {GUIDED_PROMPTS.map((prompt) => (
                    <Button
                      key={prompt}
                      variant="outline"
                      size="sm"
                      onClick={() => handlePromptClick(prompt)}
                    >
                      {prompt}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="entryType">Entry Type</Label>
                  <Select value={entryType} onValueChange={setEntryType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily Journal</SelectItem>
                      <SelectItem value="letter">Letter to Child</SelectItem>
                      <SelectItem value="incident">Incident Record</SelectItem>
                      <SelectItem value="gratitude">Gratitude</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Your Entry</Label>
                <Textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Start writing..."
                  rows={15}
                  className="font-sans"
                />
              </div>

              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => setIsWriting(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1"
                  disabled={!content.trim() || createEntryMutation.isPending}
                >
                  {createEntryMutation.isPending ? "Saving..." : "Save Entry"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

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
                <BookOpen className="h-8 w-8 text-accent" />
                Memoir & Journal
              </h1>
              <p className="text-muted-foreground mt-1">
                Document your journey and experiences
              </p>
            </div>
            <Button onClick={() => setIsWriting(true)}>
              <Plus className="h-4 w-4 mr-2" />
              New Entry
            </Button>
          </div>

          <MentalHealthBanner />

          {isLoading ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">Loading entries...</p>
              </CardContent>
            </Card>
          ) : entries.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="py-12 text-center">
                <BookOpen className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Start Your Journal</h3>
                <p className="text-muted-foreground mb-6">
                  Document your journey, record important events, and write letters to your children.
                </p>
                <Button onClick={() => setIsWriting(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Write First Entry
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {entries.map((entry: any) => (
                <Card
                  key={entry.id}
                  className="cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => navigate(`/journal/${entry.id}`)}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-accent/10 rounded-lg">
                          {entry.entryType === "letter" ? (
                            <Heart className="h-5 w-5 text-accent" />
                          ) : entry.entryType === "incident" ? (
                            <FileText className="h-5 w-5 text-primary" />
                          ) : (
                            <Calendar className="h-5 w-5 text-accent" />
                          )}
                        </div>
                        <div>
                          <CardTitle className="text-lg">
                            {new Date(entry.date).toLocaleDateString("en-AU", {
                              weekday: "long",
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </CardTitle>
                          <CardDescription className="capitalize">
                            {entry.entryType || "daily"}
                          </CardDescription>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {entry.content}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
