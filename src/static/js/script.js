// Lógica para o personalizador de canudos

document.addEventListener("DOMContentLoaded", () => {
    // Elementos da UI
    const canudoImg = document.getElementById("canudo-img");
    const areaPersonalizacao = document.getElementById("area-personalizacao");

    // --- Elementos Interativos (Arrays) ---
    const elementosTexto = [
        document.getElementById("elemento-interativo-texto-1"),
        document.getElementById("elemento-interativo-texto-2"),
        document.getElementById("elemento-interativo-texto-3"),
    ];
    const textosPersonalizados = [
        document.getElementById("texto-personalizado-1"),
        document.getElementById("texto-personalizado-2"),
        document.getElementById("texto-personalizado-3"),
    ];
    const elementosLogo = [
        document.getElementById("elemento-interativo-logo-1"),
        document.getElementById("elemento-interativo-logo-2"),
    ];
    const logosPersonalizados = [
        document.getElementById("logo-personalizado-1"),
        document.getElementById("logo-personalizado-2"),
    ];

    // --- Controles (Arrays) ---
    const textoInputs = [
        document.getElementById("texto-input-1"),
        document.getElementById("texto-input-2"),
        document.getElementById("texto-input-3"),
    ];
    const logoUploads = [
        document.getElementById("logo-upload-1"),
        document.getElementById("logo-upload-2"),
    ];
    const fonteTextoSelects = [
        document.getElementById("fonte-texto-1"),
        document.getElementById("fonte-texto-2"),
        document.getElementById("fonte-texto-3"),
    ];
    const apagarTextoBtns = [
        document.getElementById("apagar-texto-btn-1"),
        document.getElementById("apagar-texto-btn-2"),
        document.getElementById("apagar-texto-btn-3"),
    ];
    const apagarLogoBtns = [
        document.getElementById("apagar-logo-btn-1"),
        document.getElementById("apagar-logo-btn-2"),
    ];
    const removerFundoBtns = [
        document.getElementById("remover-fundo-btn-1"),
        document.getElementById("remover-fundo-btn-2"),
    ];

    // --- Outros Controles ---
    const corCanudoSelect = document.getElementById("cor-canudo");
    const corGravacaoSelect = document.getElementById("cor-gravacao");
    const nomeClienteInput = document.getElementById("nome-cliente");
    const emailClienteInput = document.getElementById("email-cliente");
    const finalizarBtn = document.getElementById("finalizar-btn");
    const confirmacaoCheckbox = document.getElementById("confirmacao-checkbox");

    // --- Estado das Imagens (Arrays) ---
    let uploadedImageDataUrls = [null, null];
    let processedImageDataUrls = [null, null];

    // Mapeamento de nomes de cores de gravação para valores CSS
    const coresGravacaoMap = {
        Dourado: "gold",
        Prata: "silver",
        Roxo: "purple",
        "Rosa Pink": "deeppink",
        Preto: "black",
        Verde: "green",
        Azul: "blue",
    };
    let currentActiveElement = null; // Track the currently selected element

    // --- Event Listeners (Controles) ---

    // Cor do Canudo (Simulação)
    corCanudoSelect.addEventListener("change", (event) => {
        const index = event.target.selectedIndex;
        const hue = (index * 15) % 360;
        canudoImg.style.filter = `hue-rotate(${hue}deg)`;
    });
    corCanudoSelect.dispatchEvent(new Event("change"));

    // Cor da Gravação (Aplica a todos os textos)
    corGravacaoSelect.addEventListener("change", (event) => {
        const corNome = event.target.value;
        const corCss = coresGravacaoMap[corNome] || "black";
        textosPersonalizados.forEach(span => {
            if (span) span.style.color = corCss;
        });
    });
    corGravacaoSelect.dispatchEvent(new Event("change"));

    // --- Textos Personalizados (Loop) ---
    textoInputs.forEach((input, index) => {
        if (!input) return;
        const elemento = elementosTexto[index];
        const span = textosPersonalizados[index];
        const fonteSelect = fonteTextoSelects[index];
        const apagarBtn = apagarTextoBtns[index];

        // Input de Texto
        input.addEventListener("input", (event) => {
            const textValue = event.target.value;
            if (textValue) {
                span.textContent = textValue;
                elemento.style.display = "flex";
                // Reset position/size only if it wasn't displayed before
                if (elemento.style.display !== 'none' && !elemento.style.top) {
                    elemento.style.width = "auto";
                    elemento.style.height = "auto";
                    elemento.style.top = `${25 + index * 15}%`; // Stagger initial positions
                    elemento.style.left = "50%";
                    elemento.style.transform = "translate(-50%, -50%)";
                    span.style.fontSize = "1.5em";
                }
            } else {
                elemento.style.display = "none";
            }
        });

        // Seleção de Fonte
        if (fonteSelect) {
            fonteSelect.addEventListener("change", (event) => {
                span.style.fontFamily = event.target.value;
            });
            fonteSelect.dispatchEvent(new Event("change"));
        }

        // Botão Apagar Texto
        if (apagarBtn) {
            apagarBtn.addEventListener("click", () => {
                input.value = "";
                span.textContent = "";
                elemento.style.display = "none";
            });
        }
    });

    // --- Logos Personalizados (Loop) ---
    logoUploads.forEach((upload, index) => {
        if (!upload) return;
        const elemento = elementosLogo[index];
        const img = logosPersonalizados[index];
        const apagarBtn = apagarLogoBtns[index];
        const removerFundoBtn = removerFundoBtns[index];

        // Upload de Logo
        upload.addEventListener("change", (event) => {
            const file = event.target.files[0];
            if (file && (file.type === "image/jpeg" || file.type === "image/png")) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    uploadedImageDataUrls[index] = e.target.result;
                    processedImageDataUrls[index] = uploadedImageDataUrls[index];
                    img.src = processedImageDataUrls[index];
                    elemento.style.display = "flex";
                    if (removerFundoBtn) removerFundoBtn.style.display = "inline-block";
                    // Reset position/size
                    elemento.style.width = "100px";
                    elemento.style.height = "auto";
                    elemento.style.top = `${45 + index * 15}%`; // Stagger initial positions
                    elemento.style.left = "50%";
                    elemento.style.transform = "translate(-50%, -50%)";
                };
                reader.readAsDataURL(file);
            } else {
                if (file) alert("Por favor, selecione um arquivo JPG ou PNG.");
                upload.value = "";
                uploadedImageDataUrls[index] = null;
                processedImageDataUrls[index] = null;
                img.src = "";
                elemento.style.display = "none";
                if (removerFundoBtn) removerFundoBtn.style.display = "none";
            }
        });

        // Botão Apagar Logo
        if (apagarBtn) {
            apagarBtn.addEventListener("click", () => {
                upload.value = "";
                uploadedImageDataUrls[index] = null;
                processedImageDataUrls[index] = null;
                img.src = "";
                elemento.style.display = "none";
                if (removerFundoBtn) removerFundoBtn.style.display = "none";
            });
        }

        // Botão Remover Fundo (Comentado)
        /*
        if (removerFundoBtn) {
            removerFundoBtn.addEventListener("click", () => {
                if (!uploadedImageDataUrls[index]) return alert(`Nenhuma imagem carregada para o Logo ${index + 1}.`);
                fetch("/remove-bg", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ image_data: uploadedImageDataUrls[index] }),
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success && data.image_data_no_bg) {
                        processedImageDataUrls[index] = data.image_data_no_bg;
                        img.src = processedImageDataUrls[index];
                        alert(`Fundo do Logo ${index + 1} removido com sucesso!`);
                    } else {
                        alert(`Erro ao remover o fundo do Logo ${index + 1}: ` + (data.error || "Erro desconhecido"));
                    }
                })
                .catch(error => {
                    console.error(`Erro na requisição para remover fundo do Logo ${index + 1}:`, error);
                    alert(`Erro na comunicação com o servidor para remover o fundo do Logo ${index + 1}.`);
                });
            });
        }
        */
    });

    // --- Interatividade (Arrastar e Redimensionar) --- Refatorada
    function makeInteractive(element) {
        // ... (makeInteractive function remains exactly the same as before)
        let isDragging = false;
        let isResizing = false;
        let currentResizer = null;
        let startX, startY, initialLeft, initialTop, initialWidth, initialHeight;

        function getRelativeCoords(event) {
            const rect = areaPersonalizacao.getBoundingClientRect();
            const clientX = event.clientX || (event.touches && event.touches[0].clientX);
            const clientY = event.clientY || (event.touches && event.touches[0].clientY);
            return {
                x: clientX - rect.left,
                y: clientY - rect.top,
            };
        }

        element.addEventListener("mousedown", startDrag);
        element.addEventListener("touchstart", startDrag, { passive: false });

        function startDrag(e) {
            console.log("--- startDrag --- Element:", element.id);
            if (e.target.classList.contains("resizer")) return;

            // Deselect previous element if different
            if (currentActiveElement && currentActiveElement !== element) {
                currentActiveElement.classList.remove("active");
            }
            currentActiveElement = element; // Set current element as active

            isDragging = true;
            element.classList.add("active");
            const coords = getRelativeCoords(e);
            startX = coords.x;
            startY = coords.y;
            initialLeft = element.offsetLeft;
            initialTop = element.offsetTop;
            document.addEventListener("mousemove", handleDrag);
            document.addEventListener("mouseup", stopDrag);
            document.addEventListener("touchmove", handleDrag, { passive: false });
            document.addEventListener("touchend", stopDrag);
            e.preventDefault();
        }

        function handleDrag(e) {
            if (!isDragging) return;
            const coords = getRelativeCoords(e);
            const dx = coords.x - startX;
            const dy = coords.y - startY;
            let newLeft = initialLeft + dx;
            let newTop = initialTop + dy;
            const maxLeft = areaPersonalizacao.clientWidth - element.offsetWidth;
            const maxTop = areaPersonalizacao.clientHeight - element.offsetHeight;
            newLeft = Math.max(0, Math.min(newLeft, maxLeft));
            newTop = Math.max(0, Math.min(newTop, maxTop));
            element.style.left = `${newLeft}px`;
            element.style.top = `${newTop}px`;
            element.style.transform = "translate(0, 0)";
            e.preventDefault();
        }

        function stopDrag() {
            if (isDragging) {
                isDragging = false;
                // element.classList.remove("active"); // Keep element active after dragging
                document.removeEventListener("mousemove", handleDrag);
                document.removeEventListener("mouseup", stopDrag);
                document.removeEventListener("touchmove", handleDrag);
                document.removeEventListener("touchend", stopDrag);
            }
        }

        const resizers = element.querySelectorAll(".resizer");
        resizers.forEach((resizer) => {
            const listener = (e) => {
                console.log("--- Resizer Clicked --- Element:", element.id, "Resizer Class:", resizer.className);
                startResize(e);
            };
            resizer.addEventListener("mousedown", listener);
            resizer.addEventListener("touchstart", listener, { passive: false });
        });

        function startResize(e) {
            console.log("--- startResize --- Element:", element.id, "Resizer:", e.target.className);

            // Deselect previous element if different
            if (currentActiveElement && currentActiveElement !== element) {
                currentActiveElement.classList.remove("active");
            }
            currentActiveElement = element; // Set current element as active

            isResizing = true;
            currentResizer = e.target;
            element.classList.add("active"); // Ensure it's active
            const coords = getRelativeCoords(e);
            startX = coords.x;
            startY = coords.y;
            const rect = element.getBoundingClientRect();
            const parentRect = areaPersonalizacao.getBoundingClientRect();
            initialWidth = rect.width;
            initialHeight = rect.height;
            initialLeft = rect.left - parentRect.left;
            initialTop = rect.top - parentRect.top;
            document.addEventListener("mousemove", handleResize);
            document.addEventListener("mouseup", stopResize);
            document.addEventListener("touchmove", handleResize, { passive: false });
            document.addEventListener("touchend", stopResize);
            e.preventDefault();
        }

        function handleResize(e) {
            if (!isResizing) return;
            console.log("--- handleResize --- Element:", element.id);
            const coords = getRelativeCoords(e);
            const dx = coords.x - startX;
            const dy = coords.y - startY;
            let newWidth = initialWidth;
            let newHeight = initialHeight;
            let newLeft = initialLeft;
            let newTop = initialTop;
            const minWidth = 30;
            const minHeight = 15;

            if (currentResizer.classList.contains("bottom-right")) {
                newWidth = Math.max(minWidth, initialWidth + dx);
                newHeight = Math.max(minHeight, initialHeight + dy);
            } else if (currentResizer.classList.contains("bottom-left")) {
                newWidth = Math.max(minWidth, initialWidth - dx);
                newHeight = Math.max(minHeight, initialHeight + dy);
                newLeft = initialLeft + dx;
            } else if (currentResizer.classList.contains("top-right")) {
                newWidth = Math.max(minWidth, initialWidth + dx);
                newHeight = Math.max(minHeight, initialHeight - dy);
                newTop = initialTop + dy;
            } else if (currentResizer.classList.contains("top-left")) {
                newWidth = Math.max(minWidth, initialWidth - dx);
                newHeight = Math.max(minHeight, initialHeight - dy);
                newLeft = initialLeft + dx;
                newTop = initialTop + dy;
            }

            const maxContainerWidth = areaPersonalizacao.clientWidth;
            const maxContainerHeight = areaPersonalizacao.clientHeight;
            if (newLeft < 0) { newWidth += newLeft; newLeft = 0; }
            if (newTop < 0) { newHeight += newTop; newTop = 0; }
            if (newLeft + newWidth > maxContainerWidth) { newWidth = maxContainerWidth - newLeft; }
            if (newTop + newHeight > maxContainerHeight) { newHeight = maxContainerHeight - newTop; }
            newWidth = Math.max(minWidth, newWidth);
            newHeight = Math.max(minHeight, newHeight);

            element.style.width = `${newWidth}px`;
            element.style.height = `${newHeight}px`;
            element.style.left = `${newLeft}px`;
            element.style.top = `${newTop}px`;
            element.style.transform = "translate(0, 0)";
            console.log(`--- handleResize --- Applied: L=${newLeft.toFixed(2)}px, T=${newTop.toFixed(2)}px, W=${newWidth.toFixed(2)}px, H=${newHeight.toFixed(2)}px`);

            // Adjust font size proportionally for text elements
            if (element.classList.contains("texto-elemento")) {
                 const currentHeight = element.clientHeight;
                 const targetElement = element.querySelector("span");
                 console.log(`--- handleResize [Text] --- Element: ${element.id}, Height: ${currentHeight.toFixed(2)}px, Target Span:`, targetElement);
                 if(targetElement) {
                    // Set font size based on element height (e.g., 60% of height), minimum 8px
                    let newFontSize = Math.max(8, currentHeight * 0.6);
                    targetElement.style.fontSize = `${newFontSize}px`;
                    console.log(`--- handleResize [Text] --- Applied Font Size: ${newFontSize.toFixed(2)}px`);
                 } else {
                    console.log("--- handleResize [Text] --- Span element not found inside", element.id);
                 }
            }
            e.preventDefault();
        }

        function stopResize() {
            if (isResizing) {
                isResizing = false;
                // element.classList.remove("active"); // Keep element active after resizing
                document.removeEventListener("mousemove", handleResize);
                document.removeEventListener("mouseup", stopResize);
                document.removeEventListener("touchmove", handleResize);
                document.removeEventListener("touchend", stopResize);
            }
        }
    }

    // Apply interactive logic to all elements
    elementosTexto.forEach(el => { if (el) makeInteractive(el); });
    elementosLogo.forEach(el => { if (el) makeInteractive(el); });

    // --- Finalizar Pedido UPDATED ---
    finalizarBtn.addEventListener("click", () => {
        if (!confirmacaoCheckbox.checked) {
            return alert("Por favor, marque a caixa de confirmação para concordar com o layout.");
        }
        if (!nomeClienteInput.value || !emailClienteInput.value) {
            return alert("Preencha nome e email.");
        }

        // Check if at least one personalization exists
        const hasText = textoInputs.some(input => input && input.value);
        const hasLogo = processedImageDataUrls.some(url => url);
        if (!hasText && !hasLogo) {
            return alert("Adicione pelo menos um texto ou um logo para personalizar.");
        }

        // Collect data from all fields
        const textos = textoInputs.map((input, index) => {
            return input && input.value ? { texto: input.value, fonte: fonteTextoSelects[index]?.value } : null;
        }).filter(t => t !== null); // Filter out empty texts

        const logos = processedImageDataUrls.map((url, index) => {
            return url ? { logo_data_url: url, index: index + 1 } : null;
        }).filter(l => l !== null); // Filter out empty logos

        const pedido = {
            cor_canudo: corCanudoSelect.value,
            cor_gravacao: corGravacaoSelect.value,
            textos: textos, // Array of text objects
            logos: logos,   // Array of logo objects
            nome_cliente: nomeClienteInput.value,
            email_cliente: emailClienteInput.value,
            confirmacao_layout: confirmacaoCheckbox.checked,
            // Could add position/size data for each element if needed
        };

        console.log("Enviando pedido:", pedido);

        fetch("/finalizar", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(pedido),
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert("Pedido finalizado com sucesso! Verifique seu email.");
                // Optionally reset form fields here
            } else {
                alert("Erro ao finalizar o pedido: " + (data.error || "Erro desconhecido"));
            }
        })
        .catch(error => {
            console.error("Erro na requisição /finalizar:", error);
            alert("Erro na comunicação com o servidor ao finalizar o pedido.");
        });
    });
});

