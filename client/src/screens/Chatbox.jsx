import React, { useState, useRef, useEffect } from 'react';
import { chatService } from '../services/chatService'; // CHANGE THIS IMPORT
import { supabase } from '../config/supabase';

const ChatBox = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [sessionId, setSessionId] = useState('');
  const messagesEndRef = useRef(null);

  // Generate or get session ID
  useEffect(() => {
    // Create unique session ID for this chat session
    let savedSessionId = localStorage.getItem('chat-session-id');
    if (!savedSessionId) {
      savedSessionId = `chat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('chat-session-id', savedSessionId);
    }
    setSessionId(savedSessionId);
    
    // Load user email if saved
    const savedEmail = localStorage.getItem('chat-user-email');
    if (savedEmail) setUserEmail(savedEmail);
    
    // Load chat history for this session
    loadChatHistory(savedSessionId);
  }, []);

  // Load messages for this session
  const loadChatHistory = async (sessionId) => {
    try {
      const result = await chatService.getChatHistory(sessionId);
      
      if (result.success && result.messages.length > 0) {
        // Convert to chat format
        const chatMessages = result.messages.flatMap(msg => [
          { text: msg.user_message, sender: "user" },
          { text: msg.ai_response, sender: "ai" }
        ]);
        setMessages(chatMessages);
      } else {
        // Add welcome message
        setMessages([
          { text: "Hello! I'm SmartWatt AI Assistant. How can I help you today?", sender: "ai" }
        ]);
      }
    } catch (error) {
      console.error('Failed to load chat:', error);
      setMessages([
        { text: "Hello! I'm SmartWatt AI Assistant. How can I help you today?", sender: "ai" }
      ]);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // AI Response Logic (keep your existing)
  const getAIResponse = (userMessage) => {
    const message = userMessage.toLowerCase();
    
    if (message.includes('price') || message.includes('cost')) {
      return "Our pricing starts at $99 for basic installation. Would you like a custom quote?";
    }
    else if (message.includes('delivery') || message.includes('shipping')) {
      return "We offer free delivery within 30 miles. Delivery takes 3-5 business days.";
    }
    else if (message.includes('install') || message.includes('setup')) {
      return "Our certified technicians handle all installations. It typically takes 2-4 hours.";
    }
    else if (message.includes('warranty') || message.includes('guarantee')) {
      return "All products come with a 5-year warranty and 30-day money-back guarantee.";
    }
    else if (message.includes('contact') || message.includes('call')) {
      return "You can reach us at (555) 123-4567 or email support@smartwatt.com";
    }
    else if (message.includes('thank') || message.includes('thanks')) {
      return "You're welcome! Is there anything else I can help you with?";
    }
    else if (message.includes('order') || message.includes('purchase')) {
      return "You can place orders directly through our website. Visit the Products page!";
    }
    else if (message.includes('hours') || message.includes('open')) {
      return "We're available 24/7 through this chat! Phone support: Mon-Fri 9AM-6PM.";
    }
    else {
      const defaultResponses = [
        "I understand. Let me connect you with our energy specialists for detailed assistance.",
        "That's a great question! Our team can provide the best solution for your specific needs.",
        "I'll make sure our experts get back to you with the most efficient solution.",
        "For detailed technical specifications, our specialists will contact you shortly.",
        "I've noted your query. Our energy consultants will reach out with customized options."
      ];
      return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
    }
  };

  const handleSend = async () => {
    if (inputMessage.trim() === "") return;

    const userMessage = inputMessage.trim();
    
    // Add user message to UI
    setMessages(prev => [...prev, { text: userMessage, sender: "user" }]);
    setInputMessage("");

    // Get AI response
    const aiResponse = getAIResponse(userMessage);
    
    // Add AI response to UI after delay
    setTimeout(() => {
      setMessages(prev => [...prev, { text: aiResponse, sender: "ai" }]);
    }, 1000);

    // ✅ SAVE TO SUPABASE USING chatService
    try {
      const userId = userEmail || 'anonymous';
      
      const result = await chatService.saveMessage(
        sessionId,      // Unique session ID
        userId,         // User email or 'anonymous'
        userMessage,    // User's message
        aiResponse      // AI's response
      );
      
      if (result.success) {
        console.log('✅ Chat saved to cloud:', result.id);
      } else {
        console.error('❌ Failed to save chat:', result.error);
      }
    } catch (error) {
      console.error('❌ Error saving chat:', error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  // Clear chat history for this session
  const clearChat = async () => {
    if (window.confirm('Clear all chat messages for this session?')) {
      try {
        // Get messages for this session
        const result = await chatService.getChatHistory(sessionId);
        
        if (result.success) {
          // Delete each message
          for (const msg of result.messages) {
            await chatService.deleteMessage(msg.id);
          }
          
          // Clear local messages
          setMessages([
            { text: "Hello! I'm SmartWatt AI Assistant. How can I help you today?", sender: "ai" }
          ]);
          
          // Create new session
          const newSessionId = `chat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
          localStorage.setItem('chat-session-id', newSessionId);
          setSessionId(newSessionId);
          
          alert('Chat cleared and new session started!');
        }
      } catch (error) {
        console.error('Failed to clear chat:', error);
        alert('Error clearing chat: ' + error.message);
      }
    }
  };

  // Export chat for user
  const exportChat = async () => {
    try {
      const result = await chatService.getChatHistory(sessionId);
      
      if (result.success && result.messages.length > 0) {
        const chatText = result.messages.map(msg => 
          `You: ${msg.user_message}\nAI: ${msg.ai_response}\n---`
        ).join('\n');
        
        const blob = new Blob([chatText], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `smartwatt_chat_${sessionId}.txt`;
        a.click();
        
        alert('Chat exported as text file!');
      } else {
        alert('No chat history to export.');
      }
    } catch (error) {
      console.error('Error exporting chat:', error);
      alert('Failed to export chat.');
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full shadow-2xl flex items-center justify-center hover:from-blue-700 hover:to-blue-800 transition-all duration-300 z-50"
      >
        💬
      </button>

      {isOpen && (
        <div className="fixed bottom-20 right-6 w-80 h-96 bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 flex flex-col">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-t-2xl flex justify-between items-center">
            <div>
              <h3 className="font-bold text-lg">SmartWatt AI Assistant</h3>
              <p className="text-blue-100 text-sm">Session: {sessionId.slice(0, 8)}...</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={exportChat}
                className="text-white hover:text-green-300 text-sm"
                title="Export chat"
              >
                💾
              </button>
              <button
                onClick={clearChat}
                className="text-white hover:text-red-300 text-sm"
                title="Clear chat history"
              >
                🗑️
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white hover:text-blue-200 text-xl"
              >
                ×
              </button>
            </div>
          </div>

          <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
            {messages.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                <p>Starting new chat...</p>
              </div>
            ) : (
              messages.map((message, index) => (
                <div
                  key={index}
                  className={`mb-3 ${message.sender === "user" ? "text-right" : "text-left"}`}
                >
                  <div className={`inline-block max-w-xs px-4 py-2 rounded-2xl ${
                    message.sender === "user"
                      ? "bg-blue-600 text-white rounded-br-none"
                      : "bg-green-500 text-white rounded-bl-none"
                  }`}>
                    <div className="text-xs font-semibold mb-1 opacity-80">
                      {message.sender === "user" ? "You" : "SmartWatt AI"}
                    </div>
                    {message.text}
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 border-t border-gray-200 bg-white rounded-b-2xl">
            {!userEmail && (
              <div className="mb-2">
                <input
                  type="email"
                  placeholder="Enter email for follow-up (optional)"
                  value={userEmail}
                  onChange={(e) => {
                    setUserEmail(e.target.value);
                    localStorage.setItem('chat-user-email', e.target.value);
                  }}
                  className="w-full px-3 py-1 text-sm rounded border border-gray-300 focus:outline-none focus:border-blue-500"
                />
              </div>
            )}
            <div className="flex gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about pricing, delivery, installation..."
                className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:border-blue-500 text-gray-900 placeholder-gray-500"
              />
              <button
                onClick={handleSend}
                disabled={!inputMessage.trim()}
                className={`rounded-full w-10 h-10 flex items-center justify-center transition-colors ${
                  inputMessage.trim() 
                    ? "bg-blue-600 text-white hover:bg-blue-700" 
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                ➤
              </button>
            </div>
            <div className="text-xs text-gray-500 mt-2 text-center">
              💾 Messages saved permanently to SmartWatt
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBox;