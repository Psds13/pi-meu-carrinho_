document.addEventListener("DOMContentLoaded", () => {
    // Inicializa todos os carrosséis na página
    const carousels = document.querySelectorAll(".carousel-container");

    carousels.forEach(container => {
        const track = container.querySelector(".highlights-grid, .promocoes-grid");
        if (!track) return;

        const leftArrow = container.querySelector(".left-arrow");
        const rightArrow = container.querySelector(".right-arrow");
        const items = track.children;
        
        if (items.length === 0) return;

        let index = 0;
        const totalItems = items.length;
        
        // Função para calcular a largura real de um item incluindo o gap
        function getStepWidth() {
            const firstItem = items[0];
            const style = window.getComputedStyle(track);
            const gap = parseInt(style.columnGap) || 0;
            return firstItem.offsetWidth + gap;
        }

        // Clonagem para Loop Infinito
        for (let i = 0; i < totalItems; i++) {
            const cloneAfter = items[i].cloneNode(true);
            track.appendChild(cloneAfter);
        }
        for (let i = totalItems - 1; i >= 0; i--) {
            const cloneBefore = items[i].cloneNode(true);
            track.insertBefore(cloneBefore, track.firstChild);
        }

        // Posição inicial (no meio)
        index = totalItems;
        track.style.transform = `translateX(${-index * getStepWidth()}px)`;

        function move(direction) {
            const stepWidth = getStepWidth();
            
            if (direction === "next") {
                index++;
            } else {
                index--;
            }

            track.style.transition = "transform 0.6s cubic-bezier(0.23, 1, 0.32, 1)";
            track.style.transform = `translateX(${-index * stepWidth}px)`;

            // Snap back for infinite loop
            if (index >= totalItems * 2) {
                setTimeout(() => {
                    track.style.transition = "none";
                    index = totalItems;
                    track.style.transform = `translateX(${-index * stepWidth}px)`;
                }, 600);
            }

            if (index < totalItems) {
                setTimeout(() => {
                    track.style.transition = "none";
                    index = totalItems * 2 - 1;
                    track.style.transform = `translateX(${-index * stepWidth}px)`;
                }, 600);
            }
        }

        if (rightArrow) rightArrow.addEventListener("click", () => move("next"));
        if (leftArrow) leftArrow.addEventListener("click", () => move("prev"));

        // Responsividade: reajustar posição no resize
        window.addEventListener("resize", () => {
            track.style.transition = "none";
            track.style.transform = `translateX(${-index * getStepWidth()}px)`;
        });
    });
});
