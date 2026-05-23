"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useUser } from "@clerk/nextjs";
import {
  Send,
  MessageSquare,
  Calculator,
  Atom,
  FlaskConical,
  Dna,
  Code2,
  BookOpen,
  BookMarked,
  Users,
  Paperclip,
  X,
  ChevronLeft,
  Loader2,
} from "lucide-react";
import { useChat, type ChatMessage } from "@/hooks/useSocket";
import { cn } from "@/utils/cn";

// ── Room definitions ───────────────────────────────────────────────────────

const CHAT_ROOMS = [
  { id: "general",          label: "General",        Icon: MessageSquare,  color: "text-violet-400" },
  { id: "mathematics",      label: "Mathematics",    Icon: Calculator,     color: "text-blue-400"   },
  { id: "physics",          label: "Physics",        Icon: Atom,           color: "text-cyan-400"   },
  { id: "chemistry",        label: "Chemistry",      Icon: FlaskConical,   color: "text-green-400"  },
  { id: "biology",          label: "Biology",        Icon: Dna,            color: "text-emerald-400"},
  { id: "computer-science", label: "Computer Sci",   Icon: Code2,          color: "text-orange-400" },
  { id: "history",          label: "History",        Icon: BookOpen,       color: "text-amber-400"  },
  { id: "english",          label: "English",        Icon: BookMarked,     color: "text-pink-400"   },
] as const;

type RoomId = (typeof CHAT_ROOMS)[number]["id"];

// ── Avatar helper ──────────────────────────────────────────────────────────

function Avatar({ name, avatar, size = 8 }: { name: string; avatar?: string; size?: number }) {
  if (avatar) {
    return (
      <img
        src={avatar}
        alt={name}
        className={`w-${size} h-${size} rounded-full object-cover flex-shrink-0`}
      />
    );
  }
  return (
    <div
      className={`w-${size} h-${size} rounded-full bg-violet-600/30 border border-violet-500/30 flex items-center justify-center flex-shrink-0`}
    >
      <span className="text-violet-300 font-semibold text-xs">{name[0]?.toUpperCase()}</span>
    </div>
  );
}

// ── Typing indicator ───────────────────────────────────────────────────────

function TypingIndicator({ users }: { users: Record<string, string> }) {
  const names = Object.values(users).slice(0, 3);
  if (names.length === 0) return null;

  const label =
    names.length === 1
      ? `${names[0]} is typing`
      : names.length === 2
      ? `${names[0]} and ${names[1]} are typing`
      : `${names[0]}, ${names[1]} and others are typing`;

  return (
    <div className="flex items-center gap-2 px-4 pb-1 text-slate-500 text-xs">
      <span className="flex gap-0.5 items-end">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="w-1 h-1 bg-slate-500 rounded-full animate-bounce"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </span>
      {label}…
    </div>
  );
}

// ── Single message bubble ──────────────────────────────────────────────────

function MessageBubble({
  message,
  isOwn,
  showMeta,
}: {
  message: ChatMessage;
  isOwn: boolean;
  showMeta: boolean;
}) {
  const time = new Date(message.createdAt).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className={cn("flex gap-3 group", showMeta ? "mt-3" : "mt-0.5")}>
      {/* Avatar — only on first message of a group */}
      <div className="w-8 flex-shrink-0 mt-0.5">
        {showMeta && (
          <Avatar name={message.sender.name} avatar={message.sender.avatar} size={8} />
        )}
      </div>

      <div className="flex-1 min-w-0">
        {/* Name + timestamp — only first of group */}
        {showMeta && (
          <div className="flex items-baseline gap-2 mb-1">
            <span className={cn("text-sm font-semibold", isOwn ? "text-violet-300" : "text-slate-200")}>
              {isOwn ? "You" : message.sender.name}
            </span>
            <span className="text-[10px] text-slate-600">{time}</span>
          </div>
        )}

        {/* Content */}
        {message.type === "flashcard" && message.attachmentData ? (
          <FlashcardShare data={message.attachmentData} />
        ) : (
          <p
            className={cn(
              "text-sm leading-relaxed rounded-xl px-3 py-2 inline-block max-w-prose break-words",
              message.type === "note"
                ? "bg-amber-500/10 border border-amber-500/20 text-amber-100"
                : isOwn
                ? "bg-violet-600/20 text-slate-100"
                : "bg-white/5 text-slate-200"
            )}
          >
            {message.type === "note" && (
              <span className="text-amber-400 text-xs font-semibold mr-2">📌 Note</span>
            )}
            {message.content}
          </p>
        )}
      </div>
    </div>
  );
}

// ── Shared flashcard display ───────────────────────────────────────────────

function FlashcardShare({
  data,
}: {
  data: { front?: string; back?: string; subject?: string };
}) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      onClick={() => setFlipped((f) => !f)}
      className="cursor-pointer bg-gradient-to-br from-violet-900/40 to-blue-900/40 border border-violet-500/20 rounded-xl p-4 max-w-xs"
    >
      <p className="text-[10px] text-violet-400 font-semibold mb-2 flex items-center gap-1">
        <span>🃏</span> Shared Flashcard {data.subject && `· ${data.subject}`}
      </p>
      <p className="text-sm text-slate-200 font-medium">
        {flipped ? data.back || "—" : data.front || "—"}
      </p>
      <p className="text-[10px] text-slate-600 mt-2">
        {flipped ? "Showing answer — tap to flip" : "Showing question — tap to flip"}
      </p>
    </div>
  );
}

// ── Flashcard picker modal ─────────────────────────────────────────────────

interface Flashcard {
  _id: string;
  front: string;
  back: string;
  subject: string;
}

function FlashcardPicker({
  onSelect,
  onClose,
}: {
  onSelect: (card: Flashcard) => void;
  onClose: () => void;
}) {
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/flashcards?limit=100")
      .then((r) => r.json())
      .then((d) => {
        setCards(d.flashcards || d || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filtered = cards.filter(
    (c) =>
      c.front.toLowerCase().includes(search.toLowerCase()) ||
      c.subject.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="absolute bottom-full left-0 mb-2 w-80 bg-[#0f1629] border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden">
      <div className="flex items-center justify-between p-3 border-b border-white/5">
        <span className="text-sm font-semibold text-slate-300">Share a Flashcard</span>
        <button onClick={onClose} className="text-slate-500 hover:text-slate-300">
          <X size={16} />
        </button>
      </div>
      <div className="p-2 border-b border-white/5">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search flashcards…"
          className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white placeholder:text-slate-600 outline-none"
        />
      </div>
      <div className="max-h-56 overflow-y-auto">
        {loading ? (
          <div className="flex justify-center py-6">
            <Loader2 className="w-5 h-5 animate-spin text-slate-500" />
          </div>
        ) : filtered.length === 0 ? (
          <p className="text-slate-600 text-sm text-center py-6">No flashcards found</p>
        ) : (
          filtered.map((card) => (
            <button
              key={card._id}
              onClick={() => onSelect(card)}
              className="w-full text-left px-3 py-2.5 hover:bg-white/5 transition-colors border-b border-white/5 last:border-0"
            >
              <p className="text-xs text-violet-400 mb-0.5">{card.subject}</p>
              <p className="text-sm text-slate-300 truncate">{card.front}</p>
            </button>
          ))
        )}
      </div>
    </div>
  );
}

// ── Main page ──────────────────────────────────────────────────────────────

export default function ChatPage() {
  const { user, isLoaded } = useUser();
  const [activeRoom, setActiveRoom] = useState<RoomId>("general");
  const [showRoomList, setShowRoomList] = useState(true);
  const [inputText, setInputText] = useState("");
  const [messageType, setMessageType] = useState<"text" | "note">("text");
  const [showFlashcardPicker, setShowFlashcardPicker] = useState(false);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const userInfo = isLoaded && user
    ? { userId: user.id, name: user.fullName || user.username || "Student", avatar: user.imageUrl }
    : null;

  const { messages, sendMessage, typingUsers, roomMembers, isLoading, emitTyping } =
    useChat(activeRoom, userInfo);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typingUsers]);

  const handleSend = useCallback(async () => {
    const text = inputText.trim();
    if (!text || sending) return;
    setSending(true);
    setInputText("");
    await sendMessage(text, messageType);
    setSending(false);
    setMessageType("text");
    inputRef.current?.focus();
  }, [inputText, sending, sendMessage, messageType]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFlashcardShare = async (card: { _id: string; front: string; back: string; subject: string }) => {
    setShowFlashcardPicker(false);
    setSending(true);
    await sendMessage(card.front, "flashcard", {
      front: card.front,
      back: card.back,
      subject: card.subject,
    });
    setSending(false);
  };

  const activeRoomInfo = CHAT_ROOMS.find((r) => r.id === activeRoom)!;

  // Group messages: show meta (avatar + name) only when sender changes or >5 min gap
  const groupedMessages = messages.map((msg, i) => {
    const prev = messages[i - 1];
    const sameSender = prev?.sender.userId === msg.sender.userId;
    const closeInTime =
      prev && new Date(msg.createdAt).getTime() - new Date(prev.createdAt).getTime() < 5 * 60 * 1000;
    return { msg, showMeta: !sameSender || !closeInTime };
  });

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden bg-[#080b14]">
      {/* ── Room list ──────────────────────────────────────────────────────── */}
      <aside
        className={cn(
          "flex-shrink-0 w-64 border-r border-white/5 flex flex-col bg-[#0a0d1a] transition-all",
          "md:flex",
          showRoomList ? "flex" : "hidden"
        )}
      >
        <div className="px-4 py-4 border-b border-white/5">
          <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-widest">
            Chat Rooms
          </h2>
        </div>
        <nav className="flex-1 overflow-y-auto p-2 space-y-0.5">
          {CHAT_ROOMS.map(({ id, label, Icon, color }) => {
            const isActive = id === activeRoom;
            return (
              <button
                key={id}
                onClick={() => {
                  setActiveRoom(id);
                  setShowRoomList(false);
                }}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left",
                  isActive
                    ? "bg-violet-600/15 text-slate-200 border border-violet-500/15"
                    : "text-slate-500 hover:text-slate-300 hover:bg-white/5"
                )}
              >
                <Icon size={16} className={isActive ? color : "text-slate-600"} />
                <span className="flex-1">{label}</span>
                {isActive && <div className="w-1.5 h-1.5 rounded-full bg-violet-400" />}
              </button>
            );
          })}
        </nav>

        {/* Online count */}
        <div className="p-4 border-t border-white/5">
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <Users size={12} />
            <span>{roomMembers.length} in this room</span>
          </div>
        </div>
      </aside>

      {/* ── Chat area ──────────────────────────────────────────────────────── */}
      <div className={cn("flex-1 flex flex-col min-w-0", !showRoomList ? "flex" : "hidden md:flex")}>
        {/* Header */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-white/5 bg-[#0a0d1a]/80 backdrop-blur">
          {/* Mobile back */}
          <button
            onClick={() => setShowRoomList(true)}
            className="md:hidden text-slate-500 hover:text-slate-300 p-1"
          >
            <ChevronLeft size={18} />
          </button>

          <activeRoomInfo.Icon size={18} className={activeRoomInfo.color} />
          <div>
            <h1 className="text-sm font-semibold text-slate-200">{activeRoomInfo.label}</h1>
            <p className="text-[11px] text-slate-600">
              {roomMembers.length > 0 ? `${roomMembers.length} online` : "No one else here yet"}
            </p>
          </div>

          {/* Online avatars */}
          {roomMembers.length > 0 && (
            <div className="ml-auto flex -space-x-2">
              {roomMembers.slice(0, 5).map((m) => (
                <Avatar key={m.userId} name={m.name} avatar={m.avatar} size={7} />
              ))}
              {roomMembers.length > 5 && (
                <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-[10px] text-slate-400 font-medium">
                  +{roomMembers.length - 5}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="w-6 h-6 animate-spin text-violet-500" />
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center gap-3">
              <activeRoomInfo.Icon size={40} className={cn(activeRoomInfo.color, "opacity-30")} />
              <p className="text-slate-500 text-sm">
                No messages yet. Be the first to say something in #{activeRoomInfo.label.toLowerCase()}!
              </p>
            </div>
          ) : (
            <>
              {groupedMessages.map(({ msg, showMeta }) => (
                <MessageBubble
                  key={msg._id}
                  message={msg}
                  isOwn={msg.sender.userId === userInfo?.userId}
                  showMeta={showMeta}
                />
              ))}
            </>
          )}
          <TypingIndicator users={typingUsers} />
          <div ref={messagesEndRef} />
        </div>

        {/* Input bar */}
        <div className="p-3 border-t border-white/5 bg-[#0a0d1a]/80">
          {/* Note mode toggle */}
          {messageType === "note" && (
            <div className="flex items-center gap-2 mb-2 px-1">
              <span className="text-xs text-amber-400 font-medium">📌 Sending as Note</span>
              <button
                onClick={() => setMessageType("text")}
                className="text-slate-500 hover:text-slate-300"
              >
                <X size={12} />
              </button>
            </div>
          )}

          <div className="flex items-end gap-2">
            {/* Attach flashcard */}
            <div className="relative flex-shrink-0">
              <button
                onClick={() => setShowFlashcardPicker((v) => !v)}
                title="Share a flashcard"
                className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 text-slate-500 hover:text-slate-300 transition-colors"
              >
                <Paperclip size={16} />
              </button>
              {showFlashcardPicker && (
                <FlashcardPicker
                  onSelect={handleFlashcardShare}
                  onClose={() => setShowFlashcardPicker(false)}
                />
              )}
            </div>

            {/* Note toggle */}
            <button
              onClick={() => setMessageType((t) => (t === "note" ? "text" : "note"))}
              title="Mark as note"
              className={cn(
                "w-9 h-9 flex-shrink-0 flex items-center justify-center rounded-xl transition-colors text-sm",
                messageType === "note"
                  ? "bg-amber-500/20 text-amber-400 border border-amber-500/20"
                  : "bg-white/5 hover:bg-white/10 text-slate-500 hover:text-slate-300"
              )}
            >
              📌
            </button>

            {/* Text input */}
            <textarea
              ref={inputRef}
              value={inputText}
              onChange={(e) => {
                setInputText(e.target.value);
                emitTyping();
              }}
              onKeyDown={handleKeyDown}
              placeholder={`Message #${activeRoomInfo.label.toLowerCase()}…`}
              rows={1}
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-slate-600 outline-none focus:border-violet-500/40 resize-none max-h-32 leading-relaxed"
              style={{ fieldSizing: "content" } as React.CSSProperties}
            />

            {/* Send */}
            <button
              onClick={handleSend}
              disabled={!inputText.trim() || sending}
              className="w-9 h-9 flex-shrink-0 flex items-center justify-center rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-40 disabled:cursor-not-allowed text-white transition-colors"
            >
              {sending ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Send size={16} />
              )}
            </button>
          </div>

          <p className="text-[10px] text-slate-700 mt-1.5 ml-1">
            Enter to send · Shift+Enter for new line · 📎 share flashcard · 📌 send as note
          </p>
        </div>
      </div>
    </div>
  );
}
