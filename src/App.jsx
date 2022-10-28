import { useState, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import { getHighlighter, setCDN } from 'shiki'

setCDN('https://cdn.jsdelivr.net/npm/shiki/')

function App() {
  const [highlighter, setHighlighter] = useState()

  useEffect(() => {
      getHighlighter({
        theme: 'dracula',
        langs: ['jsx'],
      }).then(setHighlighter)
  }, [])

  const markdown = `
  # Here is some Markdown 

  \`\`\`jsx 
  const [count, setCount] = useState(0)
  \`\`\`  

  \`\`\`jsx 
  const [count, setCount] = useState(0) 

  useEffect(() => {
    setCount(count + 1)
  }, [count])
  \`\`\`
  `

  return <ReactMarkdown
      components={{
        pre({ children }) {
          const {
            className,
            children: [code],
          } = children[0].props
          const match = /language-(\w+)/.exec(className || '')
          return (
            <code
              dangerouslySetInnerHTML={{
                __html:
                  highlighter?.codeToHtml(code, {
                    lang: match?.[1],
                  }) ?? '',
              }}
            />
          )
        },
      }}
    >
      {markdown}
    </ReactMarkdown>
}

export default App