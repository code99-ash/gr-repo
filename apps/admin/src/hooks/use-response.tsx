import { useToast } from '@/hooks/use-toast';

interface ResponseProp {
    title?: string;
    description: string;
}

export default function useResponse() {
    const { toast } = useToast()

    const errorResponse = (props: ResponseProp, use_title: false) => {
        toast({
          variant: "destructive",
          title: props.title ?? use_title? props.description : "Error Alert",
          description: props.description,
        })
    }
    const defaultResponse = (props: ResponseProp, use_title: false) => {
        toast({
            variant: "primary",
            title: props.title ?? use_title? props.description : "Error Alert",
            description: props.description,
        })
    }

    return {
        errorResponse,
        defaultResponse
    }
}