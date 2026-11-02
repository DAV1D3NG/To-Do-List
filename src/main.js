import "./style.css"

const KEY = "key"
const lista = document.querySelector("#lista")
const info  = document.querySelector("#info")
const form  = document.querySelector("#form")
const campo = document.querySelector("#campo")

let tasks = loadState()

function loadState() {
  const testo = localStorage.getItem(KEY)

  if (testo === null) return []
  return JSON.parse(testo)
}

function saveState() { localStorage.setItem(KEY, JSON.stringify(tasks)) }

function render() {
  lista.innerHTML = tasks.map(t => `
      <li class="${t.completed ? "fatto" : ""}" data-id="${t.id}">
        <span class="titolo">${t.title}</span>
        <button class="elimina" data-id="${t.id}">X</button>
      </li>
    `).join("")

  const completati = tasks.filter(t => t.completed).length
  info.textContent = `Totali: ${tasks.length} · Completati: ${completati}`
}

function addTask(title) {
  const trimmed = title.trim()
  if (trimmed === "") return

  tasks = [...tasks, { id: Date.now(), title: trimmed, completed: false }]
  saveState()
  render()
}

function toggleTask(id) {
  tasks = tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t)
  saveState()
  render()
}

function deleteTask(id) {
  tasks = tasks.filter(t => t.id !== id)
  saveState()
  render()
}


function handleAdd(e) {
  e.preventDefault()
  addTask(campo.value)
  campo.value = ""
  campo.focus()
}

function handleDeleteToggle(e) {
  const el = e.target

  if (el.classList.contains("elimina")) {
    deleteTask(Number(el.dataset.id))
    return
  }

  const li = el.closest("li")
  if (li) toggleTask(Number(li.dataset.id))
}

form.addEventListener("submit", handleAdd)
lista.addEventListener("click", handleDeleteToggle)

// Funzionalità per mantenere la dimensione anche ingrandendo/rimpicciolendo
const main = document.querySelector("main")
const zoomIniziale = window.devicePixelRatio

function keepSize() {
  const zoomAttuale = window.devicePixelRatio

  const scala = zoomIniziale / zoomAttuale

  main.style.transform = `scale(${scala})`
  main.style.transformOrigin = "top center"
}

window.addEventListener("resize", keepSize)
keepSize()

render()