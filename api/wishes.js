import { kv } from "@vercel/kv";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { from, message } = req.body;

    if (!from || !message) {
      return res.status(400).json({ error: "Missing fields" });
    }

    const wish = {
      id: Date.now(),
      from,
      message,
      createdAt: new Date().toISOString(),
    };

    // Save to KV
    await kv.rpush("wishes", JSON.stringify(wish));

    return res.status(200).json(wish);
  }

  if (req.method === "GET") {
    const all = await kv.lrange("wishes", 0, -1);
    const wishes = all.map((w) => JSON.parse(w));
    return res.status(200).json(wishes);
  }

  res.setHeader("Allow", ["GET", "POST"]);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
