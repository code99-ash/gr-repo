import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    const token = req.cookies.token;

    // if (!token) {
    //     return res.status(401).json({ message: 'Unauthorized: Token not found' });
    // }

    try {
        const nestResponse = await fetch(`${process.env.NEST_API_URL}/policies`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: req.body
        });

        if (!nestResponse.ok) {
        return res.status(401).json({ message: 'Invalid credentials' });
        }

        const data = await nestResponse.json();

        res.status(200).json(data.data);
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
}
