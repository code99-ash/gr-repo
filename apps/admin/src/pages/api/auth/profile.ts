import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: Token not found' });
  }

  try {
    const nestResponse = await fetch(`${process.env.NEST_API_URL}/auth/profile`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    });

    if (!nestResponse.ok) {
      return res.status(nestResponse.status).json({ 
        message: 'Session expired or invalid token' 
    });
    }

    const data = await nestResponse.json();


    if (!data || !data.data) {
      return res.status(400).json({ message: 'Invalid response structure' });
    }

    const user = data.data;
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
