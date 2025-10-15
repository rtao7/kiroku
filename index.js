let myLinks = [];
const input = document.getElementById("input-el");
const inputButton = document.getElementById("input-btn");
const linkList = document.getElementById("link-list");

inputButton.addEventListener("click", (e) => {
  myLinks.push(input.value);
  let listItems = "";
  for (let i = 0; i < myLinks.length; i++) {
    listItems += "<li>" + myLinks[i] + "</li>";
    console.log(listItems);
  }
  linkList.innerHTML = listItems;
});
