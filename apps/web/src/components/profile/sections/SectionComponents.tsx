import { motion } from "framer-motion";
import { Building2, GraduationCap, FolderGit2, ExternalLink, MapPin, Calendar, Award, Code, TrendingUp } from "lucide-react";
import { PublicProfile } from "@shared/types";

interface SectionProps {
    profile: PublicProfile;
    theme: any;
    itemVariants: any;
}

const getHeadingStyle = (theme: any) => ({
    fontFamily: theme?.fonts?.heading || "Inter",
});

const SectionCard = ({ children, colors, className = "" }: { children: React.ReactNode; colors: any; className?: string }) => (
    <div 
        className={`rounded-3xl p-6 sm:p-10 ${className}`}
        style={{ 
            backgroundColor: colors.surface,
            border: `1px solid ${colors.primary}15`,
            boxShadow: `0 8px 40px ${colors.primary}08`
        }}
    >
        {children}
    </div>
);

// ===================== EXPERIENCE SECTIONS =====================

export function ExperienceTimeline({ profile, theme, itemVariants }: SectionProps) {
    const colors = theme?.colors || {};
    const headingStyle = getHeadingStyle(theme);
    const experiences = profile.experiences || [];

    if (!experiences.length) return null;

    return (
        <motion.section id="experience" variants={itemVariants} className="max-w-5xl mx-auto px-6 py-6 scroll-mt-28">
            <SectionCard colors={colors}>
                <div className="flex items-center gap-3 mb-10">
                <div className="p-3 rounded-xl" style={{ backgroundColor: colors.accent }}>
                    <Building2 className="w-6 h-6" style={{ color: colors.background }} />
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold" style={{ ...headingStyle, color: colors.primary }}>Experience</h2>
            </div>
            <div className="space-y-6">
                {experiences.map((exp: any, idx: number) => (
                    <motion.div 
                        key={exp.id}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: idx * 0.1 }}
                        className="relative pl-10"
                    >
                        <div className="absolute left-0 top-0 bottom-0 w-px" style={{ backgroundColor: colors.primary, opacity: 0.15 }} />
                        <div className="absolute w-4 h-4 rounded-full -left-[7px] top-2 ring-4" style={{ backgroundColor: colors.accent, borderColor: colors.background }} />
                        <div className="pb-8 last:pb-0">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                                <h3 className="text-xl font-bold" style={{ color: colors.primary }}>{exp.title}</h3>
                                <span className="hidden sm:inline w-1.5 h-1.5 rounded-full" style={{ backgroundColor: colors.textSecondary }} />
                                <span className="text-sm font-medium" style={{ color: colors.accent }}>{exp.company}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm mb-3" style={{ color: colors.textSecondary }}>
                                <Calendar className="w-4 h-4" />
                                <span>{exp.startDate} — {exp.endDate || "Present"}</span>
                            </div>
                            {exp.description && (
                                <div className="p-4 rounded-xl" style={{ backgroundColor: colors.surface }}>
                                    <p className="whitespace-pre-line" style={{ color: colors.text }}>{exp.description}</p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                ))}
            </div>
            </SectionCard>
        </motion.section>
    );
}

export function ExperienceCards({ profile, theme, itemVariants }: SectionProps) {
    const colors = theme?.colors || {};
    const headingStyle = getHeadingStyle(theme);
    const experiences = profile.experiences || [];

    if (!experiences.length) return null;

    return (
        <motion.section id="experience" variants={itemVariants} className="max-w-5xl mx-auto px-6 py-6 scroll-mt-28">
            <SectionCard colors={colors}>
                <div className="flex items-center gap-3 mb-10">
                <div className="p-3 rounded-xl" style={{ backgroundColor: colors.accent }}>
                    <TrendingUp className="w-6 h-6" style={{ color: colors.background }} />
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold" style={{ ...headingStyle, color: colors.primary }}>Experience</h2>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
                {experiences.map((exp: any, idx: number) => (
                    <motion.div
                        key={exp.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: idx * 0.1 }}
                        className="group p-6 rounded-2xl transition-all duration-300 hover:-translate-y-1"
                        style={{ 
                            backgroundColor: colors.surface,
                            boxShadow: `0 4px 20px ${colors.primary}10`,
                            border: `1px solid ${colors.primary}10`
                        }}
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div className="p-2.5 rounded-lg" style={{ backgroundColor: colors.accent }}>
                                <Building2 className="w-5 h-5" style={{ color: colors.background }} />
                            </div>
                            <span className="text-xs font-medium px-2.5 py-1 rounded-full" style={{ backgroundColor: colors.accent + "20", color: colors.accent }}>
                                {exp.startDate.split(',')[0]}
                            </span>
                        </div>
                        <h3 className="font-bold text-lg mb-1.5" style={{ color: colors.primary }}>{exp.title}</h3>
                        <p className="text-sm font-semibold mb-3" style={{ color: colors.accent }}>{exp.company}</p>
                        <div className="flex items-center gap-1.5 text-xs mb-4" style={{ color: colors.textSecondary }}>
                            <Calendar className="w-3.5 h-3.5" />
                            <span>{exp.startDate} — {exp.endDate || "Present"}</span>
                        </div>
                        {exp.description && (
                            <p className="text-sm leading-relaxed" style={{ color: colors.text, opacity: 0.85 }}>{exp.description}</p>
                        )}
                    </motion.div>
                ))}
            </div>
            </SectionCard>
        </motion.section>
    );
}

export function ExperienceMinimal({ profile, theme, itemVariants }: SectionProps) {
    const colors = theme?.colors || {};
    const headingStyle = getHeadingStyle(theme);
    const experiences = profile.experiences || [];

    if (!experiences.length) return null;

    return (
        <motion.section id="experience" variants={itemVariants} className="max-w-3xl mx-auto px-6 py-6 scroll-mt-28">
            <SectionCard colors={colors}>
                <div className="flex items-center gap-3 mb-8">
                <Award className="w-5 h-5" style={{ color: colors.accent }} />
                <h2 className="text-xl font-bold" style={{ ...headingStyle, color: colors.primary }}>Experience</h2>
            </div>
            <div className="space-y-4">
                {experiences.map((exp: any) => (
                    <div 
                        key={exp.id} 
                        className="flex items-center justify-between p-4 rounded-xl"
                        style={{ backgroundColor: colors.surface }}
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.accent }} />
                            <div>
                                <h3 className="font-semibold" style={{ color: colors.primary }}>{exp.title}</h3>
                                <p className="text-sm" style={{ color: colors.textSecondary }}>{exp.company}</p>
                            </div>
                        </div>
                        <span className="text-xs font-medium" style={{ color: colors.textSecondary }}>
                            {exp.startDate.split(',')[0]}
                        </span>
                    </div>
                ))}
            </div>
            </SectionCard>
        </motion.section>
    );
}

export const experienceSections = {
    timeline: ExperienceTimeline,
    cards: ExperienceCards,
    minimal: ExperienceMinimal,
};

// ===================== EDUCATION SECTIONS =====================

export function EducationTimeline({ profile, theme, itemVariants }: SectionProps) {
    const colors = theme?.colors || {};
    const headingStyle = getHeadingStyle(theme);
    const educations = profile.educations || [];

    if (!educations.length) return null;

    return (
        <motion.section id="education" variants={itemVariants} className="max-w-5xl mx-auto px-6 py-6 scroll-mt-28">
            <SectionCard colors={colors}>
                <div className="flex items-center gap-3 mb-10">
                <div className="p-3 rounded-xl" style={{ backgroundColor: colors.accent }}>
                    <GraduationCap className="w-6 h-6" style={{ color: colors.background }} />
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold" style={{ ...headingStyle, color: colors.primary }}>Education</h2>
            </div>
            <div className="space-y-6">
                {educations.map((edu: any, idx: number) => (
                    <motion.div 
                        key={edu.id}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: idx * 0.1 }}
                        className="relative pl-10"
                    >
                        <div className="absolute left-0 top-0 bottom-0 w-px" style={{ backgroundColor: colors.primary, opacity: 0.15 }} />
                        <div className="absolute w-4 h-4 rounded-full -left-[7px] top-2" style={{ backgroundColor: colors.accent }} />
                        <div className="pb-8 last:pb-0">
                            <h3 className="text-xl font-bold mb-1.5" style={{ color: colors.primary }}>{edu.degree}</h3>
                            <div className="flex items-center gap-2 text-sm mb-3" style={{ color: colors.accent }}>
                                <MapPin className="w-4 h-4" />
                                <span className="font-medium">{edu.institution}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm mb-3" style={{ color: colors.textSecondary }}>
                                <Calendar className="w-4 h-4" />
                                <span>{edu.startYear} — {edu.endYear || "Present"}</span>
                            </div>
                            {edu.description && (
                                <div className="p-4 rounded-xl" style={{ backgroundColor: colors.surface }}>
                                    <p className="whitespace-pre-line" style={{ color: colors.text }}>{edu.description}</p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                ))}
            </div>
            </SectionCard>
        </motion.section>
    );
}

export function EducationCards({ profile, theme, itemVariants }: SectionProps) {
    const colors = theme?.colors || {};
    const headingStyle = getHeadingStyle(theme);
    const educations = profile.educations || [];

    if (!educations.length) return null;

    return (
        <motion.section id="education" variants={itemVariants} className="max-w-5xl mx-auto px-6 py-12 scroll-mt-28">
            <div className="flex items-center gap-3 mb-10">
                <div className="p-3 rounded-xl" style={{ backgroundColor: colors.accent }}>
                    <Award className="w-6 h-6" style={{ color: colors.background }} />
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold" style={{ ...headingStyle, color: colors.primary }}>Education</h2>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
                {educations.map((edu: any, idx: number) => (
                    <motion.div
                        key={edu.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: idx * 0.1 }}
                        className="group p-6 rounded-2xl transition-all duration-300 hover:-translate-y-1"
                        style={{ 
                            backgroundColor: colors.surface,
                            boxShadow: `0 4px 20px ${colors.primary}10`,
                            border: `1px solid ${colors.primary}10`
                        }}
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div className="p-2.5 rounded-lg" style={{ backgroundColor: colors.accent }}>
                                <GraduationCap className="w-5 h-5" style={{ color: colors.background }} />
                            </div>
                            <span className="text-xs font-medium px-2.5 py-1 rounded-full" style={{ backgroundColor: colors.accent + "20", color: colors.accent }}>
                                {edu.startYear}
                            </span>
                        </div>
                        <h3 className="font-bold text-lg mb-1.5" style={{ color: colors.primary }}>{edu.degree}</h3>
                        <div className="flex items-center gap-1.5 text-sm mb-3" style={{ color: colors.accent }}>
                            <MapPin className="w-4 h-4" />
                            <span className="font-medium">{edu.institution}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs" style={{ color: colors.textSecondary }}>
                            <Calendar className="w-3.5 h-3.5" />
                            <span>{edu.startYear} — {edu.endYear || "Present"}</span>
                        </div>
                    </motion.div>
                ))}
            </div>
        </motion.section>
    );
}

export function EducationMinimal({ profile, theme, itemVariants }: SectionProps) {
    const colors = theme?.colors || {};
    const headingStyle = getHeadingStyle(theme);
    const educations = profile.educations || [];

    if (!educations.length) return null;

    return (
        <motion.section id="education" variants={itemVariants} className="max-w-3xl mx-auto px-6 py-12 scroll-mt-28">
            <div className="flex items-center gap-3 mb-8">
                <GraduationCap className="w-5 h-5" style={{ color: colors.accent }} />
                <h2 className="text-xl font-bold" style={{ ...headingStyle, color: colors.primary }}>Education</h2>
            </div>
            <div className="space-y-4">
                {educations.map((edu: any) => (
                    <div 
                        key={edu.id} 
                        className="flex items-center justify-between p-4 rounded-xl"
                        style={{ backgroundColor: colors.surface }}
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.accent }} />
                            <div>
                                <h3 className="font-semibold" style={{ color: colors.primary }}>{edu.degree}</h3>
                                <p className="text-sm" style={{ color: colors.textSecondary }}>{edu.institution}</p>
                            </div>
                        </div>
                        <span className="text-xs font-medium" style={{ color: colors.textSecondary }}>
                            {edu.startYear}
                        </span>
                    </div>
                ))}
            </div>
        </motion.section>
    );
}

export const educationSections = {
    timeline: EducationTimeline,
    cards: EducationCards,
    minimal: EducationMinimal,
};

// ===================== PROJECTS SECTIONS =====================

export function ProjectsGrid({ profile, theme, itemVariants }: SectionProps) {
    const colors = theme?.colors || {};
    const headingStyle = getHeadingStyle(theme);
    const projects = profile.projects || [];

    if (!projects.length) return null;

    return (
        <motion.section id="projects" variants={itemVariants} className="max-w-5xl mx-auto px-6 py-12 scroll-mt-28">
            <div className="flex items-center gap-3 mb-10">
                <div className="p-3 rounded-xl" style={{ backgroundColor: colors.accent }}>
                    <FolderGit2 className="w-6 h-6" style={{ color: colors.background }} />
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold" style={{ ...headingStyle, color: colors.primary }}>Projects</h2>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
                {projects.map((project: any, idx: number) => (
                    <motion.a
                        key={project.id}
                        href={project.projectUrl || "#"}
                        target={project.projectUrl ? "_blank" : undefined}
                        rel="noreferrer"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: idx * 0.1 }}
                        className="group p-6 rounded-2xl transition-all duration-300 hover:-translate-y-2"
                        style={{ 
                            backgroundColor: colors.surface,
                            boxShadow: `0 4px 20px ${colors.primary}10`,
                            border: `1px solid ${colors.primary}10`
                        }}
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div className="p-2.5 rounded-lg transition-colors group-hover:bg-accent" style={{ backgroundColor: colors.accent + "20" }}>
                                <Code className="w-5 h-5" style={{ color: colors.accent }} />
                            </div>
                            {project.projectUrl && (
                                <ExternalLink className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: colors.accent }} />
                            )}
                        </div>
                        <h3 className="font-bold text-lg mb-2 group-hover:text-accent transition-colors" style={{ color: colors.primary }}>{project.title}</h3>
                        <p className="text-sm leading-relaxed" style={{ color: colors.textSecondary }}>{project.description}</p>
                    </motion.a>
                ))}
            </div>
        </motion.section>
    );
}

export function ProjectsCards({ profile, theme, itemVariants }: SectionProps) {
    const colors = theme?.colors || {};
    const headingStyle = getHeadingStyle(theme);
    const projects = profile.projects || [];

    if (!projects.length) return null;

    return (
        <motion.section id="projects" variants={itemVariants} className="max-w-5xl mx-auto px-6 py-12 scroll-mt-28">
            <div className="flex items-center gap-3 mb-10">
                <div className="p-3 rounded-xl" style={{ backgroundColor: colors.accent }}>
                    <Code className="w-6 h-6" style={{ color: colors.background }} />
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold" style={{ ...headingStyle, color: colors.primary }}>Projects</h2>
            </div>
            <div className="space-y-4">
                {projects.map((project: any, idx: number) => (
                    <motion.a
                        key={project.id}
                        href={project.projectUrl || "#"}
                        target={project.projectUrl ? "_blank" : undefined}
                        rel="noreferrer"
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: idx * 0.1 }}
                        className="group flex items-center gap-5 p-5 rounded-2xl transition-all duration-300 hover:-translate-x-2"
                        style={{ 
                            backgroundColor: colors.surface,
                            boxShadow: `0 4px 20px ${colors.primary}10`,
                            border: `1px solid ${colors.primary}10`
                        }}
                    >
                        <div className="p-3 rounded-xl flex-shrink-0 transition-colors group-hover:bg-accent" style={{ backgroundColor: colors.accent + "20" }}>
                            <FolderGit2 className="w-6 h-6" style={{ color: colors.accent }} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2 mb-1">
                                <h3 className="font-bold truncate" style={{ color: colors.primary }}>{project.title}</h3>
                                {project.projectUrl && (
                                    <ExternalLink className="w-4 h-4 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: colors.accent }} />
                                )}
                            </div>
                            <p className="text-sm truncate" style={{ color: colors.textSecondary }}>{project.description}</p>
                        </div>
                    </motion.a>
                ))}
            </div>
        </motion.section>
    );
}

export function ProjectsList({ profile, theme, itemVariants }: SectionProps) {
    const colors = theme?.colors || {};
    const headingStyle = getHeadingStyle(theme);
    const projects = profile.projects || [];

    if (!projects.length) return null;

    return (
        <motion.section id="projects" variants={itemVariants} className="max-w-3xl mx-auto px-6 py-12 scroll-mt-28">
            <div className="flex items-center gap-3 mb-8">
                <div className="p-3 rounded-xl" style={{ backgroundColor: colors.accent }}>
                    <FolderGit2 className="w-6 h-6" style={{ color: colors.background }} />
                </div>
                <h2 className="text-2xl font-bold" style={{ ...headingStyle, color: colors.primary }}>Projects</h2>
            </div>
            <div className="space-y-3">
                {projects.map((project: any, idx: number) => (
                    <motion.a
                        key={project.id}
                        href={project.projectUrl || "#"}
                        target={project.projectUrl ? "_blank" : undefined}
                        rel="noreferrer"
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: idx * 0.05 }}
                        className="group flex items-center justify-between p-4 rounded-xl transition-all hover:pl-6"
                        style={{ backgroundColor: colors.surface }}
                    >
                        <div className="flex items-center gap-3">
                            <FolderGit2 className="w-5 h-5" style={{ color: colors.accent }} />
                            <span className="font-medium" style={{ color: colors.primary }}>{project.title}</span>
                        </div>
                        {project.projectUrl && (
                            <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: colors.accent }} />
                        )}
                    </motion.a>
                ))}
            </div>
        </motion.section>
    );
}

export function ProjectsMasonry({ profile, theme, itemVariants }: SectionProps) {
    const colors = theme?.colors || {};
    const headingStyle = getHeadingStyle(theme);
    const projects = profile.projects || [];

    if (!projects.length) return null;

    return (
        <motion.section id="projects" variants={itemVariants} className="max-w-5xl mx-auto px-6 py-12 scroll-mt-28">
            <div className="flex items-center gap-3 mb-10">
                <div className="p-3 rounded-xl" style={{ backgroundColor: colors.accent }}>
                    <FolderGit2 className="w-6 h-6" style={{ color: colors.background }} />
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold" style={{ ...headingStyle, color: colors.primary }}>Projects</h2>
            </div>
            <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
                {projects.map((project: any, idx: number) => (
                    <motion.a
                        key={project.id}
                        href={project.projectUrl || "#"}
                        target={project.projectUrl ? "_blank" : undefined}
                        rel="noreferrer"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: idx * 0.05 }}
                        className="block p-5 rounded-2xl break-inside-avoid transition-all hover:-translate-y-1"
                        style={{ 
                            backgroundColor: colors.surface,
                            boxShadow: `0 4px 20px ${colors.primary}10`,
                            border: `1px solid ${colors.primary}10`
                        }}
                    >
                        <div className="p-2 rounded-lg w-fit mb-3" style={{ backgroundColor: colors.accent + "20" }}>
                            <Code className="w-4 h-4" style={{ color: colors.accent }} />
                        </div>
                        <h3 className="font-bold mb-2" style={{ color: colors.primary }}>{project.title}</h3>
                        <p className="text-sm" style={{ color: colors.textSecondary }}>{project.description}</p>
                    </motion.a>
                ))}
            </div>
        </motion.section>
    );
}

export const projectSections = {
    grid: ProjectsGrid,
    cards: ProjectsCards,
    list: ProjectsList,
    masonry: ProjectsMasonry,
};
