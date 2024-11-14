import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

  try {
    const nestResponse = await fetch(`${process.env.NEST_API_URL}/policies`);

    if (!nestResponse.ok) {
      return res.status(401).json({ message: 'Failed to fetch policies' });
    }

    const data = await nestResponse.json();

    res.json(data.data)

  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
