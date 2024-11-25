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
