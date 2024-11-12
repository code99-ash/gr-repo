import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    const token = req.cookies.token;
    
    if (!token) {
        return res.redirect(302, '/login')
    }

    const {product_id} = req.query;
    const url = `${process.env.NEST_API_URL}/products/${product_id}/policies`;
    
    try {
        const nestResponse = await fetch(url, {
          method: 'POST',
          cache: 'no-store',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(req.body)
        });

        if(!nestResponse.ok) {
          return res.status(nestResponse.status).send('Unable to update product policies')
        }

        const data = await nestResponse.json();

        res.status(200).json(data.data);
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
}
