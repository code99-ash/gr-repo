import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const token = req.cookies.token;

    if (!token) {
        return res.redirect(302, '/login');
    }

    const { shop, code } = req.query;


    try {
        const nestResponse = await fetch(`${process.env.NEST_API_URL}/stores/authorize/callback/shopify?shop=${shop}&code=${code}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!nestResponse.ok) {
            return res.redirect(302, '/dashboard/connect-store');
        }

        return res.redirect(302, '/dashboard/products')

    } catch (error) {
        console.error('Error fetching store authorization:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}
