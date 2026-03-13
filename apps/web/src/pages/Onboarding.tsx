import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useCreateProfile } from "@/features/profile/hooks/useProfile";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const PROFESSIONS = [
  "Software Engineer",
  "Full Stack Developer",
  "Frontend Developer",
  "Backend Developer",
  "DevOps Engineer",
  "Data Scientist",
  "Machine Learning Engineer",
  "Mobile App Developer",
  "UI/UX Designer",
  "Product Manager",
  "Project Manager",
  "Technical Writer",
  "Cloud Architect",
  "Cybersecurity Expert",
  "Blockchain Developer",
  "Game Developer",
  "Embedded Systems Engineer",
  "QA Engineer",
  "Business Analyst",
  "Marketing Manager",
  "Sales Representative",
  "Entrepreneur",
  "Freelancer",
  "Student",
  "Content Creator",
  "Digital Marketer",
  "Graphic Designer",
  "Photographer",
  "Videographer",
  "Writer / Author",
  "Consultant",
  "Other",
];

export default function Onboarding() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const createProfile = useCreateProfile();

  const [formData, setFormData] = useState({
    username: "",
    fullName: "",
    dateOfBirth: "",
    profession: "",
    tagline: "",
    bio: "",
    email: user?.email || "",
    phone: "",
    location: "",
  });

  const [usernameChecking, setUsernameChecking] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    
    if (e.target.name === "username") {
      setUsernameAvailable(null);
    }
  };

  const checkUsername = async (username: string) => {
    if (username.length < 3) return;
    setUsernameChecking(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/username/check?q=${username}`
      );
      const data = await res.json();
      setUsernameAvailable(data.available);
    } catch (error) {
      console.error("Error checking username:", error);
    } finally {
      setUsernameChecking(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.username || !formData.fullName || !formData.email) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (usernameAvailable === false) {
      toast.error("Username is already taken");
      return;
    }

    createProfile.mutate(formData, {
      onSuccess: () => {
        toast.success("Profile created successfully!");
        navigate("/dashboard");
      },
      onError: (err) => {
        toast.error(err.message);
      },
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Complete Your Profile</h1>
          <p className="text-slate-600 mt-2">Tell us about yourself to get started</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-xl shadow-sm border">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username *</Label>
              <Input
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                onBlur={(e) => checkUsername(e.target.value)}
                placeholder="johndoe"
                required
              />
              {usernameChecking && <p className="text-xs text-slate-500">Checking...</p>}
              {usernameAvailable === true && (
                <p className="text-xs text-green-600">Username available!</p>
              )}
              {usernameAvailable === false && (
                <p className="text-xs text-red-500">Username already taken</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name *</Label>
              <Input
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="John Doe"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dateOfBirth">Date of Birth</Label>
              <Input
                id="dateOfBirth"
                name="dateOfBirth"
                type="date"
                value={formData.dateOfBirth}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="profession">Profession</Label>
              <select
                id="profession"
                name="profession"
                value={formData.profession}
                onChange={handleChange}
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="">Select profession</option>
                {PROFESSIONS.map((prof) => (
                  <option key={prof} value={prof}>
                    {prof}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tagline">Tagline</Label>
            <Input
              id="tagline"
              name="tagline"
              value={formData.tagline}
              onChange={handleChange}
              placeholder="Software Engineer & Creator"
              maxLength={150}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Tell the world about yourself..."
              rows={4}
              maxLength={1000}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="hello@example.com"
                required
              />
              {user?.email && (
                <p className="text-xs text-slate-500">
                  Auth email: {user.email}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+1 (555) 000-0000"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Address / Location</Label>
            <Input
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="San Francisco, CA"
            />
          </div>

          <Button type="submit" className="w-full" disabled={createProfile.isPending}>
            {createProfile.isPending ? "Creating Profile..." : "Create Profile"}
          </Button>
        </form>

        <p className="text-center text-sm text-slate-500 mt-6">
          Already have a profile?{" "}
          <Link to="/login" className="text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
