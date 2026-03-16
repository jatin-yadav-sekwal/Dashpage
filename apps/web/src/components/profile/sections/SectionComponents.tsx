import { motion } from "framer-motion";
import { Building2, GraduationCap, FolderGit2, ExternalLink, MapPin, Calendar, Award, Code, ArrowRight, Clock, Users, BookOpen, Sparkles } from "lucide-react";
import { PublicProfile } from "@shared/types";

interface SectionProps {
    profile: PublicProfile;
    theme: any;
    itemVariants: any;
}

const DEFAULT_COLORS = {
    background: "#ffffff",
    surface: "#f8fafc",
    primary: "#0f172a",
    text: "#1e293b",
    textSecondary: "#64748b",
    accent: "#3b82f6"
};

const getHeadingStyle = (theme: any) => ({
    fontFamily: theme?.fonts?.heading || "Inter",
});

const getColors = (themeColors: any) => {
    if (!themeColors) return DEFAULT_COLORS;
    return {
        background: themeColors.background || DEFAULT_COLORS.background,
        surface: themeColors.surface || DEFAULT_COLORS.surface,
        primary: themeColors.primary || DEFAULT_COLORS.primary,
        text: themeColors.text || DEFAULT_COLORS.text,
        textSecondary: themeColors.textSecondary || DEFAULT_COLORS.textSecondary,
        accent: themeColors.accent || DEFAULT_COLORS.accent
    };
};

const hexToRgba = (hex: string | undefined, alpha: number) => {
    if (!hex) return `rgba(128, 128, 128, ${alpha})`;
    try {
        const cleanHex = hex.replace('#', '');
        if (cleanHex.length === 3) {
            const r = parseInt(cleanHex[0] + cleanHex[0], 16);
            const g = parseInt(cleanHex[1] + cleanHex[1], 16);
            const b = parseInt(cleanHex[2] + cleanHex[2], 16);
            return `rgba(${r}, ${g}, ${b}, ${alpha})`;
        }
        if (cleanHex.length === 6) {
            const r = parseInt(cleanHex.slice(0, 2), 16);
            const g = parseInt(cleanHex.slice(2, 4), 16);
            const b = parseInt(cleanHex.slice(4, 6), 16);
            return `rgba(${r}, ${g}, ${b}, ${alpha})`;
        }
    } catch (e) {
        return `rgba(128, 128, 128, ${alpha})`;
    }
    return `rgba(128, 128, 128, ${alpha})`;
};

const ProjectCard = ({ 
    project, 
    idx, 
    colors, 
    children, 
    className 
}: { 
    project: any; 
    idx: number; 
    colors: any; 
    children: React.ReactNode;
    className?: string;
}) => {
    const hasUrl = !!project.projectUrl;
    
    if (hasUrl) {
        return (
            <motion.a
                key={project.id}
                href={project.projectUrl}
                target="_blank"
                rel="noreferrer"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.4 }}
                className={className}
                style={{ 
                    backgroundColor: colors.surface,
                    boxShadow: `0 4px 24px ${hexToRgba(colors.primary, 0.08)}`,
                    border: `1px solid ${hexToRgba(colors.primary, 0.1)}`
                }}
            >
                {children}
            </motion.a>
        );
    }
    
    return (
        <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1, duration: 0.4 }}
            className={className}
            style={{ 
                backgroundColor: colors.surface,
                boxShadow: `0 4px 24px ${hexToRgba(colors.primary, 0.08)}`,
                border: `1px solid ${hexToRgba(colors.primary, 0.1)}`
            }}
        >
            {children}
        </motion.div>
    );
};

const SectionCard = ({ children, colors, className = "" }: { children: React.ReactNode; colors: any; className?: string }) => (
    <div 
        className={`rounded-3xl p-6 sm:p-10 ${className}`}
        style={{ 
            backgroundColor: colors.surface,
            border: `1px solid ${hexToRgba(colors.primary, 0.08)}`,
            boxShadow: `0 8px 40px ${hexToRgba(colors.primary, 0.06)}`
        }}
    >
        {children}
    </div>
);

// ===================== EXPERIENCE SECTIONS =====================

export function ExperienceTimeline({ profile, theme, itemVariants }: SectionProps) {
    const colors = getColors(theme?.colors);
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
                <div className="relative">
                    {/* Timeline line */}
                    <div 
                        className="absolute left-4 top-0 bottom-0 w-0.5" 
                        style={{ 
                            background: `linear-gradient(180deg, ${colors.accent} 0%, ${hexToRgba(colors.accent, 0.2)} 100%)`,
                            opacity: 0.3
                        }} 
                    />
                    
                    <div className="space-y-8">
                        {experiences.map((exp: any, idx: number) => (
                            <motion.div 
                                key={exp.id}
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.15, duration: 0.5 }}
                                className="relative pl-12"
                            >
                                {/* Timeline dot */}
                                <div 
                                    className="absolute left-2 top-2 w-5 h-5 rounded-full border-4"
                                    style={{ 
                                        backgroundColor: colors.background,
                                        borderColor: colors.accent,
                                        boxShadow: `0 0 0 4px ${hexToRgba(colors.accent, 0.15)}`
                                    }} 
                                />
                                
                                <motion.div 
                                    className="p-6 rounded-2xl relative overflow-hidden"
                                    style={{ 
                                        backgroundColor: hexToRgba(colors.surface, 0.5),
                                        border: `1px solid ${hexToRgba(colors.primary, 0.08)}`
                                    }}
                                    whileHover={{ scale: 1.01 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    {/* Gradient overlay on hover */}
                                    <div 
                                        className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                                        style={{
                                            background: `linear-gradient(135deg, ${hexToRgba(colors.accent, 0.05)} 0%, transparent 50%)`
                                        }}
                                    />
                                    
                                    <div className="relative">
                                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
                                            <div className="flex-1">
                                                <h3 className="text-xl font-bold mb-1" style={{ color: colors.primary }}>{exp.title}</h3>
                                                <div className="flex items-center gap-2 text-sm font-medium" style={{ color: colors.accent }}>
                                                    <Building2 className="w-4 h-4" />
                                                    <span>{exp.company}</span>
                                                </div>
                                            </div>
                                            <div 
                                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium"
                                                style={{ 
                                                    backgroundColor: hexToRgba(colors.accent, 0.1),
                                                    color: colors.accent
                                                }}
                                            >
                                                <Clock className="w-3 h-3" />
                                                <span>{exp.startDate} — {exp.endDate || "Present"}</span>
                                            </div>
                                        </div>
                                        
                                        {exp.description && (
                                            <div 
                                                className="mt-4 p-4 rounded-xl"
                                                style={{ 
                                                    backgroundColor: hexToRgba(colors.background, 0.5),
                                                    borderLeft: `3px solid ${colors.accent}`
                                                }}
                                            >
                                                <p className="whitespace-pre-line text-sm leading-relaxed" style={{ color: colors.text }}>
                                                    {exp.description}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </SectionCard>
        </motion.section>
    );
}

export function ExperienceCards({ profile, theme, itemVariants }: SectionProps) {
    const colors = getColors(theme?.colors);
    const headingStyle = getHeadingStyle(theme);
    const experiences = profile.experiences || [];

    if (!experiences.length) return null;

    return (
        <motion.section id="experience" variants={itemVariants} className="max-w-5xl mx-auto px-6 py-6 scroll-mt-28">
            <SectionCard colors={colors}>
                <div className="flex items-center gap-3 mb-10">
                    <div className="p-3 rounded-xl" style={{ backgroundColor: colors.accent }}>
                        <Users className="w-6 h-6" style={{ color: colors.background }} />
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
                            transition={{ delay: idx * 0.1, duration: 0.4 }}
                            className="group relative p-6 rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-2"
                            style={{ 
                                backgroundColor: colors.surface,
                                boxShadow: `0 4px 24px ${hexToRgba(colors.primary, 0.08)}`,
                                border: `1px solid ${hexToRgba(colors.primary, 0.1)}`
                            }}
                        >
                            {/* Gradient top border */}
                            <div 
                                className="absolute top-0 left-0 right-0 h-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                style={{
                                    background: `linear-gradient(90deg, ${colors.accent}, ${hexToRgba(colors.accent, 0.5)})`
                                }}
                            />
                            
                            <div className="flex items-start justify-between mb-4">
                                <div 
                                    className="p-3 rounded-xl transition-transform group-hover:scale-110"
                                    style={{ backgroundColor: hexToRgba(colors.accent, 0.15) }}
                                >
                                    <Building2 className="w-5 h-5" style={{ color: colors.accent }} />
                                </div>
                                <div 
                                    className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium"
                                    style={{ 
                                        backgroundColor: hexToRgba(colors.accent, 0.1),
                                        color: colors.accent
                                    }}
                                >
                                    <Calendar className="w-3 h-3" />
                                    <span>{exp.startDate?.split(',')[0]}</span>
                                </div>
                            </div>
                            
                            <h3 className="font-bold text-lg mb-1.5 group-hover:transition-colors" style={{ color: colors.primary }}>
                                {exp.title}
                            </h3>
                            <p className="text-sm font-semibold mb-3" style={{ color: colors.accent }}>{exp.company}</p>
                            
                            <div className="flex items-center gap-1.5 text-xs mb-4" style={{ color: colors.textSecondary }}>
                                <Clock className="w-3.5 h-3.5" />
                                <span>{exp.startDate} — {exp.endDate || "Present"}</span>
                            </div>
                            
                            {exp.description && (
                                <div 
                                    className="mt-4 pt-4 border-t"
                                    style={{ borderColor: hexToRgba(colors.primary, 0.1) }}
                                >
                                    <p className="text-sm leading-relaxed line-clamp-3" style={{ color: colors.text }}>
                                        {exp.description}
                                    </p>
                                </div>
                            )}
                            
                            {/* Arrow indicator */}
                            <div 
                                className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0"
                                style={{ color: colors.accent }}
                            >
                                <ArrowRight className="w-5 h-5" />
                            </div>
                        </motion.div>
                    ))}
                </div>
            </SectionCard>
        </motion.section>
    );
}

export function ExperienceMinimal({ profile, theme, itemVariants }: SectionProps) {
    const colors = getColors(theme?.colors);
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
                    {experiences.map((exp: any, idx: number) => (
                        <motion.div 
                            key={exp.id}
                            initial={{ opacity: 0, x: -10 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className="flex items-center justify-between p-4 rounded-xl group hover:scale-[1.01] transition-transform"
                            style={{ 
                                backgroundColor: hexToRgba(colors.surface, 0.5),
                                border: `1px solid ${hexToRgba(colors.primary, 0.06)}`
                            }}
                        >
                            <div className="flex items-center gap-4">
                                <div 
                                    className="w-3 h-3 rounded-full"
                                    style={{ 
                                        backgroundColor: colors.accent,
                                        boxShadow: `0 0 8px ${hexToRgba(colors.accent, 0.5)}`
                                    }} 
                                />
                                <div>
                                    <h3 className="font-semibold" style={{ color: colors.primary }}>{exp.title}</h3>
                                    <p className="text-sm" style={{ color: colors.textSecondary }}>{exp.company}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <span 
                                    className="text-xs font-medium px-2.5 py-1 rounded-full"
                                    style={{ 
                                        backgroundColor: hexToRgba(colors.accent, 0.1),
                                        color: colors.accent
                                    }}
                                >
                                    {exp.startDate?.split(',')[0]}
                                </span>
                            </div>
                        </motion.div>
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
    const colors = getColors(theme?.colors);
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
                <div className="relative">
                    {/* Timeline line */}
                    <div 
                        className="absolute left-4 top-0 bottom-0 w-0.5" 
                        style={{ 
                            background: `linear-gradient(180deg, ${colors.accent} 0%, ${hexToRgba(colors.accent, 0.2)} 100%)`,
                            opacity: 0.3
                        }} 
                    />
                    
                    <div className="space-y-8">
                        {educations.map((edu: any, idx: number) => (
                            <motion.div 
                                key={edu.id}
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.15, duration: 0.5 }}
                                className="relative pl-12"
                            >
                                {/* Timeline dot */}
                                <div 
                                    className="absolute left-2 top-2 w-5 h-5 rounded-full border-4"
                                    style={{ 
                                        backgroundColor: colors.background,
                                        borderColor: colors.accent,
                                        boxShadow: `0 0 0 4px ${hexToRgba(colors.accent, 0.15)}`
                                    }} 
                                />
                                
                                <motion.div 
                                    className="p-6 rounded-2xl relative overflow-hidden"
                                    style={{ 
                                        backgroundColor: hexToRgba(colors.surface, 0.5),
                                        border: `1px solid ${hexToRgba(colors.primary, 0.08)}`
                                    }}
                                    whileHover={{ scale: 1.01 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    {/* Gradient overlay on hover */}
                                    <div 
                                        className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                                        style={{
                                            background: `linear-gradient(135deg, ${hexToRgba(colors.accent, 0.05)} 0%, transparent 50%)`
                                        }}
                                    />
                                    
                                    <div className="relative">
                                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
                                            <div className="flex-1">
                                                <div 
                                                    className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium mb-2"
                                                    style={{ 
                                                        backgroundColor: hexToRgba(colors.accent, 0.15),
                                                        color: colors.accent
                                                    }}
                                                >
                                                    <BookOpen className="w-3 h-3" />
                                                    <span>Education</span>
                                                </div>
                                                <h3 className="text-xl font-bold mb-1" style={{ color: colors.primary }}>{edu.degree}</h3>
                                            </div>
                                            <div 
                                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium"
                                                style={{ 
                                                    backgroundColor: hexToRgba(colors.accent, 0.1),
                                                    color: colors.accent
                                                }}
                                            >
                                                <Calendar className="w-3 h-3" />
                                                <span>{edu.startYear} — {edu.endYear || "Present"}</span>
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-center gap-2 text-sm mb-3" style={{ color: colors.accent }}>
                                            <MapPin className="w-4 h-4" />
                                            <span className="font-medium">{edu.school || edu.institution}</span>
                                        </div>
                                        
                                        {edu.description && (
                                            <div 
                                                className="mt-4 p-4 rounded-xl"
                                                style={{ 
                                                    backgroundColor: hexToRgba(colors.background, 0.5),
                                                    borderLeft: `3px solid ${colors.accent}`
                                                }}
                                            >
                                                <p className="whitespace-pre-line text-sm leading-relaxed" style={{ color: colors.text }}>
                                                    {edu.description}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </SectionCard>
        </motion.section>
    );
}

export function EducationCards({ profile, theme, itemVariants }: SectionProps) {
    const colors = getColors(theme?.colors);
    const headingStyle = getHeadingStyle(theme);
    const educations = profile.educations || [];

    if (!educations.length) return null;

    return (
        <motion.section id="education" variants={itemVariants} className="max-w-5xl mx-auto px-6 py-12 scroll-mt-28">
            <SectionCard colors={colors}>
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
                            transition={{ delay: idx * 0.1, duration: 0.4 }}
                            className="group relative p-6 rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-2"
                            style={{ 
                                backgroundColor: colors.surface,
                                boxShadow: `0 4px 24px ${hexToRgba(colors.primary, 0.08)}`,
                                border: `1px solid ${hexToRgba(colors.primary, 0.1)}`
                            }}
                        >
                            {/* Gradient top border */}
                            <div 
                                className="absolute top-0 left-0 right-0 h-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                style={{
                                    background: `linear-gradient(90deg, ${colors.accent}, ${hexToRgba(colors.accent, 0.5)})`
                                }}
                            />
                            
                            <div className="flex items-start justify-between mb-4">
                                <div 
                                    className="p-3 rounded-xl transition-transform group-hover:scale-110"
                                    style={{ backgroundColor: hexToRgba(colors.accent, 0.15) }}
                                >
                                    <GraduationCap className="w-5 h-5" style={{ color: colors.accent }} />
                                </div>
                                <div 
                                    className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium"
                                    style={{ 
                                        backgroundColor: hexToRgba(colors.accent, 0.1),
                                        color: colors.accent
                                    }}
                                >
                                    <Calendar className="w-3 h-3" />
                                    <span>{edu.startYear}</span>
                                </div>
                            </div>
                            
                            <h3 className="font-bold text-lg mb-2" style={{ color: colors.primary }}>{edu.degree}</h3>
                            
                            <div className="flex items-center gap-2 text-sm mb-2" style={{ color: colors.accent }}>
                                <MapPin className="w-4 h-4" />
                                <span className="font-medium">{edu.school || edu.institution}</span>
                            </div>
                            
                            <div className="flex items-center gap-1.5 text-xs" style={{ color: colors.textSecondary }}>
                                <Clock className="w-3.5 h-3.5" />
                                <span>{edu.startYear} — {edu.endYear || "Present"}</span>
                            </div>
                            
                            {edu.description && (
                                <div 
                                    className="mt-4 pt-4 border-t"
                                    style={{ borderColor: hexToRgba(colors.primary, 0.1) }}
                                >
                                    <p className="text-sm leading-relaxed line-clamp-2" style={{ color: colors.text }}>
                                        {edu.description}
                                    </p>
                                </div>
                            )}
                            
                            {/* Badge */}
                            <div 
                                className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                            >
                                <div 
                                    className="flex items-center gap-1 px-2 py-1 rounded-full text-xs"
                                    style={{ 
                                        backgroundColor: hexToRgba(colors.accent, 0.1),
                                        color: colors.accent
                                    }}
                                >
                                    <Award className="w-3 h-3" />
                                    <span>Graduated</span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </SectionCard>
        </motion.section>
    );
}

export function EducationMinimal({ profile, theme, itemVariants }: SectionProps) {
    const colors = getColors(theme?.colors);
    const headingStyle = getHeadingStyle(theme);
    const educations = profile.educations || [];

    if (!educations.length) return null;

    return (
        <motion.section id="education" variants={itemVariants} className="max-w-3xl mx-auto px-6 py-12 scroll-mt-28">
            <SectionCard colors={colors}>
                <div className="flex items-center gap-3 mb-8">
                    <GraduationCap className="w-5 h-5" style={{ color: colors.accent }} />
                    <h2 className="text-xl font-bold" style={{ ...headingStyle, color: colors.primary }}>Education</h2>
                </div>
                <div className="space-y-4">
                    {educations.map((edu: any, idx: number) => (
                        <motion.div 
                            key={edu.id}
                            initial={{ opacity: 0, x: -10 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className="flex items-center justify-between p-4 rounded-xl group hover:scale-[1.01] transition-transform"
                            style={{ 
                                backgroundColor: hexToRgba(colors.surface, 0.5),
                                border: `1px solid ${hexToRgba(colors.primary, 0.06)}`
                            }}
                        >
                            <div className="flex items-center gap-4">
                                <div 
                                    className="w-3 h-3 rounded-full"
                                    style={{ 
                                        backgroundColor: colors.accent,
                                        boxShadow: `0 0 8px ${hexToRgba(colors.accent, 0.5)}`
                                    }} 
                                />
                                <div>
                                    <h3 className="font-semibold" style={{ color: colors.primary }}>{edu.degree}</h3>
                                    <p className="text-sm" style={{ color: colors.textSecondary }}>{edu.school || edu.institution}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <span 
                                    className="text-xs font-medium px-2.5 py-1 rounded-full"
                                    style={{ 
                                        backgroundColor: hexToRgba(colors.accent, 0.1),
                                        color: colors.accent
                                    }}
                                >
                                    {edu.startYear}
                                </span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </SectionCard>
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
    const colors = getColors(theme?.colors);
    const headingStyle = getHeadingStyle(theme);
    const projects = profile.projects || [];

    if (!projects.length) return null;

    return (
        <motion.section id="projects" variants={itemVariants} className="max-w-5xl mx-auto px-6 py-12 scroll-mt-28">
            <SectionCard colors={colors}>
                <div className="flex items-center gap-3 mb-10">
                    <div className="p-3 rounded-xl" style={{ backgroundColor: colors.accent }}>
                        <FolderGit2 className="w-6 h-6" style={{ color: colors.background }} />
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-bold" style={{ ...headingStyle, color: colors.primary }}>Projects</h2>
                </div>
                <div className="grid gap-5 sm:grid-cols-2">
                    {projects.map((project: any, idx: number) => (
                        <ProjectCard
                            key={project.id}
                            project={project}
                            idx={idx}
                            colors={colors}
                            className="group p-6 rounded-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer"
                        >
                            {/* Gradient top border on hover */}
                            <div 
                                className="absolute top-0 left-0 right-0 h-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-t-2xl"
                                style={{
                                    background: `linear-gradient(90deg, ${colors.accent}, ${hexToRgba(colors.accent, 0.5)})`
                                }}
                            />
                            
                            <div className="flex items-start justify-between mb-4">
                                <div 
                                    className="p-3 rounded-xl transition-all duration-300 group-hover:scale-110"
                                    style={{ backgroundColor: hexToRgba(colors.accent, 0.15) }}
                                >
                                    <Code className="w-5 h-5" style={{ color: colors.accent }} />
                                </div>
                                {project.projectUrl && (
                                    <div 
                                        className="p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0"
                                        style={{ 
                                            backgroundColor: hexToRgba(colors.accent, 0.1),
                                            color: colors.accent 
                                        }}
                                    >
                                        <ExternalLink className="w-4 h-4" />
                                    </div>
                                )}
                            </div>
                            
                            <h3 
                                className="font-bold text-lg mb-2 transition-colors duration-300" 
                                style={{ color: colors.primary }}
                            >
                                {project.title}
                            </h3>
                            
                            <p 
                                className="text-sm leading-relaxed line-clamp-3 mb-4" 
                                style={{ color: colors.textSecondary }}
                            >
                                {project.description}
                            </p>
                            
                            {/* View project indicator */}
                            {project.projectUrl && (
                                <div 
                                    className="flex items-center gap-2 text-xs font-medium pt-3 border-t transition-colors duration-300"
                                    style={{ 
                                        borderColor: hexToRgba(colors.primary, 0.1),
                                        color: colors.accent 
                                    }}
                                >
                                    <span>View Project</span>
                                    <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
                                </div>
                            )}
                        </ProjectCard>
                    ))}
                </div>
            </SectionCard>
        </motion.section>
    );
}

export function ProjectsCards({ profile, theme, itemVariants }: SectionProps) {
    const colors = getColors(theme?.colors);
    const headingStyle = getHeadingStyle(theme);
    const projects = profile.projects || [];

    if (!projects.length) return null;

    return (
        <motion.section id="projects" variants={itemVariants} className="max-w-5xl mx-auto px-6 py-12 scroll-mt-28">
            <SectionCard colors={colors}>
                <div className="flex items-center gap-3 mb-10">
                    <div className="p-3 rounded-xl" style={{ backgroundColor: colors.accent }}>
                        <Sparkles className="w-6 h-6" style={{ color: colors.background }} />
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-bold" style={{ ...headingStyle, color: colors.primary }}>Projects</h2>
                </div>
                <div className="space-y-4">
                    {projects.map((project: any, idx: number) => (
                        <ProjectCard
                            key={project.id}
                            project={project}
                            idx={idx}
                            colors={colors}
                            className="group flex items-center gap-5 p-5 rounded-2xl transition-all duration-300 hover:-translate-x-2"
                        >
                            <div 
                                className="p-4 rounded-xl flex-shrink-0 transition-all duration-300 group-hover:scale-110"
                                style={{ backgroundColor: hexToRgba(colors.accent, 0.15) }}
                            >
                                <FolderGit2 className="w-6 h-6" style={{ color: colors.accent }} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-2 mb-1">
                                    <h3 className="font-bold truncate" style={{ color: colors.primary }}>{project.title}</h3>
                                    {project.projectUrl && (
                                        <div 
                                            className="p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300"
                                            style={{ 
                                                backgroundColor: hexToRgba(colors.accent, 0.1),
                                                color: colors.accent 
                                            }}
                                        >
                                            <ExternalLink className="w-4 h-4" />
                                        </div>
                                    )}
                                </div>
                                <p className="text-sm truncate" style={{ color: colors.textSecondary }}>{project.description}</p>
                            </div>
                        </ProjectCard>
                    ))}
                </div>
            </SectionCard>
        </motion.section>
    );
}

export function ProjectsList({ profile, theme, itemVariants }: SectionProps) {
    const colors = getColors(theme?.colors);
    const headingStyle = getHeadingStyle(theme);
    const projects = profile.projects || [];

    if (!projects.length) return null;

    return (
        <motion.section id="projects" variants={itemVariants} className="max-w-3xl mx-auto px-6 py-12 scroll-mt-28">
            <SectionCard colors={colors}>
                <div className="flex items-center gap-3 mb-8">
                    <div className="p-3 rounded-xl" style={{ backgroundColor: colors.accent }}>
                        <FolderGit2 className="w-6 h-6" style={{ color: colors.background }} />
                    </div>
                    <h2 className="text-2xl font-bold" style={{ ...headingStyle, color: colors.primary }}>Projects</h2>
                </div>
                <div className="space-y-3">
                    {projects.map((project: any, idx: number) => (
                        <ProjectCard
                            key={project.id}
                            project={project}
                            idx={idx}
                            colors={colors}
                            className="group flex items-center justify-between p-4 rounded-xl transition-all duration-300 hover:pl-6"
                        >
                            <div className="flex items-center gap-3">
                                <div 
                                    className="p-2 rounded-lg"
                                    style={{ backgroundColor: hexToRgba(colors.accent, 0.15) }}
                                >
                                    <FolderGit2 className="w-5 h-5" style={{ color: colors.accent }} />
                                </div>
                                <span className="font-medium" style={{ color: colors.primary }}>{project.title}</span>
                            </div>
                            {project.projectUrl && (
                                <div 
                                    className="p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300"
                                    style={{ 
                                        backgroundColor: hexToRgba(colors.accent, 0.1),
                                        color: colors.accent 
                                    }}
                                >
                                    <ExternalLink className="w-4 h-4" />
                                </div>
                            )}
                        </ProjectCard>
                    ))}
                </div>
            </SectionCard>
        </motion.section>
    );
}

export function ProjectsMasonry({ profile, theme, itemVariants }: SectionProps) {
    const colors = getColors(theme?.colors);
    const headingStyle = getHeadingStyle(theme);
    const projects = profile.projects || [];

    if (!projects.length) return null;

    return (
        <motion.section id="projects" variants={itemVariants} className="max-w-5xl mx-auto px-6 py-12 scroll-mt-28">
            <SectionCard colors={colors}>
                <div className="flex items-center gap-3 mb-10">
                    <div className="p-3 rounded-xl" style={{ backgroundColor: colors.accent }}>
                        <FolderGit2 className="w-6 h-6" style={{ color: colors.background }} />
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-bold" style={{ ...headingStyle, color: colors.primary }}>Projects</h2>
                </div>
                <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
                    {projects.map((project: any, idx: number) => (
                        <ProjectCard
                            key={project.id}
                            project={project}
                            idx={idx}
                            colors={colors}
                            className="block p-5 rounded-2xl break-inside-avoid transition-all hover:-translate-y-1"
                        >
                            <div className="p-2 rounded-lg w-fit mb-3" style={{ backgroundColor: hexToRgba(colors.accent, 0.15) }}>
                                <Code className="w-4 h-4" style={{ color: colors.accent }} />
                            </div>
                            <h3 className="font-bold mb-2" style={{ color: colors.primary }}>{project.title}</h3>
                            <p className="text-sm" style={{ color: colors.textSecondary }}>{project.description}</p>
                        </ProjectCard>
                    ))}
                </div>
            </SectionCard>
        </motion.section>
    );
}

export const projectSections = {
    grid: ProjectsGrid,
    cards: ProjectsCards,
    list: ProjectsList,
    masonry: ProjectsMasonry,
};
