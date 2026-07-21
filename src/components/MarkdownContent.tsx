import { isValidElement, useState, type MouseEvent, type ReactNode } from 'react'
import ReactMarkdown, { type Components } from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Link } from 'react-router-dom'
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
        <div className="border-hairline-strong bg-panel flex min-h-40 items-center justify-center rounded-lg border border-dashed px-6 py-10 text-center">
          <span className="text-ink-faint text-sm">{caption || 'Hình minh hoạ'}</span>
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
        className="border-hairline w-full rounded-lg border"
      />
      {caption ? <figcaption className="text-ink-faint mt-2 text-center text-sm">{caption}</figcaption> : null}
    </figure>
  )
}

// Đặt tên tường minh (khác biệt "img") để so sánh identity chính xác trong `p` bên dưới —
// react-markdown truyền element CHƯA render (type = hàm mapping này, chưa phải <Figure>)
// làm children của <p>, vì React chỉ thực sự gọi hàm này ở bước render sau, không phải
// lúc `p` nhận children. So type với Figure (thứ hàm này TRẢ VỀ) sẽ luôn sai.
function ImageRenderer({ src, alt, title }: { src?: unknown; alt?: string; title?: string }) {
  return <Figure src={typeof src === 'string' ? src : undefined} alt={alt} title={title} />
}

function makeHeading(depth: 2 | 3 | 4) {
  const styles: Record<2 | 3 | 4, string> = {
    2: 'text-ink mt-12 mb-4 text-2xl font-semibold tracking-tight',
    3: 'text-ink mt-10 mb-3 text-xl font-semibold tracking-tight',
    4: 'text-ink-secondary mt-8 mb-2 text-lg font-semibold',
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

// Link "#" thuần (không có id neo) là kiểu tag/chủ đề trang trí từ site gốc — hiển thị
// giống liên kết (accent xanh) nhưng bấm vào không điều hướng, không cuộn trang.
function preventBareHashNavigation(event: MouseEvent<HTMLAnchorElement>) {
  event.preventDefault()
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
    if (meaningful.length === 1 && isValidElement(meaningful[0]) && meaningful[0].type === ImageRenderer) {
      return <>{children}</>
    }
    return <p className="text-ink-body mb-4 text-[15px] leading-7">{children}</p>
  },
  ul: ({ children }) => (
    <ul className="text-ink-body marker:text-ink-faint mb-4 list-outside list-disc space-y-1.5 pl-6 text-[15px] leading-7">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="text-ink-body marker:text-ink-faint mb-4 list-outside list-decimal space-y-1.5 pl-6 text-[15px] leading-7">
      {children}
    </ol>
  ),
  li: ({ children }) => <li>{children}</li>,
  a: ({ href, children }) => {
    const linkClassName =
      'text-accent-on-surface underline decoration-accent-on-surface/40 underline-offset-4 hover:decoration-accent-on-surface'

    if (href === '#') {
      return (
        <a href={href} onClick={preventBareHashNavigation} className={linkClassName}>
          {children}
        </a>
      )
    }

    if (href?.startsWith('/')) {
      return (
        <Link to={href} className={linkClassName}>
          {children}
        </Link>
      )
    }

    return (
      <a
        href={href}
        target={href?.startsWith('http') ? '_blank' : undefined}
        rel={href?.startsWith('http') ? 'noreferrer' : undefined}
        className={linkClassName}
      >
        {children}
      </a>
    )
  },
  strong: ({ children }) => <strong className="text-ink-secondary font-semibold">{children}</strong>,
  em: ({ children }) => <em className="italic">{children}</em>,
  blockquote: ({ children }) => (
    <blockquote className="border-accent-on-surface/60 bg-panel/60 text-ink-body my-5 rounded-r-md border-l-2 px-4 py-3 text-[15px] leading-7 [&>p:last-child]:mb-0 [&>p]:mb-2">
      {children}
    </blockquote>
  ),
  hr: () => <hr className="border-hairline my-10" />,
  img: ImageRenderer,
  pre: ({ children }) => <>{children}</>,
  code: ({ className, children }) => {
    const text = flattenToText(children).replace(/\n$/, '')
    const languageMatch = /language-(\w+)/.exec(className ?? '')
    const isBlock = Boolean(languageMatch) || text.includes('\n')

    if (isBlock) {
      return <CodeBlock code={text} language={languageMatch?.[1]} />
    }

    return (
      <code className="bg-well text-ink-secondary rounded px-1.5 py-0.5 font-mono text-[0.85em]">{children}</code>
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
