"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {Button, PromptBox} from "@/shared/components";
import { useChatHistory } from "@/shared/hooks/use-chat-history";

export default function Home() {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [streamingResponse, setStreamingResponse] = useState<string>("");

    const { messages, isLoaded, addMessage, clearHistory } = useChatHistory();

    const handleMessageSubmit = (message: string) => {
        addMessage(message, "user");
    };

    const handleResponseStart = (partialResponse: string) => {
        setStreamingResponse(partialResponse);
    };

    const handleResponseComplete = (response: string) => {
        addMessage(response, "assistant");
        setStreamingResponse("");
    };

    const handleClearChat = () => {
        if (confirm("Очистить всю историю чата?")) {
            clearHistory();
            setError(null);
        }
    };

    const formatTime = (date: Date): string =>
        date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    const renderWelcomeScreen = () => (
        <div className="chat__welcome">
            <h2>Добро пожаловать в Bot4You!</h2>
            <p>Задайте вопрос, и я с радостью помогу вам!</p>
        </div>
    );

    if (!isLoaded) {
        return (
            <div className="chat">
                <div className="chat__loading">Загрузка...</div>
            </div>
        );
    }

    return (
        <div className="chat">
            <div className="chat__header">
                <h1 className="chat__title">Bot4You</h1>
                {messages.length > 0 && (
                    <Button
                        onClick={handleClearChat}
                        variant="outline"
                    >
                        Очистить чат
                    </Button>
                )}
            </div>

            {error && (
                <div className="chat__error">
                    {error}
                </div>
            )}

            {messages.length === 0 ? (
                renderWelcomeScreen()
            ) : (<div className="chat__history">
                {messages.map((message) => (
                    <div
                        key={message.id}
                        className={`chat__message chat__message--${message.role}`}
                    >
                        <div className="chat__message__info">
                            {message.role === 'user' ? '👤 Вы' : '🤖 Bot4You'}
                            <i className="chat__message__info__vr"/>
                            <span className="chat__message-time">
                                {formatTime(message.timestamp)}
                            </span>
                        </div>
                        <div className="chat__message-content">
                            {message.role === 'assistant' ? (
                                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                    {message.content}
                                </ReactMarkdown>
                            ) : (
                                message.content
                            )}
                        </div>
                    </div>
                ))}

                {isLoading && !streamingResponse && (
                    <div className="chat__message chat__message--assistant">
                        <div className="chat__message__info">
                            🤖 Bot4You <span className="chat__typing">печатает...</span>
                        </div>
                        <div className="chat__message-content">
                            🤔<span className="chat__thinking"> Думаю...</span>
                        </div>
                    </div>
                )}

                {streamingResponse && (
                    <div className="chat__message chat__message--assistant">
                        <div className="chat__message__info">
                            🤖 Bot4You <span className="chat__typing">печатает...</span>
                        </div>
                        <div className="chat__message-content">
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                {streamingResponse}
                            </ReactMarkdown>
                        </div>
                    </div>
                )}
            </div>)}

            <div className="chat__form-container">
                <PromptBox
                    setIsLoading={setIsLoading}
                    setError={setError}
                    isLoading={isLoading}
                    onMessageSubmit={handleMessageSubmit}
                    onResponseStart={handleResponseStart}
                    onResponseComplete={handleResponseComplete}
                />
            </div>
        </div>
    );
}