import { useEffect, useRef, useState, useCallback } from "react";


export const useWebSocket = (url: string) => {

    const wsRef = useRef<WebSocket | null>(null);
    const accumulatedMessageRef = useRef<string>("");

    const [messages, setMessages] = useState<{ text: string; sender: string }[]>([]);
    const [generatedMessage, setGeneratedMessage] = useState("");
    const [isGeneratingMessage, setIsGeneratingMessage] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const sendMessage = useCallback((message: string) => {
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
            wsRef.current.send(message);
        }
    }, []);

    useEffect(() => {

        const socket = new WebSocket(url);

        socket.onopen = () => {
            console.log("WebSocket connection established");
        };

        socket.onmessage = (event) => {
            const message = event.data;
            if (message === "MODEL_GEN_COMPLETE") {
                setMessages((prevMessages) => [
                    ...prevMessages,
                    { text: accumulatedMessageRef.current, sender: "bot" },
                ]);

                setTimeout(() => {
                    setGeneratedMessage("");
                    setIsGeneratingMessage(false);
                    setIsLoading(false);
                }, 50);
            } else {
                accumulatedMessageRef.current += message;
                setGeneratedMessage((prev) => prev + message);
                setIsGeneratingMessage(true);
            }
        };

        socket.onclose = () => {
            console.log("WebSocket connection closed");
        };

        wsRef.current = socket;

        return () => {
            socket.close();
        };
    }, [url]);

    return {
        sendMessage,
        messages,
        generatedMessage,
        isGeneratingMessage,
        isLoading,
    };

}
