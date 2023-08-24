let defaultItems = [
  {
    text: "Não foi dessa vez",
    type: 'end'
  },
  {
    type: "replay",
    text: "Jogue Novamente",
    ikon: "replay",
  },
];
const defaultItem = { text: "" };
function getItems() {
  try {
    const items = window.localStorage.getItem("defaultItems");
    if (items) defaultItems = JSON.parse(items);
  } catch {
    return null;
  }
  setItems();
}

function callbackInputChange(e) {
  const value = e?.target?.value ?? "";
  const index = e?.target?.id?.split("-")[1];
  defaultItems.splice(index, 1, { ...defaultItems[index], text: value });
}
function addInputsChangeListener() {
  const inputs = $(".inputs-awards");
  for (let index = 0; index < inputs.length; index++) {
    const input = inputs[index];
    input?.addEventListener("keyup", callbackInputChange);
    input?.addEventListener("change", callbackInputChange);
  }
}
function removeInputsChangeListener() {
  const inputs = $(".inputs-awards");
  for (let index = 0; index < inputs.length; index++) {
    const input = inputs[index];
    input?.removeEventListener("keyup", callbackInputChange);
    input?.removeEventListener("change", callbackInputChange);
  }
}

function setItems() {
  const divItems = $("#awards");
  divItems.html("");
  removeInputsChangeListener();
  for (let index = 0; index < defaultItems.length; index++) {
    const item = defaultItems[index];
    if (item.type === "replay") continue;
    const itemDiv = `
    <div class="sm:col-span-full flex justify-between w-full gap-2">
      <div class="w-full">
        <input
          type="text"
          value="${item.text}"
          id="item-${index}"
          class="inputs-awards block w-full rounded-md border-0 p-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
        />
      </div>
      ${index !== 0
        ? ` <button onclick="handleDeleteButton(${index})" type="button"
      class="delete rounded-md bg-red-600 p-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"><i class="material-icons">delete</i></button>`
        : ""
      }
     
      ${index === defaultItems.length - 2
        ? `
      <button onclick="handleAddButton()" type="button" 
        class="rounded-md bg-indigo-600 p-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"><i class="material-icons">add</i></button>`
        : ""
      }
    </div>
    `;
    divItems.html(divItems.html() + itemDiv);
  }
  addInputsChangeListener();
}

function handleDeleteButton(index) {
  defaultItems.splice(parseInt(index, 10), 1);
  setItems();
}
function handleAddButton() {
  defaultItems.splice(defaultItems.length - 1, 0, defaultItem);
  setItems();
}
getItems();
function handleSaveButton() {
  window.localStorage.setItem("defaultItems", JSON.stringify(defaultItems));
  getItems();
  handleToggleModalForm();
  window.location.reload();
}

function handleMenu() {
  const menu = document.getElementById("menu");
  menu.classList.toggle("hidden");
}
