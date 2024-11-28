import { redirect } from 'next/navigation';
import ProductList from './components/product-list';
import { cookies } from 'next/headers'

export default async function ProductPage() {
  const cookieStore = cookies();
  const token = cookieStore.get('token')?.value;

  const response = await fetch(`${process.env.NEST_API_URL}/products`, {
    cache: 'no-store',
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (!response.ok) {
    if(response.status === 404) {
      return redirect('/dashboard/connect-store')
    }
    if(response.status === 401) {
      return redirect('/login')
    }
  }

  const data = await response.json();

  return <ProductList data={data.data} />;
}
