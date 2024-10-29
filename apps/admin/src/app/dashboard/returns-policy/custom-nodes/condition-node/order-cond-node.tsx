import React from 'react'
import { OrderConditionData } from '@/interfaces/order.interface'


interface PropType {
    data: OrderConditionData
}

export default function OrderConditionNode({data}: PropType) {
    return <>
        <h1 className="text-primary text-[10px] satoshi-bold capitalize">
            Condition
        </h1>
        <div className="w-full grow border rounded p-2 space-y-1">
            <header className="flex items-center gap-1 capitalize text-[7px]">
                <span 
                    className="material-symbols-outlined"
                    style={{fontSize: '8px'}}    
                >autorenew</span>
                <span className="capitalize">{data.category.replaceAll('_', ' ')}</span>
            </header>
            <p className="text-[7px]">
                Amount {data.operator.replaceAll('_', ' ')} {data.value}
            </p>
        </div>
    </>
}
