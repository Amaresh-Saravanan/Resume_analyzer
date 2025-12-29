import { Target, CheckCircle, TrendingUp, Zap, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Landing = () => {
  const features = [
    {
      icon: CheckCircle,
      title: "AI-Powered Analysis",
      description: "Advanced algorithms analyze your resume against job requirements with precision.",
    },
    {
      icon: Target,
      title: "Match Scoring",
      description: "Get an instant compatibility score showing how well you match the position.",
    },
    {
      icon: TrendingUp,
      title: "Skill Recommendations",
      description: "Receive actionable suggestions to improve your resume and boost your chances.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-foreground flex items-center justify-center">
              <Target className="w-5 h-5 text-background" />
            </div>
            <span className="font-bold text-xl text-foreground">ResuMatch AI</span>
          </Link>
          
          <div className="flex items-center gap-4">
            <Link to="/auth/login">
              <Button variant="ghost" size="sm">Log in</Button>
            </Link>
            <Link to="/auth/signup">
              <Button variant="dark" size="sm">Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-slide-up">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6">
                Match Your Resume to{" "}
                <span className="text-accent">Dream Jobs</span>{" "}
                with AI
              </h1>
              <p className="text-lg text-muted-foreground mb-8 max-w-lg">
                Upload your resume and job description to get instant AI-powered analysis. 
                Discover your match score, identify skill gaps, and get personalized recommendations.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/auth/signup">
                  <Button variant="hero" size="xl" className="gap-3">
                    Analyze Resume Free
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
                <Link to="/auth/login">
                  <Button variant="outline-light" size="xl">
                    View Demo
                  </Button>
                </Link>
              </div>
            </div>
            
            {/* Dashboard Preview */}
            <div className="animate-fade-in" style={{ animationDelay: "0.2s" }}>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-accent/20 to-primary/20 rounded-3xl blur-3xl" />
                <div className="relative bg-card border border-border rounded-3xl p-8 shadow-card">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-3 h-3 rounded-full bg-destructive" />
                    <div className="w-3 h-3 rounded-full bg-warning" />
                    <div className="w-3 h-3 rounded-full bg-success" />
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center">
                        <Zap className="w-6 h-6 text-accent" />
                      </div>
                      <div>
                        <div className="font-semibold text-foreground">Match Score</div>
                        <div className="text-2xl font-bold text-accent">87%</div>
                      </div>
                    </div>
                    <div className="h-3 bg-secondary rounded-full overflow-hidden">
                      <div className="h-full w-[87%] bg-gradient-to-r from-accent to-primary rounded-full" />
                    </div>
                    <div className="grid grid-cols-2 gap-4 pt-4">
                      <div className="p-4 bg-secondary/50 rounded-xl">
                        <div className="text-sm text-muted-foreground">Matched Skills</div>
                        <div className="text-xl font-bold text-foreground">12</div>
                      </div>
                      <div className="p-4 bg-secondary/50 rounded-xl">
                        <div className="text-sm text-muted-foreground">Missing Skills</div>
                        <div className="text-xl font-bold text-foreground">3</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-card">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Everything You Need to Land Your Dream Job
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our AI analyzes every aspect of your resume against job requirements to give you the edge you need.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={feature.title}
                className="group p-8 bg-background rounded-2xl border border-border hover:border-accent/50 transition-all duration-300 hover:shadow-lg animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center mb-6 group-hover:bg-accent/20 transition-colors">
                  <feature.icon className="w-7 h-7 text-accent" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-4xl">
          <div className="relative overflow-hidden rounded-3xl bg-foreground p-12 md:p-16 text-center animate-fade-in">
            <div className="absolute inset-0 bg-gradient-to-br from-accent/20 via-transparent to-primary/20" />
            <div className="relative">
              <h2 className="text-3xl md:text-4xl font-bold text-background mb-4">
                Ready to Optimize Your Resume?
              </h2>
              <p className="text-lg text-background/70 mb-8 max-w-xl mx-auto">
                Join thousands of job seekers who have improved their application success rate with ResuMatch AI.
              </p>
              <Link to="/auth/signup">
                <Button 
                  size="xl" 
                  className="bg-background text-foreground hover:bg-background/90 shadow-xl"
                >
                  Get Started for Free
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-border">
        <div className="container mx-auto max-w-6xl flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-accent" />
            <span className="font-semibold text-foreground">ResuMatch AI</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} ResuMatch AI. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
