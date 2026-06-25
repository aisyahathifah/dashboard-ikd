const charts = {};

let rawData = [];
let filteredData = [];

Papa.parse("dataset_ikd_clean.csv", {
  download: true,
  header: true,
  skipEmptyLines: true,

  complete: function(results) {

    rawData = results.data;
    filteredData = [...rawData];

    initFilters();
    updateDashboard();

    document.getElementById("loadingOverlay").style.display = "none";
  }
});

function initFilters() {

  document.getElementById("filterGender")
    .addEventListener("change", applyFilters);

  document.getElementById("filterAge")
    .addEventListener("change", applyFilters);

  document.getElementById("btnReset")
    .addEventListener("click", resetFilters);
}

function applyFilters() {

  const gender =
    document.getElementById("filterGender").value;

  const age =
    document.getElementById("filterAge").value;

  filteredData = rawData.filter(row => {

    const genderMatch =
      !gender ||
      row.jenis_kelamin === gender;

    const ageMatch =
      !age ||
      row.usia === age;

    return genderMatch && ageMatch;
  });

  updateDashboard();
}

function resetFilters() {

    document.getElementById("filterGender").value = "";
    document.getElementById("filterAge").value = "";

    filteredData = [...rawData];

    updateDashboard();
}

function updateKPIs() {

  const total = filteredData.length;

  const punya =
    filteredData.filter(
      x => x.status_ikd === "Ya"
    ).length;

  const belum =
    filteredData.filter(
      x => x.status_ikd === "Belum"
    ).length;

  const aktif =
    filteredData.filter(
      x => x.status_aktif === "Sudah"
    ).length;

  document.getElementById("kv-total").textContent = total;

  document.getElementById("kv-punya").textContent = punya;

  document.getElementById("kv-belum").textContent = belum;

  document.getElementById("kv-aktif").textContent = aktif;

  document.getElementById("sidebar-total").textContent = total;
}

function renderGenderChart() {

  const counts = {};

  filteredData.forEach(row => {

    counts[row.jenis_kelamin] =
      (counts[row.jenis_kelamin] || 0) + 1;
  });

  const ctx =
    document.getElementById("chartGender");

  if(charts.gender)
    charts.gender.destroy();

  charts.gender = new Chart(ctx, {

    type: "doughnut",

    data: {
      labels: Object.keys(counts),
      datasets: [{
        data: Object.values(counts)
      }]
    }
  });
}

function renderUsiaChart() {

  const counts = {};

  filteredData.forEach(row => {

    counts[row.usia] =
      (counts[row.usia] || 0) + 1;
  });

  const ctx =
    document.getElementById("chartUsia");

  if(charts.usia)
    charts.usia.destroy();

  charts.usia = new Chart(ctx, {

    type: "bar",

    data: {
      labels: Object.keys(counts),
      datasets: [{
        data: Object.values(counts)
      }]
    }
  });
}

function renderKepemilikanChart() {

  const counts = {};

  filteredData.forEach(row => {

    const status = row.status_ikd || "Tidak Diketahui";

    counts[status] =
      (counts[status] || 0) + 1;
  });

  const ctx =
    document.getElementById("chartKepemilikan");

  if(charts.kepemilikan)
    charts.kepemilikan.destroy();

  charts.kepemilikan = new Chart(ctx, {

    type: "doughnut",

    data: {
      labels: Object.keys(counts),
      datasets: [{
        data: Object.values(counts)
      }]
    }
  });
}

function renderStatusAktifChart() {

  const counts = {};

  filteredData.forEach(row => {

    const status =
      row.status_aktif || "Tidak Ada";

    counts[status] =
      (counts[status] || 0) + 1;
  });

  const ctx =
    document.getElementById("chartStatusAktif");

  if(charts.statusAktif)
    charts.statusAktif.destroy();

  charts.statusAktif = new Chart(ctx, {

    type: "doughnut",

    data: {
      labels: Object.keys(counts),
      datasets: [{
        data: Object.values(counts)
      }]
    }
  });
}

function renderPekerjaanChart() {

  const counts = {};

  filteredData.forEach(row => {

    const pekerjaan =
      row.pekerjaan || "Lainnya";

    counts[pekerjaan] =
      (counts[pekerjaan] || 0) + 1;
  });

  const ctx =
    document.getElementById("chartPekerjaan");

  if(charts.pekerjaan)
    charts.pekerjaan.destroy();

  charts.pekerjaan = new Chart(ctx, {

    type: "bar",

    data: {
      labels: Object.keys(counts),
      datasets: [{
        data: Object.values(counts)
      }]
    },

    options: {
      indexAxis: 'y'
    }
  });
}

function renderFrekuensiChart() {

  const freqMap = {
    "1.0": "Sangat Sering",
    "2.0": "Sering",
    "3.0": "Biasa",
    "4.0": "Jarang",
    "5.0": "Tidak Pernah"
  };

  const counts = {
    "Sangat Sering": 0,
    "Sering": 0,
    "Biasa": 0,
    "Jarang": 0,
    "Tidak Pernah": 0
  };

  filteredData.forEach(row => {

    const value =
      String(row.frekuensi_penggunaan).trim();

    if (!value) return;

    const label = freqMap[value];

    if (label) {
      counts[label]++;
    }
  });

  const ctx =
    document.getElementById("chartFrekuensi");

  if (charts.frekuensi)
    charts.frekuensi.destroy();

  charts.frekuensi = new Chart(ctx, {

    type: "bar",

    data: {
      labels: Object.keys(counts),
      datasets: [{
        label: "Jumlah Responden",
        data: Object.values(counts)
      }]
    },

    options: {
      responsive: true,
      maintainAspectRatio: false
    }
  });
}

function renderPenggunaanChart() {

  const counts = {};

  filteredData.forEach(row => {

    if(!row.penggunaan_ikd) return;

    row.penggunaan_ikd
      .split(",")

      .forEach(item => {

        const key = item.trim();

        counts[key] =
          (counts[key] || 0) + 1;
      });
  });

  const ctx =
    document.getElementById("chartPenggunaan");

  if(charts.penggunaan)
    charts.penggunaan.destroy();

  charts.penggunaan = new Chart(ctx, {

    type: "bar",

    data: {
      labels: Object.keys(counts),
      datasets: [{
        data: Object.values(counts)
      }]
    },

    options: {
      indexAxis: 'y'
    }
  });
}

function renderPengetahuanChart() {

  const counts = {};

  filteredData.forEach(row => {

    const key =
      row.tingkat_pengetahuan ||
      "Tidak Ada";

    counts[key] =
      (counts[key] || 0) + 1;
  });

  const ctx =
    document.getElementById("chartPengetahuan");

  if(charts.pengetahuan)
    charts.pengetahuan.destroy();

  charts.pengetahuan = new Chart(ctx, {

    type: "doughnut",

    data: {
      labels: Object.keys(counts),
      datasets: [{
        data: Object.values(counts)
      }]
    }
  });
}

function renderSumberInfoChart() {

  const counts = {};

  filteredData.forEach(row => {

    if(!row.sumber_info) return;

    row.sumber_info
      .split(",")

      .forEach(item => {

        const key = item.trim();

        counts[key] =
          (counts[key] || 0) + 1;
      });
  });

  const ctx =
    document.getElementById("chartSumberInfo");

  if(charts.sumberInfo)
    charts.sumberInfo.destroy();

  charts.sumberInfo = new Chart(ctx, {

    type: "bar",

    data: {
      labels: Object.keys(counts),
      datasets: [{
        data: Object.values(counts)
      }]
    },

    options: {
      indexAxis: 'y'
    }
  });
}

function generateInsights() {

  const insightGrid =
    document.getElementById("insightGrid");

  if(!insightGrid) return;

  const total =
    filteredData.length;

  const punya =
    filteredData.filter(
      x => x.status_ikd === "Ya"
    ).length;

  const persen =
    ((punya / total) * 100)
      .toFixed(1);

  insightGrid.innerHTML = `

    <div class="insight-card">
      ${persen}% responden telah memiliki IKD
    </div>

    <div class="insight-card">
      Total responden yang dianalisis: ${total}
    </div>
  `;
}

function renderAdopsiPieChart() {

  const counts = {};

  filteredData.forEach(row => {

    const key = row.status_ikd || "Tidak Ada";

    counts[key] =
      (counts[key] || 0) + 1;
  });

  const ctx =
    document.getElementById("chartAdopsiPie");

  if(charts.adopsiPie)
    charts.adopsiPie.destroy();

  charts.adopsiPie = new Chart(ctx, {

    type: "pie",

    data: {
      labels: Object.keys(counts),
      datasets: [{
        data: Object.values(counts)
      }]
    }
  });
}

function renderMinatChart() {

  const counts = {};

  filteredData.forEach(row => {

    const key =
      row.minat || "Tidak Ada";

    counts[key] =
      (counts[key] || 0) + 1;
  });

  const ctx =
    document.getElementById("chartMinat");

  if(charts.minat)
    charts.minat.destroy();

  charts.minat = new Chart(ctx, {

    type: "doughnut",

    data: {
      labels: Object.keys(counts),
      datasets: [{
        data: Object.values(counts)
      }]
    }
  });
}

function renderAlasanChart() {

  const counts = {};

  filteredData.forEach(row => {

    if(!row.alasan_belum) return;

    row.alasan_belum
      .split(",")

      .forEach(item => {

        const key = item.trim();

        counts[key] =
          (counts[key] || 0) + 1;
      });
  });

  const ctx =
    document.getElementById("chartAlasan");

  if(charts.alasan)
    charts.alasan.destroy();

  charts.alasan = new Chart(ctx, {

    type: "bar",

    data: {
      labels: Object.keys(counts),
      datasets: [{
        data: Object.values(counts)
      }]
    },

    options: {
      indexAxis: 'y'
    }
  });
}

function updateSatisfactionCards() {

  const validData = filteredData.filter(
    row =>
      row.kemudahan &&
      row.manfaat &&
      row.kepercayaan &&
      row.kepuasan
  );

  if(validData.length === 0) return;

  const avg = field =>
    validData.reduce(
      (sum,row)=>sum + Number(row[field]),
      0
    ) / validData.length;

  const kemudahan = avg("kemudahan");
  const manfaat = avg("manfaat");
  const kepercayaan = avg("kepercayaan");
  const kepuasan = avg("kepuasan");

  document.getElementById("sv-kemudahan").textContent =
    kemudahan.toFixed(2);

  document.getElementById("sv-manfaat").textContent =
    manfaat.toFixed(2);

  document.getElementById("sv-kepercayaan").textContent =
    kepercayaan.toFixed(2);

  document.getElementById("sv-kepuasan").textContent =
    kepuasan.toFixed(2);

  // progress bar (skala 1-5 → persen)

  document.getElementById("sb-kemudahan")
    .style.width = `${(kemudahan/5)*100}%`;

  document.getElementById("sb-manfaat")
    .style.width = `${(manfaat/5)*100}%`;

  document.getElementById("sb-kepercayaan")
    .style.width = `${(kepercayaan/5)*100}%`;

  document.getElementById("sb-kepuasan")
    .style.width = `${(kepuasan/5)*100}%`;
}

function renderStatsTable() {

  const fields = [
    "kemudahan",
    "manfaat",
    "kepercayaan",
    "kepuasan"
  ];

  const labels = {
    kemudahan: "Kemudahan",
    manfaat: "Manfaat",
    kepercayaan: "Kepercayaan",
    kepuasan: "Kepuasan"
  };

  const body =
    document.getElementById("statsTableBody");

  body.innerHTML = "";

  fields.forEach(field => {

    // Ambil hanya data yang benar-benar terisi
    const values = filteredData
      .filter(r =>
        r[field] !== "" &&
        r[field] !== null &&
        r[field] !== undefined
      )
      .map(r => Number(r[field]))
      .filter(v => !isNaN(v));

    if(values.length === 0) return;

    values.sort((a,b) => a - b);

    // Mean
    const mean =
      values.reduce((a,b) => a + b, 0) /
      values.length;

    // Median
    let median;

    if(values.length % 2 === 0) {

      median =
        (
          values[values.length/2 - 1] +
          values[values.length/2]
        ) / 2;

    } else {

      median =
        values[Math.floor(values.length/2)];

    }

    const min =
      Math.min(...values);

    const max =
      Math.max(...values);

    // Kategori berdasarkan skala Likert 1-5
    let kategori;

    if(mean >= 4.21)
      kategori = "Sangat Baik";
    else if(mean >= 3.41)
      kategori = "Baik";
    else if(mean >= 2.61)
      kategori = "Cukup";
    else if(mean >= 1.81)
      kategori = "Kurang";
    else
      kategori = "Sangat Kurang";

    body.innerHTML += `
      <tr>
        <td>${labels[field]}</td>
        <td>${mean.toFixed(2)}</td>
        <td>${median.toFixed(2)}</td>
        <td>${min}</td>
        <td>${max}</td>
        <td>${kategori}</td>
      </tr>
    `;
  });
}

function renderRadarChart() {

  const validData = filteredData.filter(
    row => row.kemudahan && row.manfaat &&
           row.kepercayaan && row.kepuasan
  );

  if(validData.length === 0) return;

  const avg = field =>
    validData.reduce(
      (sum,row)=>sum + Number(row[field]),
      0
    ) / validData.length;

  const ctx =
    document.getElementById("chartRadar");

  if(charts.radar)
    charts.radar.destroy();

  charts.radar = new Chart(ctx, {

    type: "radar",

    data: {

      labels: [
        "Kemudahan",
        "Manfaat",
        "Kepercayaan",
        "Kepuasan"
      ],

      datasets: [{

        label: "Rata-rata Skor",

        data: [
          avg("kemudahan"),
          avg("manfaat"),
          avg("kepercayaan"),
          avg("kepuasan")
        ]
      }]
    },

    options: {
      scales: {
        r: {
          min: 0,
          max: 5
        }
      }
    }
  });
}

function renderSkorBarChart() {

  const validData = filteredData.filter(
    row => row.kemudahan && row.manfaat &&
           row.kepercayaan && row.kepuasan
  );

  if(validData.length === 0) return;

  const avg = field =>
    validData.reduce(
      (sum,row)=>sum + Number(row[field]),
      0
    ) / validData.length;

  const ctx =
    document.getElementById("chartSkorBar");

  if(charts.skorBar)
    charts.skorBar.destroy();

  charts.skorBar = new Chart(ctx, {

    type: "bar",

    data: {

      labels: [
        "Kemudahan",
        "Manfaat",
        "Kepercayaan",
        "Kepuasan"
      ],

      datasets: [{

        label: "Rata-rata",

        data: [
          avg("kemudahan"),
          avg("manfaat"),
          avg("kepercayaan"),
          avg("kepuasan")
        ]
      }]
    },

    options: {
      scales: {
        y: {
          beginAtZero: true,
          max: 5
        }
      }
    }
  });
}

function updateDashboard() {

  updateKPIs();

  renderKepemilikanChart();
  renderStatusAktifChart();

  renderGenderChart();
  renderUsiaChart();
  renderPekerjaanChart();

  renderFrekuensiChart();
  renderAdopsiPieChart();
  renderPenggunaanChart();

  renderPengetahuanChart();
  renderMinatChart();
  renderSumberInfoChart();
  renderAlasanChart();

  updateSatisfactionCards();
  renderRadarChart();
  renderSkorBarChart();
  renderStatsTable();

  generateInsights();
}