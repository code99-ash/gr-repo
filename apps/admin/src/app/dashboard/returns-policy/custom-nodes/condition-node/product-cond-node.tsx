import React from 'react'
import { ProductConditionData } from '@/interfaces/product.interface'


interface PropType {
    data: ProductConditionData
}

export default function ProductConditionNode({data}: PropType) {
    return <>
        <h1 className="text-primary text-[10px] satoshi-bold capitalize">
            <span className='uppercase'>{data.ruling}</span>&nbsp; Condition{data.ruling==='any'?'':'s'}
        </h1>
        <div className="w-full grow border rounded p-2 space-y-1">
            <header className="flex items-center gap-1 capitalize text-[7px]">
                <span 
                    className="material-symbols-outlined"
                    style={{fontSize: '8px'}}    
                >autorenew</span>
                Category
            </header>
            <p className="text-[7px]">
                {data?.list?.length > 0 ? (
                <>
                    {data.list[0]}
                    {data.list.length > 1 && `, +${data.list.length - 1} more`}
                </>
                ) : (
                'No conditions specified'
                )}
            </p>
        </div>
    </>
}
