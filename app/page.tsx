"use client";

import {useState} from "react";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {PromptBox} from "@/shared/components";

export default function Home() {
    const [response, setResponse] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [userMessage, setUserMessage] = useState<string>("");
    const [responseTime, setResponseTime] = useState<Date | null>(null);

    const handleMessageSubmit = (message: string) => {
        setUserMessage(message);
    };

    const handleResponseTimeSet = (time: Date) => {
        setResponseTime(time);
    };

    const formatTime = (date: Date): string => {
        return date.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});
    };

    return (
        <div className="chat">
            <h1 className="chat__title">Bot4You</h1>

            {error && (
                <div className="chat__error">
                    {error}
                </div>
            )}

            {userMessage && (
                <div className="chat__message chat__message--user">
                    <div className="chat__message-content">
                        {userMessage}
                    </div>
                </div>
            )}

            {response && (
                <div className="chat__message chat__message--assistant">
                    <div className="chat__message__info">
                        🤖 Bot4You  {!isLoading && responseTime && (
                        <>
                            <i className="chat__message__info__vr"/>
                            <span className="chat__message-time">
                    {formatTime(responseTime)}
                </span>
                        </>
                    )}
                    </div>
                    <div className="chat__message-content">
                        <div className={`chat__response-text ${isLoading ? 'chat__response-text--typing' : ''}`}>
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                {response}
                            </ReactMarkdown>
                        </div>
                    </div>
                </div>
            )}

            <div className="chat__form-container">
                <PromptBox
                    setIsLoading={setIsLoading}
                    setError={setError}
                    setResponse={setResponse}
                    isLoading={isLoading}
                    onMessageSubmit={handleMessageSubmit}
                    onResponseTimeSet={handleResponseTimeSet}
                />
            </div>
        </div>
    );
}