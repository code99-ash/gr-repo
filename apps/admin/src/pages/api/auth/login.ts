import {serialize} from 'cookie';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
 
  const { email, password } = JSON.parse(req.body);

  try {
    const nestResponse = await fetch(`${process.env.NEST_API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!nestResponse.ok) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const data = await nestResponse.json();
    const token = data.data.access_token;

    res.setHeader(
      'Set-Cookie',
      serialize('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24, // 1 day
        path: '/',
      })
    );

    res.status(200).json({ message: 'Login successful' });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
