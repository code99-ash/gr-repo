import { useToast } from '@/hooks/use-toast';

interface ResponseProp {
    title?: string;
    description: string;
}

export default function useResponse() {
    const { toast } = useToast()

    const errorResponse = (props: ResponseProp) => {
        toast({
          variant: "destructive",
          title: props.title ?? "Error Alert",
          description: props.description,
        })
    }
    const defaultResponse = (props: ResponseProp) => {
        toast({
            variant: "primary",
            title: props.title ?? "Success Alert",
            description: props.description,
        })
    }

    return {
        errorResponse,
        defaultResponse
    }
}