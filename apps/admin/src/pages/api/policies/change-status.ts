import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    const token = req.cookies.token;
    const { policy_uid, policy_status } = JSON.parse(req.body)
    
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized: Token not found' });
    }

    try {
        const nestResponse = await fetch(`${process.env.NEST_API_URL}/policies/${policy_uid}/status`, {
          method: 'PUT',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({policy_status})
        });

        if(!nestResponse.ok) {
            const data = await nestResponse.json()
            console.log(data)
            return res.status(data.statusCode).json({message: data.message})
        }

        const data = await nestResponse.json();

        res.status(200).json({message: data.data});
    } catch (error: any) {
        res.status(error.status).json({ message: 'Internal Server Error' });
    }
}
