import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Sparkles } from 'lucide-react';
import { chatWithTutor } from '../lib/agents';

const TutorChat = ({ portfolio }) => {
  const [messages, setMessages] = useState([
    { role: 'bot', text: 'Hi! I\'m your Gemini investing tutor. Ask me anything about your portfolio or investing basics!' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    const response = await chatWithTutor(portfolio, input, messages);
    
    setMessages(prev => [...prev, { role: 'bot', text: response }]);
    setIsTyping(false);
  };

  return (
    <div className="glass-card rounded-3xl overflow-hidden flex flex-col h-[500px]">
      <div className="p-4 bg-primary-600 text-white flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5" />
          <span className="font-bold">AI Tutor Chat</span>
        </div>
      </div>
      
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-3 rounded-2xl flex gap-3 ${
              m.role === 'user' 
                ? 'bg-primary-600 text-white rounded-tr-none' 
                : 'bg-white border border-slate-100 text-slate-800 rounded-tl-none'
            }`}>
              {m.role === 'bot' && <Bot className="w-4 h-4 shrink-0 mt-1" />}
              <p className="text-sm leading-relaxed">{m.text}</p>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white border border-slate-100 p-3 rounded-2xl rounded-tl-none">
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 bg-primary-400 rounded-full animate-bounce"></div>
                <div className="w-1.5 h-1.5 bg-primary-500 rounded-full animate-bounce delay-100"></div>
                <div className="w-1.5 h-1.5 bg-primary-600 rounded-full animate-bounce delay-200"></div>
              </div>
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSend} className="p-4 bg-white border-t border-slate-100 flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question..."
          className="flex-1 px-4 py-2 rounded-xl bg-slate-50 border-none focus:ring-2 focus:ring-primary-500 outline-none text-sm"
        />
        <button 
          type="submit"
          className="p-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors disabled:opacity-50"
          disabled={!input.trim() || isTyping}
        >
          <Send className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
};

export default TutorChat;
