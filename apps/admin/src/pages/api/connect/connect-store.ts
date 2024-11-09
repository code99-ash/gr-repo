import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized: Token not found' });
    }

    const { store, store_domain } = req.query;

    if (!(store && store_domain)) {
        return res.status(400).json({ message: 'Bad Request: Store parameters are required' });
    }

    try {
        const nestResponse = await fetch(`${process.env.NEST_API_URL}/stores/authorize/${store}?store_domain=${store_domain}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!nestResponse.ok) {
            const resp = await nestResponse.json();
            return res.status(resp.statusCode).json({ message: resp.message });
        }

        const data = await nestResponse.json();

        return res.status(200).json({message: data.data});
    } catch (error) {
        console.error('Error fetching store authorization:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}
