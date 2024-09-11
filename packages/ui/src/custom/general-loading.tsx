import { LoaderCircle } from "lucide-react";

export default function GeneralLoading() {
  return <div className='size-full flex items-center justify-center'><LoaderCircle className='stroke-primary w-8 h-8 animate-spin' /></div>
}