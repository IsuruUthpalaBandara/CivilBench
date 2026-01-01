export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { jobId, adminKey } = req.body;

  if (!jobId || !adminKey) {
    return res.status(400).json({ error: "Missing parameters" });
  }

  if (adminKey !== process.env.ADMIN_SECRET) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const response = await fetch(
    `${process.env.SUPABASE_URL}/rest/v1/jobs?id=eq.${jobId}`,
    {
      method: "DELETE",
      headers: {
        apikey: process.env.SUPABASE_KEY,
        Authorization: `Bearer ${process.env.SUPABASE_KEY}`
      }
    }
  );

  if (!response.ok) {
    return res.status(500).json({ error: "Failed to delete job" });
  }

  res.status(200).json({ success: true });
}
