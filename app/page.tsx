import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowUpRight, ShieldCheck, Zap, BarChart3, Bell, Users, DollarSign, TrendingUp, Check, Sparkles, MessageSquare, FileText, Calendar } from "lucide-react"
import Link from "next/link"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* <CHANGE> Enhanced Hero Section with stats and visual hierarchy */}
      <section className="pt-32 pb-20 md:pt-48 md:pb-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-primary/5 pointer-events-none" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <Badge variant="secondary" className="mb-6 rounded-full px-4 py-1.5 font-medium border border-border/50">
            <Sparkles className="mr-2 w-3.5 h-3.5 text-accent inline" />
            Trusted by 500+ Educational Institutes
          </Badge>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter max-w-5xl mx-auto leading-[1.05] mb-6 text-balance">
            AI-Powered Fee Management for{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-primary">
              Modern Institutes
            </span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-10 leading-relaxed text-balance">
            Automate reminders, predict revenue, and scale your institute with intelligent multi-tenant infrastructure.
            Join the future of educational fee management.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Button size="lg" className="rounded-full px-8 h-12 text-base font-semibold group" asChild>
              <Link href="/auth/register">
                Start Free Trial
                <ArrowUpRight className="ml-2 w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="rounded-full px-8 h-12 text-base font-semibold bg-transparent"
              asChild
            >
              <Link href="#demo">Watch Demo</Link>
            </Button>
          </div>

          {/* <CHANGE> Platform Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div>
              <div className="text-3xl md:text-4xl font-bold text-foreground mb-1">₹2.5Cr+</div>
              <div className="text-sm text-muted-foreground">Fees Collected</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-foreground mb-1">50K+</div>
              <div className="text-sm text-muted-foreground">Active Students</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-foreground mb-1">98%</div>
              <div className="text-sm text-muted-foreground">Collection Rate</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-foreground mb-1">24/7</div>
              <div className="text-sm text-muted-foreground">AI Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* <CHANGE> Enhanced Feature Grid with icons and better visual hierarchy */}
      <section id="features" className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">Features</Badge>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Everything you need to manage fees</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Powerful features designed for educational institutes of all sizes
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="border-border/50 bg-card hover:shadow-lg transition-all group">
              <CardHeader>
                <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-accent group-hover:text-accent-foreground transition-colors">
                  <Zap className="w-6 h-6 text-accent group-hover:text-accent-foreground" />
                </div>
                <CardTitle className="text-xl">AI Payment Reminders</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  Smart engine analyzes payment patterns and sends personalized WhatsApp/SMS/Email reminders at optimal
                  times.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border/50 bg-card hover:shadow-lg transition-all group">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <ShieldCheck className="w-6 h-6 text-primary group-hover:text-primary-foreground" />
                </div>
                <CardTitle className="text-xl">Multi-Tenant Security</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  Enterprise-grade data isolation for every institute. Your records remain completely private and
                  secure.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border/50 bg-card hover:shadow-lg transition-all group">
              <CardHeader>
                <div className="w-12 h-12 bg-chart-2/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-chart-2 group-hover:text-white transition-colors">
                  <BarChart3 className="w-6 h-6 text-chart-2 group-hover:text-white" />
                </div>
                <CardTitle className="text-xl">Intelligent Reporting</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  Generate instant reports, predict revenue, and identify defaulters using natural language queries.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border/50 bg-card hover:shadow-lg transition-all group">
              <CardHeader>
                <div className="w-12 h-12 bg-chart-4/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-chart-4 group-hover:text-white transition-colors">
                  <Bell className="w-6 h-6 text-chart-4 group-hover:text-white" />
                </div>
                <CardTitle className="text-xl">Automated Notifications</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  Set up bulk reminders, due date alerts, and payment confirmations with zero manual effort.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border/50 bg-card hover:shadow-lg transition-all group">
              <CardHeader>
                <div className="w-12 h-12 bg-chart-5/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-chart-5 group-hover:text-white transition-colors">
                  <Users className="w-6 h-6 text-chart-5 group-hover:text-white" />
                </div>
                <CardTitle className="text-xl">Student Management</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  Manage batches, assign fee structures, track attendance, and maintain comprehensive student records.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border/50 bg-card hover:shadow-lg transition-all group">
              <CardHeader>
                <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-accent group-hover:text-accent-foreground transition-colors">
                  <FileText className="w-6 h-6 text-accent group-hover:text-accent-foreground" />
                </div>
                <CardTitle className="text-xl">Digital Receipts</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  Generate professional PDF receipts automatically for every payment with custom branding.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* <CHANGE> New Pricing Section */}
      <section id="pricing" className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">Pricing</Badge>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Simple, transparent pricing</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Choose the plan that fits your institute size
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="border-border/50 bg-card relative">
              <CardHeader>
                <CardTitle className="text-2xl">Starter</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold">₹999</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <p className="text-sm text-muted-foreground mt-2">Up to 100 students</p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                    <span className="text-sm">Basic fee management</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                    <span className="text-sm">Manual reminders</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                    <span className="text-sm">Standard reports</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                    <span className="text-sm">Email support</span>
                  </li>
                </ul>
                <Button className="w-full mt-6 rounded-full" variant="outline">
                  Get Started
                </Button>
              </CardContent>
            </Card>

            <Card className="border-accent bg-card relative shadow-xl scale-105">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <Badge className="bg-accent text-accent-foreground">Most Popular</Badge>
              </div>
              <CardHeader>
                <CardTitle className="text-2xl">Professional</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold">₹2,999</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <p className="text-sm text-muted-foreground mt-2">Up to 500 students</p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                    <span className="text-sm">AI-powered reminders</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                    <span className="text-sm">WhatsApp/SMS integration</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                    <span className="text-sm">Advanced analytics</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                    <span className="text-sm">Revenue prediction</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                    <span className="text-sm">Priority support</span>
                  </li>
                </ul>
                <Button className="w-full mt-6 rounded-full">Get Started</Button>
              </CardContent>
            </Card>

            <Card className="border-border/50 bg-card relative">
              <CardHeader>
                <CardTitle className="text-2xl">Enterprise</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold">Custom</span>
                </div>
                <p className="text-sm text-muted-foreground mt-2">Unlimited students</p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                    <span className="text-sm">Everything in Professional</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                    <span className="text-sm">Custom AI training</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                    <span className="text-sm">API access</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                    <span className="text-sm">Dedicated account manager</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                    <span className="text-sm">24/7 phone support</span>
                  </li>
                </ul>
                <Button className="w-full mt-6 rounded-full" variant="outline">
                  Contact Sales
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* <CHANGE> New Testimonials Section */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">Testimonials</Badge>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Loved by institutes worldwide</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="border-border/50 bg-card">
              <CardContent className="pt-6">
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  "FeeSmart reduced our collection time by 60%. The AI reminders are incredibly effective and students
                  love the digital receipts."
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center font-bold text-accent">
                    AP
                  </div>
                  <div>
                    <div className="font-semibold text-sm">Amit Patel</div>
                    <div className="text-xs text-muted-foreground">Principal, Greenwood Academy</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50 bg-card">
              <CardContent className="pt-6">
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  "The revenue prediction feature helps us plan our budgets accurately. We've seen a 40% decrease in
                  defaulters since switching."
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                    SK
                  </div>
                  <div>
                    <div className="font-semibold text-sm">Sunita Kapoor</div>
                    <div className="text-xs text-muted-foreground">Director, Global Institute</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50 bg-card">
              <CardContent className="pt-6">
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  "Excellent support and intuitive interface. Our staff adapted to it within a week. The multi-tenant
                  setup is perfect for our group of schools."
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-chart-2/10 flex items-center justify-center font-bold text-chart-2">
                    RJ
                  </div>
                  <div>
                    <div className="font-semibold text-sm">Rajesh Joshi</div>
                    <div className="text-xs text-muted-foreground">Admin, EduTech Group</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* <CHANGE> Enhanced CTA Section with visual elements */}
      <section className="py-24 md:py-32">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-br from-primary via-primary to-accent text-primary-foreground rounded-3xl p-8 md:p-16 text-center max-w-5xl mx-auto relative overflow-hidden">
            <div className="absolute inset-0 bg-grid-white/10 [mask-image:radial-gradient(white,transparent_70%)]" />
            <div className="relative z-10">
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">
                Ready to transform your institute?
              </h2>
              <p className="text-primary-foreground/90 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
                Join 500+ schools and colleges that have streamlined their fee collection with FeeSmart AI.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button
                  size="lg"
                  className="rounded-full px-8 h-12 bg-background text-foreground hover:bg-background/90 font-semibold"
                  asChild
                >
                  <Link href="/auth/register">Start Free Trial</Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-full px-8 h-12 border-primary-foreground/20 hover:bg-primary-foreground/10 text-primary-foreground bg-transparent font-semibold"
                  asChild
                >
                  <Link href="/contact">Contact Sales</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="py-12 border-t">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="font-bold text-lg mb-4">Product</div>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="#features" className="hover:text-foreground transition-colors">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#pricing" className="hover:text-foreground transition-colors">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="#demo" className="hover:text-foreground transition-colors">
                    Demo
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <div className="font-bold text-lg mb-4">Company</div>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/about" className="hover:text-foreground transition-colors">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-foreground transition-colors">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="/careers" className="hover:text-foreground transition-colors">
                    Careers
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <div className="font-bold text-lg mb-4">Resources</div>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/docs" className="hover:text-foreground transition-colors">
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="hover:text-foreground transition-colors">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="/support" className="hover:text-foreground transition-colors">
                    Support
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <div className="font-bold text-lg mb-4">Legal</div>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/privacy" className="hover:text-foreground transition-colors">
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-foreground transition-colors">
                    Terms
                  </Link>
                </li>
                <li>
                  <Link href="/security" className="hover:text-foreground transition-colors">
                    Security
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-8 border-t">
            <div className="text-sm text-muted-foreground">© 2025 FeeSmart Inc. All rights reserved.</div>
            <div className="flex items-center gap-6">
              <Link href="/twitter" className="text-muted-foreground hover:text-foreground transition-colors">
                <span className="sr-only">Twitter</span>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </Link>
              <Link href="/linkedin" className="text-muted-foreground hover:text-foreground transition-colors">
                <span className="sr-only">LinkedIn</span>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
