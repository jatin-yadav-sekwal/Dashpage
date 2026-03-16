#!/usr/bin/env node

/**
 * Script to verify and configure the profile picture bucket in Supabase
 */

import { createClient } from "@supabase/supabase-js";

// Get Supabase credentials from environment
const SUPABASE_URL = process.env.SUPABASE_URL || "https://pwxcyrnwhphtdibkswnl.supabase.co";
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_SERVICE_KEY) {
  console.error("Error: SUPABASE_SERVICE_ROLE_KEY must be set");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function setupAvatarBucket() {
  console.log("🔧 Setting up 'avatar' bucket...\n");

  try {
    // 1. List all buckets
    console.log("1. Checking existing buckets...");
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    if (listError) {
      console.error("❌ Error listing buckets:", listError.message);
      return;
    }

    const avatarBucket = buckets?.find((b) => b.name === "avatar");

    if (!avatarBucket) {
      console.log("   'avatar' bucket not found. Creating...\n");

      // 2. Create the bucket
      const { error: createError } = await supabase.storage.createBucket("avatar", {
        public: true,
        file_size_limit: "2MB",
        allowed_mime_types: ["image/jpeg", "image/png", "image/webp", "image/gif"],
      });

      if (createError) {
        console.error("❌ Error creating bucket:", createError.message);
        return;
      }

      console.log("   ✅ Bucket 'avatar' created successfully!\n");
    } else {
      console.log("   ✅ Bucket 'avatar' already exists");
      console.log(`   Public: ${avatarBucket.public}`);
      console.log(`   Size limit: ${avatarBucket.file_size_limit}`);
      console.log(`   Allowed types: ${avatarBucket.allowed_mime_types?.join(", ")}\n`);
    }

    // 3. Verify bucket is public
    console.log("2. Checking bucket permissions...");
    const { error: updateError } = await supabase.storage.updateBucket("avatar", {
      public: true,
      file_size_limit: "2MB",
      allowed_mime_types: ["image/jpeg", "image/png", "image/webp", "image/gif"],
    });

    if (updateError) {
      console.error("❌ Error updating bucket:", updateError.message);
      return;
    }

    console.log("   ✅ Bucket is public and configured correctly\n");

    // 4. Test upload path
    console.log("3. Upload configuration:");
    console.log(`   Bucket: avatar`);
    console.log(`   Upload URL: ${SUPABASE_URL}/storage/v1/object/avatar/{path}`);
    console.log(`   Public URL: ${SUPABASE_URL}/storage/v1/object/public/avatar/{path}`);
    console.log("\n✅ Avatar bucket is ready for uploads!\n");

  } catch (error) {
    console.error("❌ Unexpected error:", error);
  }
}

setupAvatarBucket();
