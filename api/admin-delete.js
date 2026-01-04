export default async function handler(req, res) {
  // ✅ CORS HEADERS — MUST BE FIRST
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  // ✅ Handle preflight
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // ❌ Only allow DELETE
  if (req.method !== "DELETE") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { jobId, adminKey } = req.body;

  // 🔐 Admin secret check
  if (adminKey !== process.env.ADMIN_SECRET_KEY) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (!jobId) {
    return res.status(400).json({ error: "Job ID required" });
  }

  // 🗑 Delete from Supabase
  const response = await fetch(
    `${process.env.SUPABASE_URL}/rest/v1/jobs?id=eq.${jobId}`,
    {
      method: "DELETE",
      headers: {
        apikey: process.env.SUPABASE_SERVICE_ROLE_KEY,
        Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
      },
    }
  );

  if (!response.ok) {
    const text = await response.text();
    return res.status(500).json({ error: text });
  }

  return res.status(200).json({ success: true });
}

