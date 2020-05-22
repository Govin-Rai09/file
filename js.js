// class
class File {
  constructor(name, address, id) {
    this.name = name;
    this.address = address;
    this.id = id;
  }
}
// ui
class UI {
  static DisplayForm() {
    const forms = Store.getForms();
    forms.forEach(form => UI.AddForm(form));
  }
  static AddForm(form) {
    const list = document.querySelector(`#list`);
    const row = document.createElement(`tr`);
    row.innerHTML = `
    <td>${form.name}</td>
    <td>${form.address}</td>
    <td>${form.id}</td>
    <td><a href="#" class="btn btn-danger btn-sm del">#</a></td>
    `;
    list.appendChild(row);
  }
  static DelForm(el) {
    if (el.classList.contains(`del`)) {
      el.parentElement.parentElement.remove();
    }
  }
  static clearField() {
    document.querySelector(`#name`).value = ``;
    document.querySelector(`#address`).value = ``;
    document.querySelector(`#id`).value = ``;
  }
  static showAlert(mes, className) {
    const div = document.createElement(`div`);
    div.className = `alert alert-${className}`;
    div.appendChild(document.createTextNode(mes));
    const cont = document.querySelector(`.cont`);
    const cool = document.querySelector(`#co`);
    cont.insertBefore(div, cool);

    setTimeout(() => document.querySelector(`.alert`).remove(), 2000);
  }
}
// store
class Store {
  static getForms() {
    let forms;
    if (localStorage.getItem(`forms`) === null) {
      forms = [];
    } else {
      forms = JSON.parse(localStorage.getItem(`forms`));
    }
    return forms;
  }
  static addForm(form) {
    const forms = Store.getForms();
    forms.push(form);
    localStorage.setItem(`forms`, JSON.stringify(forms));
  }
  static removeForm(id) {
    const forms = Store.getForms();
    forms.forEach((form, index) => {
      if (form.id === id) {
        forms.splice(index, 1);
      }
    });
    localStorage.setItem(`forms`, JSON.stringify(forms));
  }
}
// display
document.addEventListener(`DOMContentLoaded`, UI.DisplayForm);
// add
document.querySelector(`#co`).addEventListener(`submit`, e => {
  e.preventDefault();
  const name = document.querySelector(`#name`).value;
  const address = document.querySelector(`#address`).value;
  const id = document.querySelector(`#id`).value;
  if (name === `` || address === `` || id === ``) {
    UI.showAlert(`fill all gaps`, `danger`);
  } else {
    const form = new File(name, address, id);
    UI.AddForm(form);
    Store.addForm(form);
    UI.showAlert(`Added`, `success`);
    UI.clearField();
  }
});
// del
document.querySelector(`#list`).addEventListener(`click`, e => {
  UI.DelForm(e.target);
  Store.removeForm(e.target.parentElement.previousElementSibling.textContent);
  UI.showAlert(`Removed`, `success`);
});
// modifying table content
Pra = (table, column, asc = true) => {
  const modify = asc ? 1 : -1;
  const tBody = table.tBodies[0];
  const rows = Array.from(tBody.querySelectorAll(`tr`));
  const sortrows = rows.sort((a, b) => {
    const aText = a
      .querySelector(`td:nth-child(${column + 1})`)
      .textContent.trim();
    const bText = b
      .querySelector(`td:nth-child(${column + 1})`)
      .textContent.trim();
    return aText > bText ? 1 * modify : -1 * modify;
  });
  while (tBody.firstChild) {
    tBody.removeChild(tBody.firstChild);
  }
  tBody.append(...sortrows);
  table
    .querySelectorAll(`th`)
    .forEach(th => th.classList.remove(`th-sort-asc`, `th-sort-desc`));
  table
    .querySelector(`th:nth-child(${column + 1})`)
    .classList.toggle(`th-sort-asc`, asc);
  table
    .querySelector(`th:nth-child(${column + 1})`)
    .classList.toggle(`th-sort-desc`, !asc);
};
document.querySelectorAll(`.table th`).forEach(th => {
  th.addEventListener(`click`, () => {
    const tElement = th.parentElement.parentElement.parentElement;
    const indexO = Array.prototype.indexOf.call(th.parentElement.children, th);
    const ascCo = th.classList.contains(`th-sort-asc`);
    Pra(tElement, indexO, !ascCo);
  });
});
