import styled, { keyframes } from "styled-components";

export const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

export const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
  background-color: black;
  font-family: "Varela Round";
  overflow-x: hidden;
`;

export const ChatHeader = styled.div`
  border-bottom: 1px solid grey;
  color: white;
  padding: 0px;
  text-align: center;
  font-size: 2em;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: "10px";
`;

export const ChatMessages = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  color: white;
  animation: ${fadeIn} 0.5s ease forwards;
`;

export const ChatInputContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 20px;
  box-shadow: 0 -4px 6px rgba(0, 0, 0, 0.1);
`;

export const ChatInput = styled.textarea`
  flex: 1;
  border: none;
  border-radius: 5px;
  margin-right: 20px;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
`;

export const SendButton = styled.button`
  padding: 15px;
  width: 100px;
  background-color: black;
  color: white;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 20px;
  cursor: pointer;
  border: 2px solid white;

  &:hover {
    background-color: white;
    color: black;
    border: 2px solid black;
  }
`;

export const Loader = styled.div`
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  width: 10px;
  height: 10px;
  animation: spin 2s linear infinite;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

export const CodeBlock = styled.pre`
  position: relative;
  border: 1px solid white;
  background-color: #000d1a;
  margin: 14px;
  color: #fff;
  border-radius: 10px;
  font-family: monospace;
  white-space: pre-wrap;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;
export const CopyButton = styled.button`
  bottom: 10px;
  background: transparent;
  border: 1px solid white;
  border-radius: 4px;
  cursor: pointer;
  color: #fff;
  &:hover {
    color: yellow;
    border: 1px solid yellow;
  }
`;

export const FullResponseBox = styled.div`
  padding: 20px;
  border-radius: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  animation: ${fadeIn} 0.5s ease forwards;
`;

export const UserMessage = styled.div`
  align-self: flex-end;
  max-width: 60%;
  background-color: #30302f;
  color: white;
  padding: 10px;
  border-radius: 10px;
  margin: 5px 0;
  float: right;
  clear: both; /* Added for right alignment */
`;

export const AssistantMessage = styled.div`
  align-self: flex-start;
  max-width: 60%;

  background-color: black;
  border: 1px solid white;
  color: white;
  padding: 20px;
  padding-top: 30px;
  padding-bottom: 30px;
  padding-bottom: 30px;
  border-radius: 10px;
  margin: 5px 0;

  float: left;
  clear: both;
  text-align: left; /* Added for left alignment */
`;

export const MessageContainer = styled.div`
  animation: fadeIn 0.5s ease;
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

export const Text = styled.span`
  font-size: 15px;
  line-height: 1.5;
`;
export const Title = styled.h4`
  font-weight: bold;
  font-size: 1.2em;
  margin: 10px 0;
`;
