import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Target,
  Upload,
  TrendingUp,
  LogOut,
  FileText,
  CheckCircle,
  XCircle,
  Sparkles,
  AlertTriangle,
  Download,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface AnalysisResult {
  matchPercentage: number;
  matchedSkills: string[];
  missingSkills: string[];
  strengths: string[];
  improvements: string[];
  summary: string;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<"upload" | "results">("upload");
  const [resumeText, setResumeText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);

  useEffect(() => {
    // Check if user is logged in (mock auth)
    const userData = localStorage.getItem('user');
    if (!userData) {
      navigate("/auth/login");
    } else {
      setUser(JSON.parse(userData));
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    toast({ title: "Logged out", description: "See you next time!" });
    navigate("/");
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== "text/plain") {
        toast({
          title: "Invalid file type",
          description: "Please upload a .txt file",
          variant: "destructive",
        });
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        setResumeText(event.target?.result as string);
        toast({ title: "File uploaded", description: "Resume text loaded successfully" });
      };
      reader.readAsText(file);
    }
  };

  const handleAnalyze = async () => {
    if (!resumeText.trim() || !jobDescription.trim()) {
      toast({
        title: "Missing information",
        description: "Please provide both resume text and job description",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);

    try {
      const { data, error } = await supabase.functions.invoke('analyze-resume', {
        body: { resumeText, jobDescription }
      });

      if (error) {
        console.error("Analysis error:", error);
        throw error;
      }

      if (data?.success && data?.analysis) {
        setAnalysis(data.analysis);
        setActiveTab("results");
        toast({ 
          title: "Analysis complete!", 
          description: data.warning || "View your results below" 
        });
      } else {
        throw new Error("Invalid response from analysis");
      }
    } catch (error) {
      console.error("Failed to analyze:", error);
      toast({
        title: "Analysis failed",
        description: "Please try again. Make sure your inputs are valid.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-success";
    if (score >= 60) return "text-info";
    return "text-destructive";
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return "bg-success";
    if (score >= 60) return "bg-info";
    return "bg-destructive";
  };

  if (!user) return null;

  const displayEmail = user.email ?? "";
  const displayName = user.name ?? user.email?.split("@")[0] ?? "User";
  const displayInitial = displayName.charAt(0).toUpperCase();

  return (
    <div className="min-h-screen bg-background flex dark">
      {/* Sidebar */}
      <aside className="w-64 bg-sidebar-bg border-r border-border flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center">
              <Target className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg text-foreground">ResuMatch AI</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          <button
            onClick={() => setActiveTab("upload")}
            className={`sidebar-link w-full ${activeTab === "upload" ? "active" : ""}`}
          >
            <Upload className="w-5 h-5" />
            <span>Upload & Analyze</span>
          </button>
          <button
            onClick={() => {
              if (analysis) {
                setActiveTab("results");
              } else {
                toast({
                  title: "No analysis yet",
                  description: "Please analyze a resume first",
                });
              }
            }}
            className={`sidebar-link w-full ${activeTab === "results" ? "active" : ""} ${
              !analysis ? "opacity-50" : ""
            }`}
          >
            <TrendingUp className="w-5 h-5" />
            <span>Results</span>
          </button>
        </nav>

        {/* User section */}
        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
              <span className="text-sm font-semibold text-primary">
                {displayInitial}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{displayName}</p>
              <p className="text-xs text-muted-foreground truncate">{displayEmail}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start text-muted-foreground hover:text-destructive"
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Log out
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-auto">
        {activeTab === "upload" ? (
          <div className="max-w-5xl mx-auto animate-fade-in">
            <h1 className="text-3xl font-bold text-foreground mb-2">Analyze Your Resume</h1>
            <p className="text-muted-foreground mb-8">
              Upload your resume and job description to get AI-powered analysis
            </p>

            <div className="grid lg:grid-cols-2 gap-6">
              {/* Resume Section */}
              <div className="glass-card p-6">
                <div className="flex items-center gap-2 mb-4">
                  <FileText className="w-5 h-5 text-primary" />
                  <h2 className="text-lg font-semibold text-foreground">Resume Text</h2>
                </div>

                {/* File Upload */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".txt"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full p-6 border-2 border-dashed border-border rounded-xl hover:border-primary/50 transition-colors mb-4 group"
                >
                  <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground group-hover:text-primary transition-colors" />
                  <p className="text-sm text-muted-foreground">
                    Click to upload a <span className="text-primary">.txt file</span>
                  </p>
                </button>

                <textarea
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                  placeholder="JOHN DOE
Software Engineer

SKILLS
JavaScript, React, TypeScript, Node.js

EXPERIENCE
Senior Developer at TechCorp (2020-Present)
- Led team of 5 developers
- Increased performance by 40%"
                  className="w-full h-64 p-4 bg-input border border-border rounded-xl text-foreground placeholder:text-muted-foreground/50 font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
                <p className="text-xs text-muted-foreground mt-2">
                  For best results, paste your resume as plain text
                </p>
              </div>

              {/* Job Description Section */}
              <div className="glass-card p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="w-5 h-5 text-primary" />
                  <h2 className="text-lg font-semibold text-foreground">Job Description</h2>
                </div>

                <textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="SENIOR SOFTWARE ENGINEER

REQUIREMENTS:
- 5+ years of experience
- Strong JavaScript/TypeScript skills
- Experience with React and Node.js
- Cloud platform experience (AWS/GCP)

RESPONSIBILITIES:
- Design and implement features
- Mentor junior developers
- Participate in code reviews"
                  className="w-full h-80 p-4 bg-input border border-border rounded-xl text-foreground placeholder:text-muted-foreground/50 font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
                <p className="text-xs text-muted-foreground mt-2">
                  Paste the complete job posting
                </p>
              </div>
            </div>

            {/* Analyze Button */}
            <Button
              variant="gradient"
              size="xl"
              className="w-full mt-6"
              onClick={handleAnalyze}
              disabled={isAnalyzing}
            >
              {isAnalyzing ? (
                <>
                  <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <TrendingUp className="w-5 h-5" />
                  Analyze Match
                </>
              )}
            </Button>
          </div>
        ) : analysis ? (
          <div className="max-w-5xl mx-auto animate-fade-in">
            {/* Summary */}
            <div className="glass-card p-6 mb-6">
              <p className="text-muted-foreground">{analysis.summary}</p>
            </div>

            {/* Score */}
            <div className="glass-card p-8 mb-6 text-center">
              <h2 className="text-lg font-medium text-muted-foreground mb-2">Match Score</h2>
              <div className={`text-7xl font-bold ${getScoreColor(analysis.matchPercentage)} mb-4`}>
                {analysis.matchPercentage}%
              </div>
              <div className="w-full h-4 bg-secondary rounded-full overflow-hidden">
                <div
                  className={`h-full ${getScoreBg(analysis.matchPercentage)} rounded-full transition-all duration-1000`}
                  style={{ width: `${analysis.matchPercentage}%` }}
                />
              </div>
            </div>

            {/* Skills Grid */}
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              {/* Matched Skills */}
              <div className="glass-card p-6">
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle className="w-5 h-5 text-success" />
                  <h3 className="text-lg font-semibold text-foreground">Matched Skills</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {analysis.matchedSkills.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1 bg-success/10 text-success rounded-full text-sm font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Missing Skills */}
              <div className="glass-card p-6">
                <div className="flex items-center gap-2 mb-4">
                  <XCircle className="w-5 h-5 text-destructive" />
                  <h3 className="text-lg font-semibold text-foreground">Missing Skills</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {analysis.missingSkills.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1 bg-destructive/10 text-destructive rounded-full text-sm font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Strengths */}
              <div className="glass-card p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="w-5 h-5 text-primary" />
                  <h3 className="text-lg font-semibold text-foreground">Key Strengths</h3>
                </div>
                <ul className="space-y-2">
                  {analysis.strengths.map((strength, i) => (
                    <li key={i} className="flex items-start gap-2 text-muted-foreground">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                      {strength}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Improvements */}
              <div className="glass-card p-6">
                <div className="flex items-center gap-2 mb-4">
                  <AlertTriangle className="w-5 h-5 text-warning" />
                  <h3 className="text-lg font-semibold text-foreground">Suggested Improvements</h3>
                </div>
                <ul className="space-y-2">
                  {analysis.improvements.map((improvement, i) => (
                    <li key={i} className="flex items-start gap-2 text-muted-foreground">
                      <div className="w-1.5 h-1.5 rounded-full bg-warning mt-2 shrink-0" />
                      {improvement}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <Button
                variant="outline"
                size="lg"
                className="flex-1"
                onClick={() => {
                  setActiveTab("upload");
                  setAnalysis(null);
                  setResumeText("");
                  setJobDescription("");
                }}
              >
                <RefreshCw className="w-4 h-4" />
                New Analysis
              </Button>
              <Button
                variant="gradient"
                size="lg"
                className="flex-1"
                onClick={() => window.print()}
              >
                <Download className="w-4 h-4" />
                Export Results
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center animate-fade-in">
            <div className="w-20 h-20 rounded-2xl bg-secondary flex items-center justify-center mb-6">
              <FileText className="w-10 h-10 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">No Analysis Yet</h2>
            <p className="text-muted-foreground mb-6">
              Upload your resume and job description to get started
            </p>
            <Button variant="gradient" onClick={() => setActiveTab("upload")}>
              <Upload className="w-4 h-4" />
              Go to Upload
            </Button>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
