"use client"

import React from 'react'
import { CollectionGroupItem } from '../interfaces'

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Trash2Icon } from 'lucide-react'
import PageHeader from './page-header'
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card'
import Image from 'next/image'


export default function CollectionGroup({ data }: { data: CollectionGroupItem[] }) {
    return (
        <section className='space-y-5'>
            <PageHeader />
            
            <div>

            </div>
            <Card className="rounded-xl shadow-none">
                {
                    data.map(collection => (
                        <CardContent key={collection.uid} className='py-3 px-0'>
                            <div className='flex items-center gap-2 mb-2 px-3'>
                                <Checkbox className="shadow-none" />
                                <CardTitle className='text-primary satoshi-medium capitalize'>{collection.title}</CardTitle>
                            </div>
                            <Table className="w-full">
                            {
                                collection.collection_products.map(each => {
                                    const product = each.products;

                                    return (
                                            <TableRow key={product.uid}>
                                                <TableCell className='px-6'>
                                                    <div className='flex items-center gap-2'>
                                                        <Checkbox />
                                                        <Image 
                                                            src={product.images[0].src}
                                                            width={35}
                                                            height={35}
                                                            alt=""
                                                            className="rounded-full"
                                                        />
                                                        <h3 className='satoshi-medium'>{product.title}</h3>
                                                    </div>
                                                </TableCell>
                                                <TableCell className='px-6'>
                                                    <div className='flex items-center justify-end gap-x-10'>
                                                        <span>0</span>
                                                        <Trash2Icon 
                                                            role='button'
                                                            width={18}
                                                            height={18}
                                                        />
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                    )
                                })
                            }
                            </Table>
                        </CardContent>
                    ))
                }
            </Card>
        </section>
    )
};

