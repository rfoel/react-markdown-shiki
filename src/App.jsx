import parseNumericRange from 'parse-numeric-range'
import ReactMarkdown from 'react-markdown'
import useShiki, { setCDN } from 'use-shiki'

setCDN('https://cdn.jsdelivr.net/npm/shiki/')

function App() {
  const highlighter = useShiki({
    theme: 'dracula',
    langs: ['jsx'],
  })

  const markdown = `
  # Here is some Markdown 

  \`\`\`jsx highlight=1&add=4&delete=3,5
  const [count, setCount] = useState(0)

  useEffect(() => {
    setCount(count + 1)
  }, [count])
  \`\`\`
  `

  return (
    <ReactMarkdown
      components={{
        pre({ children, node }) {
          const {
            className,
            children: [code],
          } = children[0].props
          const match = /language-(\w+)/.exec(className || '')

          let lineOptions = []
          if (typeof node.children[0].data?.meta === 'string') {
            const options = Object.fromEntries([
              ...new URLSearchParams(node.children[0].data?.meta).entries(),
            ])

            lineOptions = Object.entries(options).reduce(
              (acc, [className, lines]) => {
                const parsedLines = parseNumericRange(lines)
                return [
                  ...acc,
                  ...parsedLines.map(line => ({
                    classes: [className],
                    line,
                  })),
                ]
              },
              [],
            )
          }

          return (
            <code
              dangerouslySetInnerHTML={{
                __html:
                  highlighter?.codeToHtml(code.replace(/\n$/, ''), {
                    lang: match?.[1],
                    lineOptions,
                  }) ?? '',
              }}
            />
          )
        },
      }}
    >
      {markdown}
    </ReactMarkdown>
  )
}

export default App
