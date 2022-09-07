const notesContainer = document.querySelector(".notes");
const addBtn = document.querySelector(".add");
const clearBtn = document.querySelector(".clear-all");
let notesArray = JSON.parse(localStorage.getItem("notes"));
// get data from local storage and update the dom
if (notesArray) {
  notesArray.forEach((note) => {
    addNote(note, false);
  });
} else {
  notesArray = [];
}
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
// clearBtn.addEventListener("click", () => {
//   notesArray = [];
//   notesContainer.innerHTML = "";
//   localStorage.removeItem("notes");
// });

// Create and attach the notes to the dom
function addNote(newNote, focus) {
  const noteWrapper = document.createElement("div");
  const titleText = newNote.title == "" ? "add title" : newNote.title;
  const contentText = newNote.content == "" ? "add content" : newNote.content;
  const date = new Date(newNote.date).toDateString();
  const background = newNote.background;
  noteWrapper.classList.add("note-wrapper");
  setTimeout(() => {
    noteWrapper.classList.add("animate");
  }, 15);
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
  notesContainer.appendChild(noteWrapper);

  if (titleText == "add title") {
    titleEl.classList.add("glow");
  } else {
    titleEl.classList.remove("glow");
  }
  // Focus the note when it is added by the add button
  if (focus) {
    titleEl.textContent = "";
    titleEl.focus();
  }
  titleEl.addEventListener("keyup", (e) => {
    updateLocal();
  });
  titleEl.addEventListener("keypress", (e) => {
    if (e.target.textContent == "add title") {
      e.target.textContent = "";
      e.target.classList.remove("glow");
    }
  });
  contentEl.addEventListener("keyup", (e) => {
    updateLocal();
  });
  contentEl.addEventListener("keypress", (e) => {
    if (e.target.textContent == "add content") {
      e.target.textContent = "";
    }
  });
  deleteEl.addEventListener("click", () => {
    noteWrapper.classList.remove("animate");
    setTimeout(() => {
      noteWrapper.remove();
      updateLocal();
    }, 500);
  });
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
  updateLocal();
  noteWrapper.addEventListener("dragstart", dragstart_handler);
  noteWrapper.addEventListener("dragover", dragover_handler);
  noteWrapper.addEventListener("dragenter", dragenter_handler);
  noteWrapper.addEventListener("dragleave", dragleave_handler);
  noteWrapper.addEventListener("dragend", dragend_handler);
  noteWrapper.addEventListener("drop", drop_handler);
}

let enterTarget = null; // to help identify the correct element
let dragSrcEl = null; //

function dragstart_handler(e) {
  this.style.opacity = "0.4";
  dragSrcEl = this;
  console.log(dragSrcEl);
  e.dataTransfer.effectAllowed = "move";
  e.dataTransfer.setData("text/html", this.innerHTML);
}
function dragover_handler(e) {
  e.preventDefault();
  e.dataTransfer.dropEffect = "move";
  console.log(" dragover_handler");
  return false;
}
function dragenter_handler(e) {
  enterTarget = e.target;
  this.classList.add("over");
  console.log(" dragenter_handler ");
}
function dragleave_handler(e) {
  e.preventDefault();
  if (enterTarget == e.target) {
    this.classList.remove("over");
  }
  console.log(" dragleave_handler ");
}
function dragend_handler(e) {
  console.log(" dragend_handler ");
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
