// appointments.js

// DOM Elements
const departmentSelect = document.getElementById('department');
const doctorSelect = document.getElementById('doctor');
const appointmentDate = document.getElementById('appointmentDate');
const appointmentTime = document.getElementById('appointmentTime');
const appointmentForm = document.getElementById('appointmentForm');
const appointmentTypeRadios = document.querySelectorAll('input[name="appointmentType"]');
const doctorCard = document.getElementById('selectedDoctorCard');
const appointmentModal = document.getElementById('appointmentModal');
const confirmationModal = document.getElementById('confirmationModal');
const tabButtons = document.querySelectorAll('.tab-btn');

// Sample data for doctors (in a real app, this would come from an API)
const doctorsData = {
    cardiology: [
        {
            id: 1,
            name: "Dr. Rajesh Kumar",
            specialty: "Cardiologist",
            experience: "15 years",
            rating: 4.8,
            reviews: 124,
            image: "https://placehold.co/300x300/0066cc/white?text=Dr.+Rajesh",
            availableDays: ["Monday", "Wednesday", "Friday"],
            timeSlots: ["09:00 AM", "10:00 AM", "11:00 AM", "02:00 PM", "03:00 PM"]
        },
        {
            id: 2,
            name: "Dr. Priya Sharma",
            specialty: "Cardiologist",
            experience: "12 years",
            rating: 4.9,
            reviews: 98,
            image: "https://placehold.co/300x300/0066cc/white?text=Dr.+Priya",
            availableDays: ["Tuesday", "Thursday", "Saturday"],
            timeSlots: ["10:00 AM", "11:00 AM", "12:00 PM", "04:00 PM", "05:00 PM"]
        }
    ],
    neurology: [
        {
            id: 3,
            name: "Dr. Amit Singh",
            specialty: "Neurologist",
            experience: "18 years",
            rating: 4.7,
            reviews: 156,
            image: "https://placehold.co/300x300/0066cc/white?text=Dr.+Amit",
            availableDays: ["Monday", "Tuesday", "Thursday", "Friday"],
            timeSlots: ["09:30 AM", "10:30 AM", "11:30 AM", "03:00 PM", "04:00 PM"]
        }
    ],
    pediatrics: [
        {
            id: 4,
            name: "Dr. Sunita Devi",
            specialty: "Pediatrician",
            experience: "14 years",
            rating: 4.9,
            reviews: 203,
            image: "https://placehold.co/300x300/0066cc/white?text=Dr.+Sunita",
            availableDays: ["Monday", "Wednesday", "Thursday", "Saturday"],
            timeSlots: ["09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "02:00 PM"]
        }
    ],
    orthopedics: [
        {
            id: 5,
            name: "Dr. Vikram Jeet",
            specialty: "Orthopedic Surgeon",
            experience: "16 years",
            rating: 4.6,
            reviews: 87,
            image: "https://placehold.co/300x300/0066cc/white?text=Dr.+Vikram",
            availableDays: ["Tuesday", "Wednesday", "Friday", "Saturday"],
            timeSlots: ["10:00 AM", "11:00 AM", "12:00 PM", "03:00 PM", "04:00 PM"]
        }
    ],
    dermatology: [
        {
            id: 6,
            name: "Dr. Neha Gupta",
            specialty: "Dermatologist",
            experience: "11 years",
            rating: 4.8,
            reviews: 142,
            image: "https://placehold.co/300x300/0066cc/white?text=Dr.+Neha",
            availableDays: ["Monday", "Tuesday", "Thursday", "Friday"],
            timeSlots: ["09:00 AM", "10:00 AM", "11:00 AM", "04:00 PM", "05:00 PM"]
        }
    ],
    gynecology: [
        {
            id: 7,
            name: "Dr. Anjali Mehta",
            specialty: "Gynecologist",
            experience: "13 years",
            rating: 4.9,
            reviews: 176,
            image: "https://placehold.co/300x300/0066cc/white?text=Dr.+Anjali",
            availableDays: ["Monday", "Wednesday", "Friday", "Saturday"],
            timeSlots: ["09:30 AM", "10:30 AM", "11:30 AM", "02:30 PM", "03:30 PM"]
        }
    ],
    general: [
        {
            id: 8,
            name: "Dr. Sanjay Verma",
            specialty: "General Physician",
            experience: "20 years",
            rating: 4.7,
            reviews: 231,
            image: "https://placehold.co/300x300/0066cc/white?text=Dr.+Sanjay",
            availableDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
            timeSlots: ["08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM", "04:00 PM", "05:00 PM"]
        }
    ]
};

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    // Set minimum date to today
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const todayStr = `${yyyy}-${mm}-${dd}`;
    appointmentDate.min = todayStr;
    
    // Load appointments from localStorage if available
    loadAppointments();
    
    // Set up event listeners
    setupEventListeners();
});

// Set up event listeners
function setupEventListeners() {
    // Department change event
    departmentSelect.addEventListener('change', populateDoctors);
    
    // Doctor change event
    doctorSelect.addEventListener('change', updateDoctorDetails);
    
    // Date change event
    appointmentDate.addEventListener('change', populateTimeSlots);
    
    // Appointment type change event
    appointmentTypeRadios.forEach(radio => {
        radio.addEventListener('change', updateAppointmentSummary);
    });
    
    // Form submission
    appointmentForm.addEventListener('submit', handleFormSubmission);
    
    // Tab buttons
    tabButtons.forEach(button => {
        button.addEventListener('click', switchTab);
    });
    
    // Modal close buttons
    document.querySelectorAll('.close-modal').forEach(closeBtn => {
        closeBtn.addEventListener('click', () => {
            appointmentModal.style.display = 'none';
            confirmationModal.style.display = 'none';
        });
    });
    
    // Click outside modal to close
    window.addEventListener('click', (e) => {
        if (e.target === appointmentModal) {
            appointmentModal.style.display = 'none';
        }
        if (e.target === confirmationModal) {
            confirmationModal.style.display = 'none';
        }
    });
    
    // Confirmation modal actions
    document.getElementById('cancelAction').addEventListener('click', () => {
        confirmationModal.style.display = 'none';
    });
    
    document.getElementById('confirmAction').addEventListener('click', executeConfirmedAction);
}

// Populate doctors based on department selection
function populateDoctors() {
    const department = departmentSelect.value;
    doctorSelect.innerHTML = '<option value="">Select Doctor</option>';
    
    if (department && doctorsData[department]) {
        doctorsData[department].forEach(doctor => {
            const option = document.createElement('option');
            option.value = doctor.id;
            option.textContent = doctor.name;
            doctorSelect.appendChild(option);
        });
    }
    
    // Reset doctor details
    resetDoctorDetails();
}

// Update doctor details when a doctor is selected
function updateDoctorDetails() {
    const department = departmentSelect.value;
    const doctorId = parseInt(doctorSelect.value);
    
    if (department && doctorId) {
        const doctor = doctorsData[department].find(d => d.id === doctorId);
        
        if (doctor) {
            // Update doctor image
            document.getElementById('doctorImage').src = doctor.image;
            document.getElementById('doctorImage').alt = doctor.name;
            
            // Update doctor info
            document.getElementById('doctorName').textContent = doctor.name;
            document.getElementById('doctorSpecialty').textContent = doctor.specialty;
            document.getElementById('doctorExperience').textContent = `${doctor.experience} of experience`;
            
            // Update rating
            const starsContainer = document.querySelector('#doctorRating .stars');
            starsContainer.innerHTML = '';
            
            const fullStars = Math.floor(doctor.rating);
            const hasHalfStar = doctor.rating % 1 !== 0;
            
            for (let i = 1; i <= 5; i++) {
                const star = document.createElement('i');
                if (i <= fullStars) {
                    star.className = 'fas fa-star';
                } else if (i === fullStars + 1 && hasHalfStar) {
                    star.className = 'fas fa-star-half-alt';
                } else {
                    star.className = 'far fa-star';
                }
                starsContainer.appendChild(star);
            }
            
            // Update reviews
            document.getElementById('doctorReviews').textContent = `${doctor.reviews} reviews`;
            
            // Update availability
            document.getElementById('doctorAvailability').innerHTML = 
                `<p><strong>Available Days:</strong> ${doctor.availableDays.join(', ')}</p>`;
            
            // Enable date field and set available days
            appointmentDate.disabled = false;
            
            // Populate time slots if date is already selected
            if (appointmentDate.value) {
                populateTimeSlots();
            }
        }
    } else {
        resetDoctorDetails();
    }
    
    updateAppointmentSummary();
}

// Reset doctor details
function resetDoctorDetails() {
    document.getElementById('doctorImage').src = 'https://placehold.co/300x300/0066cc/white?text=Select+Doctor';
    document.getElementById('doctorImage').alt = 'Doctor';
    document.getElementById('doctorName').textContent = 'Select a Doctor';
    document.getElementById('doctorSpecialty').textContent = 'Specialty will appear here';
    document.getElementById('doctorExperience').textContent = 'Experience will appear here';
    
    const starsContainer = document.querySelector('#doctorRating .stars');
    starsContainer.innerHTML = '';
    for (let i = 0; i < 5; i++) {
        const star = document.createElement('i');
        star.className = 'far fa-star';
        starsContainer.appendChild(star);
    }
    
    document.getElementById('doctorReviews').textContent = '0 reviews';
    document.getElementById('doctorAvailability').innerHTML = '<p><strong>Available Days:</strong> Not selected</p>';
    
    // Disable date and time fields
    appointmentDate.disabled = true;
    appointmentTime.disabled = true;
    appointmentTime.innerHTML = '<option value="">Select Time Slot</option>';
}

// Populate time slots based on selected doctor and date
function populateTimeSlots() {
    const department = departmentSelect.value;
    const doctorId = parseInt(doctorSelect.value);
    const date = new Date(appointmentDate.value);
    const day = date.toLocaleDateString('en-US', { weekday: 'long' });
    
    appointmentTime.innerHTML = '<option value="">Select Time Slot</option>';
    appointmentTime.disabled = true;
    
    if (department && doctorId && appointmentDate.value) {
        const doctor = doctorsData[department].find(d => d.id === doctorId);
        
        if (doctor && doctor.availableDays.includes(day)) {
            appointmentTime.disabled = false;
            
            doctor.timeSlots.forEach(slot => {
                const option = document.createElement('option');
                option.value = slot;
                option.textContent = slot;
                appointmentTime.appendChild(option);
            });
        }
    }
    
    updateAppointmentSummary();
}

// Update appointment summary
function updateAppointmentSummary() {
    const date = appointmentDate.value ? new Date(appointmentDate.value).toDateString() : 'Not selected';
    const time = appointmentTime.value || 'Not selected';
    
    // Get selected appointment type
    let type = 'Clinic Visit';
    appointmentTypeRadios.forEach(radio => {
        if (radio.checked) {
            type = radio.value === 'video' ? 'Video Consultation' : 'Clinic Visit';
        }
    });
    
    document.getElementById('summaryDate').textContent = date;
    document.getElementById('summaryTime').textContent = time;
    document.getElementById('summaryType').textContent = type;
}

// Handle form submission
function handleFormSubmission(e) {
    e.preventDefault();
    
    // Validate form
    if (!validateForm()) {
        showNotification('Please fill all required fields correctly.', 'error');
        return;
    }
    
    // Get form data
    const department = departmentSelect.value;
    const doctorId = parseInt(doctorSelect.value);
    const doctor = doctorsData[department].find(d => d.id === doctorId);
    const date = appointmentDate.value;
    const time = appointmentTime.value;
    
    // Get selected appointment type
    let type = 'clinic';
    appointmentTypeRadios.forEach(radio => {
        if (radio.checked) {
            type = radio.value;
        }
    });
    
    const reason = document.getElementById('reason').value;
    
    // Create appointment object
    const appointment = {
        id: Date.now(), // Unique ID
        department: department,
        doctorId: doctorId,
        doctorName: doctor.name,
        doctorSpecialty: doctor.specialty,
        date: date,
        time: time,
        type: type,
        reason: reason,
        status: 'upcoming',
        createdAt: new Date().toISOString()
    };
    
    // Show confirmation modal
    showConfirmationModal(appointment);
}

// Validate form
function validateForm() {
    let isValid = true;
    
    if (!departmentSelect.value) isValid = false;
    if (!doctorSelect.value) isValid = false;
    if (!appointmentDate.value) isValid = false;
    if (!appointmentTime.value) isValid = false;
    
    return isValid;
}

// Show confirmation modal
function showConfirmationModal(appointment) {
    const modal = document.getElementById('confirmationModal');
    const title = document.getElementById('confirmationTitle');
    const message = document.getElementById('confirmationMessage');
    
    title.textContent = 'Confirm Appointment';
    message.innerHTML = `
        <p>Please confirm your appointment details:</p>
        <div class="confirmation-details">
            <p><strong>Doctor:</strong> ${appointment.doctorName}</p>
            <p><strong>Date:</strong> ${new Date(appointment.date).toDateString()}</p>
            <p><strong>Time:</strong> ${appointment.time}</p>
            <p><strong>Type:</strong> ${appointment.type === 'video' ? 'Video Consultation' : 'Clinic Visit'}</p>
        </div>
    `;
    
    modal.style.display = 'block';
    
    // Store appointment data for confirmation
    modal.dataset.appointment = JSON.stringify(appointment);
}

// Execute confirmed action (book appointment)
function executeConfirmedAction() {
    const modal = document.getElementById('confirmationModal');
    const appointment = JSON.parse(modal.dataset.appointment);
    
    // Save appointment
    saveAppointment(appointment);
    
    // Hide modal
    modal.style.display = 'none';
    
    // Show success message
    showNotification('Appointment booked successfully!', 'success');
    
    // Reset form
    appointmentForm.reset();
    resetDoctorDetails();
    updateAppointmentSummary();
    
    // Reload appointments
    loadAppointments();
}

// Save appointment to localStorage
function saveAppointment(appointment) {
    let appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
    appointments.push(appointment);
    localStorage.setItem('appointments', JSON.stringify(appointments));
}

// Load appointments from localStorage
function loadAppointments() {
    const appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
    
    // Filter appointments by status
    const upcoming = appointments.filter(a => a.status === 'upcoming');
    const completed = appointments.filter(a => a.status === 'completed');
    const cancelled = appointments.filter(a => a.status === 'cancelled');
    
    // Display appointments
    displayAppointments(upcoming, 'upcomingAppointments');
    displayAppointments(completed, 'completedAppointments');
    displayAppointments(cancelled, 'cancelledAppointments');
}

// Display appointments in the UI
function displayAppointments(appointments, containerId) {
    const container = document.getElementById(containerId);
    
    if (appointments.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-calendar-${containerId === 'upcomingAppointments' ? 'plus' : 
                                          containerId === 'completedAppointments' ? 'check' : 'times'}"></i>
                <h3>No ${containerId.replace('Appointments', '').toLowerCase()} appointments</h3>
                <p>${containerId === 'upcomingAppointments' ? 'Book your first appointment to get started' : 
                    `Your ${containerId.replace('Appointments', '').toLowerCase()} appointments will appear here`}</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = '';
    
    appointments.forEach(appointment => {
        const appointmentElement = createAppointmentElement(appointment);
        container.appendChild(appointmentElement);
    });
}

// Create appointment element for display
function createAppointmentElement(appointment) {
    const element = document.createElement('div');
    element.className = 'appointment-item';
    element.dataset.id = appointment.id;
    
    const date = new Date(appointment.date);
    const formattedDate = date.toLocaleDateString('en-US', { 
        weekday: 'short', 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
    });
    
    element.innerHTML = `
        <div class="appointment-header">
            <h3>${appointment.doctorName} <span>(${appointment.doctorSpecialty})</span></h3>
            <span class="status-badge ${appointment.status}">${appointment.status}</span>
        </div>
        <div class="appointment-details">
            <p><i class="fas fa-calendar-alt"></i> ${formattedDate}</p>
            <p><i class="fas fa-clock"></i> ${appointment.time}</p>
            <p><i class="fas ${appointment.type === 'video' ? 'fa-video' : 'fa-clinic-medical'}"></i> 
                ${appointment.type === 'video' ? 'Video Consultation' : 'Clinic Visit'}</p>
        </div>
        <div class="appointment-actions">
            ${appointment.status === 'upcoming' ? `
                <button class="btn-outline view-btn">View Details</button>
                <button class="btn-outline cancel-btn">Cancel</button>
            ` : `
                <button class="btn-outline view-btn">View Details</button>
            `}
        </div>
    `;
    
    // Add event listeners to buttons
    const viewBtn = element.querySelector('.view-btn');
    viewBtn.addEventListener('click', () => viewAppointmentDetails(appointment));
    
    if (appointment.status === 'upcoming') {
        const cancelBtn = element.querySelector('.cancel-btn');
        cancelBtn.addEventListener('click', () => cancelAppointment(appointment.id));
    }
    
    return element;
}

// View appointment details
function viewAppointmentDetails(appointment) {
    const modalBody = document.getElementById('appointmentModalBody');
    const date = new Date(appointment.date);
    const formattedDate = date.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
    
    modalBody.innerHTML = `
        <div class="appointment-detail">
            <h2>Appointment Details</h2>
            <div class="detail-section">
                <h3>Doctor Information</h3>
                <p><strong>Name:</strong> ${appointment.doctorName}</p>
                <p><strong>Specialty:</strong> ${appointment.doctorSpecialty}</p>
                <p><strong>Department:</strong> ${appointment.department.charAt(0).toUpperCase() + appointment.department.slice(1)}</p>
            </div>
            <div class="detail-section">
                <h3>Appointment Information</h3>
                <p><strong>Date:</strong> ${formattedDate}</p>
                <p><strong>Time:</strong> ${appointment.time}</p>
                <p><strong>Type:</strong> ${appointment.type === 'video' ? 'Video Consultation' : 'Clinic Visit'}</p>
                <p><strong>Status:</strong> <span class="status-badge ${appointment.status}">${appointment.status}</span></p>
            </div>
            ${appointment.reason ? `
            <div class="detail-section">
                <h3>Reason for Visit</h3>
                <p>${appointment.reason}</p>
            </div>
            ` : ''}
            <div class="detail-actions">
                ${appointment.status === 'upcoming' ? `
                    <button class="btn-primary" id="rescheduleBtn">Reschedule</button>
                    <button class="btn-outline" id="cancelDetailBtn">Cancel Appointment</button>
                ` : ''}
            </div>
        </div>
    `;
    
    // Add event listeners to buttons
    if (appointment.status === 'upcoming') {
        document.getElementById('cancelDetailBtn').addEventListener('click', () => {
            appointmentModal.style.display = 'none';
            cancelAppointment(appointment.id);
        });
        
        document.getElementById('rescheduleBtn').addEventListener('click', () => {
            appointmentModal.style.display = 'none';
            // In a real app, this would open a rescheduling interface
            showNotification('Rescheduling feature coming soon!', 'info');
        });
    }
    
    appointmentModal.style.display = 'block';
}

// Cancel appointment
function cancelAppointment(appointmentId) {
    const modal = document.getElementById('confirmationModal');
    const title = document.getElementById('confirmationTitle');
    const message = document.getElementById('confirmationMessage');
    
    title.textContent = 'Cancel Appointment';
    message.textContent = 'Are you sure you want to cancel this appointment?';
    
    modal.style.display = 'block';
    modal.dataset.appointmentId = appointmentId;
    modal.dataset.action = 'cancel';
}

// Switch between tabs
function switchTab(e) {
    const tabId = e.target.dataset.tab;
    
    // Update tab buttons
    tabButtons.forEach(btn => {
        btn.classList.remove('active');
    });
    e.target.classList.add('active');
    
    // Update tab panes
    document.querySelectorAll('.tab-pane').forEach(pane => {
        pane.classList.remove('active');
    });
    document.getElementById(tabId).classList.add('active');
}

// Show notification
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => {
        notification.remove();
    });
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button class="close-notification">&times;</button>
    `;
    
    // Add to body
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Auto hide after 5 seconds
    setTimeout(() => {
        hideNotification(notification);
    }, 5000);
    
    // Close button event
    notification.querySelector('.close-notification').addEventListener('click', () => {
        hideNotification(notification);
    });
}

// Hide notification
function hideNotification(notification) {
    notification.classList.remove('show');
    setTimeout(() => {
        notification.remove();
    }, 300);
}

// Handle confirmed action from modal (cancel appointment)
document.getElementById('confirmAction').addEventListener('click', function() {
    const modal = document.getElementById('confirmationModal');
    const action = modal.dataset.action;
    const appointmentId = modal.dataset.appointmentId;
    
    if (action === 'cancel' && appointmentId) {
        // Cancel the appointment
        let appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
        const appointmentIndex = appointments.findIndex(a => a.id == appointmentId);
        
        if (appointmentIndex !== -1) {
            appointments[appointmentIndex].status = 'cancelled';
            localStorage.setItem('appointments', JSON.stringify(appointments));
            
            // Show notification
            showNotification('Appointment cancelled successfully.', 'success');
            
            // Reload appointments
            loadAppointments();
        }
    }
    
    // Hide modal
    modal.style.display = 'none';
});