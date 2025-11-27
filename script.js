// Crime data for Ranchi areas with real coordinates
const crimeData = {
  dhurwa: {
    name: "Dhurwa",
    safetyLevel: "caution",
    safetyScore: 6.5,
    crimes: ["Theft", "Chain Snatching", "Cybercrime"],
    recentIncidents: 23,
    coordinates: [23.3441, 85.3096], // Real coordinates for Dhurwa, Ranchi
    description: "Mixed residential and commercial area with moderate crime rates",
    detailPage: "dhurwa.html",
  },
  morabadi: {
    name: "Morabadi",
    safetyLevel: "danger",
    safetyScore: 3.2,
    crimes: ["Harassment", "Assault", "Theft"],
    recentIncidents: 41,
    coordinates: [23.3569, 85.3239], // Real coordinates for Morabadi, Ranchi
    description: "High crime area requiring extra caution, especially for women",
    detailPage: "morabadi.html",
  },
  harmu: {
    name: "Harmu",
    safetyLevel: "caution",
    safetyScore: 5.8,
    crimes: ["Robbery", "Street Crime", "Vehicle Theft"],
    recentIncidents: 18,
    coordinates: [23.3703, 85.3119], // Real coordinates for Harmu, Ranchi
    description: "Busy commercial area with street crime concerns",
    detailPage: "harmu.html",
  },
  namkom: {
    name: "Namkom",
    safetyLevel: "safe",
    safetyScore: 7.8,
    crimes: ["Vehicle Theft", "Minor Theft"],
    recentIncidents: 8,
    coordinates: [23.2294, 85.2456], // Real coordinates for Namkom, Ranchi
    description: "Relatively safe residential area with low crime rates",
    detailPage: "namkom.html",
  },
  patratu: {
    name: "Patratu",
    safetyLevel: "caution",
    safetyScore: 6.0,
    crimes: ["Land Disputes", "Rural Crime", "Theft"],
    recentIncidents: 15,
    coordinates: [23.6833, 85.1667], // Real coordinates for Patratu, Ranchi
    description: "Rural area with occasional land-related disputes",
    detailPage: "patratu.html",
  },
  birsaMunda: {
    name: "Birsa Munda Airport Area",
    safetyLevel: "danger",
    safetyScore: 4.1,
    crimes: ["Smuggling", "Organized Crime", "Theft"],
    recentIncidents: 32,
    coordinates: [23.3143, 85.3217], // Real coordinates for Birsa Munda Airport, Ranchi
    description: "Airport vicinity with organized crime activities",
    detailPage: "birsa-munda.html",
  },
}

// DOM elements
let selectedArea = null
let darkMode = false
let map = null
const markers = {}

// Import Leaflet library
const L = window.L

// Initialize the application
document.addEventListener("DOMContentLoaded", () => {
  initializeMap()
  initializeAreasGrid()
  initializeEventListeners()
  initializeNavigation()
  loadPreferences()
})

// Initialize interactive map
function initializeMap() {
  const mapContainer = document.getElementById("crimeMap")

  // Initialize map centered on Ranchi
  map = L.map("crimeMap").setView([23.3441, 85.3096], 11)

  // Add OpenStreetMap tiles
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap contributors",
  }).addTo(map)

  // Create custom icons for different safety levels
  const createCustomIcon = (safetyLevel) => {
    const colors = {
      safe: "#28a745",
      caution: "#ffc107",
      danger: "#dc3545",
    }

    return L.divIcon({
      className: "custom-marker",
      html: `<div class="custom-marker marker-${safetyLevel}" style="background-color: ${colors[safetyLevel]}"></div>`,
      iconSize: [20, 20],
      iconAnchor: [10, 10],
    })
  }

  // Add markers for each area
  Object.keys(crimeData).forEach((areaKey) => {
    const area = crimeData[areaKey]
    const icon = createCustomIcon(area.safetyLevel)

    const marker = L.marker(area.coordinates, { icon })
      .addTo(map)
      .bindPopup(`
        <div class="popup-header">${area.name}</div>
        <div class="popup-safety-badge ${area.safetyLevel}">${area.safetyLevel}</div>
        <div><strong>Safety Score:</strong> ${area.safetyScore}/10</div>
        <div><strong>Recent Incidents:</strong> ${area.recentIncidents}</div>
        <div><strong>Common Crimes:</strong> ${area.crimes.slice(0, 2).join(", ")}</div>
        <button onclick="selectArea('${areaKey}')" style="margin-top: 8px; padding: 4px 8px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;">View Details</button>
      `)

    // Store marker reference
    markers[areaKey] = marker

    // Add click event to marker
    marker.on("click", () => {
      selectArea(areaKey)
    })
  })

  // Add map legend
  const legend = L.control({ position: "bottomleft" })
  legend.onAdd = () => {
    const div = L.DomUtil.create("div", "map-legend")
    div.innerHTML = `
      <h4>Safety Levels</h4>
      <div class="legend-item"><div class="legend-color safe"></div><span>Safe</span></div>
      <div class="legend-item"><div class="legend-color caution"></div><span>Caution</span></div>
      <div class="legend-item"><div class="legend-color danger"></div><span>Danger</span></div>
    `
    return div
  }
  legend.addTo(map)
}

// Initialize areas grid
function initializeAreasGrid() {
  const areasGrid = document.getElementById("areasGrid")

  Object.keys(crimeData).forEach((areaKey) => {
    const area = crimeData[areaKey]
    const areaCard = createAreaCard(areaKey, area)
    areasGrid.appendChild(areaCard)
  })
}

// Create area card element
function createAreaCard(areaKey, area) {
  const card = document.createElement("div")
  card.className = "area-card"
  card.setAttribute("data-area", areaKey)
  card.setAttribute("data-safety", area.safetyLevel)

  card.innerHTML = `
        <div class="area-card-header">
            <h3>${area.name}</h3>
            <span class="safety-badge ${area.safetyLevel}">${area.safetyLevel.toUpperCase()}</span>
        </div>
        <div class="area-card-content">
            <div class="area-card-stats">
                <div>
                    <span class="stat-label">Safety Score:</span>
                    <span class="stat-value">${area.safetyScore}/10</span>
                </div>
                <div>
                    <span class="stat-label">Recent Incidents:</span>
                    <span class="stat-value danger-text">${area.recentIncidents}</span>
                </div>
            </div>
            <div class="area-card-crimes">
                <span class="crime-label">Common Crimes:</span>
                <div class="crime-badges">
                    ${area.crimes
                      .slice(0, 2)
                      .map((crime) => `<span class="crime-badge">${crime}</span>`)
                      .join("")}
                    ${area.crimes.length > 2 ? `<span class="crime-badge">+${area.crimes.length - 2} more</span>` : ""}
                </div>
            </div>
            <a href="${area.detailPage}" class="view-details-btn">
                <i class="fas fa-info-circle"></i> View Details
            </a>
        </div>
    `

  card.addEventListener("click", (e) => {
    // Only select area if not clicking the view details button
    if (!e.target.closest(".view-details-btn")) {
      selectArea(areaKey)
    }
  })

  return card
}

// Select area and show details
function selectArea(areaKey) {
  selectedArea = areaKey
  const area = crimeData[areaKey]
  const infoPanel = document.getElementById("selectedAreaInfo")

  // Update area information
  document.getElementById("areaName").textContent = area.name
  document.getElementById("areaSafetyBadge").textContent = area.safetyLevel.toUpperCase()
  document.getElementById("areaSafetyBadge").className = `safety-badge ${area.safetyLevel}`
  document.getElementById("areaDescription").textContent = area.description
  document.getElementById("safetyScore").textContent = `${area.safetyScore}/10`
  document.getElementById("recentIncidents").textContent = area.recentIncidents

  // Update crime types
  const crimesList = document.getElementById("crimeTypesList")
  crimesList.innerHTML = area.crimes.map((crime) => `<span class="crime-badge">${crime}</span>`).join("")

  // Show info panel
  infoPanel.style.display = "block"
  infoPanel.classList.add("fade-in")

  // Highlight selected marker on map
  Object.keys(markers).forEach((key) => {
    const marker = markers[key]
    if (key === areaKey) {
      // Highlight selected marker
      marker.setIcon(
        L.divIcon({
          className: "custom-marker selected",
          html: `<div class="custom-marker marker-${area.safetyLevel}" style="background-color: ${area.safetyLevel === "safe" ? "#28a745" : area.safetyLevel === "caution" ? "#ffc107" : "#dc3545"}; transform: scale(1.3); z-index: 1000;"></div>`,
          iconSize: [26, 26],
          iconAnchor: [13, 13],
        }),
      )
      // Center map on selected area
      map.setView(area.coordinates, 13)
    } else {
      // Reset other markers
      const otherArea = crimeData[key]
      marker.setIcon(
        L.divIcon({
          className: "custom-marker",
          html: `<div class="custom-marker marker-${otherArea.safetyLevel}" style="background-color: ${otherArea.safetyLevel === "safe" ? "#28a745" : otherArea.safetyLevel === "caution" ? "#ffc107" : "#dc3545"}"></div>`,
          iconSize: [20, 20],
          iconAnchor: [10, 10],
        }),
      )
    }
  })

  // Scroll to map section
  document.querySelector(".map-section").scrollIntoView({
    behavior: "smooth",
    block: "center",
  })
}

// Initialize event listeners
function initializeEventListeners() {
  // Dark mode toggle
  const darkModeToggle = document.getElementById("darkModeToggle")
  darkModeToggle.addEventListener("click", toggleDarkMode)

  // Search functionality
  const searchInput = document.getElementById("searchInput")
  searchInput.addEventListener("input", handleSearch)

  // Safety filter
  const safetyFilter = document.getElementById("safetyFilter")
  safetyFilter.addEventListener("change", handleFilter)

  // Crime report form
  const reportForm = document.getElementById("crimeReportForm")
  reportForm.addEventListener("submit", handleReportSubmit)

  // Clear form button
  const clearFormBtn = document.getElementById("clearForm")
  clearFormBtn.addEventListener("click", clearReportForm)

  // Modal close
  const closeModalBtn = document.getElementById("closeModal")
  closeModalBtn.addEventListener("click", closeModal)

  // Close modal when clicking outside
  const modal = document.getElementById("successModal")
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      closeModal()
    }
  })
}

// Initialize navigation
function initializeNavigation() {
  const navLinks = document.querySelectorAll(".nav-link")

  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault()

      // Remove active class from all links
      navLinks.forEach((l) => l.classList.remove("active"))

      // Add active class to clicked link
      this.classList.add("active")

      // Smooth scroll to section
      const targetId = this.getAttribute("href")
      const targetSection = document.querySelector(targetId)

      if (targetSection) {
        targetSection.scrollIntoView({
          behavior: "smooth",
          block: "start",
        })
      }
    })
  })
}

// Toggle dark mode
function toggleDarkMode() {
  darkMode = !darkMode
  document.body.classList.toggle("dark-mode", darkMode)

  const darkModeBtn = document.getElementById("darkModeToggle")
  const icon = darkModeBtn.querySelector("i")

  if (darkMode) {
    icon.className = "fas fa-sun"
  } else {
    icon.className = "fas fa-moon"
  }

  // Save preference to localStorage
  localStorage.setItem("darkMode", darkMode)
}

// Handle search functionality
function handleSearch() {
  const searchTerm = document.getElementById("searchInput").value.toLowerCase()
  const areaCards = document.querySelectorAll(".area-card")

  areaCards.forEach((card) => {
    const areaName = card.querySelector("h3").textContent.toLowerCase()
    const shouldShow = areaName.includes(searchTerm)

    card.style.display = shouldShow ? "block" : "none"

    if (shouldShow) {
      card.classList.add("fade-in")
    }
  })
}

// Handle safety level filter
function handleFilter() {
  const filterValue = document.getElementById("safetyFilter").value
  const areaCards = document.querySelectorAll(".area-card")

  areaCards.forEach((card) => {
    const safetyLevel = card.getAttribute("data-safety")
    const shouldShow = filterValue === "all" || safetyLevel === filterValue

    card.style.display = shouldShow ? "block" : "none"

    if (shouldShow) {
      card.classList.add("fade-in")
    }
  })
}

// Handle crime report form submission
function handleReportSubmit(e) {
  e.preventDefault()

  const formData = {
    crimeType: document.getElementById("crimeType").value,
    area: document.getElementById("crimeArea").value,
    dateTime: document.getElementById("incidentDateTime").value,
    description: document.getElementById("crimeDescription").value,
  }

  // Validate required fields
  if (!formData.crimeType || !formData.area || !formData.description) {
    alert("Please fill in all required fields.")
    return
  }

  // Generate report ID and time
  const reportId = generateReportId()
  const submitTime = new Date().toLocaleString()

  // Show success modal
  document.getElementById("reportId").textContent = reportId
  document.getElementById("submitTime").textContent = submitTime
  document.getElementById("successModal").style.display = "block"

  // Save report to localStorage
  const existingReports = JSON.parse(localStorage.getItem("crimeReports")) || []
  existingReports.unshift({ ...formData, dateTime: formData.dateTime })
  localStorage.setItem("crimeReports", JSON.stringify(existingReports))

  // Update the reports view
  displayReports()

  // Clear form
  clearReportForm()
}

// Generate random report ID
function generateReportId() {
  return "CR" + Math.random().toString(36).substr(2, 9).toUpperCase()
}

// Clear report form
function clearReportForm() {
  document.getElementById("crimeReportForm").reset()
}

// Close success modal
function closeModal() {
  document.getElementById("successModal").style.display = "none"
}

// Display submitted reports
function displayReports() {
  const reportsContainer = document.getElementById("recentReports")
  const reports = JSON.parse(localStorage.getItem("crimeReports")) || []

  if (!reportsContainer) return

  if (reports.length === 0) {
    reportsContainer.innerHTML = `<p style="text-align: center; color: gray;">No reports submitted yet.</p>`
    return
  }

  const reportsHTML = reports
    .slice(0, 10)
    .map(
      (report) => `
    <div class="report-item fade-in">
      <div class="report-header">
        <span class="report-area">${report.area}</span>
        <span class="report-type">${report.crimeType}</span>
        <span class="report-date">${formatDate(report.dateTime)}</span>
      </div>
      <div class="report-description">${report.description}</div>
    </div>
  `,
    )
    .join("")

  reportsContainer.innerHTML = reportsHTML
}

// Format the date
function formatDate(dateString) {
  if (!dateString || typeof dateString !== "string") return "Invalid Date"
  if (dateString.length === 16) {
    dateString += ":00"
  }
  const date = new Date(dateString)
  if (isNaN(date.getTime())) {
    return "Invalid Date"
  }
  return date.toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

// Load saved preferences
function loadPreferences() {
  const savedDarkMode = localStorage.getItem("darkMode")
  if (savedDarkMode === "true") {
    toggleDarkMode()
  }

  // Load reports on page load
  displayReports()
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault()
    const target = document.querySelector(this.getAttribute("href"))
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    }
  })
})

// Add loading animation
window.addEventListener("load", () => {
  document.body.classList.add("loaded")

  // Animate elements on scroll
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("fade-in")
      }
    })
  }, observerOptions)

  // Observe all cards and sections
  document.querySelectorAll(".card, .tip-card, .area-card").forEach((el) => {
    observer.observe(el)
  })
})

// Emergency contact quick dial
function quickDial(number) {
  if (confirm(`Do you want to call ${number}?`)) {
    window.location.href = `tel:${number}`
  }
}

// Add emergency contact functionality
document.querySelectorAll(".contact-number").forEach((contact) => {
  contact.addEventListener("click", function (e) {
    e.preventDefault()
    const number = this.textContent
    quickDial(number)
  })
})

// Keyboard navigation support
document.addEventListener("keydown", (e) => {
  // ESC key closes modal
  if (e.key === "Escape") {
    closeModal()
  }

  // Enter key on map markers
  if (e.key === "Enter" && e.target.classList.contains("map-marker")) {
    const areaKey = e.target.getAttribute("data-area")
    selectArea(areaKey)
  }
})

// Add accessibility attributes
document.querySelectorAll(".map-marker").forEach((marker) => {
  marker.setAttribute("tabindex", "0")
  marker.setAttribute("role", "button")
  marker.setAttribute("aria-label", `View details for ${marker.title}`)
})

// Print functionality
function printPage() {
  window.print()
}

// Export data functionality (for future use)
function exportData() {
  const dataStr = JSON.stringify(crimeData, null, 2)
  const dataBlob = new Blob([dataStr], { type: "application/json" })
  const url = URL.createObjectURL(dataBlob)
  const link = document.createElement("a")
  link.href = url
  link.download = "ranchi-crime-data.json"
  link.click()
  URL.revokeObjectURL(url)
}

// Add error handling for network requests
window.addEventListener("error", (e) => {
  console.error("Application error:", e.error)
})

// Service worker registration (for future PWA support)
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    // Service worker would be registered here for offline support
    console.log("Service Worker support detected")
  })
}
