import { useContext } from "react";
import { PlaygroundContext } from "@/context/PlaygroundContext";

export const usePlaygroundContext = () => {
    const context = useContext(PlaygroundContext);
    if (!context) {
        throw new Error("usePlaygroundContext must be used within a PlaygroundProvider");
    }
    return context;
};