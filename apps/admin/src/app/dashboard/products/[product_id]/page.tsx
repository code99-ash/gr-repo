import { redirect } from 'next/navigation';
import { cookies } from 'next/headers'
import ProductView from './product-view';


interface ParamProp {
    params: {
        product_id: string;
    };
}

export default async function ProductPage(context: ParamProp) {
  const cookieStore = cookies();
  const token = cookieStore.get('token')?.value;

  const response = await fetch(`${process.env.NEST_API_URL}/products/${context.params.product_id}`, {
    cache: 'no-store',
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (response.status === 401) {
   return redirect('/login')
  }

  const data = await response.json();

  return <ProductView data={data.data} />;
}
