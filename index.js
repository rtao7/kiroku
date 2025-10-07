let myLinks = [];
const input = document.getElementById("input-el");
const inputButton = document.getElementById("input-btn");
const linkList = document.getElementById("link-list");

inputButton.addEventListener("click", (e) => {
  myLinks.push(input.value);
  console.log(myLinks);
});

for (let i = 0; i < myLinks.length; i++) {
  const listItem = document.createElement("li");
  listItem.textContent = myLinks[i].textContent;
  linkList.appendChild(listItem);
}
