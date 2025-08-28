// /api/get-wishes.js
import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const wishes = await kv.lrange('wishes', 0, -1);
      const parsed = wishes.map(w => JSON.parse(w));

      return res.status(200).json(parsed.reverse()); // newest first
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch wishes' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
