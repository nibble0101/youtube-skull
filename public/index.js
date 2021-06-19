const form = document.getElementById("form");

function clearUrlInput(){
  const url = document.getElementById("url");
  url.value = "";
}


form.addEventListener("submit", (event) => {
  event.preventDefault();
  const url = document.getElementById("url");
  if(!url.value.trim()){
    alert("Please enter correct URL");
  }
});
