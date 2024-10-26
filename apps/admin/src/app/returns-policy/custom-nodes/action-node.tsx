import React from 'react'
import { Handle, Position } from '@xyflow/react'
import NodeWrapper from './node-wrapper'


export default function ActionNode({data}: { data: any }) {

    return (
      <NodeWrapper node_id={data.node_id}>
        <Handle 
            position={Position.Left} 
            type="target"
            isConnectableStart={false}
            isConnectableEnd={true}
        />

        <h1 className="text-green text-[10px] satoshi-bold capitalize">Action</h1>
        <div className="w-full grow border rounded-xl p-2 space-y-1">
            <header className="flex items-center gap-1 capitalize text-[7px]">
                <span 
                    className="material-symbols-outlined"
                    style={{fontSize: '8px'}}    
                >autorenew</span>
                <span className="capitalize">{data.action_type.replace('_', ' ')}</span>
            </header>
            <p className="text-[7px]">{data.message}</p>
        </div>
      </NodeWrapper>
    )
}