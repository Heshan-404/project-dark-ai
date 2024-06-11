import hljs from "highlight.js";
import { faCopy } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as marked from "marked";
import { CodeBlock, CopyButton, Text, Title } from "./components";

function renderMessageContent(content, handleCopyCode) {
  const codeBlockPattern = /```([\s\S]*?)```/g;

  const sections = content.split(/(\d+\.\s+)(`[^`]+`:\s*)/gm);
  return sections.map((section, index) => {
    if (index % 2 === 1) {
      return <Title key={index}>{section}</Title>;
    } else if (index % 2 === 0) {
      const parts = section.split(codeBlockPattern).reduce((acc, part, i) => {
        if (i % 2 === 1) {
          const languagePattern = /^(\w+)\n/;
          const match = part.match(languagePattern);
          let language = "plaintext";
          let code = part;
          if (match) {
            language = match[1];
            code = part.replace(languagePattern, "");
          }
          acc.push({ type: "code", content: code, language });
        } else {
          acc.push({ type: "text", content: marked.parse(part) });
        }
        return acc;
      }, []);

      return (
        <div key={index} className="section-content">
          {parts.map((part, i) => {
            if (part.type === "code") {
              return (
                <CodeBlock key={i}>
                  <div className="code-header">
                    <div
                      className="language"
                      style={{
                        backgroundColor: "black",
                        color: "white",
                        fontWeight: "bold",
                      }}
                    >
                      {part.language}
                    </div>
                  </div>
                  <div
                    className="m-3"
                    dangerouslySetInnerHTML={{
                      __html: hljs.highlight(part.content, {
                        language: part.language,
                      }).value,
                    }}
                  />{" "}
                  <div className="float-end pe-3 pb-3">
                    <CopyButton
                      onClick={() => handleCopyCode(part.content)}
                      style={{}}
                    >
                      <FontAwesomeIcon icon={faCopy} />
                    </CopyButton>
                  </div>
                </CodeBlock>
              );
            } else if (part.type === "text") {
              return (
                <Text
                  key={i}
                  dangerouslySetInnerHTML={{ __html: part.content }}
                />
              );
            }
            return null;
          })}
        </div>
      );
    }
    return null;
  });
}

export default renderMessageContent;
