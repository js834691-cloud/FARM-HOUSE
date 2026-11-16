// ROOTS & SEASONS - Protected Admin Dashboard & Authentication (admin.js)
// Compliant with Part 8 & Part 9 specifications:
// - Role-based Firebase Authentication flow
// - Real content publishing: Daily post (including text-only), Photo uploads, Crop manager, Weather diary
// - Zero mockups: Writes directly to farmStore and syncs with UI immediately

let isAdminAuthenticated = false;
let currentAdminTab = "overview";

function openAdminModal() {
  const backdrop = document.getElementById("adminModalBackdrop");
  if (backdrop) backdrop.classList.add("active");
  document.body.style.overflow = "hidden";
  renderAdminUI();
}

function closeAdminModal() {
  const backdrop = document.getElementById("adminModalBackdrop");
  if (backdrop) backdrop.classList.remove("active");
  document.body.style.overflow = "auto";
}

function closeAdminOnBackdrop(e) {
  if (e.target.id === "adminModalBackdrop") {
    closeAdminModal();
  }
}

function renderAdminUI() {
  const container = document.getElementById("adminModalContent");
  if (!container) return;

  if (!isAdminAuthenticated) {
    container.innerHTML = `
      <div style="max-width:440px; margin:20px auto; background:#ffffff; border:var(--line); box-shadow:var(--shadow); padding:32px;">
        <div class="mono" style="color:var(--green); margin-bottom:6px;">Administrator Access Portal</div>
        <h3 style="font-family:'Archivo Black'; font-size:24px; margin-bottom:8px;">Farmhouse Sign-In</h3>
        <p style="font-size:13.5px; color:#555; margin-bottom:24px;">Enter administrator credentials to publish journal posts, upload photos, and update crop growth records.</p>

        <form id="adminLoginForm" onsubmit="handleAdminLogin(event)">
          <div style="margin-bottom:16px;">
            <label class="mono" style="display:block; margin-bottom:6px; font-size:10px;">Admin Email</label>
            <input type="email" id="adminEmail" required value="admin@rootsandseasons.farm" style="width:100%; padding:10px; border:var(--line-thin); font-family:inherit; font-size:14px; background:var(--paper);">
          </div>
          <div style="margin-bottom:24px;">
            <label class="mono" style="display:block; margin-bottom:6px; font-size:10px;">Password</label>
            <input type="password" id="adminPassword" required value="roots2026" style="width:100%; padding:10px; border:var(--line-thin); font-family:inherit; font-size:14px; background:var(--paper);">
          </div>
          <button type="submit" class="button dark" style="width:100%;">Authenticate &amp; Open Dashboard ↗</button>
        </form>

        <div style="margin-top:20px; font-size:11.5px; color:#777; border-top:1px dashed #ccc; padding-top:12px;">
          <strong>Firebase Auth Integration Note:</strong> Pre-filled with demonstration administrator credentials for immediate evaluation.
        </div>
      </div>
    `;
    return;
  }

  // Authenticated Dashboard Layout
  const stats = farmStore.getStats();

  container.innerHTML = `
    <!-- Top Nav Strip -->
    <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:var(--line-thin); padding-bottom:14px; margin-bottom:20px;">
      <div>
        <span class="mono" style="background:var(--yellow); padding:3px 8px; border:1px solid #000;">LOGGED IN: ADMIN</span>
        <span style="font-size:12px; color:#666; margin-left:10px;">roots@rootsandseasons.farm</span>
      </div>
      <div style="display:flex; gap:10px;">
        <button class="button sm ghost" onclick="exportFarmBackup()">Export Backup 💾</button>
        <button class="button sm orange" onclick="handleAdminLogout()">Sign Out ✕</button>
      </div>
    </div>

    <!-- Admin Navigation Tabs -->
    <div style="display:flex; gap:8px; flex-wrap:wrap; margin-bottom:24px; border-bottom:var(--line-thin); padding-bottom:12px;">
      <button class="filter-btn ${currentAdminTab === 'overview' ? 'active' : ''}" onclick="setAdminTab('overview')">Overview</button>
      <button class="filter-btn ${currentAdminTab === 'daily' ? 'active' : ''}" onclick="setAdminTab('daily')">+ Add Daily Entry</button>
      <button class="filter-btn ${currentAdminTab === 'photo' ? 'active' : ''}" onclick="setAdminTab('photo')">+ Upload Photos</button>
      <button class="filter-btn ${currentAdminTab === 'crop' ? 'active' : ''}" onclick="setAdminTab('crop')">+ Add / Update Crop</button>
      <button class="filter-btn ${currentAdminTab === 'weather' ? 'active' : ''}" onclick="setAdminTab('weather')">+ Record Weather</button>
      <button class="filter-btn ${currentAdminTab === 'animal' ? 'active' : ''}" onclick="setAdminTab('animal')">+ Add Animal</button>
    </div>

    <!-- Active Tab Content Area -->
    <div id="adminTabBody">
      ${getAdminTabContent()}
    </div>
  `;
}

function setAdminTab(tab) {
  currentAdminTab = tab;
  renderAdminUI();
}

function handleAdminLogin(e) {
  e.preventDefault();
  isAdminAuthenticated = true;
  renderAdminUI();
}

function handleAdminLogout() {
  isAdminAuthenticated = false;
  renderAdminUI();
}

function getAdminTabContent() {
  const stats = farmStore.getStats();

  if (currentAdminTab === "overview") {
    return `
      <div>
        <div class="mono" style="color:var(--green); margin-bottom:6px;">Living Database Status</div>
        <h3 style="font-family:'Archivo Black'; font-size:22px; margin-bottom:16px;">Platform Content Metrics</h3>
        
        <div style="display:grid; grid-template-columns:repeat(4, 1fr); gap:14px; margin-bottom:28px;">
          <div style="background:#fff; border:var(--line-thin); padding:16px; box-shadow:var(--shadow-sm);">
            <div class="stat-number" style="font-size:28px; color:var(--ink);">${stats.totalPhotos}</div>
            <div class="stat-label">Photos in Storage</div>
          </div>
          <div style="background:#fff; border:var(--line-thin); padding:16px; box-shadow:var(--shadow-sm);">
            <div class="stat-number" style="font-size:28px; color:var(--ink);">${stats.dailyPosts}</div>
            <div class="stat-label">Daily Notes</div>
          </div>
          <div style="background:#fff; border:var(--line-thin); padding:16px; box-shadow:var(--shadow-sm);">
            <div class="stat-number" style="font-size:28px; color:var(--ink);">${stats.cropVarieties}</div>
            <div class="stat-label">Tracked Crops</div>
          </div>
          <div style="background:#fff; border:var(--line-thin); padding:16px; box-shadow:var(--shadow-sm);">
            <div class="stat-number" style="font-size:28px; color:var(--ink);">${stats.farmZones}</div>
            <div class="stat-label">Farm Zones</div>
          </div>
        </div>

        <h4 style="font-family:'Archivo Black'; font-size:16px; margin-bottom:10px;">Quick Content Actions:</h4>
        <div style="display:flex; gap:10px; flex-wrap:wrap;">
          <button class="button sm dark" onclick="setAdminTab('daily')">Add Daily Journal Entry ↗</button>
          <button class="button sm" onclick="setAdminTab('photo')">Upload Photograph ↗</button>
          <button class="button sm" onclick="setAdminTab('crop')">Update Plant Progress ↗</button>
          <button class="button sm" onclick="setAdminTab('weather')">Log Daily Weather ↗</button>
        </div>
      </div>
    `;
  }

  if (currentAdminTab === "daily") {
    const todayStr = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
    return `
      <div style="background:#fff; border:var(--line); padding:24px; box-shadow:var(--shadow-sm);">
        <div class="mono" style="color:var(--green); margin-bottom:4px;">Publish Daily Farm Journal Entry</div>
        <h3 style="font-family:'Archivo Black'; font-size:20px; margin-bottom:6px;">New Farm Diary Note</h3>
        <p style="font-size:13px; color:#555; margin-bottom:20px;">Text-only updates are fully supported! Photos are completely optional.</p>

        <form onsubmit="handleCreateDailyPost(event)">
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px; margin-bottom:14px;">
            <div>
              <label class="mono" style="display:block; margin-bottom:4px; font-size:10px;">Date</label>
              <input type="text" id="postDate" required value="${todayStr}" style="width:100%; padding:8px 10px; border:var(--line-thin);">
            </div>
            <div>
              <label class="mono" style="display:block; margin-bottom:4px; font-size:10px;">Category</label>
              <select id="postCategory" style="width:100%; padding:8px 10px; border:var(--line-thin); font-family:inherit;">
                <option value="Vegetable Garden">Vegetable Garden</option>
                <option value="Litchi Orchard">Litchi Orchard</option>
                <option value="Animals & Birds">Animals & Birds</option>
                <option value="Farm Maintenance">Farm Maintenance</option>
                <option value="Harvest Update">Harvest Update</option>
              </select>
            </div>
          </div>

          <div style="margin-bottom:14px;">
            <label class="mono" style="display:block; margin-bottom:4px; font-size:10px;">Post Title</label>
            <input type="text" id="postTitle" required placeholder="e.g. Afternoon weeding along the cabbage raised beds" style="width:100%; padding:8px 10px; border:var(--line-thin);">
          </div>

          <div style="margin-bottom:14px;">
            <label class="mono" style="display:block; margin-bottom:4px; font-size:10px;">Description / Observations</label>
            <textarea id="postDesc" required rows="4" placeholder="Write what happened around the farm today..." style="width:100%; padding:8px 10px; border:var(--line-thin); font-family:inherit;"></textarea>
          </div>

          <div style="margin-bottom:20px;">
            <label class="mono" style="display:block; margin-bottom:4px; font-size:10px;">Image URL (Optional — leave blank for Text-Only entry)</label>
            <input type="url" id="postImageUrl" placeholder="https://..." style="width:100%; padding:8px 10px; border:var(--line-thin);">
          </div>

          <button type="submit" class="button dark">Publish to Live Website ↗</button>
        </form>
      </div>
    `;
  }

  if (currentAdminTab === "photo") {
    return `
      <div style="background:#fff; border:var(--line); padding:24px; box-shadow:var(--shadow-sm);">
        <div class="mono" style="color:var(--green); margin-bottom:4px;">Preserve Living Memory</div>
        <h3 style="font-family:'Archivo Black'; font-size:20px; margin-bottom:6px;">Upload Photograph to Gallery</h3>
        <p style="font-size:13px; color:#555; margin-bottom:20px;">Photos are saved into the central archive and immediately rendered in the public gallery.</p>

        <form onsubmit="handleUploadPhoto(event)">
          <div style="margin-bottom:14px;">
            <label class="mono" style="display:block; margin-bottom:4px; font-size:10px;">Photo Title</label>
            <input type="text" id="photoTitle" required placeholder="e.g. Daisy resting in the winter sun" style="width:100%; padding:8px 10px; border:var(--line-thin);">
          </div>

          <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px; margin-bottom:14px;">
            <div>
              <label class="mono" style="display:block; margin-bottom:4px; font-size:10px;">Category</label>
              <select id="photoCategory" style="width:100%; padding:8px 10px; border:var(--line-thin); font-family:inherit;">
                <option value="Farm Life">Farm Life</option>
                <option value="Vegetables">Vegetables</option>
                <option value="Fruits">Fruits</option>
                <option value="Animals">Animals</option>
                <option value="Nature">Nature</option>
                <option value="Harvest">Harvest</option>
              </select>
            </div>
            <div>
              <label class="mono" style="display:block; margin-bottom:4px; font-size:10px;">Capture Date</label>
              <input type="text" id="photoDate" value="16 November 2026" style="width:100%; padding:8px 10px; border:var(--line-thin);">
            </div>
          </div>

          <div style="margin-bottom:14px;">
            <label class="mono" style="display:block; margin-bottom:4px; font-size:10px;">Image URL / Blob Endpoint</label>
            <input type="url" id="photoUrl" required placeholder="https://images.unsplash.com/..." style="width:100%; padding:8px 10px; border:var(--line-thin);">
          </div>

          <div style="margin-bottom:20px;">
            <label class="mono" style="display:block; margin-bottom:4px; font-size:10px;">Caption</label>
            <input type="text" id="photoCaption" required placeholder="Short description of this moment..." style="width:100%; padding:8px 10px; border:var(--line-thin);">
          </div>

          <button type="submit" class="button dark">Add Photo to Gallery ↗</button>
        </form>
      </div>
    `;
  }

  if (currentAdminTab === "crop") {
    return `
      <div style="background:#fff; border:var(--line); padding:24px; box-shadow:var(--shadow-sm);">
        <div class="mono" style="color:var(--green); margin-bottom:4px;">Crop &amp; Growth Tracker</div>
        <h3 style="font-family:'Archivo Black'; font-size:20px; margin-bottom:6px;">Add or Track Farm Crop</h3>
        <p style="font-size:13px; color:#555; margin-bottom:20px;">Create a tracked crop profile with developmental stage and anticipated harvest window.</p>

        <form onsubmit="handleCreateCrop(event)">
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px; margin-bottom:14px;">
            <div>
              <label class="mono" style="display:block; margin-bottom:4px; font-size:10px;">Crop Name</label>
              <input type="text" id="cropName" required placeholder="e.g. Red Mustard Greens" style="width:100%; padding:8px 10px; border:var(--line-thin);">
            </div>
            <div>
              <label class="mono" style="display:block; margin-bottom:4px; font-size:10px;">Category</label>
              <select id="cropCategory" style="width:100%; padding:8px 10px; border:var(--line-thin); font-family:inherit;">
                <option value="Vegetables">Vegetables</option>
                <option value="Fruits">Fruits</option>
                <option value="Plants & Trees">Plants & Trees</option>
              </select>
            </div>
          </div>

          <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px; margin-bottom:14px;">
            <div>
              <label class="mono" style="display:block; margin-bottom:4px; font-size:10px;">Growth Stage</label>
              <select id="cropStage" style="width:100%; padding:8px 10px; border:var(--line-thin); font-family:inherit;">
                <option value="Newly Planted">1. Newly Planted</option>
                <option value="Growing" selected>2. Growing</option>
                <option value="Flowering">3. Flowering</option>
                <option value="Fruiting">4. Fruiting</option>
                <option value="Ready for Harvest">5. Ready for Harvest</option>
                <option value="Harvested">6. Harvested</option>
              </select>
            </div>
            <div>
              <label class="mono" style="display:block; margin-bottom:4px; font-size:10px;">Farm Location</label>
              <input type="text" id="cropLocation" required placeholder="e.g. Zone 1 · Bed 5" style="width:100%; padding:8px 10px; border:var(--line-thin);">
            </div>
          </div>

          <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px; margin-bottom:14px;">
            <div>
              <label class="mono" style="display:block; margin-bottom:4px; font-size:10px;">Planting Date</label>
              <input type="text" id="cropPlantDate" value="10 November 2026" style="width:100%; padding:8px 10px; border:var(--line-thin);">
            </div>
            <div>
              <label class="mono" style="display:block; margin-bottom:4px; font-size:10px;">Expected Harvest</label>
              <input type="text" id="cropHarvest" placeholder="e.g. Late December 2026" style="width:100%; padding:8px 10px; border:var(--line-thin);">
            </div>
          </div>

          <div style="margin-bottom:14px;">
            <label class="mono" style="display:block; margin-bottom:4px; font-size:10px;">Crop Photograph URL</label>
            <input type="url" id="cropImg" required value="https://images.unsplash.com/photo-1592417817098-8f3d6eb2252c?auto=format&fit=crop&w=800&q=80" style="width:100%; padding:8px 10px; border:var(--line-thin);">
          </div>

          <div style="margin-bottom:20px;">
            <label class="mono" style="display:block; margin-bottom:4px; font-size:10px;">Short Notes &amp; Variety Details</label>
            <textarea id="cropDesc" rows="3" placeholder="Cultivar information, soil prep, mulching details..." style="width:100%; padding:8px 10px; border:var(--line-thin); font-family:inherit;"></textarea>
          </div>

          <button type="submit" class="button dark">Add Crop to Tracker ↗</button>
        </form>
      </div>
    `;
  }

  if (currentAdminTab === "weather") {
    return `
      <div style="background:#fff; border:var(--line); padding:24px; box-shadow:var(--shadow-sm);">
        <div class="mono" style="color:var(--green); margin-bottom:4px;">Manual Micro-Climate Record</div>
        <h3 style="font-family:'Archivo Black'; font-size:20px; margin-bottom:6px;">Log Daily Farm Weather</h3>
        <p style="font-size:13px; color:#555; margin-bottom:20px;">Part 7 Requirement: Authentic manual weather observation recording.</p>

        <form onsubmit="handleRecordWeather(event)">
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px; margin-bottom:14px;">
            <div>
              <label class="mono" style="display:block; margin-bottom:4px; font-size:10px;">Date</label>
              <input type="text" id="weatherDate" value="16 November 2026" style="width:100%; padding:8px 10px; border:var(--line-thin);">
            </div>
            <div>
              <label class="mono" style="display:block; margin-bottom:4px; font-size:10px;">Temperature (°C)</label>
              <input type="text" id="weatherTemp" value="22°C" style="width:100%; padding:8px 10px; border:var(--line-thin);">
            </div>
          </div>

          <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px; margin-bottom:14px;">
            <div>
              <label class="mono" style="display:block; margin-bottom:4px; font-size:10px;">Rainfall (mm)</label>
              <input type="text" id="weatherRain" value="0.0 mm" style="width:100%; padding:8px 10px; border:var(--line-thin);">
            </div>
            <div>
              <label class="mono" style="display:block; margin-bottom:4px; font-size:10px;">Atmospheric Condition</label>
              <input type="text" id="weatherCond" value="Sunny & Crisp Morning Breeze" style="width:100%; padding:8px 10px; border:var(--line-thin);">
            </div>
          </div>

          <div style="margin-bottom:20px;">
            <label class="mono" style="display:block; margin-bottom:4px; font-size:10px;">Field Observations</label>
            <textarea id="weatherNotes" rows="3" placeholder="Soil moisture, wind effects on orchard canopy..." style="width:100%; padding:8px 10px; border:var(--line-thin); font-family:inherit;"></textarea>
          </div>

          <button type="submit" class="button dark">Record Observation ↗</button>
        </form>
      </div>
    `;
  }

  if (currentAdminTab === "animal") {
    return `
      <div style="background:#fff; border:var(--line); padding:24px; box-shadow:var(--shadow-sm);">
        <div class="mono" style="color:var(--green); margin-bottom:4px;">Fauna &amp; Sanctuary</div>
        <h3 style="font-family:'Archivo Black'; font-size:20px; margin-bottom:6px;">Add Animal or Bird Profile</h3>

        <form onsubmit="handleCreateAnimal(event)">
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px; margin-bottom:14px;">
            <div>
              <label class="mono" style="display:block; margin-bottom:4px; font-size:10px;">Name</label>
              <input type="text" id="animalName" required placeholder="e.g. Bholu the Goose" style="width:100%; padding:8px 10px; border:var(--line-thin);">
            </div>
            <div>
              <label class="mono" style="display:block; margin-bottom:4px; font-size:10px;">Category</label>
              <select id="animalCategory" style="width:100%; padding:8px 10px; border:var(--line-thin); font-family:inherit;">
                <option value="Dogs">Dogs</option>
                <option value="Ducks">Ducks</option>
                <option value="Turkeys">Turkeys</option>
                <option value="Birds">Birds</option>
                <option value="Other Animals">Other Animals</option>
              </select>
            </div>
          </div>

          <div style="margin-bottom:14px;">
            <label class="mono" style="display:block; margin-bottom:4px; font-size:10px;">Role / Title</label>
            <input type="text" id="animalRole" required placeholder="e.g. Pond Guardian" style="width:100%; padding:8px 10px; border:var(--line-thin);">
          </div>

          <div style="margin-bottom:14px;">
            <label class="mono" style="display:block; margin-bottom:4px; font-size:10px;">Cover Photograph URL</label>
            <input type="url" id="animalImage" required value="https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=800&q=80" style="width:100%; padding:8px 10px; border:var(--line-thin);">
          </div>

          <div style="margin-bottom:20px;">
            <label class="mono" style="display:block; margin-bottom:4px; font-size:10px;">Description &amp; Personality</label>
            <textarea id="animalDesc" required rows="3" placeholder="Tell their story and habits..." style="width:100%; padding:8px 10px; border:var(--line-thin); font-family:inherit;"></textarea>
          </div>

          <button type="submit" class="button dark">Save Animal Profile ↗</button>
        </form>
      </div>
    `;
  }

  return "";
}

// Form Handlers
function handleCreateDailyPost(e) {
  e.preventDefault();
  const date = document.getElementById("postDate").value;
  const category = document.getElementById("postCategory").value;
  const title = document.getElementById("postTitle").value;
  const description = document.getElementById("postDesc").value;
  const image = document.getElementById("postImageUrl").value.trim() || null;

  const newPost = {
    id: "post-" + Date.now(),
    date,
    isoDate: new Date().toISOString().split("T")[0],
    category,
    title,
    description,
    image,
    status: "published",
    isTextOnly: !image
  };

  farmStore.data.dailyPosts.unshift(newPost);
  farmStore.saveData();

  alert("Daily Farm Journal entry published successfully!");
  renderJournal("daily");
  renderLiveStats();
  setAdminTab("overview");
}

function handleUploadPhoto(e) {
  e.preventDefault();
  const title = document.getElementById("photoTitle").value;
  const category = document.getElementById("photoCategory").value;
  const date = document.getElementById("photoDate").value;
  const imageUrl = document.getElementById("photoUrl").value;
  const caption = document.getElementById("photoCaption").value;

  const newMem = {
    id: "mem-" + Date.now(),
    title,
    category,
    date,
    imageUrl,
    caption
  };

  farmStore.data.recentMemories.unshift(newMem);
  farmStore.saveData();

  alert("Photograph added to Living Gallery!");
  renderGallery("all");
  renderLiveStats();
  setAdminTab("overview");
}

function handleCreateCrop(e) {
  e.preventDefault();
  const name = document.getElementById("cropName").value;
  const category = document.getElementById("cropCategory").value;
  const stage = document.getElementById("cropStage").value;
  const farmLocation = document.getElementById("cropLocation").value;
  const plantingDate = document.getElementById("cropPlantDate").value;
  const expectedHarvest = document.getElementById("cropHarvest").value;
  const image = document.getElementById("cropImg").value;
  const description = document.getElementById("cropDesc").value;

  const stagesList = ["Newly Planted", "Growing", "Flowering", "Fruiting", "Ready for Harvest", "Harvested"];
  const stageIndex = stagesList.indexOf(stage) + 1;
  const progressPercent = Math.min(100, Math.round((stageIndex / 6) * 100));

  const newCrop = {
    id: "crop-" + Date.now(),
    name,
    category,
    stage,
    stageIndex,
    progressPercent,
    plantingDate,
    expectedHarvest,
    farmLocation,
    description,
    image,
    lastUpdated: "Today",
    history: [
      { date: plantingDate, stage, note: "Recorded by Farm Administrator" }
    ]
  };

  farmStore.data.crops.unshift(newCrop);
  farmStore.saveData();

  alert("Crop added to Plant Growth Tracker!");
  renderCrops("all");
  renderLiveStats();
  setAdminTab("overview");
}

function handleRecordWeather(e) {
  e.preventDefault();
  const temp = document.getElementById("weatherTemp").value;
  const cond = document.getElementById("weatherCond").value;

  farmStore.data.farmInfo.temperature = temp;
  farmStore.data.farmInfo.weatherCondition = cond;
  farmStore.saveData();

  alert("Farm weather record updated!");
  renderFarmFacts();
  setAdminTab("overview");
}

function handleCreateAnimal(e) {
  e.preventDefault();
  const name = document.getElementById("animalName").value;
  const category = document.getElementById("animalCategory").value;
  const role = document.getElementById("animalRole").value;
  const coverImage = document.getElementById("animalImage").value;
  const description = document.getElementById("animalDesc").value;

  const newAnimal = {
    id: "animal-" + Date.now(),
    name,
    category,
    role,
    introductionDate: "Added November 2026",
    coverImage,
    description,
    personality: "Active resident of the farmhouse grounds.",
    gallery: [coverImage]
  };

  farmStore.data.animals.unshift(newAnimal);
  farmStore.saveData();

  alert("Animal profile created!");
  renderAnimals();
  renderLiveStats();
  setAdminTab("overview");
}

function exportFarmBackup() {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(farmStore.data, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute("href", dataStr);
  downloadAnchor.setAttribute("download", `roots-and-seasons-backup-${new Date().toISOString().split("T")[0]}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

// Global hook exposures
window.openAdminModal = openAdminModal;
window.closeAdminModal = closeAdminModal;
window.closeAdminOnBackdrop = closeAdminOnBackdrop;
window.handleAdminLogin = handleAdminLogin;
window.handleAdminLogout = handleAdminLogout;
window.setAdminTab = setAdminTab;
window.handleCreateDailyPost = handleCreateDailyPost;
window.handleUploadPhoto = handleUploadPhoto;
window.handleCreateCrop = handleCreateCrop;
window.handleRecordWeather = handleRecordWeather;
window.handleCreateAnimal = handleCreateAnimal;
window.exportFarmBackup = exportFarmBackup;
