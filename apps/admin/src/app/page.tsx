"use client";
import { useAuth } from "@/contexts/auth-context";
import { LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();
    const auth = useAuth();

 
    useEffect(() => {
        if (auth && auth.user && !auth.loading) {
            router.push('/dashboard');
        }
    }, [auth, router]);
    


    return (
      <div className="flex h-[100vh] w-full items-center justify-center bg-[#FAFAFA]">
        <LoaderCircle className='animate-spin' />
      </div>
    )

}
