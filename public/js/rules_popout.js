// Get the modal
const modal = document.getElementById('myModal');

// Get the button that opens the modal
const btn = document.getElementById("myBtn");

// Get the <span> element that closes the modal
const span = document.getElementsByClassName("close")[0];

// When the user clicks the button, open the modal 
btn.onclick = function() {
  modal.style.display = "block";
  modal.display ="/rules"
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

// function popup(mylink, windowname) { 
//     if (! window.focus) return true; 
//     var href;
//     if (typeof(mylink) == 'string') href=mylink; 
//     else href=mylink.href; 
//     window.open(href, windowname, 'width=400,height=200,scrollbars=yes'); 
//     return false; 
// }

