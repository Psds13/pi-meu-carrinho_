document.addEventListener("DOMContentLoaded", () => {
  const track = document.querySelector(".promocoes-grid");
  const items = document.querySelectorAll(".promocao-item");
  const leftArrow = document.querySelector(".left-arrow");
  const rightArrow = document.querySelector(".right-arrow");

  let index = 0; // Índice inicial
  const itemWidth = items[0].offsetWidth + 20; // Largura do item + margem
  const totalItems = items.length;

  // Clone dos itens para criar o loop infinito
  items.forEach((item) => {
    const clone = item.cloneNode(true);
    track.appendChild(clone);
  });

  items.forEach((item) => {
    const clone = item.cloneNode(true);
    track.insertBefore(clone, track.firstChild);
  });

  // Ajustar a posição inicial para o meio dos itens clonados
  track.style.transform = `translateX(${-totalItems * itemWidth}px)`;
  index = totalItems;

  // Função para mover o carrossel
  function moveCarousel(direction) {
      if (direction === "next") {
          index++;
      } else if (direction === "prev") {
          index--;
      }

      track.style.transition = "transform 0.5s ease";
      track.style.transform = `translateX(${-index * itemWidth}px)`;

      // Reseta para loop infinito ao avançar além do último item original
      if (index >= totalItems * 2) {
          setTimeout(() => {
              track.style.transition = "none";
              index = totalItems;
              track.style.transform = `translateX(${-index * itemWidth}px)`;
          }, 500); // Aguarda o término da animação
      }

      // Reseta para loop infinito ao voltar antes do primeiro item original
      if (index < totalItems) {
          setTimeout(() => {
              track.style.transition = "none";
              index = totalItems * 2 - 1;
              track.style.transform = `translateX(${-index * itemWidth}px)`;
          }, 500); // Aguarda o término da animação
      }
  }

  // Botões de navegação
  rightArrow.addEventListener("click", () => moveCarousel("next"));
  leftArrow.addEventListener("click", () => moveCarousel("prev"));
});
