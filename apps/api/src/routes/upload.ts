import { Hono } from "hono";
import type { Env } from "../middleware/auth";
import { authMiddleware } from "../middleware/auth";
import { profileService } from "../services/profileService";
import { string } from "zod";

const uploadRoutes = new Hono<Env>();

// ============================================
// AVATAR UPLOAD — POST /me/avatar
// ============================================
uploadRoutes.post("/me/avatar", authMiddleware, async (c) => {
  const userId = c.get("userId");
  const profile = await profileService.getByUserId(userId);

  if (!profile) {
    return c.json({ error: "Profile not found" }, 404);
  }

  const body = await c.req.parseBody();
  const file = body["file"];

  if (!file || !(file instanceof File)) {
    return c.json({ error: "No file uploaded" }, 400);
  }

  // Validate file type
  const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  if (!allowedTypes.includes(file.type)) {
    return c.json({ error: "Invalid file type. Only JPEG, PNG, WebP, and GIF allowed." }, 400);
  }

  // Validate file size (2MB max)
  if (file.size > 2 * 1024 * 1024) {
    return c.json({ error: "File too large. Max 2MB." }, 400);
  }

  const ext = file.name.split(".").pop() || "jpg";
  const path = `${userId}/${Date.now()}.${ext}`;

  // Upload to Supabase Storage
  const supabaseUrl = c.env.SUPABASE_URL;
  const supabaseServiceKey = c.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    return c.json({ error: "Storage not configured" }, 500);
  }

  const arrayBuffer = await file.arrayBuffer();
  const bucketName = "avatar";
  const objectPath = `${userId}/${Date.now()}.${ext}`;
  
  // Construct upload URL
  const uploadUrl = `${supabaseUrl}/storage/v1/object/${encodeURIComponent(bucketName)}/${encodeURIComponent(objectPath)}`;
  
  console.log("Uploading to bucket:", bucketName);
  console.log("Upload URL:", uploadUrl);
  
  try {
    const uploadRes = await fetch(uploadUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${supabaseServiceKey}`,
        "Content-Type": file.type,
        "x-upsert": "true",
      },
      body: arrayBuffer,
    });

    if (!uploadRes.ok) {
      const err = await uploadRes.text();
      console.error("Storage upload failed:", err);
      console.error("Status:", uploadRes.status);
      console.error("Status text:", uploadRes.statusText);
      return c.json({ error: `Upload failed: ${err}` }, 500);
    }

    // Build public URL
    const avatarUrl = `${supabaseUrl}/storage/v1/object/public/${encodeURIComponent(bucketName)}/${encodeURIComponent(objectPath)}`;
    
    // Update profile with new avatar URL
    await profileService.update(userId, { avatarUrl });

    return c.json({ data: { avatarUrl } });
  } catch (error:any) {
    console.error("Error during upload:", error);
    return c.json({ error: "Upload error: " + error.message}, 500);
  }
});

// ============================================
// PROJECT IMAGE UPLOAD — POST /me/projects/:id/image
// ============================================
uploadRoutes.post("/me/projects/:id/image", authMiddleware, async (c) => {
  const userId = c.get("userId");
  const { id } = c.req.param();
  const profile = await profileService.getByUserId(userId);

  if (!profile) {
    return c.json({ error: "Profile not found" }, 404);
  }

  const body = await c.req.parseBody();
  const file = body["file"];

  if (!file || !(file instanceof File)) {
    return c.json({ error: "No file uploaded" }, 400);
  }

  const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  if (!allowedTypes.includes(file.type)) {
    return c.json({ error: "Invalid file type" }, 400);
  }

  if (file.size > 5 * 1024 * 1024) {
    return c.json({ error: "File too large. Max 5MB." }, 400);
  }

  const ext = file.name.split(".").pop() || "jpg";
  const path = `${userId}/${id}/${Date.now()}.${ext}`;

  const supabaseUrl = c.env.SUPABASE_URL;
  const supabaseServiceKey = c.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    return c.json({ error: "Storage not configured" }, 500);
  }

  const arrayBuffer = await file.arrayBuffer();
  const uploadRes = await fetch(
    `${supabaseUrl}/storage/v1/object/projects/${path}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${supabaseServiceKey}`,
        "Content-Type": file.type,
        "x-upsert": "true",
      },
      body: arrayBuffer,
    }
  );

  if (!uploadRes.ok) {
    const err = await uploadRes.text();
    console.error("Storage upload failed:", err);
    return c.json({ error: "Upload failed" }, 500);
  }

  const imageUrl = `${supabaseUrl}/storage/v1/object/public/projects/${path}`;

  // Import projectService inline to update the project
  const { projectService } = await import("../services/projectService");
  const updated = await projectService.update(id, profile.id , { imageUrl });

  if (!updated) {
    return c.json({ error: "Project not found" }, 404);
  }

  return c.json({ data: { imageUrl } });
});

// ============================================
// PROJECT IMAGE DELETE — DELETE /me/projects/:id/image
// ============================================
uploadRoutes.delete("/me/projects/:id/image", authMiddleware, async (c) => {
  const userId = c.get("userId");
  const { id } = c.req.param();
  const profile = await profileService.getByUserId(userId);

  if (!profile) {
    return c.json({ error: "Profile not found" }, 404);
  }

  const { projectService } = await import("../services/projectService");
  const updated = await projectService.update(id, profile.id, { imageUrl: null });

  if (!updated) {
    return c.json({ error: "Project not found" }, 404);
  }

  return c.json({ success: true });
});

export default uploadRoutes;
