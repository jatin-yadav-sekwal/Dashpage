import { motion } from "framer-motion";
import { Mail, Phone, Github, Linkedin, Twitter, Instagram, Youtube, Globe, ArrowRight } from "lucide-react";
import { PublicProfile } from "@shared/types";

interface SectionProps {
    profile: PublicProfile;
    theme: any;
    itemVariants: any;
}

export function ContactSection({ profile, theme, itemVariants }: SectionProps) {
    const colors = theme?.colors || {};
    const headingStyle = {
        fontFamily: theme?.fonts?.heading || "Inter",
    };
    const socialLinks: any = profile.socialLinks || {};
    const hasContact = Object.values(socialLinks).some(v => v);

    if (!hasContact) return null;

    const contactItems = [
        { key: 'email', icon: Mail, label: 'Email', value: socialLinks.email, action: `mailto:${socialLinks.email}`, cta: 'Send Email' },
        { key: 'phone', icon: Phone, label: 'Phone', value: socialLinks.phone, action: `tel:${socialLinks.phone}`, cta: 'Call Now' },
        { key: 'website', icon: Globe, label: 'Website', value: socialLinks.website, action: socialLinks.website, cta: 'Visit Site', external: true },
        { key: 'github', icon: Github, label: 'GitHub', value: socialLinks.github, action: socialLinks.github, cta: 'View Profile', external: true },
        { key: 'linkedin', icon: Linkedin, label: 'LinkedIn', value: socialLinks.linkedin, action: socialLinks.linkedin, cta: 'Connect', external: true },
        { key: 'twitter', icon: Twitter, label: 'Twitter', value: socialLinks.twitter, action: socialLinks.twitter, cta: 'Follow', external: true },
        { key: 'instagram', icon: Instagram, label: 'Instagram', value: socialLinks.instagram, action: socialLinks.instagram, cta: 'Follow', external: true },
        { key: 'youtube', icon: Youtube, label: 'YouTube', value: socialLinks.youtube, action: socialLinks.youtube, cta: 'Subscribe', external: true },
    ].filter(item => item.value);

    const directContact = contactItems.slice(0, 3);
    const socials = contactItems.slice(3);

    return (
        <motion.section 
            id="contact" 
            variants={itemVariants} 
            className="max-w-5xl mx-auto px-6 py-16 scroll-mt-28"
        >
            <div className="flex items-center gap-3 mb-10">
                <div className="p-3 rounded-xl" style={{ backgroundColor: colors.accent }}>
                    <Mail className="w-6 h-6" style={{ color: colors.background }} />
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold" style={{ ...headingStyle, color: colors.primary }}>
                    Get in Touch
                </h2>
            </div>

            {/* Direct Contact Cards */}
            {directContact.length > 0 && (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-8">
                    {directContact.map((item, idx) => (
                        <motion.a
                            key={item.key}
                            href={item.action}
                            target={item.external ? "_blank" : undefined}
                            rel="noreferrer"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className="group p-5 rounded-2xl transition-all duration-300 hover:-translate-y-1"
                            style={{ 
                                backgroundColor: colors.surface,
                                boxShadow: `0 4px 20px ${colors.primary}10`,
                                border: `1px solid ${colors.primary}10`
                            }}
                        >
                            <div className="flex items-center gap-4 mb-4">
                                <div className="p-3 rounded-xl transition-colors group-hover:bg-accent" style={{ backgroundColor: colors.accent + "20" }}>
                                    <item.icon className="w-5 h-5" style={{ color: colors.accent }} />
                                </div>
                                <div>
                                    <p className="text-xs font-medium" style={{ color: colors.textSecondary }}>{item.label}</p>
                                    <p className="font-medium text-sm truncate max-w-[150px]" style={{ color: colors.primary }}>{item.value}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-1 text-sm font-medium" style={{ color: colors.accent }}>
                                <span>{item.cta}</span>
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </div>
                        </motion.a>
                    ))}
                </div>
            )}

            {/* Social Links */}
            {socials.length > 0 && (
                <div>
                    <h3 className="text-lg font-semibold mb-4" style={{ color: colors.primary }}>Social Profiles</h3>
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        {socials.map((item, idx) => (
                            <motion.a
                                key={item.key}
                                href={item.action}
                                target={item.external ? "_blank" : undefined}
                                rel="noreferrer"
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.05 }}
                                className="group flex items-center justify-between p-4 rounded-xl transition-all duration-200 hover:pl-6"
                                style={{ backgroundColor: colors.surface }}
                            >
                                <div className="flex items-center gap-3">
                                    <item.icon className="w-5 h-5" style={{ color: colors.accent }} />
                                    <span className="font-medium text-sm" style={{ color: colors.primary }}>{item.label}</span>
                                </div>
                                <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: colors.accent }} />
                            </motion.a>
                        ))}
                    </div>
                </div>
            )}
        </motion.section>
    );
}

export const contactSections = {
    default: ContactSection,
};
