Chart.defaults.color = '#94a3b8';
Chart.defaults.font.family = 'Segoe UI';

function formatNumberEn(num) {
    return new Intl.NumberFormat('en-US').format(num);
}

// 1. Map Setup
const map = L.map('map').setView([24.7136, 46.6753], 6);

L.tileLayer('https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
    maxZoom: 20,
    attribution: '&copy; Google Maps'
}).addTo(map);

// Universities grouped by cities
const riyadhUniversities = [
    'King Saud University',
    'Princess Nourah bint Abdulrahman University',
    'Imam Mohammad Ibn Saud Islamic University'
];

const jeddahUniversities = [
    'King Abdulaziz University',
    'University of Jeddah'
];

const dammamUniversities = [
    'Imam Abdulrahman Bin Faisal University',
    'King Fahd University of Petroleum and Minerals',
    'Prince Mohammad Bin Fahd University'
];

// Reference Current Date (September 2026)
const CURRENT_DATE = new Date(2026, 8, 30);

// Primary Trainee Record
const primaryTrainee = {
    nationalId: '1117862670',
    name: 'Rina Saad Aldakhini',
    dobHijri: '18 / 7 / 1423',
    gender: 'Female',
    startDate: '30/08/2026',
    endDate: '30/11/2026',
    duration: '3 Months',
    institution: 'King Saud University',
    specialization: 'Database Programming',
    gpa: 3.13,
    email: 'rinasaad394@gmail.com',
    phone: '0506502920',
    cityKey: 'Riyadh HQ',
    status: 'Active'
};

const firstNames = ['Rina', 'Sara', 'Noura', 'Maha', 'Reem', 'Shahad', 'Mona', 'Ahmed', 'Mohammed', 'Faisal', 'Khaled', 'Fahad', 'Omar', 'Ali', 'Saud'];
const lastNames = ['Aldakhini', 'Alotaibi', 'Alqahtani', 'Alzahrani', 'Alshehri', 'Aldawsari', 'Alshammari', 'Alghamdi', 'Alharbi'];
const specializations = ['Database Programming', 'Information Systems', 'Software Engineering', 'Cybersecurity', 'Data Science'];

const durations = [
    { label: '3 Months', monthsToAdd: 3 },
    { label: '4 Months', monthsToAdd: 4 },
    { label: '6 Months', monthsToAdd: 6 }
];

const startOptions = [
    { startMonth: 1, startYear: 2026 },
    { startMonth: 2, startYear: 2026 }, 
    { startMonth: 4, startYear: 2026 },
    { startMonth: 6, startYear: 2026 },
    { startMonth: 8, startYear: 2026 },
    { startMonth: 9, startYear: 2026 }
];

function generateSmartDatePeriod() {
    const startOpt = startOptions[Math.floor(Math.random() * startOptions.length)];
    const durObj = durations[Math.floor(Math.random() * durations.length)];
    const startDay = Math.floor(Math.random() * 25) + 1;

    const startDateObj = new Date(startOpt.startYear, startOpt.startMonth - 1, startDay);
    
    let endDateObj = new Date(startDateObj);
    endDateObj.setMonth(endDateObj.getMonth() + durObj.monthsToAdd);

    const fmtStart = `${startDay < 10 ? '0' + startDay : startDay}/${startOpt.startMonth < 10 ? '0' + startOpt.startMonth : startOpt.startMonth}/${startOpt.startYear}`;
    const fmtEnd = `${endDateObj.getDate() < 10 ? '0' + endDateObj.getDate() : endDateObj.getDate()}/${(endDateObj.getMonth() + 1) < 10 ? '0' + (endDateObj.getMonth() + 1) : (endDateObj.getMonth() + 1)}/${endDateObj.getFullYear()}`;

    const diffTime = endDateObj.getTime() - CURRENT_DATE.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const startDiff = Math.ceil((CURRENT_DATE.getTime() - startDateObj.getTime()) / (1000 * 60 * 60 * 24));

    let stage = 'In Progress';
    let stageLabel = '';
    let badgeClass = 'bg-active';

    if (diffDays <= 0) {
        stage = 'Completed';
        stageLabel = 'Graduated';
        badgeClass = 'bg-graduated';
    } else if (startDiff <= 35) {
        stage = 'Just Joined';
        stageLabel = `Just Joined (${diffDays}d left)`;
        badgeClass = 'bg-joined';
    } else if (diffDays <= 30) {
        stage = 'Final Month';
        stageLabel = `Final Month (${diffDays}d left)`;
        badgeClass = 'bg-final';
    } else {
        stage = 'In Progress';
        stageLabel = `In Progress (${diffDays}d left)`;
        badgeClass = 'bg-active';
    }

    return {
        startDate: fmtStart,
        endDate: fmtEnd,
        duration: durObj.label,
        stage: stage,
        stageLabel: stageLabel,
        badgeClass: badgeClass,
        remainingDays: diffDays
    };
}

const allEmployees = [];

primaryTrainee.startDate = '30/08/2026';
primaryTrainee.endDate = '30/11/2026';
primaryTrainee.duration = '3 Months';
primaryTrainee.stage = 'Just Joined';
primaryTrainee.stageLabel = 'Just Joined (61d left)';
primaryTrainee.badgeClass = 'bg-joined';

allEmployees.push(primaryTrainee);

function generateDataset() {
    const locationsDistribution = [
        { city: 'Riyadh HQ', count: 849, unis: riyadhUniversities },
        { city: 'Jeddah Branch', count: 420, unis: jeddahUniversities },
        { city: 'Dammam Branch', count: 200, unis: dammamUniversities }
    ];

    let idCounter = 1117862671;

    locationsDistribution.forEach(loc => {
        for (let i = 0; i < loc.count; i++) {
            const fName = firstNames[Math.floor(Math.random() * firstNames.length)];
            const lName = lastNames[Math.floor(Math.random() * lastNames.length)];
            const spec = specializations[Math.floor(Math.random() * specializations.length)];
            const uni = loc.unis[Math.floor(Math.random() * loc.unis.length)];
            const gpaVal = (Math.random() * (5.0 - 2.5) + 2.5).toFixed(2);
            
            const dateObj = generateSmartDatePeriod();

            const rand = Math.random();
            let status = 'Active';
            if (dateObj.stage === 'Completed') {
                status = 'Completed';
            } else if (rand > 0.93) {
                status = 'Absent';
            } else if (rand > 0.85) {
                status = 'On Leave';
            }

            allEmployees.push({
                nationalId: `${idCounter++}`,
                name: `${fName} ${lName}`,
                dobHijri: '1423 Hijri',
                gender: Math.random() > 0.5 ? 'Female' : 'Male',
                startDate: dateObj.startDate,
                endDate: dateObj.endDate,
                duration: dateObj.duration,
                stage: dateObj.stage,
                stageLabel: dateObj.stageLabel,
                badgeClass: dateObj.badgeClass,
                institution: uni,
                specialization: spec,
                gpa: parseFloat(gpaVal),
                email: `${fName.toLowerCase()}.${lName.toLowerCase()}@edu.sa`,
                phone: `050${Math.floor(1000000 + Math.random() * 9000000)}`,
                cityKey: loc.city,
                status: status
            });
        }
    });
}

generateDataset();

const locationData = {
    'Riyadh HQ': {
        hiresTrend: [100, 150, 120, 180, 200, 150, 120, 140, 100],
        attritionTrend: [3, 4, 2, 5, 3, 4, 3, 2, 1],
        deptLabels: ['King Saud', 'PNU', 'Imam U'],
        deptData: [420, 250, 180],
        salaryData: [3.8, 3.5, 3.2, 3.1, 2.9]
    },
    'Jeddah Branch': {
        hiresTrend: [30, 50, 40, 50, 70, 80, 50, 70, 60],
        attritionTrend: [1, 3, 1, 3, 2, 3, 3, 2, 1],
        deptLabels: ['KAU (Jeddah)', 'U of Jeddah'],
        deptData: [260, 160],
        salaryData: [3.6, 3.3, 3.1, 3.0, 2.8]
    },
    'Dammam Branch': {
        hiresTrend: [20, 20, 20, 20, 30, 50, 30, 30, 20],
        attritionTrend: [1, 1, 1, 2, 1, 2, 1, 1, 1],
        deptLabels: ['IAU (Dammam)', 'KFUPM (Dhahran)', 'PMU (Dammam)'],
        deptData: [90, 70, 40],
        salaryData: [3.5, 3.2, 3.0, 2.9, 2.7]
    }
};

const locations = [
    { name: 'Riyadh HQ', lat: 24.7136, lng: 46.6753, color: '#ea4335', radius: 14 },
    { name: 'Jeddah Branch', lat: 21.5433, lng: 39.1728, color: '#ea4335', radius: 11 },
    { name: 'Dammam Branch', lat: 26.4207, lng: 50.0888, color: '#ea4335', radius: 9 }
];

locations.forEach(loc => {
    const circle = L.circleMarker([loc.lat, loc.lng], {
        color: loc.color,
        fillColor: loc.color,
        fillOpacity: 0.8,
        radius: loc.radius,
        weight: 2
    }).addTo(map);

    circle.bindTooltip(`<b>${loc.name}</b>`, { direction: 'top' });
    circle.on('click', () => updateDashboard(loc.name));
});

// Charts Initializations
const trendCtx = document.getElementById('trendChart').getContext('2d');
const trendChart = new Chart(trendCtx, {
    type: 'line',
    data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
        datasets: [
            { label: 'Enrolled Trainees', data: [150, 220, 180, 250, 300, 280, 200, 240, 180], borderColor: '#10b981', fill: false, tension: 0.3 },
            { label: 'Completed Cohorts', data: [50, 80, 40, 100, 60, 90, 70, 50, 30], borderColor: '#38bdf8', fill: false, tension: 0.3 }
        ]
    },
    options: { responsive: true, maintainAspectRatio: false }
});

const deptCtx = document.getElementById('deptChart').getContext('2d');
const deptChart = new Chart(deptCtx, {
    type: 'bar',
    data: {
        labels: ['KSU (Riyadh)', 'KAU (Jeddah)', 'PNU (Riyadh)', 'Imam U (Riyadh)', 'U of Jeddah', 'IAU/KFUPM (Dammam)'],
        datasets: [{ label: 'Trainees Count', data: [420, 260, 250, 180, 160, 200], backgroundColor: '#38bdf8', borderRadius: 4 }]
    },
    options: { responsive: true, maintainAspectRatio: false }
});

const salaryCtx = document.getElementById('salaryChart').getContext('2d');
const salaryChart = new Chart(salaryCtx, {
    type: 'bar',
    indexAxis: 'y',
    data: {
        labels: ['Database Programming', 'Software Engineering', 'Cybersecurity', 'Data Science', 'Information Systems'],
        datasets: [{ label: 'Average GPA', data: [3.13, 3.45, 3.20, 3.35, 3.05], backgroundColor: '#c084fc', borderRadius: 4 }]
    },
    options: { responsive: true, maintainAspectRatio: false }
});

let currentCityFilter = null;
let currentStatusFilter = 'ALL';
let currentUniversityFilter = 'ALL';
let currentDurationFilter = 'ALL';
let currentProgressFilter = 'ALL';
let currentSearchQuery = '';
let gpaSortAscending = false;

function updateKpiCounts() {
    let cityEmployees = allEmployees;

    if (currentCityFilter) {
        cityEmployees = allEmployees.filter(emp => emp.cityKey === currentCityFilter);
    }

    if (currentUniversityFilter !== 'ALL') {
        cityEmployees = cityEmployees.filter(emp => emp.institution === currentUniversityFilter);
    }

    if (currentDurationFilter !== 'ALL') {
        cityEmployees = cityEmployees.filter(emp => emp.duration === currentDurationFilter);
    }

    if (currentProgressFilter !== 'ALL') {
        cityEmployees = cityEmployees.filter(emp => emp.stage === currentProgressFilter);
    }

    const totalCount = cityEmployees.length;
    const activeCount = cityEmployees.filter(emp => emp.status === 'Active').length;
    const leaveCount = cityEmployees.filter(emp => emp.status === 'On Leave').length;
    const absentCount = cityEmployees.filter(emp => emp.status === 'Absent').length;

    const totalGpaSum = cityEmployees.reduce((sum, emp) => sum + emp.gpa, 0);
    const avgGpa = totalCount > 0 ? (totalGpaSum / totalCount).toFixed(2) : '0.00';

    document.getElementById('emp-count').innerText = formatNumberEn(totalCount);
    document.getElementById('active-count').innerText = formatNumberEn(activeCount);
    document.getElementById('leave-count').innerText = formatNumberEn(leaveCount);
    document.getElementById('absent-count').innerText = formatNumberEn(absentCount);
    document.getElementById('avg-gpa').innerText = `${avgGpa} / 5.0`;
}

function searchTable() {
    currentSearchQuery = document.getElementById('searchInput').value.toLowerCase().trim();
    renderTable();
}

function filterByUniversity() {
    currentUniversityFilter = document.getElementById('universityFilter').value;
    renderTable();
}

function filterByDuration() {
    currentDurationFilter = document.getElementById('durationFilter').value;
    renderTable();
}

function filterByProgress() {
    currentProgressFilter = document.getElementById('progressFilter').value;
    renderTable();
}

function renderTable() {
    const tbody = document.getElementById('tableBody');
    tbody.innerHTML = '';

    let filtered = allEmployees;

    if (currentCityFilter) {
        filtered = filtered.filter(emp => emp.cityKey === currentCityFilter);
    }

    if (currentStatusFilter !== 'ALL') {
        filtered = filtered.filter(emp => emp.status === currentStatusFilter);
    }

    if (currentUniversityFilter !== 'ALL') {
        filtered = filtered.filter(emp => emp.institution === currentUniversityFilter);
    }

    if (currentDurationFilter !== 'ALL') {
        filtered = filtered.filter(emp => emp.duration === currentDurationFilter);
    }

    if (currentProgressFilter !== 'ALL') {
        filtered = filtered.filter(emp => emp.stage === currentProgressFilter);
    }

    if (currentSearchQuery !== '') {
        filtered = filtered.filter(emp => 
            emp.name.toLowerCase().includes(currentSearchQuery) || 
            emp.nationalId.toLowerCase().includes(currentSearchQuery) ||
            emp.institution.toLowerCase().includes(currentSearchQuery) ||
            emp.specialization.toLowerCase().includes(currentSearchQuery)
        );
    }

    filtered.forEach(emp => {
        const row = document.createElement('tr');
        
        let statusColor = '#10b981';
        if (emp.status === 'On Leave') statusColor = '#f59e0b';
        if (emp.status === 'Absent') statusColor = '#f43f5e';
        if (emp.status === 'Completed') statusColor = '#94a3b8';

        row.innerHTML = `
            <td>${emp.nationalId}</td>
            <td style="font-weight: 600;">${emp.name}</td>
            <td><span style="background: #334155; color: #38bdf8; padding: 2px 6px; border-radius: 4px; font-weight: 600; font-size: 0.78rem;">${emp.institution}</span></td>
            <td>${emp.specialization}</td>
            <td style="color: #38bdf8; font-weight: 600;">${emp.gpa}</td>
            <td><strong style="color: #38bdf8;">${emp.duration}</strong> <br><small style="color: #94a3b8;">(${emp.startDate} - ${emp.endDate})</small></td>
            <td><span class="badge-progress ${emp.badgeClass}">${emp.stageLabel}</span></td>
            <td><span style="color: ${statusColor}; font-weight: 600;">${emp.status}</span></td>
        `;
        tbody.appendChild(row);
    });

    const statusText = document.getElementById('table-status');
    if (statusText) {
        statusText.innerText = `Showing ${formatNumberEn(filtered.length)} records`;
    }

    updateKpiCounts();
}

function filterByStatus(status) {
    currentStatusFilter = status;

    document.querySelectorAll('.filter-btn-sm').forEach(btn => btn.classList.remove('active'));
    if (status === 'ALL') document.getElementById('btn-all')?.classList.add('active');
    if (status === 'Active') document.getElementById('btn-active')?.classList.add('active');
    if (status === 'On Leave') document.getElementById('btn-leave')?.classList.add('active');
    if (status === 'Absent') document.getElementById('btn-absent')?.classList.add('active');

    renderTable();
}

function sortByGPA() {
    gpaSortAscending = !gpaSortAscending;

    allEmployees.sort((a, b) => {
        return gpaSortAscending ? a.gpa - b.gpa : b.gpa - a.gpa;
    });

    renderTable();
}

function updateDashboard(locationName) {
    currentCityFilter = locationName;
    const data = locationData[locationName];
    if (!data) return;

    trendChart.data.datasets[0].data = data.hiresTrend;
    trendChart.data.datasets[1].data = data.attritionTrend;
    trendChart.update();

    deptChart.data.labels = data.deptLabels;
    deptChart.data.datasets[0].data = data.deptData;
    deptChart.update();

    salaryChart.data.datasets[0].data = data.salaryData;
    salaryChart.update();

    renderTable();
}

function resetFilters() {
    currentCityFilter = null;
    currentStatusFilter = 'ALL';
    currentUniversityFilter = 'ALL';
    currentDurationFilter = 'ALL';
    currentProgressFilter = 'ALL';
    currentSearchQuery = '';
    
    const searchInput = document.getElementById('searchInput');
    if (searchInput) searchInput.value = '';

    const universityFilter = document.getElementById('universityFilter');
    if (universityFilter) universityFilter.value = 'ALL';

    const durationFilter = document.getElementById('durationFilter');
    if (durationFilter) durationFilter.value = 'ALL';

    const progressFilter = document.getElementById('progressFilter');
    if (progressFilter) progressFilter.value = 'ALL';

    trendChart.data.datasets[0].data = [150, 220, 180, 250, 300, 280, 200, 240, 180];
    trendChart.data.datasets[1].data = [50, 80, 40, 100, 60, 90, 70, 50, 30];
    trendChart.update();

    deptChart.data.labels = ['KSU (Riyadh)', 'KAU (Jeddah)', 'PNU (Riyadh)', 'Imam U (Riyadh)', 'U of Jeddah', 'IAU/KFUPM (Dammam)'];
    deptChart.data.datasets[0].data = [420, 260, 250, 180, 160, 200];
    deptChart.update();

    salaryChart.data.datasets[0].data = [3.13, 3.45, 3.20, 3.35, 3.05];
    salaryChart.update();

    filterByStatus('ALL');
}

function exportToExcel() {
    const exportData = [
        ["National ID", "Trainee Name", "Hijri Birth Date", "Gender", "Start Date", "End Date", "Duration", "Stage / Remaining Days", "Educational Institution", "Specialization", "GPA", "Email", "Phone", "Branch / City", "Work Status"],
        ...allEmployees.map(e => [e.nationalId, e.name, e.dobHijri, e.gender, e.startDate, e.endDate, e.duration, e.stageLabel, e.institution, e.specialization, e.gpa, e.email, e.phone, e.cityKey, e.status])
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Training Records 1470");

    XLSX.writeFile(workbook, "PBI_Training_Records_1470.xlsx");
}

renderTable();