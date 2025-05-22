"use client";

import {useState} from "react";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {PromptBox} from "@/shared/components";

export default function Home() {
    const [response, setResponse] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    return (
        <div className="chat">
            <h1 className="chat__title">Bot4You</h1>

            {error && (
                <div className="chat__error">
                    {error}
                </div>
            )}

            {response && (
                <div className="chat__response">
                    <h2 className="chat__response-title">Ответ AI:</h2>
                    <div className="chat__response-text">
                        <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                        >
                            {response}
                        </ReactMarkdown>
                        {isLoading ? <span className="chat__cursor">|</span> : null}
                    </div>
                </div>
            )}

            <PromptBox
                setIsLoading={setIsLoading}
                setError={setError}
                setResponse={setResponse}
                isLoading={isLoading}
            />

        </div>
    );
}