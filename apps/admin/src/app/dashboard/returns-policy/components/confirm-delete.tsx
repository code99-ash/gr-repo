"use client";
import React, { useState } from 'react'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Loader2Icon, Trash2Icon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { usePolicyStore } from '@/store/policies/policy-store';
import useResponse from '@/hooks/use-response';

interface ConfirmDelete {
  policy_id: string;
  policy_name: string;
}

export default function ConfirmDelete({ policy_name, policy_id }: ConfirmDelete) {
  const removePolicy = usePolicyStore(state => state.removePolicy);
  const {defaultResponse, errorResponse} = useResponse()
  const [loading, setLoading] = useState(false)

  const deleteAnyway = async() => {
    try {
      setLoading(true)

      const response = await fetch(`/api/policies/delete?uid=${policy_id}`);
      await response.json();

      removePolicy(policy_id)
      defaultResponse({description: `Successfully removed policy ${policy_name}`})

    }catch(error: any) {
      
      errorResponse({description: error.data ?? 'An error occured, please try agan'})
    }finally {
      setLoading(false)
    }
  }

  return (
    <Dialog>
      <DialogTrigger>
        <Trash2Icon className="hover:text-destructive" width={20} height={20} />
      </DialogTrigger>
      
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            <h1 className='text-destructive'>Confirm Delete</h1>
          </DialogTitle>
          <DialogDescription>
            <div className='py-2 text-foreground'>
              <p>Delete <strong>{policy_name}</strong>?</p>
              <p>Are you absolutely sure? This action cannot be undone. This will render your policy data to be inaccessible on your account.</p>
            </div>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="justify-end gap-y-1 gap-x-3">
          <DialogClose asChild>
            <Button type="button" variant="secondary" disabled={loading}>
              Close
            </Button>
          </DialogClose>
          <Button type="button" variant="destructive" disabled={loading} onClick={() => deleteAnyway()}>
            Delete {loading && <Loader2Icon width={15} height={15} className='ml-1 animate-spin' />}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
