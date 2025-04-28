import { useCallback } from "preact/hooks";

const fabStyle: preact.JSX.CSSProperties = {
    position: "fixed",
    bottom: "2rem",
    right: "2rem",
    width: "64px",
    height: "64px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
    fontSize: "2rem",
    cursor: "pointer",
    zIndex: 1000,
    animation: "attention 1.2s infinite alternate",
    border: "none",
    outline: "none",
};

const attentionKeyframes = `
@keyframes attention {
    0% { transform: scale(1) rotate(0deg); box-shadow: 0 4px 16px rgba(0,0,0,0.2);}
    60% { transform: scale(1.1) rotate(-8deg); box-shadow: 0 8px 24px rgba(106,17,203,0.3);}
    100% { transform: scale(1) rotate(0deg); box-shadow: 0 4px 16px rgba(0,0,0,0.2);}
}
`;

const ChatFAB = () => {
    const handleClick = useCallback(() => {
        // Replace with your navigation logic
        window.location.href = "/blog/chat";
    }, []);

    return (
        <>
            <style>{attentionKeyframes}</style>
            <button style={fabStyle} aria-label="Chat with rAvI" onClick={handleClick}>
                <span role="img" aria-label="chat">💬</span>
            </button>
        </>
    );
};

export default ChatFAB;