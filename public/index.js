const form = document.getElementById("form");
const url = document.getElementById("url");

form.addEventListener("submit", (event) => {
  event.preventDefault();
  if(url.value){
    alert("Please enter correct url");
  }
});
