import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Briefcase, 
  PenTool, 
  FileText, 
  Calculator, 
  Code, 
  Edit3,
  Star,
  IndianRupee,
  Clock,
  Users,
  CheckCircle,
  Sparkles,
  Send,
  Phone,
  Mail,
  GraduationCap,
  Building2,
  UserPlus,
  MessageSquare,
  ArrowRight,
  Target,
  Award,
  Zap,
  Search
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { toast } from "sonner";
import { GigWorkerFormData } from "@/types";
import { gigWorkerAPI } from "@/services/api";

const PaidGig = () => {
  const [activeTab, setActiveTab] = useState("freelancer");
  
  // Freelancer form state
  const [freelancerData, setFreelancerData] = useState<GigWorkerFormData>({
    fullName: '',
    email: '',
    mobile: '',
    year: '',
    branch: '',
    skills: [],
    experience: '',
    hourlyRate: '',
  });
  
  // Client form state
  const [clientData, setClientData] = useState({
    fullName: '',
    email: '',
    mobile: '',
    projectTitle: '',
    projectType: '',
    description: '',
    deadline: '',
    budget: '',
    skillsNeeded: [] as string[],
    urgency: ''
  });
  
  const [isSubmittingFreelancer, setIsSubmittingFreelancer] = useState(false);
  const [isSubmittingClient, setIsSubmittingClient] = useState(false);

  const skillOptions = [
    { id: 'assignments', label: 'Assignment Writing', icon: <PenTool className="h-4 w-4" /> },
    { id: 'excel', label: 'Excel/Data Files', icon: <Calculator className="h-4 w-4" /> },
    { id: 'documents', label: 'Document Creation', icon: <FileText className="h-4 w-4" /> },
    { id: 'coding', label: 'Programming/Projects', icon: <Code className="h-4 w-4" /> },
    { id: 'design', label: 'Graphic Design', icon: <Edit3 className="h-4 w-4" /> },
    { id: 'research', label: 'Research & Analysis', icon: <Search className="h-4 w-4" /> },
  ];

  const projectTypes = [
    { id: 'assignment', label: 'Assignment/Homework' },
    { id: 'project', label: 'Final Year Project' },
    { id: 'research', label: 'Research Paper' },
    { id: 'coding', label: 'Programming Task' },
    { id: 'design', label: 'Design Work' },
    { id: 'presentation', label: 'Presentation' },
    { id: 'other', label: 'Other' }
  ];

  const handleFreelancerInputChange = (field: keyof GigWorkerFormData, value: string) => {
    setFreelancerData(prev => ({ ...prev, [field]: value }));
  };

  const handleClientInputChange = (field: string, value: string) => {
    setClientData(prev => ({ ...prev, [field]: value }));
  };

  const handleFreelancerSkillToggle = (skillId: string) => {
    setFreelancerData(prev => ({
      ...prev,
      skills: prev.skills.includes(skillId)
        ? prev.skills.filter(id => id !== skillId)
        : [...prev.skills, skillId]
    }));
  };

  const handleClientSkillToggle = (skillId: string) => {
    setClientData(prev => ({
      ...prev,
      skillsNeeded: prev.skillsNeeded.includes(skillId)
        ? prev.skillsNeeded.filter(id => id !== skillId)
        : [...prev.skillsNeeded, skillId]
    }));
  };

  const handleFreelancerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!freelancerData.fullName || !freelancerData.email || !freelancerData.mobile || !freelancerData.year || !freelancerData.branch) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (freelancerData.skills.length === 0) {
      toast.error("Please select at least one skill");
      return;
    }

    setIsSubmittingFreelancer(true);

    try {
      const response = await gigWorkerAPI.registerGigWorker(freelancerData);
      
      if (response.data.success) {
        toast.success("Registration successful! We'll contact you within 24 hours.");
        
        // Reset form
        setFreelancerData({
          fullName: '',
          email: '',
          mobile: '',
          year: '',
          branch: '',
          skills: [],
          experience: '',
          hourlyRate: '',
        });
      } else {
        toast.error(response.data.message || "Registration failed");
      }
    } catch (error: any) {
      console.error('Freelancer registration error:', error);
      
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else if (error.response?.data?.errors) {
        const errorMessages = error.response.data.errors.map((err: any) => err.msg).join(', ');
        toast.error(errorMessages);
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } finally {
      setIsSubmittingFreelancer(false);
    }
  };

  const handleClientSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!clientData.fullName || !clientData.email || !clientData.mobile || !clientData.projectTitle || !clientData.description) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (clientData.skillsNeeded.length === 0) {
      toast.error("Please select at least one skill required");
      return;
    }

    setIsSubmittingClient(true);

    try {
      // For now, we'll show a success message. You might want to create a separate API endpoint for client requests
      toast.success("Project request submitted! We'll match you with suitable freelancers soon.");
      
      // Reset form
      setClientData({
        fullName: '',
        email: '',
        mobile: '',
        projectTitle: '',
        projectType: '',
        description: '',
        deadline: '',
        budget: '',
        skillsNeeded: [],
        urgency: ''
      });
    } catch (error: any) {
      console.error('Client request error:', error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmittingClient(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-8 pb-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="p-4 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full shadow-lg">
                <Briefcase className="h-10 w-10 text-white" />
              </div>
              <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                GIG Work Hub
              </h1>
              <Sparkles className="h-10 w-10 text-indigo-500 animate-pulse" />
            </div>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto mb-8">
              Connect talented freelancers with clients who need quality work done. Whether you're looking to earn or need help with your projects, we've got you covered.
            </p>
            
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">500+</div>
                <div className="text-sm text-gray-500">Active Freelancers</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-indigo-600">1000+</div>
                <div className="text-sm text-gray-500">Projects Completed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">₹10L+</div>
                <div className="text-sm text-gray-500">Total Earnings</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">4.9★</div>
                <div className="text-sm text-gray-500">Average Rating</div>
              </div>
            </div>
          </motion.div>

          {/* Two-Section Layout */}
          <div className="max-w-7xl mx-auto">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-8 bg-white/50 backdrop-blur-sm p-2 h-16">
                <TabsTrigger 
                  value="freelancer" 
                  className="flex items-center gap-3 text-lg font-semibold h-12 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white"
                >
                  <UserPlus className="h-5 w-5" />
                  Join as Freelancer
                </TabsTrigger>
                <TabsTrigger 
                  value="client" 
                  className="flex items-center gap-3 text-lg font-semibold h-12 data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-600 data-[state=active]:to-emerald-600 data-[state=active]:text-white"
                >
                  <Target className="h-5 w-5" />
                  Hire a Freelancer
                </TabsTrigger>
              </TabsList>

              {/* Freelancer Section */}
              <TabsContent value="freelancer" className="mt-0">
                <div className="grid lg:grid-cols-2 gap-12 items-start">
                  {/* Benefits Section */}
                  <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    className="space-y-8"
                  >
                    <div>
                      <h2 className="text-3xl font-bold text-gray-800 mb-4 flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <Award className="h-8 w-8 text-blue-600" />
                        </div>
                        Why Freelance With Us?
                      </h2>
                      <p className="text-gray-600 text-lg">Turn your academic skills into a steady income stream</p>
                    </div>
                    
                    <div className="space-y-4">
                      {[
                        { 
                          icon: <Clock className="h-6 w-6" />, 
                          title: "Flexible Schedule", 
                          desc: "Work on your own time, perfect for students" 
                        },
                        { 
                          icon: <IndianRupee className="h-6 w-6" />, 
                          title: "Competitive Pay", 
                          desc: "Earn ₹200-1000+ per project based on complexity" 
                        },
                        { 
                          icon: <Zap className="h-6 w-6" />, 
                          title: "Instant Work", 
                          desc: "Get matched with projects immediately" 
                        },
                        { 
                          icon: <Users className="h-6 w-6" />, 
                          title: "Community Support", 
                          desc: "Join a network of student freelancers" 
                        }
                      ].map((benefit, index) => (
                        <motion.div
                          key={benefit.title}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.6, delay: 0.1 + index * 0.1 }}
                        >
                          <Card className="p-6 border-l-4 border-l-blue-500 hover:shadow-lg transition-all duration-300">
                            <div className="flex items-start gap-4">
                              <div className="p-3 bg-blue-100 rounded-full text-blue-600">
                                {benefit.icon}
                              </div>
                              <div>
                                <h3 className="text-xl font-semibold text-gray-800 mb-2">{benefit.title}</h3>
                                <p className="text-gray-600">{benefit.desc}</p>
                              </div>
                            </div>
                          </Card>
                        </motion.div>
                      ))}
                    </div>

                    {/* Skills in Demand */}
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl">
                      <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <Star className="h-5 w-5 text-yellow-500" />
                        Skills in High Demand:
                      </h3>
                      <div className="flex flex-wrap gap-3">
                        {skillOptions.map((skill) => (
                          <Badge key={skill.id} variant="secondary" className="p-2 bg-white border border-blue-200">
                            <div className="flex items-center gap-2">
                              {skill.icon}
                              {skill.label}
                            </div>
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </motion.div>

                  {/* Freelancer Form */}
                  <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                  >
                    <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
                      <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
                        <CardTitle className="text-2xl flex items-center gap-3">
                          <UserPlus className="h-6 w-6" />
                          Start Freelancing Today
                        </CardTitle>
                        <p className="text-blue-100">Join our community of skilled freelancers and start earning!</p>
                      </CardHeader>
                      
                      <CardContent className="p-8">
                        <form onSubmit={handleFreelancerSubmit} className="space-y-6">
                          {/* Personal Information */}
                          <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                              <Users className="h-5 w-5 text-blue-600" />
                              Personal Information
                            </h3>
                            
                            <div>
                              <Label htmlFor="freelancer-fullName" className="text-gray-700 font-medium">Full Name *</Label>
                              <Input
                                id="freelancer-fullName"
                                type="text"
                                value={freelancerData.fullName}
                                onChange={(e) => handleFreelancerInputChange('fullName', e.target.value)}
                                placeholder="Enter your full name"
                                className="mt-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                required
                              />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <Label htmlFor="freelancer-email" className="text-gray-700 font-medium">Email Address *</Label>
                                <div className="relative mt-1">
                                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                  <Input
                                    id="freelancer-email"
                                    type="email"
                                    value={freelancerData.email}
                                    onChange={(e) => handleFreelancerInputChange('email', e.target.value)}
                                    placeholder="your.email@gmail.com"
                                    className="pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                    required
                                  />
                                </div>
                              </div>

                              <div>
                                <Label htmlFor="freelancer-mobile" className="text-gray-700 font-medium">Mobile Number *</Label>
                                <div className="relative mt-1">
                                  <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                  <Input
                                    id="freelancer-mobile"
                                    type="tel"
                                    value={freelancerData.mobile}
                                    onChange={(e) => handleFreelancerInputChange('mobile', e.target.value)}
                                    placeholder="+91 98765 43210"
                                    className="pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                    required
                                  />
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Academic Information */}
                          <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                              <GraduationCap className="h-5 w-5 text-blue-600" />
                              Academic Background
                            </h3>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <Label htmlFor="freelancer-year" className="text-gray-700 font-medium">Academic Year *</Label>
                                <Select value={freelancerData.year} onValueChange={(value) => handleFreelancerInputChange('year', value)}>
                                  <SelectTrigger className="mt-1 border-gray-300 focus:border-blue-500">
                                    <SelectValue placeholder="Select your year" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="1st Year">1st Year</SelectItem>
                                    <SelectItem value="2nd Year">2nd Year</SelectItem>
                                    <SelectItem value="3rd Year">3rd Year</SelectItem>
                                    <SelectItem value="4th Year">4th Year</SelectItem>
                                    <SelectItem value="Final Year">Final Year</SelectItem>
                                    <SelectItem value="Post Graduate">Post Graduate</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>

                              <div>
                                <Label htmlFor="freelancer-branch" className="text-gray-700 font-medium">Branch/Field *</Label>
                                <div className="relative mt-1">
                                  <Building2 className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                  <Input
                                    id="freelancer-branch"
                                    type="text"
                                    value={freelancerData.branch}
                                    onChange={(e) => handleFreelancerInputChange('branch', e.target.value)}
                                    placeholder="e.g., Computer Science, MBA"
                                    className="pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                    required
                                  />
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Skills Selection */}
                          <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                              <Star className="h-5 w-5 text-blue-600" />
                              Your Skills *
                            </h3>
                            <p className="text-sm text-gray-600">Select the skills you can offer (multiple selection)</p>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {skillOptions.map((skill) => (
                                <div key={skill.id} className="flex items-center space-x-3">
                                  <Checkbox
                                    id={`freelancer-${skill.id}`}
                                    checked={freelancerData.skills.includes(skill.id)}
                                    onCheckedChange={() => handleFreelancerSkillToggle(skill.id)}
                                    className="border-blue-300 data-[state=checked]:bg-blue-600"
                                  />
                                  <Label 
                                    htmlFor={`freelancer-${skill.id}`} 
                                    className="flex items-center gap-2 text-gray-700 cursor-pointer"
                                  >
                                    {skill.icon}
                                    {skill.label}
                                  </Label>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Experience and Rate */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="freelancer-experience" className="text-gray-700 font-medium">Experience Level</Label>
                              <Select value={freelancerData.experience} onValueChange={(value) => handleFreelancerInputChange('experience', value)}>
                                <SelectTrigger className="mt-1 border-gray-300 focus:border-blue-500">
                                  <SelectValue placeholder="Select experience" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="beginner">Beginner (0-6 months)</SelectItem>
                                  <SelectItem value="intermediate">Intermediate (6 months - 2 years)</SelectItem>
                                  <SelectItem value="expert">Expert (2+ years)</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            <div>
                              <Label htmlFor="freelancer-rate" className="text-gray-700 font-medium">Expected Rate</Label>
                              <div className="relative mt-1">
                                <IndianRupee className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                <Input
                                  id="freelancer-rate"
                                  type="text"
                                  value={freelancerData.hourlyRate}
                                  onChange={(e) => handleFreelancerInputChange('hourlyRate', e.target.value)}
                                  placeholder="e.g., ₹200-500 per project"
                                  className="pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                />
                              </div>
                            </div>
                          </div>

                          {/* Submit Button */}
                          <Button
                            type="submit"
                            disabled={isSubmittingFreelancer}
                            className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold text-lg rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
                          >
                            {isSubmittingFreelancer ? (
                              <div className="flex items-center gap-2">
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                Registering...
                              </div>
                            ) : (
                              <div className="flex items-center gap-2">
                                <Send className="h-5 w-5" />
                                Join as Freelancer
                                <ArrowRight className="h-4 w-4" />
                              </div>
                            )}
                          </Button>
                        </form>
                      </CardContent>
                    </Card>
                  </motion.div>
                </div>
              </TabsContent>

              {/* Client Section */}
              <TabsContent value="client" className="mt-0">
                <div className="grid lg:grid-cols-2 gap-12 items-start">
                  {/* Client Benefits */}
                  <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    className="space-y-8"
                  >
                    <div>
                      <h2 className="text-3xl font-bold text-gray-800 mb-4 flex items-center gap-3">
                        <div className="p-2 bg-green-100 rounded-lg">
                          <Target className="h-8 w-8 text-green-600" />
                        </div>
                        Need Help With Your Work?
                      </h2>
                      <p className="text-gray-600 text-lg">Get your assignments and projects done by skilled freelancers</p>
                    </div>
                    
                    <div className="space-y-4">
                      {[
                        { 
                          icon: <Clock className="h-6 w-6" />, 
                          title: "Quick Delivery", 
                          desc: "Get your work completed within deadlines" 
                        },
                        { 
                          icon: <Award className="h-6 w-6" />, 
                          title: "Quality Work", 
                          desc: "All freelancers are verified students with expertise" 
                        },
                        { 
                          icon: <IndianRupee className="h-6 w-6" />, 
                          title: "Affordable Rates", 
                          desc: "Student-friendly pricing for all types of work" 
                        },
                        { 
                          icon: <CheckCircle className="h-6 w-6" />, 
                          title: "Satisfaction Guaranteed", 
                          desc: "Revisions until you're completely satisfied" 
                        }
                      ].map((benefit, index) => (
                        <motion.div
                          key={benefit.title}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.6, delay: 0.1 + index * 0.1 }}
                        >
                          <Card className="p-6 border-l-4 border-l-green-500 hover:shadow-lg transition-all duration-300">
                            <div className="flex items-start gap-4">
                              <div className="p-3 bg-green-100 rounded-full text-green-600">
                                {benefit.icon}
                              </div>
                              <div>
                                <h3 className="text-xl font-semibold text-gray-800 mb-2">{benefit.title}</h3>
                                <p className="text-gray-600">{benefit.desc}</p>
                              </div>
                            </div>
                          </Card>
                        </motion.div>
                      ))}
                    </div>

                    {/* Popular Services */}
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl">
                      <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-green-500" />
                        Popular Services:
                      </h3>
                      <div className="grid grid-cols-2 gap-3">
                        {[
                          "Assignment Writing",
                          "Research Papers", 
                          "Programming Projects",
                          "Excel/Data Work",
                          "Presentations",
                          "Graphic Design"
                        ].map((service) => (
                          <div key={service} className="flex items-center gap-2 text-gray-700">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span className="text-sm">{service}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>

                  {/* Client Form */}
                  <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                  >
                    <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
                      <CardHeader className="bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-t-lg">
                        <CardTitle className="text-2xl flex items-center gap-3">
                          <MessageSquare className="h-6 w-6" />
                          Post Your Project
                        </CardTitle>
                        <p className="text-green-100">Tell us about your project and we'll find the perfect freelancer!</p>
                      </CardHeader>
                      
                      <CardContent className="p-8">
                        <form onSubmit={handleClientSubmit} className="space-y-6">
                          {/* Personal Information */}
                          <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                              <Users className="h-5 w-5 text-green-600" />
                              Your Information
                            </h3>
                            
                            <div>
                              <Label htmlFor="client-fullName" className="text-gray-700 font-medium">Full Name *</Label>
                              <Input
                                id="client-fullName"
                                type="text"
                                value={clientData.fullName}
                                onChange={(e) => handleClientInputChange('fullName', e.target.value)}
                                placeholder="Enter your full name"
                                className="mt-1 border-gray-300 focus:border-green-500 focus:ring-green-500"
                                required
                              />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <Label htmlFor="client-email" className="text-gray-700 font-medium">Email Address *</Label>
                                <div className="relative mt-1">
                                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                  <Input
                                    id="client-email"
                                    type="email"
                                    value={clientData.email}
                                    onChange={(e) => handleClientInputChange('email', e.target.value)}
                                    placeholder="your.email@gmail.com"
                                    className="pl-10 border-gray-300 focus:border-green-500 focus:ring-green-500"
                                    required
                                  />
                                </div>
                              </div>

                              <div>
                                <Label htmlFor="client-mobile" className="text-gray-700 font-medium">Mobile Number *</Label>
                                <div className="relative mt-1">
                                  <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                  <Input
                                    id="client-mobile"
                                    type="tel"
                                    value={clientData.mobile}
                                    onChange={(e) => handleClientInputChange('mobile', e.target.value)}
                                    placeholder="+91 98765 43210"
                                    className="pl-10 border-gray-300 focus:border-green-500 focus:ring-green-500"
                                    required
                                  />
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Project Information */}
                          <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                              <Briefcase className="h-5 w-5 text-green-600" />
                              Project Details
                            </h3>
                            
                            <div>
                              <Label htmlFor="client-projectTitle" className="text-gray-700 font-medium">Project Title *</Label>
                              <Input
                                id="client-projectTitle"
                                type="text"
                                value={clientData.projectTitle}
                                onChange={(e) => handleClientInputChange('projectTitle', e.target.value)}
                                placeholder="e.g., Data Analysis Assignment, Web Development Project"
                                className="mt-1 border-gray-300 focus:border-green-500 focus:ring-green-500"
                                required
                              />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <Label htmlFor="client-projectType" className="text-gray-700 font-medium">Project Type</Label>
                                <Select value={clientData.projectType} onValueChange={(value) => handleClientInputChange('projectType', value)}>
                                  <SelectTrigger className="mt-1 border-gray-300 focus:border-green-500">
                                    <SelectValue placeholder="Select project type" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {projectTypes.map((type) => (
                                      <SelectItem key={type.id} value={type.id}>{type.label}</SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>

                              <div>
                                <Label htmlFor="client-urgency" className="text-gray-700 font-medium">Urgency</Label>
                                <Select value={clientData.urgency} onValueChange={(value) => handleClientInputChange('urgency', value)}>
                                  <SelectTrigger className="mt-1 border-gray-300 focus:border-green-500">
                                    <SelectValue placeholder="How urgent?" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="low">Not Urgent (1+ weeks)</SelectItem>
                                    <SelectItem value="medium">Moderate (3-7 days)</SelectItem>
                                    <SelectItem value="high">Urgent (1-2 days)</SelectItem>
                                    <SelectItem value="critical">Critical (Within 24 hours)</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>

                            <div>
                              <Label htmlFor="client-description" className="text-gray-700 font-medium">Project Description *</Label>
                              <Textarea
                                id="client-description"
                                value={clientData.description}
                                onChange={(e) => handleClientInputChange('description', e.target.value)}
                                placeholder="Describe your project in detail. Include requirements, expectations, and any specific instructions..."
                                className="mt-1 border-gray-300 focus:border-green-500 focus:ring-green-500 min-h-[100px]"
                                required
                              />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <Label htmlFor="client-deadline" className="text-gray-700 font-medium">Deadline</Label>
                                <Input
                                  id="client-deadline"
                                  type="datetime-local"
                                  value={clientData.deadline}
                                  onChange={(e) => handleClientInputChange('deadline', e.target.value)}
                                  className="mt-1 border-gray-300 focus:border-green-500 focus:ring-green-500"
                                />
                              </div>

                              <div>
                                <Label htmlFor="client-budget" className="text-gray-700 font-medium">Budget Range</Label>
                                <div className="relative mt-1">
                                  <IndianRupee className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                  <Input
                                    id="client-budget"
                                    type="text"
                                    value={clientData.budget}
                                    onChange={(e) => handleClientInputChange('budget', e.target.value)}
                                    placeholder="e.g., ₹500-1500"
                                    className="pl-10 border-gray-300 focus:border-green-500 focus:ring-green-500"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Skills Required */}
                          <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                              <Star className="h-5 w-5 text-green-600" />
                              Skills Required *
                            </h3>
                            <p className="text-sm text-gray-600">Select the skills needed for your project</p>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {skillOptions.map((skill) => (
                                <div key={skill.id} className="flex items-center space-x-3">
                                  <Checkbox
                                    id={`client-${skill.id}`}
                                    checked={clientData.skillsNeeded.includes(skill.id)}
                                    onCheckedChange={() => handleClientSkillToggle(skill.id)}
                                    className="border-green-300 data-[state=checked]:bg-green-600"
                                  />
                                  <Label 
                                    htmlFor={`client-${skill.id}`} 
                                    className="flex items-center gap-2 text-gray-700 cursor-pointer"
                                  >
                                    {skill.icon}
                                    {skill.label}
                                  </Label>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Submit Button */}
                          <Button
                            type="submit"
                            disabled={isSubmittingClient}
                            className="w-full py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold text-lg rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
                          >
                            {isSubmittingClient ? (
                              <div className="flex items-center gap-2">
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                Submitting...
                              </div>
                            ) : (
                              <div className="flex items-center gap-2">
                                <Send className="h-5 w-5" />
                                Post Project
                                <ArrowRight className="h-4 w-4" />
                              </div>
                            )}
                          </Button>

                          <div className="text-center text-sm text-gray-500">
                            <div className="flex items-center justify-center gap-2">
                              <CheckCircle className="h-4 w-4 text-green-500" />
                              <span>We'll match you with suitable freelancers within 24 hours!</span>
                            </div>
                          </div>
                        </form>
                      </CardContent>
                    </Card>
                  </motion.div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default PaidGig;
