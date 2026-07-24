import { useEffect, useState } from 'react'

type TokenKind = 'keyword' | 'control' | 'class' | 'fn' | 'ref' | 'type' | 'comment'

type Token = readonly [text: string, kind?: TokenKind]

interface CodeTab {
  file: string
  label: string
  lines: readonly (readonly Token[])[]
}

const TOKEN_CLASS: Record<TokenKind, string> = {
  keyword: 'text-(--landing-code-keyword)',
  control: 'text-(--landing-code-control)',
  class: 'text-(--landing-code-class)',
  fn: 'text-(--landing-code-fn)',
  ref: 'text-(--landing-code-ref)',
  type: 'text-(--landing-code-type)',
  comment: 'text-(--landing-code-comment)',
}

// 3 đoạn code minh hoạ Encapsulation/Inheritance/Polymorphism — tô màu thủ công theo
// đúng token của bản thiết kế gốc (không dùng prism-react-renderer ở đây vì theme có sẵn
// không khớp chính xác từng màu; nội dung tĩnh, không cần tokenizer động).
const TABS: readonly CodeTab[] = [
  {
    file: 'BankAccount.java',
    label: 'Encapsulation',
    lines: [
      [['public', 'keyword'], [' '], ['class', 'control'], [' '], ['BankAccount', 'class'], [' {']],
      [['  '], ['private', 'keyword'], [' '], ['double', 'type'], [' balance;']],
      [[' ']],
      [['  '], ['public', 'keyword'], [' '], ['BankAccount', 'fn'], ['('], ['double', 'type'], [' initial) {']],
      [['    '], ['this', 'ref'], ['.balance = initial;']],
      [['  }']],
      [[' ']],
      [['  '], ['public void', 'keyword'], [' '], ['deposit', 'fn'], ['('], ['double', 'type'], [' amount) {']],
      [['    '], ['this', 'ref'], ['.balance += amount;']],
      [['  }']],
      [[' ']],
      [['  '], ['public', 'keyword'], [' '], ['double', 'type'], [' '], ['getBalance', 'fn'], ['() {']],
      [['    '], ['return', 'ref'], [' balance;']],
      [['  }']],
      [['}']],
    ],
  },
  {
    file: 'SavingsAccount.java',
    label: 'Inheritance',
    lines: [
      [
        ['public', 'keyword'],
        [' '],
        ['class', 'control'],
        [' '],
        ['SavingsAccount', 'class'],
        [' '],
        ['extends', 'control'],
        [' '],
        ['BankAccount', 'class'],
        [' {'],
      ],
      [['  '], ['private', 'keyword'], [' '], ['double', 'type'], [' interestRate;']],
      [[' ']],
      [
        ['  '],
        ['public', 'keyword'],
        [' '],
        ['SavingsAccount', 'fn'],
        ['('],
        ['double', 'type'],
        [' balance, '],
        ['double', 'type'],
        [' rate) {'],
      ],
      [['    '], ['super', 'ref'], ['(balance);']],
      [['    '], ['this', 'ref'], ['.interestRate = rate;']],
      [['  }']],
      [[' ']],
      [['  '], ['public void', 'keyword'], [' '], ['applyInterest', 'fn'], ['() {']],
      [['    '], ['deposit', 'fn'], ['('], ['getBalance', 'fn'], ['() * interestRate);']],
      [['  }']],
      [['}']],
    ],
  },
  {
    file: 'Polymorphism.java',
    label: 'Polymorphism',
    lines: [
      [['Animal', 'class'], ['[] animals = {']],
      [
        ['  '],
        ['new', 'control'],
        [' '],
        ['Dog', 'fn'],
        ['(), '],
        ['new', 'control'],
        [' '],
        ['Cat', 'fn'],
        ['(), '],
        ['new', 'control'],
        [' '],
        ['Bird', 'fn'],
        ['()'],
      ],
      [['};']],
      [[' ']],
      [['for', 'control'], [' ('], ['Animal', 'class'], [' a : animals) {']],
      [['  a.'], ['makeSound', 'fn'], ['(); '], ['// each behaves differently', 'comment']],
      [['}']],
    ],
  },
]

export function CodeBlock() {
  const [tab, setTab] = useState(0)
  const [copied, setCopied] = useState(false)
  const active = TABS[tab]

  useEffect(() => {
    if (!copied) return
    const timer = setTimeout(() => setCopied(false), 2000)
    return () => clearTimeout(timer)
  }, [copied])

  async function handleCopy() {
    const text = active.lines.map((line) => line.map(([segmentText]) => segmentText).join('')).join('\n')
    await navigator.clipboard.writeText(text)
    setCopied(true)
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-white/8 bg-(--landing-panel) shadow-[var(--landing-panel-shadow),0_0_0_1px_rgba(59,130,246,0.06)]">
      <div className="flex items-center gap-2 border-b border-(--landing-panel-border) bg-(--landing-panel-header) px-4 py-3">
        <span className="h-2.75 w-2.75 rounded-full bg-[#3f3f46]" />
        <span className="h-2.75 w-2.75 rounded-full bg-[#3f3f46]" />
        <span className="h-2.75 w-2.75 rounded-full bg-[#3f3f46]" />
        <span className="ml-2.5 font-mono text-xs text-[#64748b]">{active.file}</span>
      </div>

      <div className="flex items-center justify-between gap-2 border-b border-(--landing-panel-border) bg-(--landing-panel-header) px-1.5">
        <div className="flex min-w-0 overflow-x-auto">
          {TABS.map((item, index) => (
            <button
              key={item.file}
              type="button"
              onClick={() => setTab(index)}
              className={`shrink-0 border-b-2 px-2.5 py-3 text-[12.5px] font-medium whitespace-nowrap transition-colors ${
                index === tab
                  ? 'border-(--landing-code-ref) text-[#e6edf3]'
                  : 'border-transparent text-[#64748b] hover:text-[#94a3b8]'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={handleCopy}
          className={`my-1.5 mr-0.5 ml-1 flex shrink-0 items-center gap-1.5 rounded-md border border-(--landing-panel-border) bg-white/4 px-2.5 py-1.5 text-[12.5px] font-medium whitespace-nowrap transition-colors hover:bg-white/8 ${
            copied ? 'text-[#22c55e]' : 'text-[#94a3b8]'
          }`}
        >
          {copied ? (
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 6 9 17l-5-5" />
            </svg>
          ) : (
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
          )}
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>

      <div className="min-h-90 overflow-x-auto px-5 py-5.5 font-mono text-[13.5px] leading-[1.85]">
        {active.lines.map((line, lineIndex) => (
          <div key={lineIndex} className="flex gap-5">
            <span className="w-4.5 shrink-0 text-right text-[#475569] select-none">{lineIndex + 1}</span>
            <span className="whitespace-pre text-(--landing-code-fg)">
              {line.map(([text, kind], segmentIndex) => (
                <span key={segmentIndex} className={kind ? TOKEN_CLASS[kind] : undefined}>
                  {text}
                </span>
              ))}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
