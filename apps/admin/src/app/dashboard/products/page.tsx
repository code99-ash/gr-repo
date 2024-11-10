import CollectionGroup from './components/collection-group';
import { cookies } from 'next/headers'

export default async function ProductPage() {
  const cookieStore = cookies();
  const token = cookieStore.get('token')?.value;

  const response = await fetch(`${process.env.NEST_API_URL}/collections`, {
    cache: 'no-store',
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (!response.ok) {
    console.log(response)
  }

  const data = await response.json();

  return <CollectionGroup data={data.data} />;
}
