import { useState } from 'react'
import { Highlight, themes } from 'prism-react-renderer'
// Side-effect: đăng ký grammar Java vào Prism (prism-react-renderer không bundle sẵn).
import '../lib/register-prism-java'

interface CodeBlockProps {
  code: string
  language?: string
}

// Code Java luôn hiển thị nền tối, kể cả khi đặt trong ngữ cảnh sáng (landing) —
// đảm bảo tính nhất quán thị giác cho mọi khối code trong toàn site.
export function CodeBlock({ code, language }: CodeBlockProps) {
  const trimmedCode = code.replace(/\n$/, '')
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    await navigator.clipboard.writeText(trimmedCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }

  return (
    <div className="group/code relative my-6 overflow-hidden rounded-lg border border-neutral-800 bg-[#1e1e1e]">
      <div className="flex h-9 items-center justify-between border-b border-neutral-800 px-4">
        {language ? (
          <span className="font-mono text-xs tracking-wide text-neutral-500 uppercase">
            {language}
          </span>
        ) : (
          <span />
        )}
        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-1.5 rounded px-2 py-1 text-xs text-neutral-500 opacity-0 transition-opacity group-hover/code:opacity-100 hover:text-neutral-200 focus-visible:opacity-100"
        >
          {copied ? (
            'Đã sao chép'
          ) : (
            <>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="h-3.5 w-3.5">
                <rect x="8" y="8" width="12" height="12" rx="1.5" />
                <path d="M16 8V5.5A1.5 1.5 0 0 0 14.5 4h-9A1.5 1.5 0 0 0 4 5.5v9A1.5 1.5 0 0 0 5.5 16H8" />
              </svg>
              Sao chép
            </>
          )}
        </button>
      </div>
      <Highlight code={trimmedCode} language={language ?? 'text'} theme={themes.vsDark}>
        {({ className, style, tokens, getLineProps, getTokenProps }) => (
          <pre
            className={`${className} overflow-x-auto px-5 py-4 text-[13px] leading-relaxed`}
            style={style}
          >
            {tokens.map((line, lineIndex) => (
              <div key={lineIndex} {...getLineProps({ line })}>
                {line.map((token, tokenIndex) => (
                  <span key={tokenIndex} {...getTokenProps({ token })} />
                ))}
              </div>
            ))}
          </pre>
        )}
      </Highlight>
    </div>
  )
}
