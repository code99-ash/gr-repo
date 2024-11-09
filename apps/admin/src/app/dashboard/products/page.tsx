'use client';
import React, { useEffect, useState } from 'react'
import './products.css'

import ProductList from './product-list'
import PageHeader from './page-header';
import { useRouter } from 'next/navigation';

export default function MyProducts() {
  const router = useRouter()
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<any[]>([]);

  
  const fetchProducts = async () => {
    try {

      setLoading(true);

      const response = await fetch('/api/fetch-products');

      const data = await response.json()
      console.log('response', data)
      // if(response.status === 404) {
      //   return router.push('/dashboard/connect-store')
      // }

      // const data = await response.json();

      // setProducts(data.message);

    } catch (error) {
      
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
      fetchProducts();
  }, []);

  return (
    <div>
      <PageHeader />
      <ProductList data={products} loading={loading} />
    </div>
  )
}
