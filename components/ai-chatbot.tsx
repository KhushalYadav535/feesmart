"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { MessageSquare, Send, X, Bot, User } from "lucide-react"
import { processChatQuery } from "@/lib/ai-services"
import { useAuth } from "@/components/auth-provider"
import { ScrollArea } from "@/components/ui/scroll-area"

export function AIChatbot() {
  const { user } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<{ role: "bot" | "user"; text: string }[]>([
    { role: "bot", text: "Hi! How can I help you today?" },
  ])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)

  if (!user) return null

  const handleSend = async (text?: string) => {
    const messageToSend = text || input
    if (!messageToSend.trim()) return

    setInput("")
    setMessages((prev) => [...prev, { role: "user", text: messageToSend }])
    setIsTyping(true)

    const response = await processChatQuery(messageToSend, { role: user.role, name: user.name })
    setMessages((prev) => [...prev, { role: "bot", text: response }])
    setIsTyping(false)
  }

  const suggestions =
    user.role === "student"
      ? ["Check my fees", "Download receipt", "Request extension"]
      : ["Revenue report", "Show defaulters", "Schedule reminders"]

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen ? (
        <Card className="w-[380px] shadow-2xl border-none bg-card overflow-hidden animate-in slide-in-from-bottom-4 zoom-in-95 duration-300 rounded-[2rem]">
          <CardHeader className="bg-primary text-primary-foreground p-6 pb-4 flex flex-row items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center">
                <Bot className="h-6 w-6 text-accent" />
              </div>
              <div>
                <CardTitle className="text-base font-bold">FeeSmart AI</CardTitle>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[10px] text-primary-foreground/60 uppercase font-bold tracking-wider">
                    Online
                  </span>
                </div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-primary-foreground hover:bg-white/10 rounded-full"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </CardHeader>
          <CardContent className="p-0 bg-muted/30">
            <ScrollArea className="h-[380px] p-6">
              <div className="space-y-6">
                {messages.map((m, i) => (
                  <div key={i} className={`flex gap-3 ${m.role === "user" ? "flex-row-reverse" : ""}`}>
                    <div
                      className={`h-8 w-8 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${
                        m.role === "bot" ? "bg-white text-primary" : "bg-primary text-primary-foreground"
                      }`}
                    >
                      {m.role === "bot" ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
                    </div>
                    <div
                      className={`p-4 rounded-[1.25rem] text-sm leading-relaxed max-w-[85%] shadow-sm ${
                        m.role === "bot"
                          ? "bg-white text-foreground rounded-tl-none"
                          : "bg-primary text-primary-foreground rounded-tr-none"
                      }`}
                    >
                      {m.text}
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex gap-3">
                    <div className="h-8 w-8 rounded-xl bg-white text-primary flex items-center justify-center shrink-0 shadow-sm">
                      <Bot className="h-4 w-4" />
                    </div>
                    <div className="bg-white p-4 rounded-[1.25rem] rounded-tl-none shadow-sm flex gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/30 animate-bounce" />
                      <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/30 animate-bounce [animation-delay:0.2s]" />
                      <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/30 animate-bounce [animation-delay:0.4s]" />
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
            <div className="px-6 py-2 flex flex-wrap gap-2">
              {suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => handleSend(s)}
                  className="text-[10px] font-bold bg-white hover:bg-accent hover:text-white transition-colors border border-border/50 px-3 py-1.5 rounded-full shadow-sm text-muted-foreground"
                >
                  {s}
                </button>
              ))}
            </div>
          </CardContent>
          <CardFooter className="p-6 pt-2 bg-muted/30">
            <div className="flex w-full gap-2 bg-white rounded-2xl p-1.5 shadow-sm border border-border/50">
              <Input
                placeholder="Type your message..."
                className="border-none focus-visible:ring-0 h-10 text-sm shadow-none"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
              />
              <Button
                size="icon"
                className="h-10 w-10 shrink-0 rounded-xl bg-accent hover:bg-accent/90 shadow-lg shadow-accent/20"
                onClick={() => handleSend()}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </CardFooter>
        </Card>
      ) : (
        <Button
          size="icon"
          className="h-16 w-16 rounded-[2rem] shadow-2xl bg-accent hover:bg-accent/90 text-white transition-transform hover:scale-105 active:scale-95 group"
          onClick={() => setIsOpen(true)}
        >
          <MessageSquare className="h-7 w-7 group-hover:rotate-12 transition-transform" />
        </Button>
      )}
    </div>
  )
}
