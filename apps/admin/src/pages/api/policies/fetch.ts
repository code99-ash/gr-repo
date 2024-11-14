import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

  const token = req.cookies.token;
    
  if (!token) {
    return res.redirect(302, '/login')
  }

  try {
    const nestResponse = await fetch(`${process.env.NEST_API_URL}/policies`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!nestResponse.ok) {
      return res.status(401).json({ message: 'Failed to fetch policies' });
    }

    const data = await nestResponse.json();

    res.json(data.data)

  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
