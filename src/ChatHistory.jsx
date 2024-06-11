/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCommentDots, faTimes } from "@fortawesome/free-solid-svg-icons";

const HistoryContainer = styled.div`
  width: 250px;
  background-color: #121212;
  color: #ffffff;
  padding: 16px;
  border-right: 1px solid #282c34;
  min-height: 100vh;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 100;
  transform: translateX(${({ showHistory }) => (showHistory ? "0" : "-100%")});
  transition: transform 0.3s ease-in-out;

  /* Styles for larger screens */
  @media (min-width: 768px) {
    position: relative;
    transform: translateX(0);
    width: 250px;
  }
`;

const HistoryHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const HistoryTitle = styled.h2`
  font-size: 1.5em;
  margin-bottom: 20px;
  color: #00a884;
`;

const ChatSessionItem = styled.div`
  padding: 12px 16px;
  margin-bottom: 10px;
  border-radius: 8px;
  background-color: #1f1f1f;
  cursor: pointer;
  transition: background-color 0.2s ease;
  display: flex;
  align-items: center;

  &:hover {
    background-color: #282c34;
  }

  &.active {
    background-color: #282c34;
    border-left: 4px solid #00a884;
    padding-left: 11px;
  }
`;

const SessionIcon = styled(FontAwesomeIcon)`
  margin-right: 10px;
  font-size: 1.2em;
  color: #54585d;
`;

const SessionName = styled.span`
  font-size: 1rem;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  padding: 10px;
  font-size: 1.2em;
  color: #00a884;
  cursor: pointer;

  /* Hide on larger screens */
  @media (min-width: 768px) {
    display: none;
  }
`;

const ChatHistory = ({ onChatSelect, showHistory, onClose }) => {
  const [chatHistory, setChatHistory] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const response = await new Promise((resolve) => {
        setTimeout(() => {
          resolve([
            { id: 1, name: "Project Alpha" },
            { id: 2, name: "Design Brainstorming" },
          ]);
        }, 1000);
      });
      setChatHistory(response);
      setIsLoading(false);
    };

    fetchData();
  }, []);

  const handleSessionClick = (sessionId) => {
    setActiveChat(sessionId);
    onChatSelect(sessionId);
  };

  return (
    <HistoryContainer showHistory={showHistory}>
      <HistoryHeader>
        <HistoryTitle>
          <SessionIcon icon={faCommentDots} /> Chat History
        </HistoryTitle>
        <CloseButton onClick={onClose}>
          <FontAwesomeIcon icon={faTimes} />
        </CloseButton>
      </HistoryHeader>
      {isLoading ? (
        <div>Loading chats...</div>
      ) : (
        chatHistory.map((session) => (
          <ChatSessionItem
            key={session.id}
            onClick={() => handleSessionClick(session.id)}
            className={activeChat === session.id ? "active" : ""}
          >
            <SessionName>{session.name}</SessionName>
          </ChatSessionItem>
        ))
      )}
    </HistoryContainer>
  );
};

export default ChatHistory;
