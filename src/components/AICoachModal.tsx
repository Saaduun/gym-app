import React, { useState, useRef, useEffect } from 'react';
import { UserProfile, TrainingPlan } from '../types';
import {
  Sparkles,
  Send,
  X,
  Bot,
  User,
  ShieldAlert,
  Flame,
  Dumbbell,
  Swords,
  RotateCcw,
} from 'lucide-react';

interface AICoachModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  plan: TrainingPlan;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

export const AICoachModal: React.FC<AICoachModalProps> = ({
  isOpen,
  onClose,
  profile,
  plan,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: `Hello ${profile.name}! I am your AI Hybrid Training Coach. I can help adapt your ${profile.trainingMode.replace('_', ' ')} routine, suggest exercise substitutions, explain combat biomechanics, or evaluate joint recovery. How can I assist your training today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputText, setInputText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const handleSendMessage = async (customPrompt?: string) => {
    const textToSend = customPrompt || inputText;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!customPrompt) setInputText('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: textToSend,
          userProfile: profile,
          currentPlanSummary: `Mode: ${profile.trainingMode}, Days: ${profile.daysPerWeek}, Goal: ${profile.goal}`,
        }),
      });

      if (!response.ok) {
        throw new Error('AI Coach response failed');
      }

      const data = await response.json();
      const botMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        sender: 'assistant',
        text: data.response || data.reply || 'I am ready to help refine your workout parameters.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err: any) {
      const fallbackMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        sender: 'assistant',
        text: `Here is athletic guidance based on your ${profile.trainingMode.replace('_', ' ')} profile: When balancing gym lifting and martial arts, prioritize multi-joint compound strength (deadlifts, landmines, squats) 48 hours away from heavy sparring, and keep core rotational volume high.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickQuestions = [
    'How do I avoid leg fatigue before sparring?',
    'Substitute bench press for shoulder-safe power',
    'Best pre-training fuel for high-intensity rounds',
    'Explain the kinetic chain of a hook punch',
  ];

  return (
    <div
      id="ai-coach-backdrop"
      className="fixed inset-0 z-50 bg-[#0A0A0A]/85 backdrop-blur-md flex justify-end animate-fade-in"
    >
      <div
        id="ai-coach-drawer"
        className="w-full max-w-lg bg-[#141414] border-l border-white/10 h-full flex flex-col justify-between shadow-2xl text-white"
      >
        {/* Top Header */}
        <div className="p-4 sm:p-5 border-b border-white/5 flex items-center justify-between bg-[#141414]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#D4FF00] text-black font-black flex items-center justify-center shadow-lg shadow-[#D4FF00]/15">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-white">AI Training Coach</span>
                <span className="text-[9px] bg-[#D4FF00]/20 text-[#D4FF00] font-black px-1.5 py-0.5 rounded uppercase">
                  Gemini 2.5
                </span>
              </div>
              <p className="text-[10px] text-zinc-400 font-mono">
                {profile.trainingMode.replace('_', ' ')} • Biomechanical Assistant
              </p>
            </div>
          </div>

          <button
            id="btn-close-ai-coach"
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 border border-white/10 text-zinc-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] p-4 rounded-2xl text-xs leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-[#D4FF00] text-black font-medium shadow-md'
                    : 'bg-[#0A0A0A] border border-white/5 text-zinc-200 shadow-xl'
                }`}
              >
                {m.text}
              </div>
              <span className="text-[9px] text-zinc-600 font-mono mt-1 px-1">
                {m.timestamp}
              </span>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-2 text-xs text-zinc-400 bg-[#0A0A0A] p-3 rounded-2xl border border-white/5 w-fit animate-pulse">
              <div className="w-2 h-2 rounded-full bg-[#D4FF00] animate-ping" />
              <span>Analyzing athletic physiology...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Question Chips */}
        <div className="p-3 border-t border-white/5 bg-[#0A0A0A]/50 overflow-x-auto flex gap-1.5 no-scrollbar">
          {quickQuestions.map((q, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSendMessage(q)}
              className="px-3 py-1.5 rounded-xl bg-[#141414] hover:bg-[#1f1f1f] border border-white/10 text-[11px] text-zinc-300 hover:text-white shrink-0 transition"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-4 border-t border-white/5 bg-[#141414]">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              id="input-ai-coach-text"
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask about exercises, fatigue, or striking power..."
              className="flex-1 px-4 py-3 rounded-2xl bg-[#0A0A0A] border border-white/10 text-xs text-white placeholder-zinc-500 focus:border-[#D4FF00] outline-none font-mono"
            />
            <button
              id="btn-submit-ai-coach"
              type="submit"
              disabled={isLoading || !inputText.trim()}
              className="p-3 rounded-2xl bg-[#D4FF00] hover:bg-[#bce300] disabled:opacity-30 text-black font-bold transition shadow-lg shadow-[#D4FF00]/10"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
