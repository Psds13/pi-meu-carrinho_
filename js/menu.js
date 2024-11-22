function myFunction() {
    var x = document.getElementById("myTopnav");
    if (x.className === "topnav") {
      x.className += " responsive";
    } else {
      x.className = "topnav";
    }
  }
  // Função para alternar a visibilidade do menu
function toggleNav() {
  var nav = document.getElementById("myTopnav");
  if (nav.style.display === "block") {
    nav.style.display = "none"; // Esconde o menu
  } else {
    nav.style.display = "block"; // Exibe o menu
  }
}

// Detecta cliques fora da navbar
document.addEventListener("click", function(event) {
  var nav = document.getElementById("myTopnav");
  var toggleButton = document.querySelector(".topnav-toggle");  // O botão de hambúrguer
  // Verifica se o clique aconteceu fora da navbar e do botão de toggle
  if (!nav.contains(event.target) && !toggleButton.contains(event.target)) {
    nav.style.display = "none"; // Fecha o menu
  }
 });
