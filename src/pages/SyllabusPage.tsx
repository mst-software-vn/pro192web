import { useState } from 'react'
import { syllabusTabs } from '../content/syllabus'

function SyllabusTable({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <div className="border-hairline overflow-x-auto rounded-lg border">
      <table className="w-full min-w-[720px] border-collapse text-left text-sm">
        <thead>
          <tr className="border-hairline border-b">
            {headers.map((header) => (
              <th
                key={header}
                className="text-ink-secondary px-4 py-3 font-semibold whitespace-nowrap align-top"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex} className="border-hairline border-b last:border-b-0">
              {row.map((cell, cellIndex) => (
                <td
                  key={cellIndex}
                  className="text-ink-body min-w-[160px] px-4 py-3 align-top whitespace-pre-line"
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function SyllabusPage() {
  const [activeTabId, setActiveTabId] = useState(syllabusTabs[0].id)
  const activeTab = syllabusTabs.find((tab) => tab.id === activeTabId) ?? syllabusTabs[0]

  return (
    <article className="mx-auto max-w-5xl">
      <header className="mb-8">
        <h1 className="text-ink text-3xl font-semibold tracking-tight sm:text-4xl">Course Syllabus</h1>
        <p className="text-ink-muted mt-3 text-[15px] leading-relaxed">
          Đề cương môn học PRO192 — Object-Oriented Programming using Java, học kỳ Spring 2021.
        </p>
      </header>

      <div className="border-hairline mb-8 flex gap-1 overflow-x-auto border-b">
        {syllabusTabs.map((tab) => {
          const isActive = tab.id === activeTabId
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTabId(tab.id)}
              className={`shrink-0 border-b-2 px-4 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? 'border-accent-on-surface text-accent-on-surface'
                  : 'text-ink-muted hover:text-ink-secondary border-transparent'
              }`}
            >
              {tab.tabLabel}
            </button>
          )
        })}
      </div>

      <h2 className="text-ink mb-4 text-xl font-semibold tracking-tight">{activeTab.title}</h2>
      <SyllabusTable headers={activeTab.table.headers} rows={activeTab.table.rows} />
    </article>
  )
}
