import React, { useState } from "react";
import { LuCopy, LuCheck, LuCode } from "react-icons/lu";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneLight } from "react-syntax-highlighter/dist/esm/styles/prism";

const AIResponsePreview = ({ content }) => {
  if (!content) return null;

  return (
    <div className="text-[14px] leading-6">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          p({ children }) {
            return <p className="mb-4 leading-5">{children}</p>;
          },
          code({ inline, className, children }) {
            const match = /language-(\w+)/.exec(className || "");
            const language = match ? match[1] : "";

            if (!inline && match) {
              return (
                <div className="mt-4 text-black bg-white sketch-border p-4 mb-4">
                  <CodeBlock
                    code={String(children).replace(/\n$/, "")}
                    language={language}
                  />
                </div>
              );
            }

            return (
              <code className="px-1 py-0.5 bg-[var(--color-accent-yellow)] sketch-border font-black text-sm">
                {children}
              </code>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

function CodeBlock({ code, language }) {
  const [copied, setCopied] = useState(false);

  const copyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative my-4 bg-white sketch-border">
      <div className="flex items-center justify-between px-4 py-2 border-b-2 border-dashed border-black bg-[var(--color-accent-pink)]">
        <div className="flex items-center space-x-2">
          <LuCode size={16} className="text-black" />
          <span className="text-xs font-black text-black uppercase tracking-wide">
            {language || "code"}
          </span>
        </div>
        <button
          onClick={copyCode}
          className="text-black focus:outline-none relative group"
          aria-label="Copy code"
        >
          {copied ? (
            <LuCheck size={16} className="text-black font-bold" />
          ) : (
            <LuCopy size={16} />
          )}
          {copied && (
            <span className="absolute -top-8 right-0 text-black bg-[var(--color-accent-yellow)] sketch-border text-xs px-2 py-1">
              Copied!
            </span>
          )}
        </button>
      </div>

      <SyntaxHighlighter
        language={language}
        style={oneLight}
        customStyle={{
          fontSize: 12.5,
          margin: 0,
          padding: "1rem",
          background: "transparent",
        }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}

export default AIResponsePreview;
