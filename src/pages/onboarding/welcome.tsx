import { useNavigate } from "react-router-dom";
import { Shield, Heart, Scale } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function Welcome() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full p-8 space-y-8">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <img
              src="/logos/shield-father.png"
              alt="DadStrong Logo"
              className="h-24 w-auto"
            />
          </div>
          <h1 className="text-3xl font-bold text-foreground">
            Welcome to DadStrong
          </h1>
          <p className="text-xl text-accent font-medium">
            You're not alone anymore.
          </p>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Navigate family law with confidence, dignity, and the support you deserve.
            We're here to help you stand strong through every step.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="text-center space-y-2 p-4">
            <div className="flex justify-center">
              <div className="p-3 bg-primary/10 rounded-full">
                <Scale className="h-6 w-6 text-primary" />
              </div>
            </div>
            <h3 className="font-medium text-sm">Legal Guidance</h3>
            <p className="text-xs text-muted-foreground">
              AI-powered communication tools for court-safe responses
            </p>
          </div>

          <div className="text-center space-y-2 p-4">
            <div className="flex justify-center">
              <div className="p-3 bg-accent/10 rounded-full">
                <Heart className="h-6 w-6 text-accent" />
              </div>
            </div>
            <h3 className="font-medium text-sm">Emotional Support</h3>
            <p className="text-xs text-muted-foreground">
              Journal tools and mental health resources
            </p>
          </div>

          <div className="text-center space-y-2 p-4">
            <div className="flex justify-center">
              <div className="p-3 bg-secondary/10 rounded-full">
                <Shield className="h-6 w-6 text-secondary" />
              </div>
            </div>
            <h3 className="font-medium text-sm">Your Safety</h3>
            <p className="text-xs text-muted-foreground">
              Private, secure, trauma-informed design
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <Button
            size="lg"
            className="w-full"
            onClick={() => navigate("/onboarding/disclaimer")}
          >
            Get Started
          </Button>
          <p className="text-center text-xs text-muted-foreground">
            Already have an account?{" "}
            <button
              onClick={() => navigate("/signin")}
              className="text-primary hover:underline"
            >
              Sign in
            </button>
          </p>
        </div>
      </Card>
    </div>
  );
}
