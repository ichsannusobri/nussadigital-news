'use client';

import { useState } from 'react';
import { generateFinancialAudit, askFinancialAdvisor } from '../../lib/budget/advisor';
import { marked } from 'marked';

export default function AIAdvisorWidget({ expenses, income, currency }) {
  const [auditResult, setAuditResult] = useState('');
  const [isAuditing, setIsAuditing] = useState(false);

  // Chat Q&A state
  const [chatMessages, setChatMessages] = useState([
    { sender: 'ai', text: `Hello! I am your NDNews AI Financial Advisor. Ask me any question about your household budget, savings targets, or cost reduction tips in ${currency}.` }
  ]);
  const [question, setQuestion] = useState('');
  const [isAsking, setIsAsking] = useState(false);

  const handleRunAudit = async () => {
    setIsAuditing(true);
    try {
      const res = await generateFinancialAudit(expenses, income, currency);
      setAuditResult(res);
    } catch (e) {
      console.error(e);
      setAuditResult("Error running AI Audit. Please try again.");
    } finally {
      setIsAuditing(false);
    }
  };

  const handleSendQuestion = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;

    const userText = question.trim();
    setQuestion('');
    setChatMessages(prev => [...prev, { sender: 'user', text: userText }]);
    setIsAsking(true);

    try {
      const aiReply = await askFinancialAdvisor(userText, expenses, income, currency);
      setChatMessages(prev => [...prev, { sender: 'ai', text: aiReply }]);
    } catch (e) {
      console.error(e);
      setChatMessages(prev => [...prev, { sender: 'ai', text: "Sorry, I couldn't process your question at the moment. Please try again." }]);
    } finally {
      setIsAsking(false);
    }
  };

  return (
    <div className="ai-advisor-card">
      <div className="advisor-header">
        <div className="advisor-title">
          <span className="sparkle-icon">✨</span>
          <h3>Gemini AI Financial Advisor (Beta)</h3>
          <span className="ai-status-tag">Live Intelligence</span>
        </div>
        <button onClick={handleRunAudit} disabled={isAuditing} className="btn-run-audit">
          {isAuditing ? "⚡ Auditing Budget..." : "⚡ Run AI Budget Audit"}
        </button>
      </div>

      {/* AUTOMATED AUDIT SECTION */}
      {auditResult && (
        <div className="audit-result-box">
          <div className="audit-box-header">
            <h4>📊 Automated Household Budget Audit</h4>
          </div>
          <div 
            className="audit-content-prose"
            dangerouslySetInnerHTML={{ __html: marked(auditResult) }}
          />
        </div>
      )}

      {/* INTERACTIVE CHAT ADVISOR */}
      <div className="ai-chat-container">
        <div className="chat-header-small">
          <span>💬 Ask AI Advisor</span>
        </div>

        <div className="chat-messages-area">
          {chatMessages.map((msg, index) => (
            <div key={index} className={`chat-bubble-row ${msg.sender === 'user' ? 'user-row' : 'ai-row'}`}>
              <div className={`chat-bubble ${msg.sender === 'user' ? 'bubble-user' : 'bubble-ai'}`}>
                {msg.sender === 'ai' ? (
                  <div dangerouslySetInnerHTML={{ __html: marked(msg.text) }} />
                ) : (
                  <p>{msg.text}</p>
                )}
              </div>
            </div>
          ))}

          {isAsking && (
            <div className="chat-bubble-row ai-row">
              <div className="bubble-ai typing-indicator">
                <span>AI Advisor is analyzing your budget...</span>
              </div>
            </div>
          )}
        </div>

        <form onSubmit={handleSendQuestion} className="chat-input-form">
          <input
            type="text"
            placeholder={`Ask a question (e.g. "How to save 20% more in ${currency}?")`}
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            disabled={isAsking}
          />
          <button type="submit" disabled={isAsking || !question.trim()} className="btn-send-chat">
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
