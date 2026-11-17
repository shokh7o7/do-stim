const pets = [
  { id: 1, name: "Momiq", type: "Mushuk", breed: "Britaniya mushugi", age: 2, gender: "Urg'ochi", description: "Momiq juda tinch va mehribon mushuk. Deraza oldida uxlashni yaxshi ko'radi. Emlangan va lotokka o'rgatilgan.", model: "models/cat.glb", available: true },
  { id: 2, name: "Barsik", type: "Mushuk", breed: "Uy mushugi", age: 1, gender: "Erkak", description: "Barsik o'yinqaroq mushukcha. Bolalar bilan tez do'stlashadi, koptok bilan o'ynashni yoqtiradi.", model: "models/cat.glb", available: true },
  { id: 3, name: "Rex", type: "It", breed: "Nemis ovcharkasi", age: 3, gender: "Erkak", description: "Rex aqlli va sodiq it. Asosiy buyruqlarni biladi, sayr qilishni juda yaxshi ko'radi. Hovlili uy uchun juda mos.", model: "models/dog.glb", available: true },
  { id: 4, name: "Laycha", type: "It", breed: "Labrador", age: 1, gender: "Urg'ochi", description: "Laycha quvnoq kuchukcha. Odamlarni yaxshi ko'radi va suvda suzishni yoqtiradi.", model: "models/dog.glb", available: true },
  { id: 5, name: "Bobik", type: "It", breed: "Aralash zot", age: 6, gender: "Erkak", description: "Bobik bosiq va mehribon it. Tinch oilaga mos keladi.", model: "models/dog.glb", available: false },
  { id: 6, name: "Paxmoq", type: "Quyon", breed: "Pakana quyon", age: 1, gender: "Urg'ochi", description: "Paxmoq yumshoq junli kichkina quyon. Sabzi va karamni yaxshi ko'radi.", model: "models/rabbit.glb", available: true },
  { id: 7, name: "Oppoq", type: "Quyon", breed: "Angora quyoni", age: 4, gender: "Erkak", description: "Oppoq uzun oq junli, xotirjam quyon. Junini haftada bir-ikki marta tarash kerak.", model: "models/rabbit.glb", available: true }
];

const preloader = document.getElementById("preloader");
const preloaderBar = document.getElementById("preloaderBar");
const preloaderPercent = document.getElementById("preloaderPercent");

document.body.classList.add("loading");

let progress = 0;
const progressTimer = setInterval(() => {
  progress += Math.random() * 12 + 4;
  if (progress >= 100) {
    progress = 100;
    clearInterval(progressTimer);
    setTimeout(() => {
      preloader.classList.add("hide");
      document.body.classList.remove("loading");
      setTimeout(() => preloader.remove(), 700);
    }, 350);
  }
  preloaderBar.style.width = progress + "%";
  preloaderPercent.textContent = Math.floor(progress) + "%";
}, 180);

window.addEventListener("load", () => {
  progress = 100;
});

const petGrid = document.getElementById("petGrid");
const searchInput = document.getElementById("searchInput");
const ageFilter = document.getElementById("ageFilter");
const emptyText = document.getElementById("emptyText");

let activeType = "Hammasi";
let selectedPet = null;

function showPets() {
  const search = searchInput.value.toLowerCase();
  const age = ageFilter.value;
  let html = "";
  let count = 0;

  pets.forEach((pet) => {
    if (activeType !== "Hammasi" && pet.type !== activeType) return;
    if (!pet.name.toLowerCase().includes(search)) return;
    if (age === "small" && pet.age > 1) return;
    if (age === "middle" && (pet.age < 2 || pet.age > 4)) return;
    if (age === "big" && pet.age < 5) return;

    count++;
    html += `
      <div class="pet-card">
        <div class="model-box">
          <model-viewer src="${pet.model}" alt="${pet.name}" auto-rotate camera-controls
            shadow-intensity="1" interaction-prompt="none" loading="lazy">
            <div class="loading" slot="poster">Yuklanmoqda...</div>
          </model-viewer>
          <div class="model-error">Model topilmadi</div>
          <span class="type-badge">${pet.type}</span>
          ${pet.available ? "" : '<span class="status-badge">Asrab olingan</span>'}
        </div>
        <div class="card-body">
          <h3>${pet.name}</h3>
          <p class="breed">${pet.breed}</p>
          <div class="chips">
            <span class="chip">${pet.age} yosh</span>
            <span class="chip">${pet.gender}</span>
          </div>
          <button class="btn btn-outline" onclick="openDetails(${pet.id})">Batafsil</button>
        </div>
      </div>
    `;
  });

  petGrid.innerHTML = html;
  emptyText.hidden = count > 0;
}

document.querySelectorAll(".type-btn").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelector(".type-btn.active").classList.remove("active");
    button.classList.add("active");
    activeType = button.dataset.type;
    showPets();
  });
});

searchInput.addEventListener("input", showPets);
ageFilter.addEventListener("change", showPets);

document.addEventListener("error", (event) => {
  if (event.target.tagName === "MODEL-VIEWER") {
    event.target.parentElement.classList.add("is-error");
  }
}, true);

const detailsModal = document.getElementById("detailsModal");
const adoptModal = document.getElementById("adoptModal");
const modalViewer = document.getElementById("modalViewer");
const adoptBtn = document.getElementById("adoptBtn");

function openDetails(id) {
  selectedPet = pets.find((pet) => pet.id === id);

  document.getElementById("modalType").textContent = selectedPet.type;
  document.getElementById("modalName").textContent = selectedPet.name;
  document.getElementById("modalInfo").textContent = `${selectedPet.breed} · ${selectedPet.age} yosh · ${selectedPet.gender}`;
  document.getElementById("modalDesc").textContent = selectedPet.description;

  modalViewer.parentElement.classList.remove("is-error");
  modalViewer.src = selectedPet.model;

  adoptBtn.disabled = !selectedPet.available;
  adoptBtn.textContent = selectedPet.available ? "Asrab olish" : "Allaqachon asrab olingan";

  detailsModal.classList.add("open");
}

const adoptForm = document.getElementById("adoptForm");
const formError = document.getElementById("formError");
const successBox = document.getElementById("successBox");

adoptBtn.addEventListener("click", () => {
  detailsModal.classList.remove("open");
  adoptForm.reset();
  formError.textContent = "";
  adoptForm.hidden = false;
  successBox.hidden = true;
  document.getElementById("adoptPet").textContent = selectedPet.name;
  adoptModal.classList.add("open");
});

adoptForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const name = document.getElementById("fName").value.trim();
  const phone = document.getElementById("fPhone").value.trim();
  const email = document.getElementById("fEmail").value.trim();

  if (name === "" || phone === "" || email === "") {
    formError.textContent = "Iltimos, ism, telefon va emailni to'ldiring.";
    return;
  }

  if (!email.includes("@")) {
    formError.textContent = "Email manzili noto'g'ri.";
    return;
  }

  adoptForm.hidden = true;
  successBox.hidden = false;
});

function closeModals() {
  detailsModal.classList.remove("open");
  adoptModal.classList.remove("open");
}

document.querySelectorAll(".close-btn").forEach((button) => {
  button.addEventListener("click", closeModals);
});

document.querySelectorAll(".modal").forEach((modal) => {
  modal.addEventListener("click", (event) => {
    if (event.target === modal) closeModals();
  });
});

const nav = document.getElementById("nav");

document.getElementById("menuBtn").addEventListener("click", () => {
  nav.classList.toggle("open");
});

nav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => nav.classList.remove("open"));
});

showPets();