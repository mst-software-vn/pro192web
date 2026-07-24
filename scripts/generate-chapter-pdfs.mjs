import { createWriteStream } from 'node:fs'
import { mkdir, rm } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { ZipArchive } from 'archiver'
import puppeteer from 'puppeteer'
import { createServer } from 'vite'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, '..')
const tmpDir = path.join(rootDir, 'tmp-chapter-pdfs')
const outputZip = path.join(rootDir, 'public/downloads/pro192-course-pdfs.zip')

// Thứ tự & slug phải khớp src/content/chapters/index.ts — không import trực tiếp file đó
// vì nó dùng import.meta.glob (chỉ chạy được trong pipeline build của Vite), còn script
// này chạy như một Node script độc lập ngoài Vite.
const CHAPTER_SLUGS = [
  'welcome',
  'introduction-course',
  'foundations',
  'encapsulation',
  'inheritance',
  'polymorphism',
  'array-of-objects',
  'collections',
  'dynamic-memory',
  'exception-handling',
  'file-io',
]

async function waitForImages(page) {
  await page.evaluate(async () => {
    const images = Array.from(document.querySelectorAll('img'))
    await Promise.all(
      images.map((img) =>
        img.complete
          ? Promise.resolve()
          : new Promise((resolve) => {
              img.addEventListener('load', resolve, { once: true })
              img.addEventListener('error', resolve, { once: true })
            }),
      ),
    )
  })
}

async function main() {
  await rm(tmpDir, { recursive: true, force: true })
  await mkdir(tmpDir, { recursive: true })
  await mkdir(path.dirname(outputZip), { recursive: true })

  const server = await createServer({ root: rootDir, server: { port: 0 } })
  await server.listen()
  const address = server.httpServer?.address()
  if (!address || typeof address === 'string') throw new Error('Vite dev server did not start')
  const baseUrl = `http://localhost:${address.port}`

  const browser = await puppeteer.launch({ headless: true })

  try {
    for (const [index, slug] of CHAPTER_SLUGS.entries()) {
      const page = await browser.newPage()
      // Headless Chromium mặc định prefers-color-scheme: dark — script chống FOUC trong
      // index.html đọc localStorage 'pro192-theme' (mặc định 'system') rồi theo system
      // preference đó để bật .dark. Ép sẵn 'light' trước khi trang tải để PDF luôn sáng.
      await page.evaluateOnNewDocument(() => {
        localStorage.setItem('pro192-theme', 'light')
      })
      await page.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: 'light' }])
      await page.goto(`${baseUrl}/print/docs/${slug}`, { waitUntil: 'networkidle0' })
      await waitForImages(page)
      await page.emulateMediaType('screen')

      const fileName = `${String(index + 1).padStart(2, '0')}-${slug}.pdf`
      await page.pdf({
        path: path.join(tmpDir, fileName),
        format: 'a4',
        printBackground: true,
        margin: { top: '20mm', bottom: '20mm', left: '18mm', right: '18mm' },
        displayHeaderFooter: true,
        headerTemplate: '<span></span>',
        footerTemplate:
          '<div style="font-size:9px;width:100%;text-align:center;color:#888;">' +
          '<span class="pageNumber"></span> / <span class="totalPages"></span></div>',
      })
      await page.close()
      console.log(`generated ${fileName}`)
    }

    await new Promise((resolve, reject) => {
      const output = createWriteStream(outputZip)
      const archive = new ZipArchive({ zlib: { level: 9 } })
      output.on('close', resolve)
      archive.on('error', reject)
      archive.pipe(output)
      archive.directory(tmpDir, false)
      archive.finalize()
    })

    console.log(`wrote ${outputZip}`)
  } finally {
    await browser.close()
    await server.close()
    await rm(tmpDir, { recursive: true, force: true })
  }
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
