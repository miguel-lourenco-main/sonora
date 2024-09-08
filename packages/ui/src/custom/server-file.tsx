'use server'

export default function ServerFile({
    serverURL,
    path,
    children
}: {
    serverURL: string
    path:string
    children: React.ReactNode
}) {
    return (
        <div>
            <a href={`${serverURL}/tmp/${path}`}>{children}</a>
        </div>
    )
}