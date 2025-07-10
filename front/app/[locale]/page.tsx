"use client";

import {useState} from "react";
import {useTranslations} from 'next-intl';
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {Button, Container, LanguageSwitch, PromptBox, ScrollArea} from "@/shared/components";
import {useChatHistory} from "@/shared/hooks/use-chat-history";
import {ChatMessage} from "@/shared/types";
import {Copy, RefreshCcw} from "lucide-react";
import {toast} from "sonner";

export default function Home() {
    const t = useTranslations('chat');
    const tWelcome = useTranslations('welcome');

    const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [streamingResponse, setStreamingResponse] = useState<string>("");

    const {messages, isLoaded, addMessage, clearHistory} = useChatHistory();

    const handleMessageSubmit = (message: string) => {
        addMessage(message, "user");
        setChatHistory(prev => [...prev, {
            id: Date.now().toString(),
            role: "user",
            content: message,
            timestamp: new Date()
        }]);
    };
    const handleResponseStart = (partialResponse: string) => {
        setStreamingResponse(partialResponse);
    };

    const handleResponseComplete = (response: string) => {
        addMessage(response, "assistant");
        setStreamingResponse("");
        setChatHistory(prev => [...prev, {
            id: Date.now().toString() + "_assistant",
            role: "assistant",
            content: response,
            timestamp: new Date()
        }]);
    };

    const handleCopyMessage = (content: string) => {
        navigator.clipboard.writeText(content).then(() => {
            console.log('Сообщение скопировано в буфер обмена');
        }).catch(err => {
            console.error('Ошибка при копировании:', err);
        });
    };

    const handleClearChat = () => {
        if (confirm(t('clearConfirmation'))) {
            clearHistory();
            setError(null);
        }
    };

    const formatTime = (date: Date): string =>
        date.toLocaleTimeString([], {hour: "2-digit", minute: "2-digit"});

    const renderWelcomeScreen = () => (
        <div className="chat__welcome">
            <Container className="chat__welcome__content">
                <h2>{tWelcome('title')}</h2>
                <p>{tWelcome('description')}</p>
            </Container>
        </div>
    );

    if (!isLoaded) {
        return (
            <div className="chat">
                <div className="chat__loading">{t('loading')}</div>
            </div>
        );
    }

    return (
        <>
            <div className="chat">
                <Container>
                    <div className="chat__header">
                        <h1 className="chat__title">Bot4You</h1>
                        <LanguageSwitch />
                        {messages.length > 0 && (
                            <Button
                                onClick={handleClearChat}
                                variant="outline"
                            >
                                {t('clearChat')}
                            </Button>
                        )}
                    </div>

                    {error && (
                        <div className="chat__error">
                            {error}
                        </div>
                    )}
                </Container>

                {messages.length === 0 ? (
                    renderWelcomeScreen()
                ) : (
                    <ScrollArea className="chat__history__wrapper">
                        <Container>
                            <div className="chat__history">
                                {messages.map((message) => (
                                    <div
                                        key={message.id}
                                        className={`chat__message chat__message--${message.role}`}
                                    >
                                        <div className="chat__message__info">
                                            {message.role === 'user' ? `👤 ${t('you')}` : '🤖 Bot4You'}
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
                                        <div className="chat__message__menu">
                                            <Button
                                                className="chat__message__menu__button"
                                                variant="ghost"
                                                onClick={() => {
                                                    handleCopyMessage(message.content)
                                                    toast(t('copySuccess'), {
                                                        duration: 3000,
                                                    })
                                                }}
                                            >
                                                <Copy/>
                                            </Button>
                                            {message.role === 'assistant' && (
                                                <Button
                                                    className="chat__message__menu__button"
                                                    variant="ghost"
                                                    onClick={() => toast(t('inDev'), {
                                                        duration: 3000,
                                                    })}
                                                    disabled={isLoading}
                                                >
                                                    <RefreshCcw/>
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                ))}

                                {isLoading && !streamingResponse && (
                                    <div className="chat__message chat__message--assistant">
                                        <div className="chat__message__info">
                                            🤖 Bot4You <span className="chat__typing">{t('typing')}</span>
                                        </div>
                                        <div className="chat__message-content">
                                            🤔<span className="chat__thinking">{t('thinking')}</span>
                                        </div>
                                    </div>
                                )}

                                {streamingResponse && (
                                    <div className="chat__message chat__message--assistant">
                                        <div className="chat__message__info">
                                            🤖 Bot4You <span className="chat__typing">{t('typing')}</span>
                                        </div>
                                        <div className="chat__message-content">
                                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                                {streamingResponse}
                                            </ReactMarkdown>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </Container>
                    </ScrollArea>
                )}

                <div className="chat__form-container">
                    <Container>
                        <PromptBox
                            setIsLoading={setIsLoading}
                            setError={setError}
                            isLoading={isLoading}
                            onMessageSubmit={handleMessageSubmit}
                            onResponseStart={handleResponseStart}
                            onResponseComplete={handleResponseComplete}
                            chatHistory={chatHistory}
                        />
                    </Container>
                </div>
            </div>
        </>
    );
}