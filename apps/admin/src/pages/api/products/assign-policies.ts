import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    const token = req.cookies.token;
    
    if (!token) {
        return res.redirect(302, '/login')
    }

    const url = `${process.env.NEST_API_URL}/products/assign-policies`;
    
    try {
        const nestResponse = await fetch(url, {
          method: 'PUT',
          cache: 'no-store',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: req.body
        });

        if(!nestResponse.ok) {
          return res.status(nestResponse.status).send('Unable to complete products to policies assignment')
        }

        const data = await nestResponse.json();

        res.status(200).json(data.data);
    } catch (error) {
      res.status(500).json({ message: 'Internal Server Error' });
    }
}
