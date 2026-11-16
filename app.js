// ROOTS & SEASONS - Main Application Controller (app.js)
// Connects the public website with the farmData store and handles all interactive UI components.

document.addEventListener("DOMContentLoaded", () => {
  initApp();
});

let currentZoneIndex = 0;

function initApp() {
  renderLiveStats();
  renderFarmFacts();
  renderZoneHighlights();
  renderCrops("all");
  renderJournal("daily");
  renderAnimals();
  renderGallery("all");
  renderThisDay();
  renderTimeline();
  setupNavigation();
}

// 01. Render Real Database Statistics
function renderLiveStats() {
  const stats = farmStore.getStats();
  const elPhotos = document.getElementById("statPhotos");
  const elDiary = document.getElementById("statDiary");
  const elWeekly = document.getElementById("statWeekly");
  const elCrops = document.getElementById("statCrops");
  const elAnimals = document.getElementById("statAnimals");
  const elZones = document.getElementById("statZones");

  if (elPhotos) elPhotos.textContent = stats.totalPhotos;
  if (elDiary) elDiary.textContent = stats.dailyPosts;
  if (elWeekly) elWeekly.textContent = stats.weeklyHighlights;
  if (elCrops) elCrops.textContent = stats.cropVarieties;
  if (elAnimals) elAnimals.textContent = stats.animalsCount;
  if (elZones) elZones.textContent = stats.farmZones;
}

// 02. Farm Facts Strip
function renderFarmFacts() {
  const info = farmStore.getFarmInfo();
  const crops = farmStore.getCrops();
  const animals = farmStore.getAnimals();

  const factCrops = document.getElementById("factCrops");
  const factAnimals = document.getElementById("factAnimals");
  const factSeason = document.getElementById("factSeason");

  if (factCrops && crops.length > 0) {
    factCrops.textContent = `${crops[0].name.split(" ")[0]}, ${crops[1] ? crops[1].name.split(" ")[0] : "Litchi"} & more`;
  }
  if (factAnimals && animals.length > 0) {
    factAnimals.textContent = animals.map(a => a.name.split(" ")[0]).slice(0, 3).join(", ");
  }
  if (factSeason) {
    factSeason.textContent = `${info.currentSeason} · ${info.temperature}`;
  }
}

// 03. About the Farm - 7 Farm Highlights & Zone Switcher
function renderZoneHighlights() {
  const zones = farmStore.getZones();
  const container = document.getElementById("zoneTabsContainer");
  if (!container) return;

  container.innerHTML = zones.map((zone, idx) => `
    <button class="zone-pill-btn ${idx === 0 ? 'active' : ''}" onclick="selectZone(${idx})">
      ${zone.name}
    </button>
  `).join("");

  updateZoneDisplay(0);
}

function selectZone(index) {
  currentZoneIndex = index;
  const buttons = document.querySelectorAll(".zone-pill-btn");
  buttons.forEach((btn, idx) => {
    btn.classList.toggle("active", idx === index);
  });
  updateZoneDisplay(index);
}

function updateZoneDisplay(index) {
  const zones = farmStore.getZones();
  const zone = zones[index];
  if (!zone) return;

  const img = document.getElementById("zoneImage");
  const tagline = document.getElementById("zoneTagline");
  const title = document.getElementById("zoneTitle");
  const headline = document.getElementById("zoneHeadline");
  const desc = document.getElementById("zoneDesc");
  const activitiesList = document.getElementById("zoneActivities");

  if (img) img.src = zone.coverImage;
  if (tagline) tagline.textContent = zone.tagline;
  if (title) title.textContent = zone.name;
  if (headline) headline.innerHTML = `${zone.name}.<br><span style="font-size:0.7em; color:var(--green);">${zone.tagline}</span>`;
  if (desc) desc.textContent = zone.description;

  if (activitiesList) {
    activitiesList.innerHTML = zone.activities.map(act => `
      <li><span class="dot"></span> ${act}</li>
    `).join("") + (zone.crops ? `<li><span class="dot" style="background:var(--orange);"></span> Crops: ${zone.crops.join(", ")}</li>` : "");
  }
}

function openZoneModal() {
  const zones = farmStore.getZones();
  const zone = zones[currentZoneIndex];
  if (!zone) return;

  const html = `
    <div class="modal-img-lead">
      <img src="${zone.coverImage}" alt="${zone.name}">
    </div>
    <div class="mono" style="color:var(--green); margin-bottom:6px;">Zone Spotlight · Area Details</div>
    <h2 style="font-family:'Archivo Black'; font-size:26px; margin-bottom:12px;">${zone.name}</h2>
    <p style="font-size:15px; line-height:1.65; margin-bottom:18px;">${zone.description}</p>
    
    <div style="background:#fff; border:var(--line-thin); padding:16px; margin-bottom:18px;">
      <h4 style="font-family:'Archivo Black'; font-size:14px; margin-bottom:8px;">Typical Farm Rhythms:</h4>
      <ul style="list-style:disc; margin-left:20px; font-size:13.5px; line-height:1.6;">
        ${zone.activities.map(a => `<li>${a}</li>`).join("")}
      </ul>
    </div>

    ${zone.crops ? `
      <div class="mono" style="margin-bottom:6px;">Cultivated in this Area:</div>
      <div style="display:flex; flex-wrap:wrap; gap:8px; margin-bottom:16px;">
        ${zone.crops.map(c => `<span class="pill" style="border:1.5px solid #171717; padding:4px 10px; font-size:11px; font-weight:700; background:var(--yellow);">${c}</span>`).join("")}
      </div>
    ` : ""}

    <button class="button dark sm" onclick="closeGenericModal()">Close Zone Overview</button>
  `;
  showGenericModal(`Farm Zone: ${zone.name}`, html);
}

// 04. What We Grow - Filterable Crop Grid with Detail Modals
function filterCrops(category) {
  const buttons = document.querySelectorAll("#cropFilterTabs .filter-btn");
  buttons.forEach(b => {
    b.classList.toggle("active", b.textContent.toLowerCase().includes(category));
  });
  renderCrops(category);
}

function renderCrops(category) {
  const grid = document.getElementById("cropsGrid");
  if (!grid) return;

  const crops = farmStore.getCrops(category);
  grid.innerHTML = crops.map(crop => `
    <div class="crop-card">
      <div class="crop-card-img">
        <img src="${crop.image}" alt="${crop.name}">
        <span class="crop-badge-category mono">${crop.category}</span>
        <span class="crop-badge-stage mono">${crop.stage}</span>
      </div>
      <div class="crop-card-body">
        <div>
          <h3 class="crop-card-title">${crop.name}</h3>
          <div class="crop-meta-row">
            <span>Location:</span>
            <strong>${crop.farmLocation}</strong>
          </div>
          <div class="crop-meta-row">
            <span>Expected Harvest:</span>
            <strong>${crop.expectedHarvest}</strong>
          </div>
          <div class="crop-meta-row">
            <span>Planted:</span>
            <strong>${crop.plantingDate}</strong>
          </div>
        </div>

        <div class="crop-progress-bar-wrap">
          <div style="display:flex; justify-content:space-between; font-family:'Space Mono'; font-size:10px; margin-bottom:4px;">
            <span>GROWTH STAGE ${crop.stageIndex}/6</span>
            <span>${crop.progressPercent}%</span>
          </div>
          <div class="crop-progress-bar">
            <div class="crop-progress-bar-fill" style="width:${crop.progressPercent}%;"></div>
          </div>
        </div>

        <button class="button sm ghost" style="width:100%; border:var(--line-thin);" onclick="openCropModal('${crop.id}')">
          View Growth History ↗
        </button>
      </div>
    </div>
  `).join("");
}

function openCropModal(cropId) {
  const crop = farmStore.getCropById(cropId);
  if (!crop) return;

  const html = `
    <div class="modal-img-lead">
      <img src="${crop.image}" alt="${crop.name}">
    </div>
    <div class="mono" style="color:var(--green); margin-bottom:4px;">${crop.category} · ${crop.farmLocation}</div>
    <h2 style="font-family:'Archivo Black'; font-size:26px; margin-bottom:8px;">${crop.name}</h2>
    <p style="font-size:15px; line-height:1.6; margin-bottom:20px;">${crop.description}</p>
    
    <div style="background:#fff; border:var(--line); padding:16px; margin-bottom:20px; box-shadow:var(--shadow-sm);">
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; font-size:13px;">
        <div><strong>Planting Date:</strong> ${crop.plantingDate}</div>
        <div><strong>Harvest Window:</strong> ${crop.expectedHarvest}</div>
        <div><strong>Current Stage:</strong> <span style="background:var(--yellow); padding:2px 6px;">${crop.stage} (Stage ${crop.stageIndex}/6)</span></div>
        <div><strong>Last Verified:</strong> ${crop.lastUpdated}</div>
      </div>
    </div>

    <h4 style="font-family:'Archivo Black'; font-size:16px; margin-bottom:12px;">Growth &amp; Activity Log:</h4>
    <div style="display:flex; flex-direction:column; gap:10px; margin-bottom:24px;">
      ${crop.history ? crop.history.map(h => `
        <div style="border-left:3px solid var(--green); padding-left:12px; background:#fff; padding:10px 14px; border:var(--line-thin); border-left:4px solid var(--green);">
          <div class="mono" style="font-size:10px; color:var(--muted);">${h.date} · <span style="color:var(--ink);">${h.stage}</span></div>
          <p style="font-size:13.5px; margin-top:4px;">${h.note}</p>
        </div>
      `).join("") : "<p>No entries yet.</p>"}
    </div>

    <button class="button dark sm" onclick="closeGenericModal()">Close Crop Details</button>
  `;
  showGenericModal(`Crop Profile: ${crop.name}`, html);
}

// 05. Latest Farm Journal (Daily & Weekly)
function showJournalTab(type) {
  const btnDaily = document.getElementById("btnShowDaily");
  const btnWeekly = document.getElementById("btnShowWeekly");

  if (type === "daily") {
    btnDaily.classList.add("active");
    btnWeekly.classList.remove("active");
  } else {
    btnWeekly.classList.add("active");
    btnDaily.classList.remove("active");
  }
  renderJournal(type);
}

function renderJournal(type) {
  const grid = document.getElementById("journalGrid");
  if (!grid) return;

  if (type === "daily") {
    const posts = farmStore.getDailyPosts();
    grid.innerHTML = posts.map(post => `
      <article class="journal-card ${post.isTextOnly ? 'text-only-entry' : ''}">
        ${post.image ? `
          <div class="journal-card-thumb">
            <img src="${post.image}" alt="${post.title}">
          </div>
        ` : `
          <div class="mono" style="background:var(--yellow); display:inline-block; align-self:flex-start; padding:2px 8px; border:1px solid #000; margin-bottom:8px;">
            📝 Daily Text Entry
          </div>
        `}
        <div class="mono journal-card-date">${post.date} · ${post.category}</div>
        <h3>${post.title}</h3>
        <p>${post.description}</p>
        <div class="journal-card-foot">
          <span class="mono" style="font-size:10px;">DAILY RECORD</span>
          <button class="button sm ghost" style="padding:0 8px;" onclick="openPostModal('${post.id}')">Read ↗</button>
        </div>
      </article>
    `).join("");
  } else {
    const highlights = farmStore.getWeeklyHighlights();
    grid.innerHTML = highlights.map(w => `
      <article class="journal-card" style="background:#e8efdc;">
        ${w.images && w.images[0] ? `
          <div class="journal-card-thumb">
            <img src="${w.images[0]}" alt="${w.title}">
          </div>
        ` : ""}
        <div class="mono journal-card-date">${w.dateRange} · ${w.category}</div>
        <h3>${w.title}</h3>
        <p>${w.description}</p>
        <div class="journal-card-foot">
          <span class="mono" style="font-size:10px;">WEEKLY SUMMARY</span>
          <button class="button sm ghost" style="padding:0 8px;" onclick="openWeeklyModal('${w.id}')">Explore ↗</button>
        </div>
      </article>
    `).join("");
  }
}

function openPostModal(postId) {
  const posts = farmStore.getDailyPosts();
  const post = posts.find(p => p.id === postId);
  if (!post) return;

  const html = `
    ${post.image ? `
      <div class="modal-img-lead">
        <img src="${post.image}" alt="${post.title}">
      </div>
    ` : ""}
    <div class="mono" style="color:var(--green); margin-bottom:4px;">${post.date} · ${post.category}</div>
    <h2 style="font-family:'Archivo Black'; font-size:24px; margin-bottom:12px;">${post.title}</h2>
    <div style="background:#fff; border:var(--line-thin); padding:20px; font-size:15.5px; line-height:1.7; margin-bottom:24px;">
      ${post.description}
    </div>
    <button class="button dark sm" onclick="closeGenericModal()">Close Journal Entry</button>
  `;
  showGenericModal(`Journal: ${post.title}`, html);
}

function openWeeklyModal(wId) {
  const highlights = farmStore.getWeeklyHighlights();
  const item = highlights.find(h => h.id === wId);
  if (!item) return;

  const html = `
    ${item.images && item.images[0] ? `
      <div class="modal-img-lead">
        <img src="${item.images[0]}" alt="${item.title}">
      </div>
    ` : ""}
    <div class="mono" style="color:var(--green); margin-bottom:4px;">${item.dateRange} · ${item.category}</div>
    <h2 style="font-family:'Archivo Black'; font-size:24px; margin-bottom:12px;">${item.title}</h2>
    <div style="background:#fff; border:var(--line-thin); padding:20px; font-size:15px; line-height:1.7; margin-bottom:24px;">
      ${item.description}
    </div>
    <button class="button dark sm" onclick="closeGenericModal()">Close Weekly Summary</button>
  `;
  showGenericModal(`Weekly Summary: ${item.title}`, html);
}

// 06. Animals & Birds Profiles
function renderAnimals() {
  const grid = document.getElementById("animalsGrid");
  if (!grid) return;

  const animals = farmStore.getAnimals();
  grid.innerHTML = animals.map(a => `
    <div class="animal-card" onclick="openAnimalModal('${a.id}')">
      <div class="animal-card-img">
        <img src="${a.coverImage}" alt="${a.name}">
      </div>
      <div class="animal-card-body">
        <div>
          <span class="mono" style="color:var(--orange); font-size:9.5px;">${a.category}</span>
          <h3>${a.name}</h3>
          <p class="animal-card-role">${a.role}</p>
        </div>
        <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px dashed #ddd; padding-top:10px; margin-top:10px;">
          <span class="mono" style="font-size:9px;">${a.introductionDate.split(" ")[0]}</span>
          <span style="font-size:13px; font-weight:700;">Profile ↗</span>
        </div>
      </div>
    </div>
  `).join("");
}

function openAnimalModal(animalId) {
  const animal = farmStore.getAnimalById(animalId);
  if (!animal) return;

  const html = `
    <div class="modal-img-lead">
      <img src="${animal.coverImage}" alt="${animal.name}">
    </div>
    <div class="mono" style="color:var(--orange); margin-bottom:4px;">${animal.category} · ${animal.role}</div>
    <h2 style="font-family:'Archivo Black'; font-size:26px; margin-bottom:10px;">${animal.name}</h2>
    <p style="font-size:15px; line-height:1.65; margin-bottom:16px;">${animal.description}</p>
    
    <div style="background:#fff; border:var(--line-thin); padding:16px; margin-bottom:20px;">
      <div class="mono" style="font-size:10px; color:var(--muted); margin-bottom:4px;">Personality &amp; Quirks:</div>
      <p style="font-size:14px; line-height:1.5;">${animal.personality}</p>
      <div style="margin-top:10px; font-size:12px; color:#555;"><strong>Timeline:</strong> ${animal.introductionDate}</div>
    </div>

    ${animal.gallery && animal.gallery.length > 1 ? `
      <div class="mono" style="margin-bottom:8px;">Additional Photo Memories:</div>
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:20px;">
        ${animal.gallery.map(img => `
          <div style="height:120px; border:var(--line-thin); overflow:hidden;">
            <img src="${img}" style="width:100%; height:100%; object-fit:cover;" alt="${animal.name}">
          </div>
        `).join("")}
      </div>
    ` : ""}

    <button class="button dark sm" onclick="closeGenericModal()">Close Profile</button>
  `;
  showGenericModal(`Animal: ${animal.name}`, html);
}

// 07. Recent Memories (Public Living Gallery)
function filterGallery(category) {
  const buttons = document.querySelectorAll("#galleryFilterTabs .filter-btn");
  buttons.forEach(b => {
    b.classList.toggle("active", b.textContent.toLowerCase().includes(category));
  });
  renderGallery(category);
}

function renderGallery(category) {
  const grid = document.getElementById("memoriesGrid");
  if (!grid) return;

  const memories = farmStore.getMemories(category);
  grid.innerHTML = memories.map(m => `
    <div class="memory-card" onclick="openMemoryModal('${m.id}')">
      <div class="memory-card-img">
        <img src="${m.imageUrl}" alt="${m.title}" loading="lazy">
      </div>
      <div class="memory-card-meta">
        <div class="mono" style="color:var(--muted); font-size:9.5px; margin-bottom:3px;">${m.date} · ${m.category}</div>
        <h4>${m.title}</h4>
        <p>${m.caption}</p>
      </div>
    </div>
  `).join("");
}

function openMemoryModal(memId) {
  const memories = farmStore.getMemories("all");
  const m = memories.find(item => item.id === memId);
  if (!m) return;

  const html = `
    <div style="max-height:480px; border:var(--line); margin-bottom:16px; overflow:hidden;">
      <img src="${m.imageUrl}" style="width:100%; height:100%; max-height:480px; object-fit:contain; background:#000; display:block;" alt="${m.title}">
    </div>
    <div class="mono" style="color:var(--green); margin-bottom:4px;">${m.date} · ${m.category}</div>
    <h2 style="font-family:'Archivo Black'; font-size:22px; margin-bottom:8px;">${m.title}</h2>
    <p style="font-size:15px; color:#333; margin-bottom:20px;">${m.caption}</p>
    <div class="mono" style="font-size:9px; color:#888; border-top:1px dashed #ccc; padding-top:8px; margin-bottom:16px;">
      IMAGE METADATA: Privacy Stripped · Original Preserved · High Definition
    </div>
    <button class="button dark sm" onclick="closeGenericModal()">Close Photo</button>
  `;
  showGenericModal(`Memory: ${m.title}`, html);
}

// 08. This Day at Our Farm
function renderThisDay() {
  const grid = document.getElementById("thisDayGrid");
  if (!grid) return;

  const records = farmStore.getOnThisDay();
  grid.innerHTML = records.map(r => `
    <div class="this-day-card">
      <span class="this-day-year-badge">${r.year} · ${r.date}</span>
      <h4>${r.title}</h4>
      <p>${r.description}</p>
      ${r.image ? `
        <div style="height:120px; border:var(--line-thin); margin-top:12px; overflow:hidden;">
          <img src="${r.image}" style="width:100%; height:100%; object-fit:cover;" alt="${r.title}">
        </div>
      ` : ""}
    </div>
  `).join("");
}

// 09. Farm Development Timeline
function renderTimeline() {
  const list = document.getElementById("timelineList");
  if (!list) return;

  const items = farmStore.getTimeline();
  list.innerHTML = items.map(item => `
    <div class="timeline-item">
      <div class="timeline-year">${item.year}</div>
      <div class="timeline-desc">
        <span class="mono" style="color:var(--green); font-size:10px;">${item.category}</span>
        <h4>${item.event}</h4>
        <p style="font-size:14px; color:#444;">${item.description}</p>
      </div>
    </div>
  `).join("");
}

// 10. Featured Season Story Reader Modal
function openStoryModal(storyId) {
  const story = farmStore.getFeaturedStory();
  if (!story) return;

  const html = `
    <div class="modal-img-lead">
      <img src="${story.coverImage}" alt="${story.title}">
    </div>
    <div class="mono" style="color:var(--green); margin-bottom:4px;">${story.season} · Published ${story.publicationDate}</div>
    <h2 style="font-family:'Archivo Black'; font-size:28px; line-height:1.1; margin-bottom:16px;">${story.title}</h2>
    <div style="background:#fff; border:var(--line-thin); padding:24px; font-size:16px; line-height:1.8; margin-bottom:24px;">
      ${story.content.replace(/\n\n/g, '<br><br>')}
    </div>
    <div style="margin-bottom:20px;">
      <div class="mono" style="margin-bottom:6px;">Related Farm Activities:</div>
      <div style="display:flex; flex-wrap:wrap; gap:8px;">
        ${story.relatedActivities.map(a => `<span class="pill" style="border:1.5px solid #171717; padding:4px 10px; font-size:10px; font-weight:700; background:var(--yellow);">${a}</span>`).join("")}
      </div>
    </div>
    <button class="button dark sm" onclick="closeGenericModal()">Close Story</button>
  `;
  showGenericModal(`Story: ${story.title}`, html);
}

// Modal Controllers
function showGenericModal(title, bodyHtml) {
  const backdrop = document.getElementById("genericModalBackdrop");
  const modalTitle = document.getElementById("modalTitle");
  const modalBody = document.getElementById("modalBody");

  if (modalTitle) modalTitle.textContent = title;
  if (modalBody) modalBody.innerHTML = bodyHtml;
  if (backdrop) backdrop.classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeGenericModal() {
  const backdrop = document.getElementById("genericModalBackdrop");
  if (backdrop) backdrop.classList.remove("active");
  document.body.style.overflow = "auto";
}

function closeModalOnBackdrop(e) {
  if (e.target.id === "genericModalBackdrop") {
    closeGenericModal();
  }
}

// Mobile Drawer Setup
function setupNavigation() {
  const burgerBtn = document.getElementById("burgerBtn");
  const closeDrawerBtn = document.getElementById("closeDrawerBtn");
  const mobileMenu = document.getElementById("mobileMenu");

  if (burgerBtn && mobileMenu) {
    burgerBtn.addEventListener("click", () => {
      mobileMenu.classList.add("open");
    });
  }
  if (closeDrawerBtn && mobileMenu) {
    closeDrawerBtn.addEventListener("click", () => {
      mobileMenu.classList.remove("open");
    });
  }
}

function closeDrawer() {
  const mobileMenu = document.getElementById("mobileMenu");
  if (mobileMenu) mobileMenu.classList.remove("open");
}

// Global hook exposures
window.selectZone = selectZone;
window.openZoneModal = openZoneModal;
window.filterCrops = filterCrops;
window.openCropModal = openCropModal;
window.showJournalTab = showJournalTab;
window.openPostModal = openPostModal;
window.openWeeklyModal = openWeeklyModal;
window.openAnimalModal = openAnimalModal;
window.filterGallery = filterGallery;
window.openMemoryModal = openMemoryModal;
window.openStoryModal = openStoryModal;
window.closeGenericModal = closeGenericModal;
window.closeModalOnBackdrop = closeModalOnBackdrop;
window.closeDrawer = closeDrawer;
window.initApp = initApp;
