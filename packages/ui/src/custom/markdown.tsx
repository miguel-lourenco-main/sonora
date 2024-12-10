/**import { FC, memo } from 'react'
import ReactMarkdown, { Options } from 'react-markdown'

export const MemoizedReactMarkdown: FC<Options> = memo(
  ReactMarkdown,
  (prevProps, nextProps) =>
    prevProps.children === nextProps.children &&
    prevProps.className === nextProps.className
)
 */

export const Markdown = ({children}:{children:React.ReactNode}) => {
  return <div>{children}</div>
}