'use client';
import { Button } from "@/components/ui/button"

interface DeleteNodeProps {
    confirmDelete: boolean;
    setConfirmDelete: (confirm: boolean) => void;
    deleteAnyway: () => void;
}

export default function DeleteNodeConfirm({confirmDelete, setConfirmDelete, deleteAnyway}: DeleteNodeProps) {
    return (
        <div className="flex items-center justify-end">
            {
            !confirmDelete?
            <Button variant="ghost" className="hover:bg-destructive" onClick={()=>setConfirmDelete(true)}>
                <span className="material-symbols-outlined">delete</span>
            </Button> :
            <div className={`hover:bg-destructive bg-destructive text-white text-sm p-1 rounded`}>
                Are you sure you want to delete this step?
                <div className="flex items-center justify-around">
                <Button variant="ghost" onClick={deleteAnyway}>Yes</Button>
                <Button variant="ghost" onClick={() => setConfirmDelete(false)}>No</Button>
                </div>
            </div>
            }
        </div>
    )
}