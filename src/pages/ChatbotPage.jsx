import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleUp } from "@fortawesome/free-solid-svg-icons";
import chatbot from "../assets/chatbot.png";
import "../styles/ChatbotPage.css";
import { sendChatMessage, getChatHistory } from "@/api/Ai";

const ChatbotPage = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [userInput, setUserInput] = useState("");

  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    const loadChatHistory = async () => {
      try {
        const res = await getChatHistory();
        console.log("getChatHistory response:", res); // 응답 확인

        const formatted = Array.isArray(res?.data)
          ? res.data.map((msg) => ({
              sender: msg.role === "user" ? "나" : "챗봇",
              message: msg.content,
            }))
          : [];

        if (formatted.length > 0) setHasInteracted(true);
        setMessages(formatted);
      } catch (err) {
        console.error("기록 불러오기 실패:", err);
      }
    };

    loadChatHistory();
  }, []);

  const addMessage = (sender, message) => {
    setMessages((prev) => [...prev, { sender, message }]);
  };

  const handleSendMessage = async () => {
    const message = userInput.trim();
    if (!message || loading) return;

    if (!hasInteracted) setHasInteracted(true);

    addMessage("나", message);
    setUserInput("");
    setLoading(true);

    try {
      const res = await sendChatMessage(message);
      const aiResponse = res?.data?.response || "응답 없음";
      addMessage("챗봇", aiResponse);
    } catch (error) {
      console.error("오류 발생:", error.message);
      addMessage("챗봇", `오류: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey && !e.isComposing) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleInputChange = (e) => {
    setUserInput(e.target.value);
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, loading]);

  return (
    <div id="ChatbotPage" style={{ padding: "1rem" }}>
      {!hasInteracted && (
        <div className="chatbotPhraseCt">
          <img className="chatbotImg" src={chatbot} alt="chatbotImg" />
          <div className="chatbotFrame">
            <div className="chatbotPhrase">
              안녕하세요 저는 당신의 재정관리를 도와 줄{" "}
              <span className="phraseHighlight">챗봇 FM</span>입니다!
            </div>
            <div className="chatbotPhrase2">
              재정관리에 대해 궁금한 내용을 질문해주세요
            </div>
          </div>
        </div>
      )}

      <div
        className="chatMessages"
        style={{ overflowY: "auto", maxHeight: "70vh" }}
      >
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`chatMessage ${msg.sender === "나" ? "user" : "ai"}`}
          >
            {msg.sender !== "나" && (
              <img className="chatbotMsgImg2" src={chatbot} alt="chatbot" />
            )}
            <div className="bubble">{msg.message}</div>
          </div>
        ))}

        {loading && (
          <div className="chatMessage ai">
            <div className="bubble2">답변 생성 중...</div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="inputTextFrame">
        <textarea
          ref={textareaRef}
          className="chatbotInput"
          placeholder="FM챗봇에게 궁금한 내용을 물어보세요"
          value={userInput}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
        />
        <div className="submitFrame" onClick={handleSendMessage}>
          <FontAwesomeIcon className="submitIcon" icon={faAngleUp} />
        </div>
      </div>
    </div>
  );
};

export default ChatbotPage;
