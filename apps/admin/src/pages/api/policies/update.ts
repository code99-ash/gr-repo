import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    const token = req.cookies.token;
    const { policy_uid } = JSON.parse(req.body)

    console.log(JSON.parse(req.body))
    // if (!token) {
    //     return res.status(401).json({ message: 'Unauthorized: Token not found' });
    // }

    try {
        const nestResponse = await fetch(`${process.env.NEST_API_URL}/policies/${policy_uid}`, {
          method: 'PATCH',
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
