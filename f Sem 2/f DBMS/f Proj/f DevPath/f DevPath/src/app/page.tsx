"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform, useInView, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Rocket, BookOpen, Users, Code2, Trophy, Zap, Target, 
  ChevronRight, Play, CheckCircle2, Lock, Clock,
  ArrowRight, Menu, X, Github, Brain, Layers, Kanban,
  MessageSquare, FileCode, Award, GraduationCap,
  ChevronDown, Moon, Sun, Sparkles, Send, MapPin,
  Building2, Briefcase, Globe, TrendingUp
} from "lucide-react";

// Indian Environment Configuration
const INDIA_CONFIG = {
  currency: "INR",
  currencySymbol: "₹",
  locale: "en-IN",
  timezone: "Asia/Kolkata",
  countryCode: "+91",
  gstRate: 18,
  state: "Karnataka",
  city: "Bengaluru",
  university: "RV University, Pattengere, Bengaluru",
  // Indian tech industry stats
  stats: {
    developers: "5.8M+",
    startups: "100,000+",
    itExports: "$250B+",
    unicorns: "100+"
  }
};

// Format currency in INR
function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}

// Format number in Indian locale
function formatIndianNumber(num: number): string {
  return new Intl.NumberFormat('en-IN').format(num);
}

// Animation Variants
const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
  }
};

const cardHover = {
  rest: { scale: 1, y: 0 },
  hover: { 
    scale: 1.02, 
    y: -8,
    transition: { duration: 0.3, ease: "easeOut" }
  }
};

// Types
interface Course {
  id: string;
  title: string;
  description: string;
  techStack: string[];
  difficulty: string;
  duration: number;
  lessons: number;
  enrolled: number;
}

interface Project {
  id: string;
  name: string;
  description: string;
  status: string;
  progress: number;
  tasks: KanbanTask[];
}

interface KanbanTask {
  id: string;
  title: string;
  status: 'locked' | 'todo' | 'in_progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  lessonGate?: string;
}

interface Team {
  id: string;
  name: string;
  members: TeamMember[];
  project: string;
}

interface TeamMember {
  id: string;
  name: string;
  role: string;
}

// Sample data with Indian context
const sampleCourses: Course[] = [
  {
    id: "1",
    title: "Full-Stack Web Development",
    description: "Build production-ready web applications from scratch. Learn React, Node.js, and PostgreSQL while creating real projects for the Indian tech ecosystem.",
    techStack: ["React", "Node.js", "PostgreSQL", "TypeScript"],
    difficulty: "intermediate",
    duration: 40,
    lessons: 24,
    enrolled: 2847,
  },
  {
    id: "2",
    title: "AI/ML Engineering Bootcamp",
    description: "Master machine learning fundamentals and deploy AI models. Build intelligent applications with Python and TensorFlow.",
    techStack: ["Python", "TensorFlow", "PyTorch", "FastAPI"],
    difficulty: "advanced",
    duration: 60,
    lessons: 36,
    enrolled: 1923,
  },
  {
    id: "3",
    title: "Mobile App Development",
    description: "Create cross-platform mobile apps with React Native. Ship to both iOS and Android stores - perfect for Indian startup ecosystem.",
    techStack: ["React Native", "Expo", "Firebase", "Redux"],
    difficulty: "beginner",
    duration: 30,
    lessons: 18,
    enrolled: 3412,
  },
  {
    id: "4",
    title: "DevOps & Cloud Architecture",
    description: "Master CI/CD pipelines, containerization, and cloud deployment. Learn to build scalable infrastructure for enterprises.",
    techStack: ["Docker", "Kubernetes", "AWS", "Terraform"],
    difficulty: "advanced",
    duration: 45,
    lessons: 28,
    enrolled: 1567,
  },
  {
    id: "5",
    title: "Fintech Application Development",
    description: "Build secure payment systems and banking applications. Learn UPI integration, RBI compliance, and financial security.",
    techStack: ["Node.js", "React", "UPI APIs", "PostgreSQL"],
    difficulty: "advanced",
    duration: 35,
    lessons: 22,
    enrolled: 987,
  },
  {
    id: "6",
    title: "Python for Data Science",
    description: "Analyze data and build visualizations. Master pandas, NumPy, and machine learning basics - essential for analytics roles.",
    techStack: ["Python", "Pandas", "NumPy", "Matplotlib"],
    difficulty: "beginner",
    duration: 25,
    lessons: 16,
    enrolled: 4521,
  }
];

const sampleProjects: Project[] = [
  {
    id: "1",
    name: "E-Commerce Platform",
    description: "A full-featured online store with UPI payment integration",
    status: "in_progress",
    progress: 65,
    tasks: [
      { id: "t1", title: "Setup Project Structure", status: "done", priority: "high" },
      { id: "t2", title: "User Authentication", status: "done", priority: "high" },
      { id: "t3", title: "Product Catalog", status: "in_progress", priority: "high", lessonGate: "Lesson 5: API Design" },
      { id: "t4", title: "UPI Payment Gateway", status: "locked", priority: "medium", lessonGate: "Lesson 8: Payment Integration" },
      { id: "t5", title: "GST Invoice Generation", status: "locked", priority: "high", lessonGate: "Lesson 12: Compliance" },
      { id: "t6", title: "Order Management", status: "locked", priority: "medium" }
    ]
  },
  {
    id: "2",
    name: "Task Management App",
    description: "Collaborative project management tool for remote teams",
    status: "planning",
    progress: 20,
    tasks: [
      { id: "t7", title: "Database Design", status: "done", priority: "high" },
      { id: "t8", title: "API Development", status: "in_progress", priority: "high", lessonGate: "Lesson 3: REST APIs" },
      { id: "t9", title: "Frontend UI", status: "locked", priority: "medium", lessonGate: "Lesson 6: React Components" },
      { id: "t10", title: "Real-time Updates", status: "locked", priority: "medium", lessonGate: "Lesson 10: WebSockets" }
    ]
  }
];

const sampleTeam: Team = {
  id: "1",
  name: "Code Crafters",
  members: [
    { id: "u1", name: "Arjun Sharma", role: "Full-Stack Lead" },
    { id: "u2", name: "Priya Patel", role: "Frontend Dev" },
    { id: "u3", name: "Rahul Kumar", role: "Backend Dev" },
    { id: "u4", name: "Ananya Singh", role: "DevOps" }
  ],
  project: "E-Commerce Platform"
};

// Indian Testimonials
const testimonials = [
  {
    name: "Vikram Reddy",
    role: "Software Engineer at Infosys",
    location: "Hyderabad",
    content: "DevPath helped me transition from a support role to a full-stack developer. The project-based approach made all the difference.",
    avatar: "VR"
  },
  {
    name: "Sneha Gupta",
    role: "Frontend Developer at Zomato",
    location: "Gurugram",
    content: "The AI-powered code reviews are incredible. It's like having a senior developer guiding you 24/7.",
    avatar: "SG"
  },
  {
    name: "Aditya Joshi",
    role: "Founder, TechStartup Bangalore",
    location: "Bengaluru",
    content: "We hired 3 developers who learned through DevPath. Their practical skills were far superior to traditional graduates.",
    avatar: "AJ"
  }
];

// Animated Counter Component
function AnimatedCounter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      const duration = 2000;
      const steps = 60;
      const increment = value / steps;
      let current = 0;
      const timer = setInterval(() => {
        current += increment;
        if (current >= value) {
          setCount(value);
          clearInterval(timer);
        } else {
          setCount(Math.floor(current));
        }
      }, duration / steps);
      return () => clearInterval(timer);
    }
  }, [isInView, value]);

  return <span ref={ref}>{formatIndianNumber(count)}{suffix}</span>;
}

// Theme Toggle Component
function ThemeToggle() {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return document.documentElement.classList.contains('dark');
    }
    return false;
  });

  const toggleTheme = () => {
    setIsDark((prev: boolean) => {
      const newIsDark = !prev;
      document.documentElement.classList.toggle('dark', newIsDark);
      return newIsDark;
    });
  };

  return (
    <motion.button
      onClick={toggleTheme}
      className="relative w-10 h-10 rounded-lg bg-surface border border-border flex items-center justify-center hover:bg-muted transition-colors"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <AnimatePresence mode="wait">
        {isDark ? (
          <motion.div
            key="sun"
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 90, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Sun className="w-5 h-5 text-amber-500" />
          </motion.div>
        ) : (
          <motion.div
            key="moon"
            initial={{ rotate: 90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: -90, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Moon className="w-5 h-5 text-primary" />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
}

// Navigation Component
function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled 
          ? 'bg-background/95 backdrop-blur-xl shadow-lg border-b border-border' 
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <motion.div 
            className="flex items-center gap-3"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div 
              className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center relative overflow-hidden"
              whileHover={{ rotate: 180 }}
              transition={{ duration: 0.5 }}
            >
              <Rocket className="w-5 h-5 text-white" />
            </motion.div>
            <span className="text-xl font-bold tracking-tight">DevPath</span>
          </motion.div>
          
          <div className="hidden md:flex items-center gap-8">
            {['Courses', 'Projects', 'Teams', 'Pricing'].map((item, i) => (
              <motion.a 
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors relative group"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 + 0.3 }}
              >
                {item}
                <motion.span 
                  className="absolute -bottom-1 left-0 h-0.5 bg-primary"
                  initial={{ width: 0 }}
                  whileHover={{ width: '100%' }}
                  transition={{ duration: 0.3 }}
                />
              </motion.a>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <ThemeToggle />
            {isLoggedIn ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <Button variant="ghost" size="sm" className="gap-2">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <span>John Doe</span>
                </Button>
              </motion.div>
            ) : (
              <>
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <Button variant="ghost" onClick={() => { setAuthMode('login'); setShowAuthDialog(true); }}>
                    Sign In
                  </Button>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button 
                    className="bg-primary hover:bg-primary/90 text-white"
                    onClick={() => { setAuthMode('register'); setShowAuthDialog(true); }}
                  >
                    Get Started
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </motion.div>
              </>
            )}
          </div>

          <motion.button 
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            whileTap={{ scale: 0.9 }}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-background/95 backdrop-blur-xl border-b border-border"
          >
            <div className="p-4 space-y-4">
              {['Courses', 'Projects', 'Teams', 'Pricing'].map((item, i) => (
                <motion.a 
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="block text-sm font-medium"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item}
                </motion.a>
              ))}
              <Separator />
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <Button variant="outline" className="w-full">Sign In</Button>
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <Button className="w-full">Get Started</Button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Auth Dialog */}
      <Dialog open={showAuthDialog} onOpenChange={setShowAuthDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{authMode === 'login' ? 'Welcome Back' : 'Create Your Account'}</DialogTitle>
            <DialogDescription>
              {authMode === 'login' 
                ? 'Sign in to continue your learning journey' 
                : 'Join DevPath and start building real projects'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {authMode === 'register' && (
              <motion.div 
                className="grid grid-cols-2 gap-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="grid gap-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" placeholder="Arjun" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" placeholder="Sharma" />
                </div>
              </motion.div>
            )}
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="arjun@example.com" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phone">Phone Number</Label>
              <div className="flex gap-2">
                <Select defaultValue="+91">
                  <SelectTrigger className="w-24">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="+91">+91</SelectItem>
                  </SelectContent>
                </Select>
                <Input id="phone" type="tel" placeholder="9876543210" className="flex-1" />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" />
            </div>
            {authMode === 'register' && (
              <div className="grid gap-2">
                <Label htmlFor="tier">Subscription Tier</Label>
                <Select defaultValue="starter">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="starter">Starter (Free)</SelectItem>
                    <SelectItem value="pro">Pro ({formatINR(529)}/month)</SelectItem>
                    <SelectItem value="team">Team ({formatINR(1249)}/month)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button 
              variant="ghost" 
              className="w-full"
              onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
            >
              {authMode === 'login' ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
            </Button>
            <Button className="w-full" onClick={() => { setIsLoggedIn(true); setShowAuthDialog(false); }}>
              {authMode === 'login' ? 'Sign In' : 'Create Account'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.nav>
  );
}

// Hero Section
function HeroSection() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section ref={containerRef} className="relative pt-32 pb-20 px-4 overflow-hidden min-h-screen flex items-center">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <motion.div 
          className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50/50 to-slate-50 dark:from-gray-950 dark:via-blue-950/20 dark:to-slate-950"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        />
        
        {/* Floating Orbs */}
        <motion.div 
          className="absolute top-20 right-20 w-96 h-96 rounded-full bg-gradient-to-br from-blue-200/40 to-indigo-200/40 dark:from-blue-600/10 dark:to-indigo-600/10 blur-3xl"
          animate={{ 
            x: [0, 50, 0],
            y: [0, 30, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute bottom-20 left-20 w-80 h-80 rounded-full bg-gradient-to-br from-indigo-200/40 to-purple-200/40 dark:from-indigo-600/10 dark:to-purple-600/10 blur-3xl"
          animate={{ 
            x: [0, -30, 0],
            y: [0, 50, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(37,99,235,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(37,99,235,0.03)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(59,130,246,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.05)_1px,transparent_1px)] bg-[size:60px_60px]" />
      </div>

      <motion.div 
        style={{ y, opacity }}
        className="relative max-w-7xl mx-auto"
      >
        <div className="text-center max-w-4xl mx-auto">
          {/* Location Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-center gap-2 mb-4"
          >
            <Badge variant="outline" className="gap-1 text-xs">
              <MapPin className="w-3 h-3" />
              Made in India
            </Badge>
            <Badge variant="outline" className="gap-1 text-xs">
              <Globe className="w-3 h-3" />
              For Indian Developers
            </Badge>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge variant="secondary" className="mb-6 px-4 py-2 text-sm font-medium">
              <Sparkles className="w-4 h-4 mr-2 text-primary" />
              AI-Augmented Learning Platform
            </Badge>
          </motion.div>
          
          <motion.h1 
            className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight mb-6"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            Learn by Building.
            <motion.span 
              className="block text-transparent bg-clip-text bg-gradient-to-r from-primary via-indigo-500 to-blue-600"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              Ship Something Real.
            </motion.span>
          </motion.h1>
          
          <motion.p 
            className="text-lg sm:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            DevPath unifies structured programming education with professional product development. 
            Every lesson maps to a concrete project deliverable.
          </motion.p>
          
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button size="lg" className="gap-2 text-lg px-8 py-6 bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/25">
                <Rocket className="w-5 h-5" />
                Start Learning Free
              </Button>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button size="lg" variant="outline" className="gap-2 text-lg px-8 py-6 border-2">
                <Play className="w-5 h-5" />
                Watch Demo
              </Button>
            </motion.div>
          </motion.div>
        </div>

        {/* India Stats */}
        <motion.div 
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          {[
            { value: 15000, suffix: "+", label: "Active Learners", icon: Users, sublabel: "Across India" },
            { value: 200, suffix: "+", label: "Project Templates", icon: Layers, sublabel: "Industry Ready" },
            { value: 95, suffix: "%", label: "Completion Rate", icon: Trophy, sublabel: "Success Stories" },
            { value: 5000, suffix: "+", label: "Projects Shipped", icon: Rocket, sublabel: "Portfolio Ready" }
          ].map((stat, i) => (
            <motion.div
              key={i}
              variants={fadeInUp}
              className="text-center"
            >
              <motion.div 
                className="w-12 h-12 mx-auto mb-4 rounded-xl bg-primary/10 flex items-center justify-center"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                <stat.icon className="w-6 h-6 text-primary" />
              </motion.div>
              <div className="text-3xl sm:text-4xl font-bold mb-1">
                <AnimatedCounter value={stat.value} suffix={stat.suffix} />
              </div>
              <p className="text-sm font-medium">{stat.label}</p>
              <p className="text-xs text-muted-foreground">{stat.sublabel}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Feature highlights */}
        <motion.div 
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-4"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          {[
            { icon: Brain, title: "AI Learning Paths", desc: "Personalized curriculum" },
            { icon: Kanban, title: "Skill-Gated Tasks", desc: "Learn before you build" },
            { icon: Users, title: "Team Workspaces", desc: "Collaborate in teams" },
            { icon: Trophy, title: "Ship It Milestones", desc: "Portfolio-ready projects" }
          ].map((feature, i) => (
            <motion.div
              key={i}
              variants={scaleIn}
              whileHover={{ y: -5, scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="bg-surface/80 backdrop-blur-sm border-border h-full cursor-pointer hover:shadow-lg transition-shadow">
                <CardContent className="p-6 text-center">
                  <motion.div 
                    className="w-12 h-12 mx-auto mb-4 rounded-xl bg-primary/10 flex items-center justify-center"
                    whileHover={{ scale: 1.1, rotate: 10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <feature.icon className="w-6 h-6 text-primary" />
                  </motion.div>
                  <h3 className="font-semibold mb-1">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.desc}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div 
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="flex flex-col items-center gap-2 text-muted-foreground"
        >
          <span className="text-xs">Scroll to explore</span>
          <ChevronDown className="w-5 h-5" />
        </motion.div>
      </motion.div>
    </section>
  );
}

// Course Catalog Section
function CourseCatalog() {
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [enrolledCourses, setEnrolledCourses] = useState<string[]>([]);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const handleEnroll = (courseId: string) => {
    if (!enrolledCourses.includes(courseId)) {
      setEnrolledCourses([...enrolledCourses, courseId]);
    }
    setSelectedCourse(null);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      case 'intermediate': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400';
      case 'advanced': return 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400';
      default: return '';
    }
  };

  return (
    <section id="courses" ref={ref} className="py-24 px-4 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          className="text-center mb-16"
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={staggerContainer}
        >
          <motion.div variants={fadeInUp}>
            <Badge variant="outline" className="mb-4 text-sm">
              <BookOpen className="w-4 h-4 mr-2 text-primary" />
              Course Catalog
            </Badge>
          </motion.div>
          <motion.h2 variants={fadeInUp} className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            Project-Driven Learning Paths
          </motion.h2>
          <motion.p variants={fadeInUp} className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Every course is designed around building real projects. Learn the skills you need, 
            apply them immediately, and ship products to your portfolio.
          </motion.p>
        </motion.div>

        <motion.div 
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={staggerContainer}
        >
          {sampleCourses.map((course, i) => (
            <motion.div
              key={course.id}
              variants={fadeInUp}
              whileHover="hover"
              initial="rest"
              animate="rest"
            >
              <motion.div
                variants={cardHover}
                className="h-full"
              >
                <Card className="group overflow-hidden h-full border-border hover:shadow-xl transition-all duration-500">
                  <motion.div 
                    className="h-40 bg-gradient-to-br from-primary via-indigo-500 to-blue-600 relative overflow-hidden"
                    whileHover="hover"
                  >
                    <motion.div 
                      className="absolute inset-0 bg-black/20"
                      initial={{ opacity: 0.2 }}
                      whileHover={{ opacity: 0.1 }}
                    />
                    <motion.div 
                      className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.1)_50%,transparent_75%)]"
                      initial={{ x: '-100%' }}
                      whileHover={{ x: '100%' }}
                      transition={{ duration: 0.6 }}
                    />
                    <div className="absolute bottom-4 left-4 right-4">
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                      >
                        <Badge className={getDifficultyColor(course.difficulty)}>
                          {course.difficulty.charAt(0).toUpperCase() + course.difficulty.slice(1)}
                        </Badge>
                      </motion.div>
                    </div>
                  </motion.div>
                  <CardHeader>
                    <CardTitle className="group-hover:text-primary transition-colors duration-300">
                      {course.title}
                    </CardTitle>
                    <CardDescription className="line-clamp-2">
                      {course.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {course.techStack.map((tech) => (
                        <Badge key={tech} variant="secondary" className="text-xs font-medium">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {course.duration}h
                      </span>
                      <span className="flex items-center gap-1">
                        <BookOpen className="w-4 h-4" />
                        {course.lessons} lessons
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {formatIndianNumber(course.enrolled)}
                      </span>
                    </div>
                  </CardContent>
                  <CardFooter>
                    {enrolledCourses.includes(course.id) ? (
                      <Button className="w-full bg-primary hover:bg-primary/90 text-white">
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        Continue Learning
                      </Button>
                    ) : (
                      <motion.div 
                        className="w-full"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button className="w-full" onClick={() => setSelectedCourse(course)}>
                          View Course
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </motion.div>
                    )}
                  </CardFooter>
                </Card>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>

        {/* Course Detail Dialog */}
        <AnimatePresence>
          {selectedCourse && (
            <Dialog open={!!selectedCourse} onOpenChange={() => setSelectedCourse(null)}>
              <DialogContent className="sm:max-w-2xl">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                >
                  <DialogHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <DialogTitle className="text-2xl">{selectedCourse.title}</DialogTitle>
                        <DialogDescription className="mt-2">
                          {selectedCourse.description}
                        </DialogDescription>
                      </div>
                      <Badge className={getDifficultyColor(selectedCourse.difficulty)}>
                        {selectedCourse.difficulty}
                      </Badge>
                    </div>
                  </DialogHeader>
                  <div className="grid gap-6 py-4">
                    <div className="flex flex-wrap gap-2">
                      {selectedCourse.techStack.map((tech) => (
                        <Badge key={tech} variant="secondary">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      {[
                        { icon: Clock, label: "Duration", value: `${selectedCourse.duration}h` },
                        { icon: BookOpen, label: "Lessons", value: selectedCourse.lessons },
                        { icon: Users, label: "Enrolled", value: formatIndianNumber(selectedCourse.enrolled) }
                      ].map((item, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.1 }}
                        >
                          <Card>
                            <CardContent className="p-4 text-center">
                              <item.icon className="w-6 h-6 mx-auto mb-2 text-primary" />
                              <p className="font-semibold">{item.value}</p>
                              <p className="text-sm text-muted-foreground">{item.label}</p>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                    <div>
                      <h4 className="font-semibold mb-3">What you will build</h4>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        {[
                          "Production-ready web application",
                          "Deployed project with live demo",
                          "Portfolio-ready case study"
                        ].map((item, i) => (
                          <motion.li 
                            key={i}
                            className="flex items-center gap-2"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                          >
                            <CheckCircle2 className="w-4 h-4 text-primary" />
                            {item}
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setSelectedCourse(null)}>
                      Cancel
                    </Button>
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button onClick={() => handleEnroll(selectedCourse.id)} className="bg-primary hover:bg-primary/90 text-white">
                        Enroll Now - Free
                      </Button>
                    </motion.div>
                  </DialogFooter>
                </motion.div>
              </DialogContent>
            </Dialog>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

// Project Dashboard with Kanban
function ProjectDashboard() {
  const [selectedProject, setSelectedProject] = useState<Project>(sampleProjects[0]);
  const [tasks, setTasks] = useState<KanbanTask[]>(sampleProjects[0].tasks);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData('taskId', taskId);
  };

  const handleDrop = (e: React.DragEvent, newStatus: KanbanTask['status']) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    setTasks(tasks.map(task => 
      task.id === taskId && task.status !== 'locked' 
        ? { ...task, status: newStatus } 
        : task
    ));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-l-rose-500';
      case 'medium': return 'border-l-amber-500';
      case 'low': return 'border-l-blue-500';
      default: return '';
    }
  };

  const columns = [
    { id: 'locked', title: 'Locked', icon: Lock, color: 'text-gray-400' },
    { id: 'todo', title: 'To Do', icon: Target, color: 'text-blue-500' },
    { id: 'in_progress', title: 'In Progress', icon: Zap, color: 'text-amber-500' },
    { id: 'done', title: 'Done', icon: CheckCircle2, color: 'text-primary' }
  ];

  return (
    <section id="projects" ref={ref} className="py-24 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          className="text-center mb-16"
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={staggerContainer}
        >
          <motion.div variants={fadeInUp}>
            <Badge variant="outline" className="mb-4 text-sm">
              <Kanban className="w-4 h-4 mr-2 text-primary" />
              Project Workspace
            </Badge>
          </motion.div>
          <motion.h2 variants={fadeInUp} className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            Skill-Gated Kanban Board
          </motion.h2>
          <motion.p variants={fadeInUp} className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Tasks are locked until you complete prerequisite lessons. This ensures you have 
            the skills needed before tackling each challenge.
          </motion.p>
        </motion.div>

        {/* Project Selector */}
        <motion.div 
          className="flex gap-4 mb-8 overflow-x-auto pb-2"
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={staggerContainer}
        >
          {sampleProjects.map((project) => (
            <motion.div
              key={project.id}
              variants={fadeInUp}
              whileHover={{ y: -5 }}
              className="min-w-[280px]"
            >
              <Card 
                className={`cursor-pointer transition-all duration-300 ${
                  selectedProject.id === project.id 
                    ? 'ring-2 ring-primary shadow-xl' 
                    : 'hover:shadow-lg'
                }`}
                onClick={() => {
                  setSelectedProject(project);
                  setTasks(project.tasks);
                }}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">{project.name}</h3>
                    <Badge variant={project.status === 'in_progress' ? 'default' : 'secondary'} 
                      className={project.status === 'in_progress' ? 'bg-primary text-white' : ''}>
                      {project.status.replace('_', ' ')}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{project.description}</p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{project.progress}%</span>
                    </div>
                    <Progress value={project.progress} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Kanban Board */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="overflow-hidden shadow-xl">
            <CardContent className="p-0">
              <div className="grid grid-cols-1 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-border">
                {columns.map((column, colIndex) => (
                  <motion.div
                    key={column.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ delay: colIndex * 0.1 + 0.3 }}
                    className="p-4 min-h-[400px] bg-muted/30"
                    onDrop={(e) => handleDrop(e, column.id as KanbanTask['status'])}
                    onDragOver={handleDragOver}
                  >
                    <div className="flex items-center gap-2 mb-4">
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 10 }}
                        transition={{ duration: 0.2 }}
                      >
                        <column.icon className={`w-5 h-5 ${column.color}`} />
                      </motion.div>
                      <h3 className="font-semibold">{column.title}</h3>
                      <Badge variant="secondary" className="ml-auto">
                        {tasks.filter(t => t.status === column.id).length}
                      </Badge>
                    </div>
                    <div className="space-y-3">
                      {tasks
                        .filter(task => task.status === column.id)
                        .map((task, taskIndex) => (
                          <motion.div
                            key={task.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: taskIndex * 0.05 }}
                            whileHover={{ scale: 1.02, y: -2 }}
                            drag={task.status !== 'locked'}
                            dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                            dragElastic={0.1}
                          >
                            <Card
                              className={`cursor-grab active:cursor-grabbing border-l-4 ${getPriorityColor(task.priority)} ${
                                task.status === 'locked' ? 'opacity-60' : ''
                              } shadow-sm hover:shadow-md transition-shadow bg-surface`}
                              draggable={task.status !== 'locked'}
                              onDragStart={(e) => handleDragStart(e, task.id)}
                            >
                              <CardContent className="p-3">
                                <div className="flex items-start justify-between">
                                  <p className="font-medium text-sm">{task.title}</p>
                                  {task.status === 'locked' && (
                                    <Lock className="w-4 h-4 text-muted-foreground" />
                                  )}
                                </div>
                                {task.lessonGate && (
                                  <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                                    <BookOpen className="w-3 h-3" />
                                    {task.lessonGate}
                                  </p>
                                )}
                                <div className="flex items-center gap-2 mt-2">
                                  <Badge variant="outline" className="text-xs capitalize">
                                    {task.priority}
                                  </Badge>
                                </div>
                              </CardContent>
                            </Card>
                          </motion.div>
                        ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}

// Team Workspace Section
function TeamWorkspace() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="teams" ref={ref} className="py-24 px-4 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          className="text-center mb-16"
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={staggerContainer}
        >
          <motion.div variants={fadeInUp}>
            <Badge variant="outline" className="mb-4 text-sm">
              <Users className="w-4 h-4 mr-2 text-primary" />
              Team Collaboration
            </Badge>
          </motion.div>
          <motion.h2 variants={fadeInUp} className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            Build Together, Learn Together
          </motion.h2>
          <motion.p variants={fadeInUp} className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Collaborate with up to 4 team members on shared projects. Assign roles, 
            track progress, and ship products as a simulated dev team.
          </motion.p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Team Card */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.6 }}
          >
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Users className="w-5 h-5 text-primary" />
                  </motion.div>
                  {sampleTeam.name}
                </CardTitle>
                <CardDescription>
                  Working on: {sampleTeam.project}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {sampleTeam.members.map((member, i) => (
                    <motion.div
                      key={member.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                      transition={{ delay: i * 0.1 }}
                      whileHover={{ x: 5 }}
                      className="flex items-center gap-3"
                    >
                      <Avatar>
                        <AvatarFallback>
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{member.name}</p>
                        <p className="text-sm text-muted-foreground truncate">{member.role}</p>
                      </div>
                      <Badge variant="outline" className="shrink-0">
                        Active
                      </Badge>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="flex gap-2">
                <motion.div className="flex-1" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button variant="outline" className="w-full">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Chat
                  </Button>
                </motion.div>
                <motion.div className="flex-1" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button className="w-full bg-primary hover:bg-primary/90 text-white">
                    <Users className="w-4 h-4 mr-2" />
                    Invite
                  </Button>
                </motion.div>
              </CardFooter>
            </Card>
          </motion.div>

          {/* Activity Feed */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-2"
          >
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Team Activity</CardTitle>
                <CardDescription>Recent updates from your team</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[350px]">
                  <div className="space-y-4">
                    {[
                      { user: 'Arjun Sharma', action: 'completed', target: 'User Authentication module', time: '2 minutes ago' },
                      { user: 'Priya Patel', action: 'pushed to', target: 'feature/product-catalog', time: '15 minutes ago' },
                      { user: 'Rahul Kumar', action: 'created PR', target: '#42: API optimization', time: '1 hour ago' },
                      { user: 'Ananya Singh', action: 'deployed', target: 'staging environment', time: '2 hours ago' },
                      { user: 'Arjun Sharma', action: 'reviewed', target: 'PR #41: Cart functionality', time: '3 hours ago' },
                      { user: 'Priya Patel', action: 'started lesson', target: 'React State Management', time: '4 hours ago' },
                    ].map((activity, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                        transition={{ delay: i * 0.05 }}
                        whileHover={{ x: 5 }}
                        className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <Avatar className="w-8 h-8">
                          <AvatarFallback>
                            {activity.user.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="text-sm">
                            <span className="font-medium">{activity.user}</span>
                            {' '}{activity.action}{' '}
                            <span className="font-medium text-primary">{activity.target}</span>
                          </p>
                          <p className="text-xs text-muted-foreground">{activity.time}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// Code Submission Section
function CodeSubmission() {
  const [code, setCode] = useState(`// Write your solution here
function processData(data) {
  // TODO: Implement this function
  return data;
}`);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluation, setEvaluation] = useState<{
    score: number;
    feedback: string[];
    suggestions: string[];
  } | null>(null);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const handleEvaluate = () => {
    setIsEvaluating(true);
    setTimeout(() => {
      setEvaluation({
        score: 85,
        feedback: [
          "Function signature is correct",
          "Good variable naming conventions",
          "Missing input validation",
          "Consider adding error handling"
        ],
        suggestions: [
          "Add null/undefined checks for input data",
          "Implement try-catch for error handling",
          "Consider adding JSDoc comments"
        ]
      });
      setIsEvaluating(false);
    }, 2000);
  };

  return (
    <section ref={ref} className="py-24 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          className="text-center mb-16"
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={staggerContainer}
        >
          <motion.div variants={fadeInUp}>
            <Badge variant="outline" className="mb-4 text-sm">
              <FileCode className="w-4 h-4 mr-2 text-primary" />
              AI Code Evaluation
            </Badge>
          </motion.div>
          <motion.h2 variants={fadeInUp} className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            Instant AI-Powered Feedback
          </motion.h2>
          <motion.p variants={fadeInUp} className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Submit your code and receive structured feedback from our AI evaluator. 
            Get scores, suggestions, and unlock the next task when you pass.
          </motion.p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Code Editor */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.6 }}
          >
            <Card className="h-full">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Code2 className="w-5 h-5 text-primary" />
                    Code Editor
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">JavaScript</Badge>
                    <Badge variant="secondary">Lesson 5</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <Textarea
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="font-mono text-sm min-h-[300px] bg-gray-950 text-gray-100 border-0 resize-none focus-visible:ring-2 focus-visible:ring-primary"
                    placeholder="// Write your code here..."
                  />
                </div>
              </CardContent>
              <CardFooter className="flex gap-2">
                <motion.div className="flex-1" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button variant="outline" className="w-full">
                    Reset
                  </Button>
                </motion.div>
                <motion.div className="flex-1" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button 
                    className="w-full bg-primary hover:bg-primary/90 text-white"
                    onClick={handleEvaluate}
                    disabled={isEvaluating}
                  >
                    {isEvaluating ? (
                      <>
                        <motion.div
                          className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full mr-2"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        />
                        Evaluating...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Submit
                      </>
                    )}
                  </Button>
                </motion.div>
              </CardFooter>
            </Card>
          </motion.div>

          {/* Evaluation Results */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Brain className="w-5 h-5 text-primary" />
                  AI Evaluation Results
                </CardTitle>
              </CardHeader>
              <CardContent>
                <AnimatePresence mode="wait">
                  {evaluation ? (
                    <motion.div
                      key="results"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="space-y-6"
                    >
                      {/* Score */}
                      <motion.div 
                        className="text-center p-6 rounded-xl bg-primary/5 border border-primary/10"
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.5, type: "spring" }}
                      >
                        <motion.div 
                          className="text-5xl font-bold text-primary mb-2"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.2 }}
                        >
                          {evaluation.score}%
                        </motion.div>
                        <p className="text-sm text-muted-foreground">Overall Score</p>
                        <motion.div
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: 1 }}
                          transition={{ delay: 0.4, duration: 0.5 }}
                        >
                          <Progress value={evaluation.score} className="h-2 mt-4" />
                        </motion.div>
                      </motion.div>

                      {/* Feedback */}
                      <div>
                        <h4 className="font-semibold mb-3">Feedback</h4>
                        <div className="space-y-2">
                          {evaluation.feedback.map((item, i) => (
                            <motion.div
                              key={i}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: i * 0.1 }}
                              className="flex items-start gap-2 text-sm"
                            >
                              {item.toLowerCase().includes('missing') || item.toLowerCase().includes('consider') ? (
                                <X className="w-4 h-4 text-rose-500 mt-0.5 shrink-0" />
                              ) : (
                                <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                              )}
                              <span>{item}</span>
                            </motion.div>
                          ))}
                        </div>
                      </div>

                      {/* Suggestions */}
                      <div>
                        <h4 className="font-semibold mb-3">Suggestions for Improvement</h4>
                        <div className="space-y-2">
                          {evaluation.suggestions.map((suggestion, i) => (
                            <motion.div
                              key={i}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: i * 0.1 }}
                              className="flex items-start gap-2 text-sm p-2 rounded-lg bg-muted/50"
                            >
                              <Zap className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                              <span>{suggestion}</span>
                            </motion.div>
                          ))}
                        </div>
                      </div>

                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Button className="w-full bg-primary hover:bg-primary/90 text-white">
                          <ChevronRight className="w-4 h-4 mr-2" />
                          Continue to Next Task
                        </Button>
                      </motion.div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="empty"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-center py-12 text-muted-foreground"
                    >
                      <motion.div
                        animate={{ y: [0, -10, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <FileCode className="w-16 h-16 mx-auto mb-4 opacity-30" />
                      </motion.div>
                      <p>Submit your code to receive AI-powered feedback</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// Pricing Section
function PricingSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const plans = [
    {
      name: "Starter",
      price: "Free",
      description: "Perfect for exploring the platform",
      features: [
        "Access to 3 beginner courses",
        "Individual projects only",
        "Basic Kanban board",
        "Community support",
        "5 AI evaluations/month"
      ],
      cta: "Get Started",
      popular: false
    },
    {
      name: "Pro",
      price: formatINR(529),
      period: "/month",
      description: "For serious learners building portfolios",
      features: [
        "Access to all courses",
        "Unlimited projects",
        "Advanced Kanban with skill gates",
        "Priority support",
        "Unlimited AI evaluations",
        "Portfolio website hosting",
        "Certificate of completion"
      ],
      cta: "Start Pro Trial",
      popular: true
    },
    {
      name: "Team",
      price: formatINR(1249),
      period: "/month per team",
      description: "For groups learning together",
      features: [
        "Everything in Pro",
        "Team workspaces (up to 4)",
        "Collaborative projects",
        "Team analytics dashboard",
        "Admin controls",
        "Shared project repository",
        "Team mentorship sessions"
      ],
      cta: "Start Team Trial",
      popular: false
    }
  ];

  return (
    <section id="pricing" ref={ref} className="py-24 px-4 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          className="text-center mb-16"
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={staggerContainer}
        >
          <motion.div variants={fadeInUp}>
            <Badge variant="outline" className="mb-4 text-sm">
              <Award className="w-4 h-4 mr-2 text-primary" />
              Pricing Plans
            </Badge>
          </motion.div>
          <motion.h2 variants={fadeInUp} className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            Choose Your Learning Path
          </motion.h2>
          <motion.p variants={fadeInUp} className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Start free and upgrade as you grow. All plans include GST invoices. 
            Prices in Indian Rupees (INR).
          </motion.p>
        </motion.div>

        <motion.div 
          className="grid md:grid-cols-3 gap-6"
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={staggerContainer}
        >
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              variants={fadeInUp}
              whileHover={{ y: -10 }}
              className="relative"
            >
              {plan.popular && (
                <motion.div 
                  className="absolute -top-3 left-1/2 -translate-x-1/2 z-10"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <Badge className="bg-primary text-white px-4">
                    Most Popular
                  </Badge>
                </motion.div>
              )}
              <Card className={`h-full ${plan.popular ? 'ring-2 ring-primary shadow-2xl' : 'shadow-lg'}`}>
                <CardHeader className="text-center">
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                  <motion.div 
                    className="mt-4"
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: i * 0.1 + 0.2 }}
                  >
                    <span className="text-4xl font-bold">{plan.price}</span>
                    {plan.period && (
                      <span className="text-muted-foreground">{plan.period}</span>
                    )}
                  </motion.div>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {plan.features.map((feature, j) => (
                      <motion.li
                        key={j}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 + j * 0.05 }}
                        className="flex items-center gap-2 text-sm"
                      >
                        <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                        {feature}
                      </motion.li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <motion.div 
                    className="w-full"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button 
                      className={`w-full ${plan.popular ? 'bg-primary hover:bg-primary/90 text-white' : ''}`}
                      variant={plan.popular ? 'default' : 'outline'}
                    >
                      {plan.cta}
                    </Button>
                  </motion.div>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* GST Note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center text-sm text-muted-foreground mt-8"
        >
          All prices are inclusive of 18% GST. GST invoices provided for all paid plans.
        </motion.p>
      </div>
    </section>
  );
}

// India Tech Ecosystem Section
function IndiaTechSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const stats = [
    { label: "IT Professionals", value: INDIA_CONFIG.stats.developers, icon: Users },
    { label: "Tech Startups", value: INDIA_CONFIG.stats.startups, icon: Rocket },
    { label: "IT Exports", value: INDIA_CONFIG.stats.itExports, icon: TrendingUp },
    { label: "Unicorn Startups", value: INDIA_CONFIG.stats.unicorns, icon: Trophy }
  ];

  return (
    <section ref={ref} className="py-24 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          className="text-center mb-16"
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={staggerContainer}
        >
          <motion.div variants={fadeInUp}>
            <Badge variant="outline" className="mb-4 text-sm">
              <Building2 className="w-4 h-4 mr-2 text-primary" />
              Indian Tech Ecosystem
            </Badge>
          </motion.div>
          <motion.h2 variants={fadeInUp} className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            Built for Indian Developers
          </motion.h2>
          <motion.p variants={fadeInUp} className="text-muted-foreground max-w-2xl mx-auto text-lg">
            India has the second-largest developer population in the world. 
            DevPath is designed to help you compete globally.
          </motion.p>
        </motion.div>

        <motion.div 
          className="grid grid-cols-2 md:grid-cols-4 gap-6"
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={staggerContainer}
        >
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              variants={scaleIn}
              whileHover={{ y: -5 }}
            >
              <Card className="text-center h-full">
                <CardContent className="p-6">
                  <motion.div 
                    className="w-12 h-12 mx-auto mb-4 rounded-xl bg-primary/10 flex items-center justify-center"
                    whileHover={{ scale: 1.1, rotate: 10 }}
                  >
                    <stat.icon className="w-6 h-6 text-primary" />
                  </motion.div>
                  <div className="text-2xl font-bold mb-1">{stat.value}</div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Testimonials */}
        <motion.div 
          className="mt-16 grid md:grid-cols-3 gap-6"
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={staggerContainer}
        >
          {testimonials.map((testimonial, i) => (
            <motion.div
              key={i}
              variants={fadeInUp}
              whileHover={{ y: -5 }}
            >
              <Card className="h-full">
                <CardContent className="p-6">
                  <p className="text-sm text-muted-foreground mb-4 italic">
                    &quot;{testimonial.content}&quot;
                  </p>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback>{testimonial.avatar}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-sm">{testimonial.name}</p>
                      <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {testimonial.location}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// Footer
function Footer() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <footer ref={ref} className="border-t border-border py-16 px-4 bg-background">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12"
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={staggerContainer}
        >
          <motion.div variants={fadeInUp}>
            <div className="flex items-center gap-2 mb-4">
              <motion.div 
                className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center"
                whileHover={{ rotate: 180 }}
                transition={{ duration: 0.5 }}
              >
                <Rocket className="w-5 h-5 text-white" />
              </motion.div>
              <span className="text-xl font-bold">DevPath</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-2">
              Learn by Building.<br />Ship Something Real.
            </p>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {INDIA_CONFIG.city}, {INDIA_CONFIG.state}
            </p>
          </motion.div>
          
          {[
            {
              title: "Platform",
              links: ["Courses", "Projects", "Teams", "Pricing"]
            },
            {
              title: "Resources",
              links: ["Documentation", "Blog", "Community", "Support"]
            },
            {
              title: "Company",
              links: ["About", "Careers", "Privacy", "Terms"]
            }
          ].map((section) => (
            <motion.div key={section.title} variants={fadeInUp}>
              <h4 className="font-semibold mb-4">{section.title}</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {section.links.map((link) => (
                  <li key={link}>
                    <motion.a 
                      href="#" 
                      className="hover:text-foreground transition-colors inline-block"
                      whileHover={{ x: 5 }}
                    >
                      {link}
                    </motion.a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>
        
        <Separator className="mb-8" />
        
        {/* Developer Credits */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ delay: 0.5 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary/5 border border-primary/20">
            <GraduationCap className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium">
              Developed by <span className="text-primary font-semibold">Francis Reuben R</span>, <span className="text-primary font-semibold">Darshan Jain</span>, and <span className="text-primary font-semibold">Harshith B A</span>
            </span>
          </div>
          <p className="text-sm text-muted-foreground mt-3">
            {INDIA_CONFIG.university}
          </p>
        </motion.div>
        
        <motion.div 
          className="flex flex-col sm:flex-row items-center justify-between gap-4"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 0.6 }}
        >
          <p className="text-sm text-muted-foreground">
            2025 DevPath. All rights reserved. Made with care in India.
          </p>
          <div className="flex items-center gap-4">
            <motion.a 
              href="#" 
              className="text-muted-foreground hover:text-foreground"
              whileHover={{ scale: 1.1, rotate: 5 }}
            >
              <Github className="w-5 h-5" />
            </motion.a>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}

// Main App Component
export default function DevPathApp() {
  return (
    <div className="min-h-screen flex flex-col font-sans antialiased">
      <Navigation />
      <main className="flex-1">
        <HeroSection />
        <CourseCatalog />
        <ProjectDashboard />
        <TeamWorkspace />
        <CodeSubmission />
        <IndiaTechSection />
        <PricingSection />
      </main>
      <Footer />
    </div>
  );
}
