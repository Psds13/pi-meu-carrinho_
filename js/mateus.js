document.querySelectorAll('.slider').forEach(slider => {
    const leftBtn = slider.querySelector('.slider-btn.left');
    const rightBtn = slider.querySelector('.slider-btn.right');
    const productList = slider.querySelector('.produtos-lista');
  
    leftBtn.addEventListener('click', () => {
      productList.scrollBy({ left: -200, behavior: 'smooth' });
    });
  
    rightBtn.addEventListener('click', () => {
      productList.scrollBy({ left: 200, behavior: 'smooth' });
    });
  });
  