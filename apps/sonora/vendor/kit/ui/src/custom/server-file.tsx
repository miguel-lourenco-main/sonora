'use server'

/**
 * ServerFile Component
 * Creates a link to a temporary file stored on the server
 * 
 * @component
 * @param serverURL - Base URL of the server
 * @param path - Path to the file relative to the server's tmp directory
 * @param children - Content to display as the link text/content
 */
export default function ServerFile({
    serverURL,
    path,
    children
}: {
    serverURL: string;    // Base server URL (e.g., 'http://localhost:3000')
    path: string;         // Relative path to file in tmp directory
    children: React.ReactNode;  // Link content
}) {
    return (
        <div>
            {/* Constructs full URL by combining server URL, tmp directory, and file path */}
            <a href={`${serverURL}/tmp/${path}`}>{children}</a>
        </div>
    )
}