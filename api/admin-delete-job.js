export default async function handler(req, res) {
  // --- CORS ---
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "DELETE") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { jobId, adminKey } = req.body;

  if (adminKey !== process.env.ADMIN_SECRET_KEY) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const response = await fetch(
    `${process.env.SUPABASE_URL}/rest/v1/jobs?id=eq.${jobId}`,
    {
      method: "DELETE",
      headers: {
        apikey: process.env.SUPABASE_SERVICE_KEY,
        Authorization: `Bearer ${process.env.SUPABASE_SERVICE_KEY}`,
      },
    }
  );

  if (!response.ok) {
    return res.status(500).json({ error: "Delete failed" });
  }

  res.json({ success: true });
}


