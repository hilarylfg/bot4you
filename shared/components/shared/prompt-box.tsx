"use client";

import {Dispatch, FormEvent, SetStateAction, useState} from "react";

interface Props {
    setIsLoading: Dispatch<SetStateAction<boolean>>;
    setError: Dispatch<SetStateAction<string | null>>;
    setResponse: Dispatch<SetStateAction<string>>;
    isLoading: boolean;
}

export function PromptBox({setIsLoading, setError, setResponse, isLoading}: Props) {
    const [message, setMessage] = useState<string>("");

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!message.trim()) return;

        setIsLoading(true);
        setError(null);
        setResponse("");

        try {
            const result = await fetch("https://openrouter.ai/api/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${process.env.NEXT_PUBLIC_OPENROUTER_API_KEY}`,
                    "Content-Type": "application/json",
                    "HTTP-Referer": window.location.origin,
                },
                body: JSON.stringify({
                    "model": "qwen/qwen3-30b-a3b:free",
                    "messages": [
                        {
                            "role": "user",
                            "content": message
                        }
                    ],
                    "stream": true
                })
            });

            if (!result.ok) {
                throw new Error(`HTTP error! Status: ${result.status}`);
            }

            const reader = result.body?.getReader();
            const decoder = new TextDecoder();

            if (!reader) {
                throw new Error("Не удалось получить reader для потока");
            }

            while (true) {
                const {done, value} = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value);
                const lines = chunk
                    .split('\n')
                    .filter(line => line.trim() !== '' && line.startsWith('data: '));

                for (const line of lines) {
                    const jsonStr = line.replace('data: ', '');
                    if (jsonStr === '[DONE]') continue;

                    try {
                        const json = JSON.parse(jsonStr);
                        const content = json.choices[0]?.delta?.content || '';
                        if (content) {
                            setResponse(prev => prev + content);
                        }
                    } catch (e) {
                        console.error('Failed to parse JSON', e);
                    }
                }
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "Произошла ошибка");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="prompt-box__form">
            <textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="prompt-box__textarea"
                rows={4}
                disabled={isLoading}
                placeholder="Введите ваш вопрос здесь..."
            />

            <hr className="prompt-box__hr"/>

            <div className="prompt-box__buttons">
                <button
                    type="submit"
                    disabled={isLoading || !message.trim()}
                    className="prompt-box__button"
                >
                    {isLoading ? "Обрабатываем..." : "Отправить"}
                </button>
            </div>
        </form>
    )
}