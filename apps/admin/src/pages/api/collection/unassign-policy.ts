import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    const token = req.cookies.token;
    
    if (!token) {
        return res.redirect(302, '/login')
    }

    try {
        const nestResponse = await fetch(`${process.env.NEST_API_URL}/collections/policies`, {
          method: 'PATCH',
          cache: 'no-store',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: req.body
        });

        const data = await nestResponse.json();

        res.status(200).json(data.data);
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
}
