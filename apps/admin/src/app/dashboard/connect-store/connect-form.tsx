'use client';
import React, { useState } from 'react'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import useResponse from '@/hooks/use-response';
  
const stores = [
    {
        image: '/images/shopify.png',
        name: 'shopify'
    },
    {
        image: '/images/woocommerce.png',
        name: 'woocommerce'
    }
]

const domain_regex = /^([a-zA-Z0-9-]+\.)?[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/

export default function ConnectForm() {
    const { toast } = useToast()
    const [store, setStore] = useState<string>('shopify');
    const [store_domain, setStoreDomain] = useState<string>('');
    const { errorResponse } = useResponse()

    const [loading, setLoading] = useState(false);

    const connectToStore = async() => {
        try {
            if(!domain_regex.test(store_domain.trim())) {
                toast({
                    variant: 'destructive',
                    title: 'Invalid store domain',
                })
                return;
            }

            setLoading(true);
            const response = await fetch(`/api/connect/connect-store?store=${store}&store_domain=${store_domain}`);
            const data = await response.json();

            if(!data.message.startsWith('http')) {
                return errorResponse({description: data.message})
            }

            if(data) {
                window.open(data.message, '_self');
            }

        } catch (error) {
            console.log(error);
            toast({
                variant: 'destructive',
                title: 'Failed to connect to store',
            })
        } finally {
            setLoading(false);
        }
    }
    
    return (
        <div className='flex justify-center items-center min-h-[50vh] w-full'>
            <Card className='w-full max-w-[500px]'>
                <CardHeader>
                    <CardTitle className="text-lg satoshi-bold">Connect your Store</CardTitle>
                    <CardDescription className="satoshi-medium">Link your e-commerce platform</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className='grid grid-cols-2 gap-4'>
                        {stores.map((item, index) => (
                            <div 
                                key={index} 
                                onClick={() => setStore(item.name)}
                                className={`store-checkbox ${item.name === store ? 'active' : 'border'}`}
                            >
                                <Image
                                    src={item.image}
                                    alt={item.name}
                                    width={200}
                                    height={150}
                                />
                            </div>
                        ))}
                    </div>
                </CardContent>
                <CardFooter>
                    <div className='w-full flex gap-2 justify-between items-center p-1 rounded border'>
                        <div className='grow flex items-center'>
                            <Input 
                                placeholder={store === 'shopify' ? 'shop.myshopify.com' : 'store.example.com'}
                                value={store_domain}
                                onChange={(e) => setStoreDomain(e.target.value)}
                                className="border-0 outline-0 rounded-none focus:outline-none"
                            />
                        </div>
                        <Button 
                            className={`bg-primary hover:bg-teal-700 text-white 
                            ${loading ? 'opacity-50 cursor-not-allowed saturate-50' : ''}`}
                            onClick={connectToStore}
                            disabled={loading}
                        >
                        {loading ? 'Connecting...' : 'Connect Store'}
                        </Button>
                    </div>
                </CardFooter>
            </Card> 
        </div>
    )
}
