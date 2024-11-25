let slideIndex = 0;
showSlides();

function showSlides() {
  let i;
  let slides = document.getElementsByClassName("mySlides");
  let dots = document.getElementsByClassName("dot");
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";  
  }
  slideIndex++;
  if (slideIndex > slides.length) {slideIndex = 1}    
  for (i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(" active", "");
  }
  slides[slideIndex-1].style.display = "block";  
  dots[slideIndex-1].className += " active";
  setTimeout(showSlides, 2000); // Change image every 2 seconds
}
// Seleciona todos os botões de incremento e decremento
const decrementBtns = document.querySelectorAll('.decrement-btn');
const incrementBtns = document.querySelectorAll('.increment-btn');

// Função para atualizar a quantidade
function updateQuantity(e, action) {
  const quantityDisplay = e.target.parentElement.querySelector('.quantity-display');
  let currentQuantity = parseInt(quantityDisplay.textContent);
  
  if (action === 'increment') {
    currentQuantity += 1;  // Aumenta a quantidade
  } else if (action === 'decrement' && currentQuantity > 0) {
    currentQuantity -= 1;  // Diminui a quantidade, mas não permite valores menores que 1
  }
  
  quantityDisplay.textContent = currentQuantity;  // Atualiza a quantidade exibida
}

// Adiciona os ouvintes de eventos para os botões de incremento e decremento
decrementBtns.forEach(btn => {
  btn.addEventListener('click', (e) => updateQuantity(e, 'decrement'));
});

incrementBtns.forEach(btn => {
  btn.addEventListener('click', (e) => updateQuantity(e, 'increment'));
});
