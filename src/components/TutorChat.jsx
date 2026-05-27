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
    <div className="dash-card flex flex-col h-[320px] overflow-hidden">
      <div className="p-4 border-b border-brand-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-brand-lime fill-brand-dark" />
          <span className="text-xs font-black uppercase tracking-widest">AI Tutor</span>
        </div>
      </div>
      
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[90%] p-3 rounded-2xl text-xs leading-relaxed ${
              m.role === 'user' 
                ? 'bg-brand-dark text-white rounded-tr-none' 
                : 'bg-brand-gray text-brand-dark rounded-tl-none font-medium text-[11px]'
            }`}>
              {m.text}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-brand-gray p-2 rounded-xl rounded-tl-none flex gap-1">
              <div className="w-1 h-1 bg-brand-dark rounded-full animate-bounce"></div>
              <div className="w-1 h-1 bg-brand-dark rounded-full animate-bounce delay-75"></div>
              <div className="w-1 h-1 bg-brand-dark rounded-full animate-bounce delay-150"></div>
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSend} className="p-3 border-t border-brand-border flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask something..."
          className="flex-1 px-3 py-2 rounded-xl bg-brand-gray focus:outline-none text-xs"
        />
        <button 
          type="submit"
          className="p-2 bg-brand-lime text-brand-dark rounded-xl hover:scale-105 transition-transform disabled:opacity-50"
          disabled={!input.trim() || isTyping}
        >
          <Send size={14} />
        </button>
      </form>
    </div>
  );
};

export default TutorChat;
