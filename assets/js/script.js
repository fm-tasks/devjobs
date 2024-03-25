const main = document.querySelector("main > .container");
const search = document.querySelector(".search > input");
const place = document.querySelector(".location > input");
const contractStatus = document.querySelector(".check");
const searchBtn = document.querySelector(".search_bar button");
const loadMore = document.querySelector(".load_more > button");
const filterBtn = document.querySelector(".filter");
const noResultText = document.querySelector('.no_result');
const url = window.location;
const jobs = [];
const modalContainer = document.createElement("div");
const modal = document.createElement("div");
let isFullTime = false;
let values = [search?.value, place?.value, isFullTime];
let currentJobs = 0;
let totalJobs;

modalContainer.classList.add("modal_container");
modalContainer.appendChild(modal);
document.body.appendChild(modalContainer);

function fetchJobs() {
  fetch("./data.json")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok.");
      }
      return response.json();
    })
    .then((data) => {
      totalJobs = data.length;
      if (data.length > 12) {
        jobs.push(...data.slice(currentJobs, currentJobs + 12));
      }
      // url.pathname === "/devjobs/details.html" ? loadDetails() : loadJobs(jobs);
      url.pathname === "/details.html" ? loadDetails() : loadJobs(jobs);
    })
    .catch((error) => {
      console.error("There was a problem with the fetch operation: ", error);
    });
}

filterBtn?.addEventListener("click", () => {
  const place = document.querySelector(".location");
  const contract = document.querySelector(".cta");
  modalContainer.style.display = "flex";
  modal.appendChild(place);
  modal.appendChild(contract);

  if (place.classList.contains("defaultTheme")) {
    modalContainer.classList.remove("darkTheme");
    modalContainer.classList.add("defaultTheme");
  } else {
    modalContainer.classList.remove("defaultTheme");
    modalContainer.classList.add("darkTheme");
  }
});

modalContainer.addEventListener("click", (e) => {
  if (modalContainer.style.display === "flex") {
    const modal = document.querySelector(".modal_container > div");
    if (modal.contains(e.target) === false) {
      modalContainer.style.display = "none";
    }
  }
});

search?.addEventListener("change", () => setNewValues(search.value, place.value, isFullTime));
place?.addEventListener("change", () => setNewValues(search.value, place.value, isFullTime));
search?.closest(".search").addEventListener("click", () => search.focus());
place?.closest(".location").addEventListener("click", () => place.focus());
search?.addEventListener("keyup", (e) => e.keyCode === 13 && searchBtn.click());
place?.addEventListener("keyup", (e) => e.keyCode === 13 && searchBtn.click());
contractStatus?.addEventListener("click", () => {
  contractStatus.classList.toggle("check-selected");
  isFullTime ? (isFullTime = false) : (isFullTime = true);
  setNewValues(search.value, place.value, isFullTime);
});

function setNewValues(searchValue, placeValue, isFullTime) {
  values[0] = searchValue.toLowerCase();
  values[1] = placeValue.toLowerCase();
  values[2] = isFullTime;
}

searchBtn?.addEventListener("click", () => {
  modalContainer.style.display = "none";

  let filteredJobs = jobs;
  if (values[0] !== "") {
    filteredJobs = filteredJobs.filter((job) => job.position.toLowerCase().includes(values[0]) || job.company.toLowerCase().includes(values[0]));
  }
  if (values[1] !== "") {
    filteredJobs = filteredJobs.filter((job) => job.location.toLowerCase().includes(values[1]));
  }
  if (values[2] === true) {
    filteredJobs = filteredJobs.filter((job) => job.contract === "Full Time");
  }
  if (values[0] === "" && values[1] === "" && values[2] === false) {
    loadJobs(jobs);
  }
  loadJobs(filteredJobs);
});

function loadJobs(jobs) {
  if (jobs.length === 0) {
    noResultText.style.display = 'flex';
  }

  if (jobs.length < 12 || jobs.length === totalJobs) {
    loadMore.style.display = "none";
  }

  main.innerHTML = "";
  jobs.map((job) => {
    let card = `
        <div class="card">
            <div class="logo" style="background: ${job.logoBackground}">
                <img src="${job.logo}" alt="${job.company}" />
            </div>
            <div class="info">
                <div>
                    <div class="contract">
                        <span>${job.postedAt}</span>
                        <span></span>
                        <span>${job.contract}</span>
                    </div>
                    <a class="position" href="./details.html?id=${job.id}">${job.position}</a>
                    <span>${job.company}</span>
                </div>
                <h4 class="address">${job.location}</h4>
            </div>
        </div>
    `;
    main.innerHTML += card;
  });
}

function loadDetails() {
  const companyCard = document.querySelector(".company_card");
  const jobDetail = document.querySelector(".job_details");
  const applySection = document.querySelector(".apply");
  const id = new URLSearchParams(window.location.search).get("id");
  const job = jobs.filter((job) => job.id === parseInt(id))[0];

  let card = `
    <div class="container">
      <div class="company_logo" style="background: ${job.logoBackground}">
        <img src="${job.logo}" alt="${job.company}" />
      </div>
      <div class="company_info">
        <div>
          <h2>${job.company}</h2>
          <p>${job.website}</p>
        </div>
        <div>
          <button class="secondary_btn">Company Site</button>
        </div>
      </div>
    </div>
  `;

  let details = `
    <div class="container">
      <div class="detail_header">
        <div>
          <div class="contract">
            <span>${job.postedAt}</span>
            <span></span>
            <span>${job.contract}</span>
          </div>
          <p class="position">${job.position}</p>
          <h4 class="address">${job.location}</h4>
        </div>
        <button class="primary_btn">Apply Now</button>
      </div>
      <p>${job.description}</p>
      <div class="requirements">
        <h3>Requirements</h3>
        <div>
          <p>${job.requirements.content}</p>
          <ul>
            ${job.requirements.items.map((item) => `<li><p>${item}</p></li>`).join("")}
          </ul>
        </div>
      </div>
      <div class="role">
        <h3>What You Will Do</h3>
        <div>
          <p>${job.role.content}</p>
          <ol>
            ${job.role.items.map((item) => `<li><p>${item}</p></li>`).join("")}
          </ol>
        </div>
      </div>
    </div>
  `;

  let apply = `
    <div class="container">
      <div>
        <h3>${job.position}</h3>
        <span>${job.company}</span>
      </div>
      <button class="primary_btn">Apply Now</button>
    </div>
  `;

  companyCard.innerHTML = card;
  jobDetail.innerHTML = details;
  applySection.innerHTML = apply;
}

loadMore?.addEventListener("click", () => {
  currentJobs += 12;
  fetchJobs();
});

fetchJobs();
