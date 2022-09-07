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
    background: "#256a0b",
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
  const note = document.createElement("div");
  const titleText = newNote.title == "" ? "add title" : newNote.title;
  const contentText = newNote.content == "" ? "add content" : newNote.content;
  const date = new Date(newNote.date).toDateString();
  const background = newNote.background;
  note.classList.add("note");
  setTimeout(() => {
    note.classList.add("animate");
  }, 15);
  note.style.backgroundColor = background;
  note.dataset.back = background;
  note.innerHTML = `
      <div class="title" contenteditable="true">${titleText}</div>
      <div class="content" contenteditable="true">${contentText}</div>
      <div class="date" data-date="${new Date()}"><i class="fa-solid fa-clock"></i>${date}</div>
      <div class="delete"><i class="fa-regular fa-trash-can"></i></div>
      <div class="colors">
        <div class="color" data-color="#dd8811" style="background-color:#dd8811;"></div>
        <div class="color" data-color="#b0b90e" style="background-color:#b0b90e;"></div>
        <div class="color" data-color="#7a2459" style="background-color:#7a2459;"></div>
        <div class="color" data-color="#1f7174" style="background-color:#1f7174;"></div>
        <div class="color" data-color="#955e10" style="background-color:#955e10;"></div>
        <div class="color" data-color="#256a0b" style="background-color:#256a0b;"></div>
      </div>
    `;
  note.addEventListener("resize", (e) => {
    e.target.width;
    console.log("e.target.width");
  });
  notesContainer.appendChild(note);
  const titleEl = note.querySelector(".title");
  const contentEl = note.querySelector(".content");
  const deleteEl = note.querySelector(".delete");
  const colors = note.querySelectorAll(".colors .color");
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
    note.classList.remove("animate");
    setTimeout(() => {
      note.remove();
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
