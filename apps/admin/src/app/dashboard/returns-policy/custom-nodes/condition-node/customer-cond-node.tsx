import React from 'react'
import { CustomerConditionData } from '@/interfaces/customer.interface'


interface PropType {
    data: CustomerConditionData
}

export default function CustomerConditionNode({data}: PropType) {
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
                Customer's Returns count
            </header>
            <p className="text-[7px]">
                {data.operator.replaceAll('_', ' ')} {data.expectedPeriod}
            </p>
        </div>
    </>
}
