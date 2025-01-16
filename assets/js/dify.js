!function () {
    const configKey = "difyChatbotConfig";
    const bubbleButtonId = "dify-chatbot-bubble-button";
    const bubbleWindowId = "dify-chatbot-bubble-window";
    const config = window[configKey];

    const icons = {
        open: `
            <svg id="openIcon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M7.7586 2L16.2412 2C17.0462 1.99999 17.7105 1.99998 ..." fill="white"/>
            </svg>
        `,
        close: `
            <svg id="closeIcon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 18L6 6M6 18L18 6" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        `
    };

    async function initialize() {
        if (config && config.token) {
            const params = new URLSearchParams(await prepareParams());
            const baseUrl = config.baseUrl || `https://${config.isDev ? "dev." : ""}udify.app`;
            const iframeUrl = `${baseUrl}/chatbot/${config.token}?${params}`;

            setupBubbleButton(iframeUrl);
        } else {
            console.error(`${configKey} is empty or token is not provided`);
        }
    }

    async function prepareParams() {
        const inputs = config?.inputs || {};
        const encodedParams = {};

        await Promise.all(Object.entries(inputs).map(async ([key, value]) => {
            const encoded = await encodeValue(value);
            encodedParams[key] = encoded;
        }));

        return encodedParams;
    }

    async function encodeValue(value) {
        const encoder = new TextEncoder();
        const encoded = encoder.encode(value);
        const compressed = await compressData(encoded);
        return btoa(String.fromCharCode(...compressed));
    }

    async function compressData(data) {
        const stream = new Blob([data]).stream();
        const compressedStream = stream.pipeThrough(new CompressionStream("gzip"));
        const buffer = await new Response(compressedStream).arrayBuffer();
        return new Uint8Array(buffer);
    }

    function setupBubbleButton(iframeUrl) {
        const button = document.createElement("div");
        applyButtonStyles(button);
        appendBubbleButtonContent(button);

        document.body.appendChild(button);

        button.addEventListener("click", function () {
            toggleBubbleWindow(iframeUrl, button);
        });

        if (config.draggable) {
            makeDraggable(button);
        }
    }

    function applyButtonStyles(button) {
        button.id = bubbleButtonId;
        button.style.cssText = `
            position: fixed; bottom: 1rem; right: 1rem; width: 50px; height: 50px;
            border-radius: 25px; background-color: #155EEF; cursor: pointer; z-index: 2147483647;
        `;
    }

    function appendBubbleButtonContent(button) {
        const content = document.createElement("div");
        content.style.cssText = "display: flex; align-items: center; justify-content: center; width: 100%; height: 100%;";
        content.innerHTML = icons.open;
        button.appendChild(content);
    }

    function toggleBubbleWindow(iframeUrl, button) {
        const bubbleWindow = document.getElementById(bubbleWindowId);

        if (bubbleWindow) {
            const isHidden = bubbleWindow.style.display === "none";
            bubbleWindow.style.display = isHidden ? "block" : "none";
            button.querySelector("div").innerHTML = isHidden ? icons.close : icons.open;
        } else {
            createBubbleWindow(iframeUrl, button);
        }
    }

    function createBubbleWindow(iframeUrl, button) {
        const iframe = document.createElement("iframe");
        iframe.id = bubbleWindowId;
        iframe.src = iframeUrl;
        iframe.allow = "fullscreen; microphone";
        iframe.style.cssText = `
            border: none; position: absolute; bottom: 55px; right: 0; width: 24rem; height: 40rem;
            border-radius: 0.75rem; background-color: #F3F4F6; z-index: 2147483647;
        `;
        button.appendChild(iframe);
    }

    function makeDraggable(element) {
        let isDragging = false;
        let offsetX, offsetY;

        element.addEventListener("mousedown", (event) => {
            isDragging = true;
            offsetX = event.clientX - element.offsetLeft;
            offsetY = event.clientY - element.offsetTop;
        });

        document.addEventListener("mousemove", (event) => {
            if (isDragging) {
                const left = event.clientX - offsetX;
                const top = event.clientY - offsetY;
                element.style.left = `${Math.max(0, left)}px`;
                element.style.top = `${Math.max(0, top)}px`;
            }
        });

        document.addEventListener("mouseup", () => {
            isDragging = false;
        });
    }

    document.body.onload = initialize;
}();