import { Highlight, themes } from 'prism-react-renderer'

interface CodeBlockProps {
  code: string
  language?: string
}

// Code Java luôn hiển thị nền tối, kể cả khi đặt trong ngữ cảnh sáng (landing) —
// đảm bảo tính nhất quán thị giác cho mọi khối code trong toàn site.
export function CodeBlock({ code, language }: CodeBlockProps) {
  const trimmedCode = code.replace(/\n$/, '')

  return (
    <div className="my-6 overflow-hidden rounded-lg border border-neutral-800 bg-[#1e1e1e]">
      {language ? (
        <div className="border-b border-neutral-800 px-4 py-2 font-mono text-xs tracking-wide text-neutral-500 uppercase">
          {language}
        </div>
      ) : null}
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
