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
  Building2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { toast } from "sonner";
import { GigWorkerFormData } from "@/types";
import { gigWorkerAPI } from "@/services/api";

const PaidGig = () => {
  const [formData, setFormData] = useState<GigWorkerFormData>({
    fullName: '',
    email: '',
    mobile: '',
    year: '',
    branch: '',
    skills: [],
    experience: '',
    hourlyRate: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const skillOptions = [
    { id: 'assignments', label: 'Assignment Writing', icon: <PenTool className="h-4 w-4" /> },
    { id: 'excel', label: 'Excel Sheets', icon: <Calculator className="h-4 w-4" /> },
    { id: 'documents', label: 'Document Creation', icon: <FileText className="h-4 w-4" /> },
    { id: 'coding', label: 'Programming/Coding', icon: <Code className="h-4 w-4" /> },
    { id: 'design', label: 'Graphic Design', icon: <Edit3 className="h-4 w-4" /> },
    { id: 'research', label: 'Research Work', icon: <FileText className="h-4 w-4" /> },
  ];

  const gigBenefits = [
    { title: "Flexible Hours", description: "Work according to your schedule", icon: <Clock className="h-6 w-6" /> },
    { title: "Fair Payment", description: "Get paid for quality work", icon: <IndianRupee className="h-6 w-6" /> },
    { title: "Skill Development", description: "Enhance your expertise", icon: <Star className="h-6 w-6" /> },
    { title: "Student Community", description: "Work with fellow students", icon: <Users className="h-6 w-6" /> },
  ];

  const handleInputChange = (field: keyof GigWorkerFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSkillToggle = (skillId: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.includes(skillId)
        ? prev.skills.filter(id => id !== skillId)
        : [...prev.skills, skillId]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.fullName || !formData.email || !formData.mobile || !formData.year || !formData.branch) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (formData.skills.length === 0) {
      toast.error("Please select at least one skill");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await gigWorkerAPI.registerGigWorker(formData);
      
      if (response.data.success) {
        toast.success(response.data.message);
        
        // Reset form
        setFormData({
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
      console.error('GIG Worker registration error:', error);
      
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else if (error.response?.data?.errors) {
        const errorMessages = error.response.data.errors.map((err: any) => err.msg).join(', ');
        toast.error(errorMessages);
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50">
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
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full">
                <Briefcase className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Paid GIG Work
              </h1>
              <Sparkles className="h-8 w-8 text-purple-500 animate-pulse" />
            </div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Turn your skills into income! Join our student freelancer community and earn money by doing assignments, creating Excel sheets, writing documents, and more.
            </p>
            
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">500+</div>
                <div className="text-sm text-gray-600">Active Freelancers</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-pink-600">₹150-500</div>
                <div className="text-sm text-gray-600">Per Hour</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-indigo-600">24/7</div>
                <div className="text-sm text-gray-600">Support</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">1000+</div>
                <div className="text-sm text-gray-600">Projects Done</div>
              </div>
            </div>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Benefits Section */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <h2 className="text-3xl font-bold text-gray-800 mb-8 flex items-center gap-2">
                <Star className="h-8 w-8 text-yellow-500" />
                Why Join Our GIG Community?
              </h2>
              
              <div className="space-y-6">
                {gigBenefits.map((benefit, index) => (
                  <motion.div
                    key={benefit.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                  >
                    <Card className="p-6 border-2 border-transparent hover:border-purple-200 transition-all duration-300 hover:shadow-lg">
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full text-purple-600">
                          {benefit.icon}
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-gray-800 mb-2">{benefit.title}</h3>
                          <p className="text-gray-600">{benefit.description}</p>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {/* Popular Skills */}
              <div className="mt-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Popular Skills in Demand:</h3>
                <div className="flex flex-wrap gap-3">
                  {skillOptions.map((skill, index) => (
                    <motion.div
                      key={skill.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                    >
                      <Badge variant="secondary" className="p-2 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 border border-purple-200">
                        <div className="flex items-center gap-2">
                          {skill.icon}
                          {skill.label}
                        </div>
                      </Badge>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Registration Form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-t-lg">
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <Users className="h-6 w-6" />
                    Join as a GIG Worker
                  </CardTitle>
                  <p className="text-purple-100">Fill out this form to start earning with your skills!</p>
                </CardHeader>
                
                <CardContent className="p-8">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Personal Information */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                        <Users className="h-5 w-5 text-purple-600" />
                        Personal Information
                      </h3>
                      
                      <div>
                        <Label htmlFor="fullName" className="text-gray-700 font-medium">Full Name *</Label>
                        <Input
                          id="fullName"
                          type="text"
                          value={formData.fullName}
                          onChange={(e) => handleInputChange('fullName', e.target.value)}
                          placeholder="Enter your full name"
                          className="mt-1 border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                          required
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="email" className="text-gray-700 font-medium">Email Address *</Label>
                          <div className="relative mt-1">
                            <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input
                              id="email"
                              type="email"
                              value={formData.email}
                              onChange={(e) => handleInputChange('email', e.target.value)}
                              placeholder="your.email@gmail.com"
                              className="pl-10 border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                              required
                            />
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="mobile" className="text-gray-700 font-medium">Mobile Number *</Label>
                          <div className="relative mt-1">
                            <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input
                              id="mobile"
                              type="tel"
                              value={formData.mobile}
                              onChange={(e) => handleInputChange('mobile', e.target.value)}
                              placeholder="+91 98765 43210"
                              className="pl-10 border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                              required
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Academic Information */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                        <GraduationCap className="h-5 w-5 text-purple-600" />
                        Academic Information
                      </h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="year" className="text-gray-700 font-medium">Academic Year *</Label>
                          <Select value={formData.year} onValueChange={(value) => handleInputChange('year', value)}>
                            <SelectTrigger className="mt-1 border-gray-300 focus:border-purple-500">
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
                          <Label htmlFor="branch" className="text-gray-700 font-medium">Branch/Field of Study *</Label>
                          <div className="relative mt-1">
                            <Building2 className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input
                              id="branch"
                              type="text"
                              value={formData.branch}
                              onChange={(e) => handleInputChange('branch', e.target.value)}
                              placeholder="e.g., Computer Science, MBA, etc."
                              className="pl-10 border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                              required
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Skills Selection */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                        <Star className="h-5 w-5 text-purple-600" />
                        Your Skills *
                      </h3>
                      <p className="text-sm text-gray-600">Select the skills you can offer (select multiple)</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {skillOptions.map((skill) => (
                          <div key={skill.id} className="flex items-center space-x-3">
                            <Checkbox
                              id={skill.id}
                              checked={formData.skills.includes(skill.id)}
                              onCheckedChange={() => handleSkillToggle(skill.id)}
                              className="border-purple-300 data-[state=checked]:bg-purple-600"
                            />
                            <Label 
                              htmlFor={skill.id} 
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
                        <Label htmlFor="experience" className="text-gray-700 font-medium">Experience Level</Label>
                        <Select value={formData.experience} onValueChange={(value) => handleInputChange('experience', value)}>
                          <SelectTrigger className="mt-1 border-gray-300 focus:border-purple-500">
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
                        <Label htmlFor="hourlyRate" className="text-gray-700 font-medium">Expected Hourly Rate</Label>
                        <div className="relative mt-1">
                          <IndianRupee className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            id="hourlyRate"
                            type="text"
                            value={formData.hourlyRate}
                            onChange={(e) => handleInputChange('hourlyRate', e.target.value)}
                            placeholder="e.g., 200-500 per hour"
                            className="pl-10 border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold text-lg rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center gap-2">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                          Registering...
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Send className="h-5 w-5" />
                          Join GIG Community
                          <Sparkles className="h-4 w-4 animate-pulse" />
                        </div>
                      )}
                    </Button>

                    <div className="text-center text-sm text-gray-500">
                      <div className="flex items-center justify-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>We'll contact you within 24 hours with work opportunities!</span>
                      </div>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default PaidGig;
