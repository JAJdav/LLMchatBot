// lucide.createIcons();

// const chatForm = document.getElementById('chatForm');
// const userInput = document.getElementById('userInput');
// const chatContainer = document.getElementById('chatContainer');
// const heroSection = document.getElementById('heroSection');

// chatForm.addEventListener('submit', async function(e) {
//     e.preventDefault();
    
//     const message = userInput.value.trim();
//     if (!message) return;

//     // Hide hero section 
//     if (heroSection) {
//         heroSection.classList.add('hidden');
//         chatContainer.classList.remove('hidden');
//         chatContainer.classList.add('flex');
//     }

//     appendMessage(message, 'user');
//     userInput.value = '';
//     scrollToBottom();


//     const loadingId = appendMessage("Thinking...", 'bot');

//     try {
//         // 3. Send request to your FastAPI /chat endpoint
//         const response = await fetch('http://127.0.0.1:8000/chat', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify({ message: message })
//         });

//         const data = await response.json();

//         if (data.error) {
//             updateBotMessage(loadingId, `Error: ${data.error}`);
//         } else {
//             // 4. Extract 'response' key from OpenRouter output
//             updateBotMessage(loadingId, data.response);
//         }

//     } catch (error) {
//         console.error("Fetch error:", error);
//         updateBotMessage(loadingId, "Failed to connect to backend server.");
//     }

//     scrollToBottom();
// });

// function appendMessage(text, sender) {
//     const messageId = 'msg-' + Date.now();
//     const messageWrapper = document.createElement('div');
//     messageWrapper.className = `flex ${sender === 'user' ? 'justify-end' : 'justify-start'} w-full`;

//     const bubble = document.createElement('div');
//     bubble.id = messageId;
    
//     if (sender === 'user') {
//         bubble.className = 'max-w-[80%] bg-emerald-500 text-white rounded-2xl rounded-tr-xs px-4 py-3 shadow-sm text-sm sm:text-base font-medium';
//     } else {
//         bubble.className = 'max-w-[80%] bg-white border border-slate-200 text-slate-800 rounded-2xl rounded-tl-xs px-4 py-3 shadow-sm text-sm sm:text-base font-normal whitespace-pre-wrap';
//     }

//     bubble.textContent = text;
//     messageWrapper.appendChild(bubble);
//     chatContainer.appendChild(messageWrapper);
    
//     return messageId;
// }

// function updateBotMessage(elementId, newText) {
//     const bubble = document.getElementById(elementId);
//     if (bubble) {
//         bubble.textContent = newText;
//     }
// }

// function scrollToBottom() {
//     window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
// }


   lucide.createIcons();

        const currentCaseId = localStorage.getItem('selectedCaseId') || 'CASE-2026-08-0341';
        document.getElementById('activeCaseBadge').textContent = currentCaseId;

        const chatForm = document.getElementById('chatForm');
        const userInput = document.getElementById('userInput');
        const chatContainer = document.getElementById('chatContainer');
        const heroSection = document.getElementById('heroSection');

        chatForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const message = userInput.value.trim();
            if (!message) return;

            if (heroSection) {
                heroSection.classList.add('hidden');
                chatContainer.classList.remove('hidden');
                chatContainer.classList.add('flex');
            }

            appendMessage(message, 'user');
            userInput.value = '';
            scrollToBottom();

            const loadingId = appendMessage("Analyzing case data...", 'bot');

            try {
                const response = await fetch('http://127.0.0.1:8000/chat', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        message: message,
                        case_id: currentCaseId
                    })
                });

                const data = await response.json();
                updateBotMessage(loadingId, data.response || data.detail);

            } catch (error) {
                updateBotMessage(loadingId, "Connection error to FastAPI backend.");
            }

            scrollToBottom();
        });

        function appendMessage(text, sender) {
            const messageId = 'msg-' + Date.now();
            const messageWrapper = document.createElement('div');
            messageWrapper.className = `flex ${sender === 'user' ? 'justify-end' : 'justify-start'} w-full`;

            const bubble = document.createElement('div');
            bubble.id = messageId;
            
            if (sender === 'user') {
                bubble.className = 'max-w-[80%] bg-emerald-500 text-white rounded-2xl rounded-tr-xs px-4 py-3 shadow-sm text-sm sm:text-base font-medium';
                bubble.textContent = text;
            } else {
                bubble.className = 'max-w-[80%] bg-white border border-slate-200 text-slate-800 rounded-2xl rounded-tl-xs px-5 py-4 shadow-sm text-sm sm:text-base space-y-2';
                bubble.innerHTML = typeof marked !== 'undefined' ? marked.parse(text) : text;
            }

            messageWrapper.appendChild(bubble);
            chatContainer.appendChild(messageWrapper);
            return messageId;
        }

        function updateBotMessage(elementId, text) {
            const bubble = document.getElementById(elementId);
            if (bubble) {
                bubble.innerHTML = typeof marked !== 'undefined' ? marked.parse(text) : text;
            }
        }

        function scrollToBottom() {
            window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
        }