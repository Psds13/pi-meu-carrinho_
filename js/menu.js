function myFunction() {
    var x = document.getElementById("myTopnav");
    if (x.className === "topnav") {
      x.className += " responsive";
    } else {
      x.className = "topnav";
    }
  }
  function toggleNav() {
  var nav = document.getElementById("myTopnav");
  if (nav.style.display === "block") {
    nav.style.display = "none"; // Esconde o menu
  } else {
    nav.style.display = "block"; // Exibe o menu
  }
}
