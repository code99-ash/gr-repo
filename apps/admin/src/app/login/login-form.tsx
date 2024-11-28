'use client';
import React from 'react';

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useToast } from "@/hooks/use-toast"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Loader2 } from 'lucide-react'

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(1, { message: 'Password is required' })
})

export default function LoginForm() {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setLoading(true)
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (response.ok) {
        router.push('/dashboard')
      } else {
        toast({
          variant: "destructive",
          title: data.message,
        })
      }
    }catch(error: any){
      toast({
        variant: "destructive",
        title: error.message ?? "Server Error, please try again",
      })
    } finally {
      setLoading(false)
    }
  }


  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Business Email Address" className="login-input" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Enter your password" type="password" className="login-input" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button variant="default" className={`login-btn ${loading ? 'saturate-50 cursor-wait' : ''}`} disabled={loading}>
          {loading ? <Loader2 className="animate-spin" /> : "Log in"}
        </Button>
      </form>
    </Form>
  )
}
