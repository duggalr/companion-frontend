import { useContext } from "react";
import { SubmissionContext } from "@/context/SubmissionContext";

export const useSubmissionContext = () => {
    const context = useContext(SubmissionContext);
    if (!context) {
        throw new Error("useSubmissionContext must be used within a SubmissionProvider");
    }
    return context;
};