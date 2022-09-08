// Global variables
const notesContainer = document.querySelector(".notes");
const addBtn = document.querySelector(".add");
const body = document.querySelector("body");
const clearBtn = document.querySelector(".tools .clear-btn");
const searchBox = document.querySelector(".search-box");
const searchInput = document.querySelector(".search-box .s-input");
const searchIcon = document.querySelector(".search-box .s-icon");
const gradients = document.querySelectorAll(
  ".tools .back-changer .gradients .gradient"
);
let notesArray = JSON.parse(localStorage.getItem("notes"));
let theme = localStorage.getItem("theme");

// Construct data from local storage
if (notesArray && notesArray.length != 0) {
  notesArray.forEach((note) => {
    addNote(note, false);
  });
} else {
  notesArray = [];
  const newNote = {
    title: "",
    content: "",
    date: Date.now(),
    background: "#004830",
  };
  addNote(newNote, false);
}

// Background gradients
gradients.forEach((grad) => {
  if (theme) {
    body.className = theme;
    clearBtn.className = "clear-btn " + theme;
    searchIcon.className = "s-icon " + theme;
    removeGradientActive();
    setTimeout(function () {
      if (grad.getAttribute("data-g") == theme) {
        grad.classList.add("active");
      }
    }, 1);
  }
  grad.addEventListener("click", function () {
    body.className = grad.getAttribute("data-g");
    clearBtn.className = "clear-btn " + grad.getAttribute("data-g");
    searchIcon.className = "s-icon " + grad.getAttribute("data-g");
    removeGradientActive();
    grad.classList.add("active");
    localStorage.setItem("theme", grad.getAttribute("data-g"));
  });
});
function removeGradientActive() {
  gradients.forEach((grad) => {
    grad.classList.remove("active");
  });
}

// Search functionality
searchIcon.addEventListener("click", () => {
  searchInput.focus();
  searchBox.classList.add("active");
});
searchInput.addEventListener("keyup", function (e) {
  const notesArrayDom = document.querySelectorAll(".notes .note-wrapper");
  e.preventDefault();
  const searchTerm = e.target.value.toLowerCase();
  notesArrayDom.forEach(function (item) {
    const itemTitle = item.querySelector(".title").textContent;
    if (itemTitle.toLowerCase().indexOf(searchTerm) != -1) {
      item.style.display = "block";
    } else {
      item.style.display = "none";
    }
  });
});

// Add new note
addBtn.addEventListener("click", () => {
  const newNote = {
    title: "",
    content: "",
    date: Date.now(),
    background: "#004830",
  };
  addNote(newNote, true);
});

// Clear all notes
clearBtn.addEventListener("click", () => {
  notesArray = [];
  notesContainer.innerHTML = "";
  localStorage.removeItem("notes");
});

// Create and append the notes to the dom
function addNote(newNote, focus) {
  const noteWrapper = document.createElement("div");
  const titleText = newNote.title == "" ? "add title" : newNote.title;
  const contentText = newNote.content == "" ? "add content" : newNote.content;
  const date = new Date(newNote.date).toDateString();
  const background = newNote.background;
  noteWrapper.classList.add("note-wrapper");
  setTimeout(() => {
    noteWrapper.classList.add("animate");
  }, 1);
  noteWrapper.draggable = true;
  noteWrapper.innerHTML = `
  <div class="note">
     <div class="title" contenteditable="true">${titleText}</div>
        <div class="content" contenteditable="true">${contentText}</div>
        <div class="date" data-date="${new Date()}"><i class="fa-solid fa-clock"></i>${date}</div>
        <div class="delete"><i class="fa-regular fa-trash-can"></i></div>
        <div class="colors">
          <div class="color" data-color="#003060" style="background-color:#003060;"></div>
          <div class="color" data-color="#a89000" style="background-color:#a89000;"></div>
          <div class="color" data-color="#7a2459" style="background-color:#7a2459;"></div>
          <div class="color" data-color="#1f7174" style="background-color:#1f7174;"></div>
          <div class="color" data-color="#a83018" style="background-color:#a83018;"></div>
          <div class="color" data-color="#004830" style="background-color:#004830;"></div>
        </div>
      </div>
    `;
  const note = noteWrapper.querySelector(".note");
  const titleEl = note.querySelector(".title");
  const contentEl = note.querySelector(".content");
  const deleteEl = note.querySelector(".delete");
  const colors = note.querySelectorAll(".colors .color");

  note.style.backgroundColor = background;
  note.dataset.back = background;

  // focus happens when it is a new note
  setTimeout(() => {
    if (focus) {
      titleEl.focus();
      titleEl.textContent = "";
      titleEl.classList.remove("placeholder");
    }
  }, 1);

  // Add placeholder
  if (titleText == "add title") {
    titleEl.classList.add("placeholder");
  } else {
    titleEl.classList.remove("placeholder");
  }
  if (contentText == "add content") {
    contentEl.classList.add("placeholder");
  } else {
    contentEl.classList.remove("placeholder");
  }
  // title and content event listeners
  titleEl.addEventListener("keyup", (e) => {
    updateLocal();
  });
  titleEl.addEventListener("keypress", (e) => {
    if (e.target.textContent == "add title") {
      e.target.textContent = "";
      e.target.classList.remove("placeholder");
    }
  });
  contentEl.addEventListener("keyup", (e) => {
    updateLocal();
  });
  contentEl.addEventListener("keypress", (e) => {
    if (e.target.textContent == "add content") {
      e.target.textContent = "";
      e.target.classList.remove("placeholder");
    }
  });
  deleteEl.addEventListener("click", () => {
    noteWrapper.classList.remove("animate");
    setTimeout(() => {
      noteWrapper.remove();
      updateLocal();
    }, 400);
  });
  // Changing notes color
  colors.forEach((color) => {
    if (color.getAttribute("data-color") == note.getAttribute("data-back")) {
      color.classList.add("active");
    }
    color.addEventListener("click", () => {
      const bk = color.getAttribute("data-color");
      colors.forEach((color) => {
        color.classList.remove("active");
      });
      color.classList.add("active");
      note.dataset.back = bk;
      note.style.backgroundColor = bk;
      note.style.transition = "background-color 0.5s";

      updateLocal();
    });
  });

  // Drag and drop functionalities
  noteWrapper.addEventListener("dragstart", dragstart_handler);
  noteWrapper.addEventListener("dragover", dragover_handler);
  noteWrapper.addEventListener("dragenter", dragenter_handler);
  noteWrapper.addEventListener("dragleave", dragleave_handler);
  noteWrapper.addEventListener("dragend", dragend_handler);
  noteWrapper.addEventListener("drop", drop_handler);

  notesContainer.appendChild(noteWrapper);
  updateLocal();
}

let enterTarget = null; // to help identify the correct element
let dragSrcEl = null; // to stop transfer if it is droped on itself

function dragstart_handler(e) {
  this.style.opacity = "0.4";
  dragSrcEl = this;
  e.dataTransfer.effectAllowed = "move";
  e.dataTransfer.setData("text/html", this.innerHTML);
}
function dragover_handler(e) {
  e.preventDefault();
  return false;
}
function dragenter_handler(e) {
  enterTarget = e.target;
  this.classList.add("over");
}
function dragleave_handler(e) {
  e.preventDefault();
  // Remove only if the enter target == the leave target
  if (enterTarget == e.target) {
    this.classList.remove("over");
  }
}
function dragend_handler(e) {
  this.style.opacity = "1";
}
function drop_handler(e) {
  e.stopPropagation();
  if (dragSrcEl !== this) {
    dragSrcEl.innerHTML = this.innerHTML;
    this.innerHTML = e.dataTransfer.getData("text/html");
  }
  this.classList.remove("over");
  updateLocal();
  return false;
}

// Fetching from Local storage
function updateLocal() {
  notesArray = [];
  const allNotes = document.querySelectorAll(".note");
  allNotes.forEach((note) => {
    const title = note.querySelector(".title").textContent;
    const content = note.querySelector(".content").textContent;
    const date = note.querySelector(".date").getAttribute("data-date");
    const background = note.getAttribute("data-back");
    const newNote = { title, content, date, background };
    notesArray.push(newNote);
  });
  localStorage.setItem("notes", JSON.stringify(notesArray));
}
