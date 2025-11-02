import React, { FC, useState, useRef, useEffect } from 'react';
import { GoogleGenAI, Part, Content } from '@google/genai';
import type { ChatMessage } from '../types';
import PaperAirplaneIcon from './icons/PaperAirplaneIcon';
import SpinnerIcon from './icons/SpinnerIcon';
import { useToast } from '../hooks/useToast';
import AcademicCapIcon from './icons/AcademicCapIcon';
import PaperclipIcon from './icons/PaperclipIcon';
import XMarkIcon from './icons/XMarkIcon';
import useLocalStorageState from '../hooks/useLocalStorageState';
import TrashIcon from './icons/TrashIcon';


let ai: GoogleGenAI | null = null;
try {
  if (import.meta.env.VITE_API_KEY) {
    ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_API_KEY });
  } else {
    console.error("VITE_API_KEY environment variable not set.");
  }
} catch(e) {
  console.error("Error initializing GoogleGenAI:", e);
}

// Helper function to convert a File object to a GoogleGenerativeAI.Part object.
async function fileToGenerativePart(file: File): Promise<Part> {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
    reader.readAsDataURL(file);
  });
  return {
    inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
  };
}

const initialMessages: ChatMessage[] = [
    { role: 'model', parts: [{ text: "Hello! I'm your AI Study Assistant. You can ask me to explain concepts, or upload a document and ask questions about it." }] }
];

const AIAssistantSection: FC = () => {
  const [messages, setMessages] = useLocalStorageState<ChatMessage[]>('chatHistory', initialMessages);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const { addToast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  
  useEffect(() => {
    if (!ai) {
        addToast("AI client could not be initialized. Make sure your API key is configured.", 'error');
    }
  }, [addToast]);
  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const selectedFile = event.target.files[0];
       // Limit file size to ~2MB for this demo
      if (selectedFile.size > 2 * 1024 * 1024) {
        addToast("File size should not exceed 2MB.", 'error');
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleSend = async () => {
    if ((!input.trim() && !file) || isLoading || !ai) return;

    const userMessageParts: Part[] = [];
    
    // Add file part if it exists
    if (file) {
      try {
        const filePart = await fileToGenerativePart(file);
        userMessageParts.push(filePart);
      } catch (error) {
        console.error("Error processing file:", error);
        addToast("Could not process the file. Please try another.", "error");
        return;
      }
    }
    
    // Add text part if it exists
    if (input.trim()) {
      userMessageParts.push({ text: input });
    }

    const userMessage: ChatMessage = { 
        role: 'user', 
        parts: userMessageParts,
        ...(file && { file: { name: file.name, type: file.type } })
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setFile(null);
    if(fileInputRef.current) fileInputRef.current.value = '';

    setIsLoading(true);

    try {
      const history: Content[] = messages.map(msg => ({ role: msg.role, parts: msg.parts }));
      const model = ai.models;
      const responseStream = await model.generateContentStream({
        model: 'gemini-2.5-flash',
        contents: [...history, { role: 'user', parts: userMessageParts }],
        config: {
          systemInstruction: 'You are a friendly and helpful study assistant for university students. Your goal is to explain complex topics simply, provide study guidance, and help students learn effectively. If a file is provided, prioritize answering based on the file content. Your responses should be encouraging and formatted clearly using markdown (e.g., use ** for bold, lists with *, and ` for code).',
        }
      });
      
      let modelResponse = '';
      setMessages(prev => [...prev, { role: 'model', parts: [{ text: '' }] }]);

      for await (const chunk of responseStream) {
        modelResponse += chunk.text;
        setMessages(prev => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1] = { role: 'model', parts: [{ text: modelResponse }] };
          return newMessages;
        });
      }

    } catch (error) {
      console.error("Error sending message to AI:", error);
      addToast('Sorry, something went wrong. The AI may be unavailable.', 'error');
      setMessages(prev => prev.slice(0, -1)); // Remove the empty model message
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages(initialMessages);
    addToast("Chat history has been cleared.", 'info');
  };
  
  const renderContent = (parts: Part[]) => {
    const textPart = parts.find(p => 'text' in p);
    let content = textPart && 'text' in textPart ? textPart.text : '';

    // Sanitize to prevent XSS
    content = content
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");

    // Markdown processing
    content = content
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/`([^`]+)`/g, '<code class="bg-slate-200 text-red-600 px-1 py-0.5 rounded font-mono text-sm">$1</code>');
    
    // Process lists and newlines
    const lines = content.split('\n');
    let html = '';
    let inList = false;
    for (const line of lines) {
        if (line.match(/^\s*\*\s/)) {
            if (!inList) {
                html += '<ul class="list-disc list-inside my-2">';
                inList = true;
            }
            html += `<li>${line.replace(/^\s*\*\s/, '')}</li>`;
        } else {
            if (inList) {
                html += '</ul>';
                inList = false;
            }
            html += line ? `<p class="my-1">${line}</p>` : '<br />';
        }
    }
    if (inList) {
        html += '</ul>';
    }

    return <div className="prose prose-sm max-w-none prose-slate" dangerouslySetInnerHTML={{ __html: html.replace(/<br \/>/g, "") }} />;
  };


  return (
    <div className="h-full flex flex-col max-h-[calc(100vh-4rem)]">
      <div className="flex flex-col md:flex-row justify-between items-start mb-6">
        <div>
            <h2 className="text-3xl font-extrabold text-slate-800">AI Study Assistant</h2>
            <p className="text-slate-500 mt-1">Your personal AI-powered tutor. Upload a file to ask questions about it.</p>
        </div>
        <button
          onClick={handleClearChat}
          className="mt-4 md:mt-0 flex items-center text-sm bg-slate-200 text-slate-700 font-semibold py-2 px-4 rounded-lg hover:bg-slate-300 transition-colors"
          aria-label="Clear chat history"
        >
          <TrashIcon className="w-4 h-4 mr-2" />
          Clear Chat
        </button>
      </div>

        <div className="flex-1 bg-white rounded-xl shadow-lg flex flex-col overflow-hidden">
            <div className="flex-1 p-6 space-y-4 overflow-y-auto" style={{ scrollbarWidth: 'thin' }}>
                {messages.map((msg, index) => (
                    <div key={index} className={`flex items-end gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                        {msg.role === 'model' && (
                            <div className="w-10 h-10 bg-red-500 rounded-full flex-shrink-0 flex items-center justify-center shadow-md self-start">
                                <AcademicCapIcon className="w-6 h-6 text-white" />
                            </div>
                        )}
                        <div className={`max-w-xl p-4 rounded-xl shadow-sm ${msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-800'}`}>
                           {msg.file && (
                                <div className="mb-2 p-2 bg-blue-500 rounded-lg text-sm">
                                    Attached: <span className="font-bold">{msg.file.name}</span>
                                </div>
                            )}
                           {renderContent(msg.parts)}
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200">
                {file && (
                    <div className="mb-2 flex items-center justify-between bg-blue-100 text-blue-800 p-2 rounded-lg text-sm">
                        <span className="font-semibold truncate pr-2">{file.name}</span>
                        <button 
                          onClick={() => {
                            setFile(null);
                            if(fileInputRef.current) fileInputRef.current.value = '';
                          }}
                          className="p-1 rounded-full hover:bg-blue-200"
                          aria-label="Remove file"
                        >
                          <XMarkIcon className="w-5 h-5"/>
                        </button>
                    </div>
                )}
                <div className="relative flex items-center">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        placeholder={file ? "Ask a question about the file..." : "Ask me anything..."}
                        className="w-full p-4 pl-14 pr-20 text-md border-2 border-slate-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-slate-100"
                        disabled={isLoading || !ai}
                        aria-label="Chat input"
                    />
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isLoading || !ai}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-blue-600 p-2 rounded-full transition-colors disabled:text-slate-300"
                        aria-label="Attach file"
                    >
                      <PaperclipIcon className="w-6 h-6" />
                    </button>
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept=".txt,.pdf,.md,.html,.css,.js,.ts" />
                    <button
                        onClick={handleSend}
                        disabled={isLoading || (!input.trim() && !file) || !ai}
                        className="absolute right-3 top-1/2 -translate-y-1/2 bg-blue-600 text-white p-2.5 rounded-lg shadow-md hover:bg-blue-700 transition-colors disabled:bg-slate-400 disabled:cursor-not-allowed"
                        aria-label="Send message"
                    >
                        {isLoading ? <SpinnerIcon className="w-6 h-6 animate-spin" /> : <PaperAirplaneIcon className="w-6 h-6" />}
                    </button>
                </div>
            </div>
        </div>
    </div>
  );
};

export default AIAssistantSection;
