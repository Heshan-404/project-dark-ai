/* eslint-disable react/prop-types */
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import "highlight.js/styles/atom-one-dark.css";
import styled, { keyframes, css, createGlobalStyle } from "styled-components";
import "./ChatApp.css";
import renderMessageContent from "./renderMessageContent";
import {
  faPaperPlane,
  faSpinner,
  faUserCircle,
  faBrain,
  faBars,
} from "@fortawesome/free-solid-svg-icons";
import { Alert } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ChatHistory from "./ChatHistory";

const theme = {
  primaryBackground: "#001020",
  secondaryBackground: "#030818",
  primaryText: "#0f0",
  secondaryText: "#adafaf",
  boxShadow: "0 2px 4px rgba(0, 16, 32, 0.5)",
  borderColor: "#0f0",
};

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    font-family: 'Oxygen Mono', monospace;
    background-color: ${theme.primaryBackground};
    color: ${theme.primaryText};
  }

  * {
    box-sizing: border-box;
  }
`;

const UserMessage = ({ message }) => (
  <MessageContainer className={`message user`}>
    <UserMessageStyled>{message.parts[0].text}</UserMessageStyled>
    <MessageIcon>
      <FontAwesomeIcon icon={faUserCircle} />
    </MessageIcon>
  </MessageContainer>
);

const AssistantMessage = ({ message, handleCopyCode }) => (
  <MessageContainer className={`message model`}>
    <MessageIcon>
      <FontAwesomeIcon icon={faBrain} />
    </MessageIcon>
    <AssistantMessageStyled>
      {renderMessageContent(message.parts[0].text, handleCopyCode)}
    </AssistantMessageStyled>
  </MessageContainer>
);

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;

  @media (min-width: 768px) {
    flex-direction: row;
  }
`;

const ChatContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  width: 100%;
  position: relative; /* To position the ChatInputContainer within */
`;
const ChatApp = () => {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messageEndRef = useRef(null);
  const [showAlert, setShowAlert] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [selectedChat, setSelectedChat] = useState(null);
  const [showChatHistory, setShowChatHistory] = useState(false);

  const handleChatSelect = (chatId) => {
    setSelectedChat(chatId);
    console.log("Selected Chat ID:", chatId);
  };

  const handleSubmit = async () => {
    if (userInput.trim() !== "") {
      setLoading(true);
      const newMessage = { role: "user", parts: [{ text: userInput }] };
      setMessages([...messages, newMessage]);
      setUserInput("");
      scrollToBottom();

      try {
        const response = await axios.post("http://localhost:3001/chat", {
          history: messages.concat(newMessage),
          newMsg: userInput,
        });
        const data = response.data;
        if (
          data &&
          data.candidates &&
          data.candidates.length > 0 &&
          data.candidates[0].content &&
          data.candidates[0].content.parts &&
          data.candidates[0].content.parts.length > 0
        ) {
          setMessages([
            ...messages,
            newMessage,
            {
              role: "model",
              parts: [{ text: data.candidates[0].content.parts[0].text }],
            },
          ]);
        } else {
          console.error("Invalid response data:", data);
        }
      } catch (error) {
        console.error("Error sending request:", error);
      } finally {
        setLoading(false);
      }
    }

    scrollToBottom();
  };

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    setShowAlert(true);
    setTimeout(() => {
      setShowAlert(false);
    }, 2000);
  };

  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom();
    }
  }, [messages]);

  return (
    <div>
      <GlobalStyle />
      {showAlert && (
        <div
          style={{
            width: "300px",
            position: "fixed",
            top: "78%",
            left: "92%",
            transform: "translate(-50%, -50%)",
            zIndex: "9999",
          }}
        >
          <Alert variant="filled" severity="success">
            Copied
          </Alert>
        </div>
      )}
      <AppContainer>
        <ChatHistory
          onChatSelect={handleChatSelect}
          showHistory={showChatHistory}
          onClose={() => setShowChatHistory(false)}
        />
        <ChatContent>
          <ChatHeader>
            <TitleContainer>
              <MenuButton onClick={() => setShowChatHistory(!showChatHistory)}>
                <FontAwesomeIcon icon={faBars} />
              </MenuButton>
              <Title style={{ fontSize: "38px" }}>Project Dark AI</Title>
            </TitleContainer>
          </ChatHeader>
          <ChatMessages>
            {messages.map((message, index) => (
              <div key={index}>
                {message.role === "user" ? (
                  <UserMessage message={message} />
                ) : (
                  <AssistantMessage
                    message={message}
                    handleCopyCode={handleCopyCode}
                  />
                )}
              </div>
            ))}
            {loading && (
              <div>
                <SkeletonMessage loading={loading} />
                <SkeletonMessage loading={loading} />
                <SkeletonMessage loading={loading} />
              </div>
            )}
            <div ref={messageEndRef} />
          </ChatMessages>
          <ChatInputContainer>
            <ChatInput
              type="text"
              placeholder="Type your message..."
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit();
                }
              }}
            />
            <SendButton onClick={handleSubmit} disabled={loading}>
              {loading ? (
                <FontAwesomeIcon icon={faSpinner} className="spinning" />
              ) : (
                <FontAwesomeIcon icon={faPaperPlane} />
              )}
            </SendButton>
          </ChatInputContainer>
        </ChatContent>
      </AppContainer>
    </div>
  );
};

const ChatHeader = styled.div`
  background-color: ${theme.secondaryBackground};
  padding: 20px;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid ${theme.borderColor};
  position: sticky; /* Set the header to sticky */
  top: 0; /* Position it at the top of the viewport */
  z-index: 10; /* Ensure the header stays on top of other elements */

  /* No changes here, as we want it at the top on larger screens */
`;

const TitleContainer = styled.div`
  display: flex;
  align-items: center;
`;

const Title = styled.h1`
  margin: 0;
  color: ${theme.primaryText};
  font-family: "Permanent Marker", cursive;
`;

const ChatMessages = styled.div`
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  padding-bottom: 80px; /* Add space for the input at the bottom */
`;

const MessageContainer = styled.div`
  margin-bottom: 15px;
  display: flex;
  align-items: flex-start;
  justify-content: ${({ className }) =>
    className.includes("user") ? "flex-end" : "flex-start"};
`;
const MessageIcon = styled.div`
  margin-top: 5px;
  margin-right: 10px;
  font-size: 1.2em;
  color: #54585d;
`;

const UserMessageStyled = styled.div`
  background-color: #007bff;
  color: #fff;
  padding: 10px 15px;
  margin-right: 10px;
  border-radius: 18px;
  max-width: 80%;
  word-break: break-word;
`;

const AssistantMessageStyled = styled.div`
  background-color: #282c34;
  color: #fff;
  padding: 10px 15px;
  border-radius: 18px;
  max-width: 80%;
  word-break: break-word;

  code {
    background-color: #1d1f21;
    padding: 3px 5px;
    border-radius: 5px;
    font-family: "Fira Code", monospace;
  }

  pre {
    background-color: #1d1f21;
    padding: 10px;
    border-radius: 5px;
    overflow-x: auto;

    code {
      background-color: transparent;
      padding: 0;
    }
  }
`;

const ChatInputContainer = styled.div`
  padding: 10px;
  background-color: ${theme.secondaryBackground};
  border-top: 1px solid ${theme.borderColor};
  display: flex;

  /* Apply fixed positioning only for smaller screens */
  @media (max-width: 767px) {
    position: fixed;
    bottom: 0;
    width: 100%;
  }
`;

const ChatInput = styled.textarea`
  flex: 1;
  padding: 10px;
  border: none;
  border-radius: 20px;
  background-color: #1d1f21;
  color: ${theme.primaryText};
  resize: none;
  font-size: 16px;
  margin-right: 10px;
  &::placeholder {
    color: #54585d;
  }
`;

const SendButton = styled.button`
  background-color: transparent;
  border: none;
  padding: 10px;
  cursor: pointer;
  font-size: 1.2em;
  color: #007bff;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .spinning {
    animation: ${keyframes`
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    `} 1s linear infinite;
  }
`;

const SkeletonMessage = styled.div`
  background-color: #282c34;
  border-radius: 8px;
  margin-bottom: 10px;
  padding: 10px;
  width: 60%;
  opacity: 0.7;

  ${({ loading }) =>
    loading &&
    css`
      animation: ${keyframes`
        0% { opacity: 0.7; }
        50% { opacity: 0.9; }
        100% { opacity: 0.7; }
      `} 1s linear infinite;
    `}
`;

const MenuButton = styled.button`
  background: none;
  border: none;
  margin-right: 20px;
  font-size: 1.2em;
  color: ${theme.primaryText};
  cursor: pointer;

  @media (min-width: 768px) {
    display: none;
  }
`;

export default ChatApp;
