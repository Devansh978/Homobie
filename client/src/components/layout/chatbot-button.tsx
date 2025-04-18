import React, { useState } from "react";
import { MessageSquare, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

export function ChatbotButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'bot', content: string }[]>([
    { role: 'bot', content: 'Hello! How can I help you today with your financial needs?' },
  ]);
  const [inputValue, setInputValue] = useState('');

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    // Add user message
    setMessages([...messages, { role: 'user', content: inputValue }]);
    setInputValue('');

    // Simulate bot response
    setTimeout(() => {
      const botResponses = [
        "I can help you with loan applications. Would you like to know more about our home loans?",
        "Our SIP plans start from just ₹500 per month. Would you like to check our calculator?",
        "You can book a free consultation with our financial experts. Shall I help you schedule one?",
        "Our loan approval process is quick and transparent. You can track your application status in your dashboard.",
        "Feel free to ask any specific questions about our financial products!"
      ];
      
      const randomResponse = botResponses[Math.floor(Math.random() * botResponses.length)];
      setMessages(prev => [...prev, { role: 'bot', content: randomResponse }]);
    }, 1000);
  };

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={toggleChat}
          className="w-14 h-14 bg-[#FFB800] text-neutral-900 rounded-full shadow-lg flex items-center justify-center hover:bg-[#D99B00] transition-colors p-0"
          aria-label={isOpen ? "Close chat" : "Open chat"}
        >
          {isOpen ? <X className="text-xl" /> : <MessageSquare className="text-xl" />}
        </Button>
      </div>

      {isOpen && (
        <Card className="fixed bottom-24 right-6 z-50 w-80 md:w-96 shadow-xl">
          <CardHeader className="bg-primary text-white py-3 px-4">
            <CardTitle className="text-base font-medium flex items-center">
              <MessageSquare className="h-5 w-5 mr-2" />
              FinSecure Assistant
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 h-96 flex flex-col">
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${
                      message.role === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg px-4 py-2 ${
                        message.role === 'user'
                          ? 'bg-primary text-white'
                          : 'bg-neutral-100 text-neutral-800'
                      }`}
                    >
                      {message.content}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
            <form onSubmit={handleSendMessage} className="p-3 border-t border-neutral-200 flex gap-2">
              <Input
                value={inputValue}
                onChange={handleInputChange}
                placeholder="Type your message..."
                className="flex-1"
              />
              <Button type="submit" size="sm">
                Send
              </Button>
            </form>
          </CardContent>
        </Card>
      )}
    </>
  );
}
