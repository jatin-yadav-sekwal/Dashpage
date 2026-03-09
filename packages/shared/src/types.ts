// ============================================
// Dashpage Shared Types
// Used by both apps/api and apps/web
// ============================================

// === Profile ===
export interface Profile {
  id: string;
  userId: string;
  username: string;
  fullName: string;
  tagline: string;
  bio: string;
  avatarUrl: string | null;
  email: string;
  phone: string | null;
  location: string | null;
  socialLinks: SocialLinks;
  themeId: string | null;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SocialLinks {
  github?: string;
  linkedin?: string;
  twitter?: string;
  website?: string;
  instagram?: string;
  youtube?: string;
  dribbble?: string;
  behance?: string;
}

export interface CreateProfileInput {
  username: string;
  fullName: string;
  tagline?: string;
  bio?: string;
  email: string;
  phone?: string;
  location?: string;
  socialLinks?: SocialLinks;
}

export interface UpdateProfileInput {
  fullName?: string;
  tagline?: string;
  bio?: string;
  email?: string;
  phone?: string | null;
  location?: string | null;
  socialLinks?: SocialLinks;
  themeId?: string | null;
  isPublished?: boolean;
}

// === Experience ===
export interface Experience {
  id: string;
  profileId: string;
  title: string;
  company: string;
  startDate: string;
  endDate: string | null;
  description: string;
  sortOrder: number;
}

export type CreateExperienceInput = Omit<Experience, "id" | "profileId" | "sortOrder">;
export type UpdateExperienceInput = Partial<CreateExperienceInput>;

// === Education ===
export interface Education {
  id: string;
  profileId: string;
  degree: string;
  institution: string;
  startYear: number;
  endYear: number | null;
  description: string | null;
  sortOrder: number;
}

export type CreateEducationInput = Omit<Education, "id" | "profileId" | "sortOrder">;
export type UpdateEducationInput = Partial<CreateEducationInput>;

// === Project ===
export interface Project {
  id: string;
  profileId: string;
  title: string;
  description: string;
  imageUrl: string | null;
  projectUrl: string | null;
  sortOrder: number;
}

export type CreateProjectInput = Omit<Project, "id" | "profileId" | "sortOrder">;
export type UpdateProjectInput = Partial<CreateProjectInput>;

// === Theme ===
export interface Theme {
  id: string;
  name: string;
  slug: string;
  previewImage: string;
  config: ThemeConfig;
  isPremium: boolean;
  price: number | null;
}

export interface ThemeConfig {
  colors: {
    background: string;
    surface: string;
    primary: string;
    text: string;
    textSecondary: string;
    accent: string;
  };
  fonts: {
    heading: string;
    body: string;
  };
  layout: "modern" | "classic" | "minimal" | "bold";
  borderRadius: "none" | "sm" | "md" | "lg" | "full";
  heroStyle: "centered" | "split" | "left-aligned";
}

// === Bookmark ===
export interface Bookmark {
  id: string;
  userId: string;
  profileId: string;
  createdAt: string;
  profile?: Profile; // populated on GET requests
}

// === Purchase ===
export interface Purchase {
  id: string;
  userId: string;
  themeId: string;
  razorpayPaymentId: string;
  razorpayOrderId: string;
  amount: number;
  status: "created" | "success" | "failed";
  createdAt: string;
}

// === Public Profile (full page data) ===
export interface PublicProfile extends Profile {
  experiences: Experience[];
  educations: Education[];
  projects: Project[];
  tags: string[];
  theme: ThemeConfig | null;
}

// === API Response Types ===
export interface ApiResponse<T> {
  data: T;
  error?: never;
}

export interface ApiError {
  data?: never;
  error: string;
}

export type ApiResult<T> = ApiResponse<T> | ApiError;
