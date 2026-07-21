import { isValidElement, useState, type ReactNode } from 'react'
import ReactMarkdown, { type Components } from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { slugify } from '../lib/slugify'
import { CodeBlock } from './CodeBlock'

interface MarkdownContentProps {
  markdown: string
}

function flattenToText(node: ReactNode): string {
  if (node == null || typeof node === 'boolean') return ''
  if (typeof node === 'string' || typeof node === 'number') return String(node)
  if (Array.isArray(node)) return node.map(flattenToText).join('')
  if (isValidElement(node)) {
    const props = node.props as { children?: ReactNode }
    return flattenToText(props.children)
  }
  return ''
}

// Ảnh gốc chưa được copy vào public/images/ — hiển thị khung placeholder có caption
// thay vì icon ảnh vỡ; tự nâng cấp lên ảnh thật ngay khi file tồn tại đúng đường dẫn.
function Figure({ src, alt, title }: { src?: string; alt?: string; title?: string }) {
  const [failed, setFailed] = useState(false)
  const caption = title ?? alt

  if (!src || failed) {
    return (
      <figure className="my-6">
        <div className="flex min-h-40 items-center justify-center rounded-lg border border-dashed border-neutral-700 bg-neutral-900 px-6 py-10 text-center">
          <span className="text-sm text-neutral-500">{caption || 'Hình minh hoạ'}</span>
        </div>
      </figure>
    )
  }

  return (
    <figure className="my-6">
      <img
        src={src}
        alt={alt ?? ''}
        onError={() => setFailed(true)}
        className="w-full rounded-lg border border-neutral-800"
      />
      {caption ? (
        <figcaption className="mt-2 text-center text-sm text-neutral-500">{caption}</figcaption>
      ) : null}
    </figure>
  )
}

function makeHeading(depth: 2 | 3 | 4) {
  const styles: Record<2 | 3 | 4, string> = {
    2: 'mt-12 mb-4 text-2xl font-semibold tracking-tight text-white',
    3: 'mt-10 mb-3 text-xl font-semibold tracking-tight text-white',
    4: 'mt-8 mb-2 text-lg font-semibold text-neutral-100',
  }
  const Tag = `h${depth}` as 'h2' | 'h3' | 'h4'

  return function Heading({ children }: { children?: ReactNode }) {
    const id = slugify(flattenToText(children))
    return (
      <Tag id={id} className={`scroll-mt-24 ${styles[depth]}`}>
        {children}
      </Tag>
    )
  }
}

const components: Components = {
  h1: makeHeading(2),
  h2: makeHeading(2),
  h3: makeHeading(3),
  h4: makeHeading(4),
  p: ({ children }) => {
    // Markdown đặt ảnh riêng 1 dòng vẫn được bọc trong <p> — nhưng Figure render ra <figure>,
    // mà <figure> không hợp lệ bên trong <p>. Bỏ wrapper <p> khi đoạn văn chỉ chứa 1 ảnh.
    const items = Array.isArray(children) ? children : [children]
    const meaningful = items.filter((child) => !(typeof child === 'string' && child.trim() === ''))
    if (meaningful.length === 1 && isValidElement(meaningful[0]) && meaningful[0].type === Figure) {
      return <>{children}</>
    }
    return <p className="mb-4 text-[15px] leading-7 text-neutral-300">{children}</p>
  },
  ul: ({ children }) => (
    <ul className="mb-4 list-outside list-disc space-y-1.5 pl-6 text-[15px] leading-7 text-neutral-300 marker:text-neutral-600">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="mb-4 list-outside list-decimal space-y-1.5 pl-6 text-[15px] leading-7 text-neutral-300 marker:text-neutral-600">
      {children}
    </ol>
  ),
  li: ({ children }) => <li>{children}</li>,
  a: ({ href, children }) => (
    <a
      href={href}
      target={href?.startsWith('http') ? '_blank' : undefined}
      rel={href?.startsWith('http') ? 'noreferrer' : undefined}
      className="text-accent-dark underline decoration-accent-dark/40 underline-offset-4 hover:decoration-accent-dark"
    >
      {children}
    </a>
  ),
  strong: ({ children }) => <strong className="font-semibold text-neutral-100">{children}</strong>,
  em: ({ children }) => <em className="italic">{children}</em>,
  blockquote: ({ children }) => (
    <blockquote className="my-5 rounded-r-md border-l-2 border-accent-dark/60 bg-neutral-900/60 px-4 py-3 text-[15px] leading-7 text-neutral-300 [&>p:last-child]:mb-0 [&>p]:mb-2">
      {children}
    </blockquote>
  ),
  hr: () => <hr className="my-10 border-neutral-800" />,
  img: ({ src, alt, title }) => (
    <Figure src={typeof src === 'string' ? src : undefined} alt={alt} title={title} />
  ),
  pre: ({ children }) => <>{children}</>,
  code: ({ className, children }) => {
    const text = flattenToText(children).replace(/\n$/, '')
    const languageMatch = /language-(\w+)/.exec(className ?? '')
    const isBlock = Boolean(languageMatch) || text.includes('\n')

    if (isBlock) {
      return <CodeBlock code={text} language={languageMatch?.[1]} />
    }

    return (
      <code className="rounded bg-neutral-800 px-1.5 py-0.5 font-mono text-[0.85em] text-neutral-200">
        {children}
      </code>
    )
  },
}

export function MarkdownContent({ markdown }: MarkdownContentProps) {
  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
      {markdown}
    </ReactMarkdown>
  )
}
