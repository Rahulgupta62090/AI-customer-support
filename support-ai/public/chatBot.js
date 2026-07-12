(function() {
    const scriptTag = document.currentScript;
    const ownerId = scriptTag.getAttribute("data-owner-id");
    const api_url = scriptTag.src.replace(/\/chatBot\.js$/, "/api/chat");

    if (!ownerId) {
        console.log("ownerId is not found");
        return;
    }

    // 1. Create Floating Chat Button
    const button = document.createElement("div");
    button.innerHTML = "💬";

    Object.assign(button.style, {
        position: "fixed",
        bottom: "24px",
        right: "24px",
        width: "56px",
        height: "56px",
        borderRadius: "50%",
        background: "#000",
        color: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        fontSize: "22px",
        boxShadow: "0 15px 40px rgba(0,0,0,0.35)",
        zIndex: "999999",
    });

    document.body.appendChild(button);

    // 2. Create Chat Box Container
    const box = document.createElement("div");
    Object.assign(box.style, {
        position: "fixed",
        bottom: "90px",
        right: "24px",
        width: "320px",
        height: "420px",
        background: "#fff",
        borderRadius: "14px",
        boxShadow: "0 25px 60px rgba(0,0,0,0.25)",
        display: "none",
        flexDirection: "column",
        overflow: "hidden",
        zIndex: "999999",
        fontFamily: "Inter, system-ui, sans-serif",
    });

    box.innerHTML = `
        <div style="background:#000; color:#fff; padding:12px 14px; font-size:14px; display:flex; justify-content:space-between; align-items:center;">
            <span>Customer Support</span>
            <span id="chat-close" style="cursor:pointer;font-size:16px">❌</span>
        </div>

        <div id="chat-messages" style="flex:1; padding:12px; overflow-y:auto; background:#f9fafb; display:flex; flex-direction:column;"></div>

        <div style="display:flex; border-top:1px solid #e5e7eb; padding:8px; gap:6px;">
            <input id="chat-input" type="text" style="flex:1; padding:8px 10px; border:1px solid #d1d5db; border-radius:8px; font-size:13px; outline:none;" placeholder="Type a message"/>
            <button id="chat-send" style="padding:8px 12px; border:none; background:#000; color:#fff; border-radius:8px; font-size:13px; cursor:pointer;">Send</button>
        </div>
    `;

    document.body.appendChild(box);

    // 3. UI Toggle Actions
    button.onclick = () => {
        box.style.display = box.style.display === "none" ? "flex" : "none";
    };

    document.querySelector("#chat-close").onclick = () => {
        box.style.display = "none";
    };

    const input = document.querySelector("#chat-input");
    const sendBtn = document.querySelector("#chat-send");
    const messageArea = document.querySelector("#chat-messages");

    // 4. Helper function to append message bubbles
    function addMessage(text, from) {
        const bubble = document.createElement("div");
        bubble.innerHTML = text;
        Object.assign(bubble.style, {
            maxWidth: "78%",
            padding: "8px 12px",
            borderRadius: "14px",
            fontSize: "13px",
            lineHeight: "1.4",
            marginBottom: "8px",
            alignSelf: from === "user" ? "flex-end" : "flex-start",
            background: from === "user" ? "#000" : "#e5e7eb",
            color: from === "user" ? "#fff" : "#111",
            borderTopRightRadius: from === "user" ? "4px" : "14px",
            borderTopLeftRadius: from === "user" ? "14px" : "4px",
        });
        messageArea.appendChild(bubble);
        messageArea.scrollTop = messageArea.scrollHeight;
    }

    // 5. Send Message Handler
    sendBtn.onclick = async () => {
        const text = input.value?.trim();
        if (!text) {
            return;
        }
        
        addMessage(text, "user");
        input.value = "";

        // Add typing indicator
        const typing = document.createElement("div");
        typing.innerHTML = "Typing...";
        Object.assign(typing.style, {
            fontSize: "12px",
            color: "#6b7280",
            marginBottom: "8px",
            alignSelf: "flex-start",
        });
        messageArea.appendChild(typing);
        messageArea.scrollTop = messageArea.scrollHeight;

        try {
            const response = await fetch(api_url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ownerId,
                    message: text,
                }),
            });

            const result = await response.json();
            
            // Ensuring we check 'result' safely to prevent "data is not defined" errors
            const message = typeof result === "object" && result !== null && "message" in result
                ? String(result.message)
                : "Something went wrong.";

            messageArea.removeChild(typing);
            addMessage(message, "ai");
        } catch (error) {
            console.error(error);
            if (messageArea.contains(typing)) {
                messageArea.removeChild(typing);
            }
            addMessage("Something went wrong.", "ai");
        }
    };
})();