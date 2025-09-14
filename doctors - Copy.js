// doctors.js

// Sample doctor data
const doctorsData = [
    {
        id: 1,
        name: "Dr. Rajesh Kumar",
        specialty: "Cardiology",
        experience: 15,
        education: "MBBS, MD (Cardiology), DM (Cardiology)",
        hospital: "Nabha Heart Institute",
        availability: ["Monday", "Wednesday", "Friday"],
        nextAvailable: "today",
        image: "https://placehold.co/300x300/0066cc/white?text=Dr.+Rajesh",
        description: "Senior Cardiologist with over 15 years of experience in treating complex heart conditions. Specialized in interventional cardiology and cardiac emergencies.",
        rating: 4.8,
        reviews: 142
    },
    {
        id: 2,
        name: "Dr. Priya Sharma",
        specialty: "Pediatrics",
        experience: 12,
        education: "MBBS, MD (Pediatrics)",
        hospital: "Nabha Children's Hospital",
        availability: ["Tuesday", "Thursday", "Saturday"],
        nextAvailable: "tomorrow",
        image: "https://placehold.co/300x300/009688/white?text=Dr.+Priya",
        description: "Pediatrician with 12 years of experience in child healthcare. Special interest in neonatal care and vaccination programs.",
        rating: 4.7,
        reviews: 98
    },
    {
        id: 3,
        name: "Dr. Amit Singh",
        specialty: "Orthopedics",
        experience: 18,
        education: "MBBS, MS (Orthopedics)",
        hospital: "Nabha Bone & Joint Center",
        availability: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        nextAvailable: "today",
        image: "https://placehold.co/300x300/ff5722/white?text=Dr.+Amit",
        description: "Orthopedic surgeon specializing in joint replacement surgeries and sports injuries. Extensive experience in minimally invasive procedures.",
        rating: 4.9,
        reviews: 215
    },
    {
        id: 4,
        name: "Dr. Sunita Mehta",
        specialty: "Gynecology",
        experience: 14,
        education: "MBBS, MD (Gynecology)",
        hospital: "Nabha Women's Hospital",
        availability: ["Monday", "Wednesday", "Friday", "Saturday"],
        nextAvailable: "this-week",
        image: "https://placehold.co/300x300/e91e63/white?text=Dr.+Sunita",
        description: "Gynecologist with expertise in women's health, pregnancy care, and laparoscopic surgeries. Passionate about women wellness programs.",
        rating: 4.8,
        reviews: 176
    },
    {
        id: 5,
        name: "Dr. Vikram Malhotra",
        specialty: "Neurology",
        experience: 20,
        education: "MBBS, MD (General Medicine), DM (Neurology)",
        hospital: "Nabha Neuro Center",
        availability: ["Tuesday", "Thursday", "Saturday"],
        nextAvailable: "tomorrow",
        image: "https://placehold.co/300x300/673ab7/white?text=Dr.+Vikram",
        description: "Senior Neurologist with expertise in treating complex neurological disorders. Specialized in stroke management and epilepsy treatment.",
        rating: 4.9,
        reviews: 189
    },
    {
        id: 6,
        name: "Dr. Anjali Gupta",
        specialty: "Dermatology",
        experience: 10,
        education: "MBBS, MD (Dermatology)",
        hospital: "Nabha Skin Clinic",
        availability: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        nextAvailable: "today",
        image: "https://placehold.co/300x300/ff9800/white?text=Dr.+Anjali",
        description: "Dermatologist specializing in cosmetic dermatology and skin diseases. Expertise in laser treatments and anti-aging procedures.",
        rating: 4.7,
        reviews: 124
    },
    {
        id: 7,
        name: "Dr. Sanjay Verma",
        specialty: "General Medicine",
        experience: 22,
        education: "MBBS, MD (General Medicine)",
        hospital: "Nabha General Hospital",
        availability: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        nextAvailable: "today",
        image: "https://placehold.co/300x300/607d8b/white?text=Dr.+Sanjay",
        description: "Senior Physician with vast experience in diagnosing and treating complex medical conditions. Special interest in diabetes and hypertension management.",
        rating: 4.8,
        reviews: 203
    },
    {
        id: 8,
        name: "Dr. Neha Patel",
        specialty: "Pediatrics",
        experience: 8,
        education: "MBBS, MD (Pediatrics)",
        hospital: "Nabha Children's Hospital",
        availability: ["Monday", "Wednesday", "Friday"],
        nextAvailable: "this-week",
        image: "https://placehold.co/300x300/009688/white?text=Dr.+Neha",
        description: "Pediatrician specializing in child nutrition and development. Expertise in managing childhood allergies and respiratory conditions.",
        rating: 4.6,
        reviews: 87
    }
];

// DOM Elements
const doctorsGrid = document.getElementById('doctorsGrid');
const doctorSearch = document.getElementById('doctorSearch');
const specialtyFilter = document.getElementById('specialtyFilter');
const experienceFilter = document.getElementById('experienceFilter');
const availabilityFilter = document.getElementById('availabilityFilter');
const resetFiltersBtn = document.getElementById('resetFilters');
const loadMoreBtn = document.getElementById('loadMoreDoctors');
const doctorModal = document.getElementById('doctorModal');
const modalBody = document.getElementById('modalBody');
const closeModal = document.querySelector('.close-modal');

// Variables
let displayedDoctors = 6;
let filteredDoctors = [...doctorsData];

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    renderDoctors();
    setupEventListeners();
});

// Set up event listeners
function setupEventListeners() {
    doctorSearch.addEventListener('input', filterDoctors);
    specialtyFilter.addEventListener('change', filterDoctors);
    experienceFilter.addEventListener('change', filterDoctors);
    availabilityFilter.addEventListener('change', filterDoctors);
    resetFiltersBtn.addEventListener('click', resetFilters);
    loadMoreBtn.addEventListener('click', loadMoreDoctors);
    closeModal.addEventListener('click', () => doctorModal.style.display = 'none');
    
    // Close modal when clicking outside
    window.addEventListener('click', (event) => {
        if (event.target === doctorModal) {
            doctorModal.style.display = 'none';
        }
    });
}

// Render doctors to the grid
function renderDoctors() {
    doctorsGrid.innerHTML = '';
    
    const doctorsToShow = filteredDoctors.slice(0, displayedDoctors);
    
    if (doctorsToShow.length === 0) {
        doctorsGrid.innerHTML = `
            <div class="no-doctors">
                <i class="fas fa-user-md"></i>
                <h3>No doctors found</h3>
                <p>Try adjusting your search or filters</p>
            </div>
        `;
        loadMoreBtn.style.display = 'none';
        return;
    }
    
    doctorsToShow.forEach(doctor => {
        const doctorCard = createDoctorCard(doctor);
        doctorsGrid.appendChild(doctorCard);
    });
    
    // Show/hide load more button
    loadMoreBtn.style.display = displayedDoctors >= filteredDoctors.length ? 'none' : 'block';
}

// Create doctor card HTML
function createDoctorCard(doctor) {
    const card = document.createElement('div');
    card.className = 'doctor-card';
    card.innerHTML = `
        <div class="doctor-image">
            <img src="${doctor.image}" alt="${doctor.name}">
            <div class="availability-tag ${doctor.nextAvailable === 'today' ? 'available-today' : ''}">
                ${formatAvailability(doctor.nextAvailable)}
            </div>
        </div>
        <div class="doctor-info">
            <h3>${doctor.name}</h3>
            <p class="specialty">${doctor.specialty}</p>
            <p class="experience"><i class="fas fa-briefcase"></i> ${doctor.experience} years experience</p>
            <p class="hospital"><i class="fas fa-hospital"></i> ${doctor.hospital}</p>
            <div class="rating">
                <div class="stars">
                    ${generateStarRating(doctor.rating)}
                </div>
                <span>${doctor.rating} (${doctor.reviews} reviews)</span>
            </div>
            <div class="availability">
                <p><strong>Available on:</strong> ${doctor.availability.join(', ')}</p>
            </div>
            <button class="btn-primary view-profile" data-id="${doctor.id}">View Profile</button>
            <button class="btn-outline book-appointment" data-id="${doctor.id}">Book Appointment</button>
        </div>
    `;
    
    // Add event listeners to buttons
    card.querySelector('.view-profile').addEventListener('click', () => showDoctorDetails(doctor.id));
    card.querySelector('.book-appointment').addEventListener('click', () => bookAppointment(doctor.id));
    
    return card;
}

// Filter doctors based on search and filters
function filterDoctors() {
    const searchText = doctorSearch.value.toLowerCase();
    const specialty = specialtyFilter.value;
    const experience = experienceFilter.value;
    const availability = availabilityFilter.value;
    
    filteredDoctors = doctorsData.filter(doctor => {
        // Search filter
        const matchesSearch = doctor.name.toLowerCase().includes(searchText) || 
                             doctor.specialty.toLowerCase().includes(searchText) ||
                             doctor.experience.toString().includes(searchText);
        
        // Specialty filter
        const matchesSpecialty = specialty === 'all' || doctor.specialty.toLowerCase() === specialty;
        
        // Experience filter
        const matchesExperience = experience === 'all' || doctor.experience >= parseInt(experience);
        
        // Availability filter
        let matchesAvailability = true;
        if (availability !== 'all') {
            matchesAvailability = doctor.nextAvailable === availability;
        }
        
        return matchesSearch && matchesSpecialty && matchesExperience && matchesAvailability;
    });
    
    displayedDoctors = 6;
    renderDoctors();
}

// Reset all filters
function resetFilters() {
    doctorSearch.value = '';
    specialtyFilter.value = 'all';
    experienceFilter.value = 'all';
    availabilityFilter.value = 'all';
    filterDoctors();
}

// Load more doctors
function loadMoreDoctors() {
    displayedDoctors += 3;
    renderDoctors();
}

// Show doctor details in modal
function showDoctorDetails(doctorId) {
    const doctor = doctorsData.find(d => d.id === doctorId);
    
    if (doctor) {
        modalBody.innerHTML = `
            <div class="modal-doctor-header">
                <div class="modal-doctor-image">
                    <img src="${doctor.image}" alt="${doctor.name}">
                </div>
                <div class="modal-doctor-basic-info">
                    <h2>${doctor.name}</h2>
                    <p class="specialty">${doctor.specialty}</p>
                    <div class="rating">
                        <div class="stars">
                            ${generateStarRating(doctor.rating)}
                        </div>
                        <span>${doctor.rating} (${doctor.reviews} reviews)</span>
                    </div>
                    <p class="hospital"><i class="fas fa-hospital"></i> ${doctor.hospital}</p>
                    <p class="experience"><i class="fas fa-briefcase"></i> ${doctor.experience} years experience</p>
                </div>
            </div>
            
            <div class="modal-doctor-details">
                <div class="detail-section">
                    <h3>About</h3>
                    <p>${doctor.description}</p>
                </div>
                
                <div class="detail-section">
                    <h3>Education & Qualifications</h3>
                    <p>${doctor.education}</p>
                </div>
                
                <div class="detail-section">
                    <h3>Availability</h3>
                    <p><strong>Available Days:</strong> ${doctor.availability.join(', ')}</p>
                    <p><strong>Next Available:</strong> ${formatAvailability(doctor.nextAvailable, true)}</p>
                </div>
            </div>
            
            <div class="modal-actions">
                <button class="btn-primary" onclick="bookAppointment(${doctor.id})">Book Appointment</button>
                <button class="btn-outline" onclick="doctorModal.style.display='none'">Close</button>
            </div>
        `;
        
        doctorModal.style.display = 'block';
    }
}

// Book appointment function
function bookAppointment(doctorId) {
    // In a real application, this would redirect to the appointments page
    // or open a booking form. For now, we'll show an alert.
    const doctor = doctorsData.find(d => d.id === doctorId);
    alert(`Booking appointment with ${doctor.name}`);
    // Typically you would redirect to: window.location.href = '../appointments/appointments.html';
}

// Helper function to generate star rating HTML
function generateStarRating(rating) {
    let stars = '';
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < fullStars; i++) {
        stars += '<i class="fas fa-star"></i>';
    }
    
    if (hasHalfStar) {
        stars += '<i class="fas fa-star-half-alt"></i>';
    }
    
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
        stars += '<i class="far fa-star"></i>';
    }
    
    return stars;
}

// Helper function to format availability text
function formatAvailability(availability, fullText = false) {
    switch(availability) {
        case 'today':
            return fullText ? 'Available today' : 'Today';
        case 'tomorrow':
            return fullText ? 'Available tomorrow' : 'Tomorrow';
        case 'this-week':
            return fullText ? 'Available this week' : 'This week';
        default:
            return availability;
    }
}