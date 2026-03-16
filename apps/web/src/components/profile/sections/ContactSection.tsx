import { motion } from "framer-motion";
import { Mail, Phone, Github, Linkedin, Twitter, Instagram, Youtube, Globe, ArrowRight, MessageCircle, Send, UserPlus } from "lucide-react";
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

export function ContactSection({ profile, theme, itemVariants }: SectionProps) {
    const colors = getColors(theme?.colors);
    const headingStyle = {
        fontFamily: theme?.fonts?.heading || "Inter",
    };
    const socialLinks: any = profile.socialLinks || {};
    
    // Always include email from profile if it exists
    const profileEmail = profile.email;
    
    // Check if there's any contact info (including profile email)
    const hasContact = !!(profileEmail || Object.values(socialLinks).some(v => v));

    if (!hasContact) return null;

    // Build contact items - always prioritize profile email, then social links
    const contactItems = [
        ...(profileEmail ? [{ key: 'email', icon: Mail, label: 'Email', value: profileEmail, action: `mailto:${profileEmail}`, cta: 'Send Email', iconBg: 'email' }] : []),
        ...(socialLinks.phone ? [{ key: 'phone', icon: Phone, label: 'Phone', value: socialLinks.phone, action: `tel:${socialLinks.phone}`, cta: 'Call Now', iconBg: 'phone' }] : []),
        ...(socialLinks.website ? [{ key: 'website', icon: Globe, label: 'Website', value: socialLinks.website, action: socialLinks.website, cta: 'Visit Site', external: true, iconBg: 'website' }] : []),
        { key: 'github', icon: Github, label: 'GitHub', value: socialLinks.github, action: socialLinks.github, cta: 'View Profile', external: true, iconBg: 'github' },
        { key: 'linkedin', icon: Linkedin, label: 'LinkedIn', value: socialLinks.linkedin, action: socialLinks.linkedin, cta: 'Connect', external: true, iconBg: 'linkedin' },
        { key: 'twitter', icon: Twitter, label: 'Twitter', value: socialLinks.twitter, action: socialLinks.twitter, cta: 'Follow', external: true, iconBg: 'twitter' },
        { key: 'instagram', icon: Instagram, label: 'Instagram', value: socialLinks.instagram, action: socialLinks.instagram, cta: 'Follow', external: true, iconBg: 'instagram' },
        { key: 'youtube', icon: Youtube, label: 'YouTube', value: socialLinks.youtube, action: socialLinks.youtube, cta: 'Subscribe', external: true, iconBg: 'youtube' },
    ].filter(item => item.value);

    const directContact = contactItems.slice(0, 3);
    const socials = contactItems.slice(3);

    const getIconBg = (type: string) => {
        const bgStyles: Record<string, { bg: string; icon: string }> = {
            email: { bg: hexToRgba(colors.accent, 0.15), icon: colors.accent },
            phone: { bg: hexToRgba('#22c55e', 0.15), icon: '#22c55e' },
            website: { bg: hexToRgba('#8b5cf6', 0.15), icon: '#8b5cf6' },
            github: { bg: hexToRgba('#333333', 0.15), icon: '#333333' },
            linkedin: { bg: hexToRgba('#0077b5', 0.15), icon: '#0077b5' },
            twitter: { bg: hexToRgba('#1da1f2', 0.15), icon: '#1da1f2' },
            instagram: { bg: hexToRgba('#e4405f', 0.15), icon: '#e4405f' },
            youtube: { bg: hexToRgba('#ff0000', 0.15), icon: '#ff0000' },
        };
        return bgStyles[type] || { bg: hexToRgba(colors.accent, 0.15), icon: colors.accent };
    };

    return (
        <motion.section 
            id="contact" 
            variants={itemVariants} 
            className="max-w-5xl mx-auto px-6 py-16 scroll-mt-28"
        >
            <SectionCard colors={colors}>
                <div className="flex items-center gap-3 mb-10">
                    <div className="p-3 rounded-xl" style={{ backgroundColor: colors.accent }}>
                        <MessageCircle className="w-6 h-6" style={{ color: colors.background }} />
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-bold" style={{ ...headingStyle, color: colors.primary }}>
                        Get in Touch
                    </h2>
                </div>

                {/* Direct Contact Cards */}
                {directContact.length > 0 && (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-10">
                        {directContact.map((item, idx) => {
                            const iconStyle = getIconBg(item.iconBg);
                            return (
                                <motion.a
                                    key={item.key}
                                    href={item.action}
                                    target={item.external ? "_blank" : undefined}
                                    rel="noreferrer"
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.1, duration: 0.4 }}
                                    className="group relative p-6 rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-2"
                                    style={{ 
                                        backgroundColor: hexToRgba(colors.surface, 0.5),
                                        border: `1px solid ${hexToRgba(colors.primary, 0.08)}`
                                    }}
                                >
                                    {/* Gradient top border on hover */}
                                    <div 
                                        className="absolute top-0 left-0 right-0 h-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                        style={{
                                            background: `linear-gradient(90deg, ${colors.accent}, ${hexToRgba(colors.accent, 0.5)})`
                                        }}
                                    />
                                    
                                    <div className="flex items-start gap-4">
                                        <div 
                                            className="p-3 rounded-xl transition-transform group-hover:scale-110"
                                            style={{ backgroundColor: iconStyle.bg }}
                                        >
                                            <item.icon className="w-5 h-5" style={{ color: iconStyle.icon }} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs font-medium mb-1" style={{ color: colors.textSecondary }}>
                                                {item.label}
                                            </p>
                                            <p 
                                                className="font-semibold text-sm truncate" 
                                                style={{ color: colors.primary }}
                                            >
                                                {item.value}
                                            </p>
                                        </div>
                                    </div>
                                    
                                    <div 
                                        className="flex items-center gap-1 text-sm font-medium mt-4 pt-3 border-t transition-colors duration-300"
                                        style={{ 
                                            borderColor: hexToRgba(colors.primary, 0.1),
                                            color: colors.accent 
                                        }}
                                    >
                                        <span>{item.cta}</span>
                                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                                    </div>
                                </motion.a>
                            );
                        })}
                    </div>
                )}

                {/* Social Links */}
                {socials.length > 0 && (
                    <div>
                        <div className="flex items-center gap-2 mb-6">
                            <UserPlus className="w-4 h-4" style={{ color: colors.textSecondary }} />
                            <h3 className="text-lg font-semibold" style={{ color: colors.primary }}>
                                Social Profiles
                            </h3>
                        </div>
                        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                            {socials.map((item, idx) => {
                                const iconStyle = getIconBg(item.iconBg);
                                return (
                                    <motion.a
                                        key={item.key}
                                        href={item.action}
                                        target={item.external ? "_blank" : undefined}
                                        rel="noreferrer"
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: idx * 0.05, duration: 0.3 }}
                                        className="group flex items-center justify-between p-4 rounded-xl transition-all duration-300 hover:pl-6"
                                        style={{ 
                                            backgroundColor: hexToRgba(colors.surface, 0.5),
                                            border: `1px solid ${hexToRgba(colors.primary, 0.06)}`
                                        }}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div 
                                                className="p-2 rounded-lg transition-transform group-hover:scale-110"
                                                style={{ backgroundColor: iconStyle.bg }}
                                            >
                                                <item.icon className="w-4 h-4" style={{ color: iconStyle.icon }} />
                                            </div>
                                            <span className="font-medium text-sm" style={{ color: colors.primary }}>
                                                {item.label}
                                            </span>
                                        </div>
                                        <div 
                                            className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0"
                                            style={{ 
                                                backgroundColor: hexToRgba(colors.accent, 0.1),
                                                color: colors.accent 
                                            }}
                                        >
                                            <ArrowRight className="w-4 h-4" />
                                        </div>
                                    </motion.a>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* CTA Banner */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                    className="mt-10 p-6 rounded-2xl text-center"
                    style={{ 
                        background: `linear-gradient(135deg, ${hexToRgba(colors.accent, 0.1)} 0%, ${hexToRgba(colors.primary, 0.05)} 100%)`,
                        border: `1px solid ${hexToRgba(colors.accent, 0.2)}`
                    }}
                >
                    <p className="text-sm mb-3" style={{ color: colors.textSecondary }}>
                        Feel free to reach out for collaborations, questions, or just to say hello!
                    </p>
                    <div className="flex items-center justify-center gap-2 text-sm font-medium" style={{ color: colors.accent }}>
                        <Send className="w-4 h-4" />
                        <span>Usually responds within 24 hours</span>
                    </div>
                </motion.div>
            </SectionCard>
        </motion.section>
    );
}

export const contactSections = {
    default: ContactSection,
};
