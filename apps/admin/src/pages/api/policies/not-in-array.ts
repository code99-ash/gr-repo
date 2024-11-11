import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = req.cookies.token;

  if (!token) {
    return res.redirect(302, '/login');
  }

  try {
    
    const nestResponse = await fetch(`${process.env.NEST_API_URL}/policies/not-in-array`, {
        method: 'POST',
        cache: 'no-store',
        body: req.body,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
    });

    if (!nestResponse.ok) {
        return res.status(nestResponse.status).json({ message: 'Failed to fetch policies' });
    }

    const data = await nestResponse.json();

    res.json(data.data)

  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
