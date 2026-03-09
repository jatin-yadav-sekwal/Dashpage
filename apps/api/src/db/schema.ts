import {
  pgTable,
  uuid,
  text,
  boolean,
  integer,
  date,
  jsonb,
  timestamp,
  uniqueIndex,
  index,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ============================================
// PROFILES — one per user, the heart of Dashpage
// ============================================
export const profiles = pgTable(
  "profiles",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id").notNull().unique(), // FK to Supabase auth.users
    username: text("username").notNull().unique(),
    fullName: text("full_name").notNull(),
    tagline: text("tagline").default(""),
    bio: text("bio").default(""),
    avatarUrl: text("avatar_url"),
    email: text("email").notNull(),
    phone: text("phone"),
    location: text("location"),
    socialLinks: jsonb("social_links").default({}).$type<Record<string, string>>(),
    themeId: uuid("theme_id"),
    isPublished: boolean("is_published").default(false).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("profiles_username_idx").on(table.username),
    index("profiles_user_id_idx").on(table.userId),
  ]
);

// ============================================
// PROFILE TAGS — searchable tags for bookmark search
// ============================================
export const profileTags = pgTable(
  "profile_tags",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    profileId: uuid("profile_id")
      .notNull()
      .references(() => profiles.id, { onDelete: "cascade" }),
    tag: text("tag").notNull(),
  },
  (table) => [
    uniqueIndex("profile_tags_unique_idx").on(table.profileId, table.tag),
    index("profile_tags_tag_idx").on(table.tag),
  ]
);

// ============================================
// EXPERIENCES — work experience (resume section)
// ============================================
export const experiences = pgTable(
  "experiences",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    profileId: uuid("profile_id")
      .notNull()
      .references(() => profiles.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    company: text("company").notNull(),
    startDate: date("start_date").notNull(),
    endDate: date("end_date"), // null = "Present"
    description: text("description").default(""),
    sortOrder: integer("sort_order").default(0).notNull(),
  },
  (table) => [index("experiences_profile_idx").on(table.profileId)]
);

// ============================================
// EDUCATIONS — education history (resume section)
// ============================================
export const educations = pgTable(
  "educations",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    profileId: uuid("profile_id")
      .notNull()
      .references(() => profiles.id, { onDelete: "cascade" }),
    degree: text("degree").notNull(),
    institution: text("institution").notNull(),
    startYear: integer("start_year").notNull(),
    endYear: integer("end_year"),
    description: text("description"),
    sortOrder: integer("sort_order").default(0).notNull(),
  },
  (table) => [index("educations_profile_idx").on(table.profileId)]
);

// ============================================
// PROJECTS — work showcase
// ============================================
export const projects = pgTable(
  "projects",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    profileId: uuid("profile_id")
      .notNull()
      .references(() => profiles.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    description: text("description").default(""),
    imageUrl: text("image_url"),
    projectUrl: text("project_url"),
    sortOrder: integer("sort_order").default(0).notNull(),
  },
  (table) => [index("projects_profile_idx").on(table.profileId)]
);

// ============================================
// THEMES — pre-built themes (free + premium)
// ============================================
export const themes = pgTable(
  "themes",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull(),
    slug: text("slug").notNull().unique(),
    previewImage: text("preview_image").default(""),
    config: jsonb("config").notNull().$type<{
      colors: {
        background: string;
        surface: string;
        primary: string;
        text: string;
        textSecondary: string;
        accent: string;
      };
      fonts: { heading: string; body: string };
      layout: string;
      borderRadius: string;
      heroStyle: string;
    }>(),
    isPremium: boolean("is_premium").default(false).notNull(),
    price: integer("price"), // in paisa (₹)
  },
  (table) => [uniqueIndex("themes_slug_idx").on(table.slug)]
);

// ============================================
// BOOKMARKS — users saving other profiles
// ============================================
export const bookmarks = pgTable(
  "bookmarks",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id").notNull(), // FK to Supabase auth.users
    profileId: uuid("profile_id")
      .notNull()
      .references(() => profiles.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("bookmarks_unique_idx").on(table.userId, table.profileId),
    index("bookmarks_user_idx").on(table.userId),
  ]
);

// ============================================
// PURCHASES — one-time theme purchases (Razorpay)
// ============================================
export const purchases = pgTable(
  "purchases",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id").notNull(),
    themeId: uuid("theme_id")
      .notNull()
      .references(() => themes.id),
    razorpayPaymentId: text("razorpay_payment_id"),
    razorpayOrderId: text("razorpay_order_id"),
    amount: integer("amount").notNull(), // in paisa
    status: text("status").default("created").notNull(), // created | success | failed
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("purchases_user_idx").on(table.userId),
    index("purchases_theme_idx").on(table.themeId),
  ]
);

// ============================================
// RELATIONS (for Drizzle relational queries)
// ============================================
export const profilesRelations = relations(profiles, ({ many, one }) => ({
  tags: many(profileTags),
  experiences: many(experiences),
  educations: many(educations),
  projects: many(projects),
  bookmarkedBy: many(bookmarks),
  theme: one(themes, {
    fields: [profiles.themeId],
    references: [themes.id],
  }),
}));

export const profileTagsRelations = relations(profileTags, ({ one }) => ({
  profile: one(profiles, {
    fields: [profileTags.profileId],
    references: [profiles.id],
  }),
}));

export const experiencesRelations = relations(experiences, ({ one }) => ({
  profile: one(profiles, {
    fields: [experiences.profileId],
    references: [profiles.id],
  }),
}));

export const educationsRelations = relations(educations, ({ one }) => ({
  profile: one(profiles, {
    fields: [educations.profileId],
    references: [profiles.id],
  }),
}));

export const projectsRelations = relations(projects, ({ one }) => ({
  profile: one(profiles, {
    fields: [projects.profileId],
    references: [profiles.id],
  }),
}));

export const bookmarksRelations = relations(bookmarks, ({ one }) => ({
  profile: one(profiles, {
    fields: [bookmarks.profileId],
    references: [profiles.id],
  }),
}));

export const purchasesRelations = relations(purchases, ({ one }) => ({
  theme: one(themes, {
    fields: [purchases.themeId],
    references: [themes.id],
  }),
}));
