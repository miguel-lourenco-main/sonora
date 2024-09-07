
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../../../shadcn/card"
import { MonitorUpIcon, ReplyIcon, Volume1Icon } from "lucide-react"
import Link from "next/link"


export function WorkflowCard({
    name,
    requests,
    uptime,
    id
}:{
    name: string | undefined
    requests: number
    uptime: string
    id: number
}) {
    return (
      <Card className="w-[340px] group hover:bg-muted/50">
        <CardHeader className="flex flex-col items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="bg-primary rounded-md p-3 flex items-center justify-center">
              <Volume1Icon className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <CardTitle className="mb-1 group-hover:text-primary hover:cursor-pointer hover:underline hover:decoration-2">
                <Link href={`/workflows/${id}`}>{name}</Link>
              </CardTitle>
              <CardDescription>Key metrics for your API</CardDescription>
            </div>
          </div>
          <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">{name}</div>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="flex items-center justify-between rounded-md border p-4">
            <div className="flex items-center justify-end gap-x-3">
              <div className="bg-primary rounded-full w-10 h-10 flex items-center justify-center">
                <ReplyIcon className="h-4 w-4 text-primary-foreground" />
              </div>
              <div className="flex flex-col space-y-1">
                <p className="text-xs font-medium leading-none">Requests</p>
                <p className="text-sm font-semibold leading-none">{requests}</p>
              </div>
            </div>
            <div className="flex items-center justify-end gap-x-3">
              <div className="bg-primary rounded-full w-10 h-10 flex items-center justify-center">
                <MonitorUpIcon className="h-4 w-4 text-primary-foreground" />
              </div>
              <div className="flex flex-col space-y-1">
                <p className="text-xs font-medium leading-none">Uptime</p>
                <p className="text-sm font-semibold leading-none">{uptime}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
}