// health-records.js

// DOM Elements
const addRecordBtn = document.getElementById('addRecordBtn');
const shareRecordsBtn = document.getElementById('shareRecordsBtn');
const addRecordModal = document.getElementById('addRecordModal');
const shareRecordsModal = document.getElementById('shareRecordsModal');
const recordDetailsModal = document.getElementById('recordDetailsModal');
const closeModalButtons = document.querySelectorAll('.close-modal');
const cancelAddRecord = document.getElementById('cancelAddRecord');
const cancelShare = document.getElementById('cancelShare');
const addRecordForm = document.getElementById('addRecordForm');
const shareRecordsForm = document.getElementById('shareRecordsForm');
const recordsList = document.getElementById('recordsList');
const recordDetails = document.getElementById('recordDetails');
const recordTypeFilter = document.getElementById('recordTypeFilter');
const searchRecords = document.getElementById('searchRecords');
const recordsToShare = document.getElementById('recordsToShare');

// Sample health records data (in a real app, this would come from an API)
let healthRecords = [
    {
        id: 1,
        type: 'lab',
        title: 'Complete Blood Count',
        date: '2023-10-15',
        provider: 'Nabha Medical Center',
        description: 'Routine blood test to check overall health and detect disorders',
        file: null
    },
    {
        id: 2,
        type: 'prescription',
        title: 'Hypertension Medication',
        date: '2023-10-10',
        provider: 'Dr. Sharma',
        description: 'Medication for blood pressure management',
        file: null
    },
    {
        id: 3,
        type: 'consultation',
        title: 'Cardiology Consultation',
        date: '2023-10-05',
        provider: 'Dr. Gupta - Cardiology',
        description: 'Follow-up consultation for heart health',
        file: null
    },
    {
        id: 4,
        type: 'lab',
        title: 'Vitamin D Test',
        date: '2023-09-28',
        provider: 'City Diagnostics',
        description: 'Test to check vitamin D levels in blood',
        file: null
    },
    {
        id: 5,
        type: 'vaccination',
        title: 'Influenza Vaccine',
        date: '2023-09-20',
        provider: 'Nabha Public Health Center',
        description: 'Annual flu vaccination',
        file: null
    },
    {
        id: 6,
        type: 'other',
        title: 'X-Ray Report - Chest',
        date: '2023-09-15',
        provider: 'Nabha Medical Center',
        description: 'X-ray examination of chest area',
        file: null
    }
];

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    // Set current date as default for new records
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const todayStr = `${yyyy}-${mm}-${dd}`;
    document.getElementById('recordDate').value = todayStr;
    
    // Load health records
    loadHealthRecords();
    
    // Set up event listeners
    setupEventListeners();
    
    // Update dashboard counts
    updateDashboardCounts();
});

// Set up event listeners
function setupEventListeners() {
    // Add record button
    addRecordBtn.addEventListener('click', () => {
        addRecordModal.style.display = 'block';
    });
    
    // Share records button
    shareRecordsBtn.addEventListener('click', () => {
        populateRecordsToShare();
        shareRecordsModal.style.display = 'block';
    });
    
    // Close modal buttons
    closeModalButtons.forEach(button => {
        button.addEventListener('click', () => {
            addRecordModal.style.display = 'none';
            shareRecordsModal.style.display = 'none';
            recordDetailsModal.style.display = 'none';
        });
    });
    
    // Cancel buttons
    cancelAddRecord.addEventListener('click', () => {
        addRecordModal.style.display = 'none';
    });
    
    cancelShare.addEventListener('click', () => {
        shareRecordsModal.style.display = 'none';
    });
    
    // Form submissions
    addRecordForm.addEventListener('submit', handleAddRecord);
    shareRecordsForm.addEventListener('submit', handleShareRecords);
    
    // Filter and search
    recordTypeFilter.addEventListener('change', filterRecords);
    searchRecords.addEventListener('input', filterRecords);
    
    // Click outside modal to close
    window.addEventListener('click', (e) => {
        if (e.target === addRecordModal) {
            addRecordModal.style.display = 'none';
        }
        if (e.target === shareRecordsModal) {
            shareRecordsModal.style.display = 'none';
        }
        if (e.target === recordDetailsModal) {
            recordDetailsModal.style.display = 'none';
        }
    });
}

// Load health records into the UI
function loadHealthRecords() {
    // Clear existing records
    recordsList.innerHTML = '';
    
    if (healthRecords.length === 0) {
        recordsList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-file-medical"></i>
                <h3>No health records found</h3>
                <p>Add your first health record to get started</p>
            </div>
        `;
        return;
    }
    
    // Sort records by date (newest first)
    const sortedRecords = [...healthRecords].sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // Add records to the list
    sortedRecords.forEach(record => {
        const recordElement = createRecordElement(record);
        recordsList.appendChild(recordElement);
    });
}

// Create a record element for the list
function createRecordElement(record) {
    const element = document.createElement('div');
    element.className = 'record-item';
    element.dataset.id = record.id;
    
    const date = new Date(record.date);
    const formattedDate = date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
    });
    
    element.innerHTML = `
        <div class="record-header">
            <span class="record-title">${record.title}</span>
            <span class="record-date">${formattedDate}</span>
        </div>
        <div class="record-type ${record.type}">${getRecordTypeLabel(record.type)}</div>
        <div class="record-provider">${record.provider}</div>
    `;
    
    // Add click event to show details
    element.addEventListener('click', () => {
        // Remove selected class from all items
        document.querySelectorAll('.record-item').forEach(item => {
            item.classList.remove('selected');
        });
        
        // Add selected class to clicked item
        element.classList.add('selected');
        
        // Show record details
        showRecordDetails(record);
    });
    
    return element;
}

// Get readable label for record type
function getRecordTypeLabel(type) {
    const typeLabels = {
        'lab': 'Lab Report',
        'prescription': 'Prescription',
        'consultation': 'Consultation',
        'vaccination': 'Vaccination',
        'other': 'Other'
    };
    
    return typeLabels[type] || 'Unknown';
}

// Show record details
function showRecordDetails(record) {
    const date = new Date(record.date);
    const formattedDate = date.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
    
    recordDetails.innerHTML = `
        <div class="record-details-content">
            <div class="record-details-header">
                <div>
                    <h2 class="record-details-title">${record.title}</h2>
                    <p class="record-details-date">${formattedDate}</p>
                </div>
                <span class="record-details-type ${record.type}">${getRecordTypeLabel(record.type)}</span>
            </div>
            
            <div class="record-details-provider">
                <strong>Healthcare Provider:</strong> ${record.provider}
            </div>
            
            <div class="record-details-description">
                <strong>Description:</strong><br>
                ${record.description || 'No description provided.'}
            </div>
            
            ${record.file ? `
            <div class="record-details-file">
                <strong>Attached File:</strong><br>
                <a href="#" class="btn-outline"><i class="fas fa-download"></i> Download File</a>
            </div>
            ` : ''}
            
            <div class="record-details-actions">
                <button class="btn-outline" onclick="shareSingleRecord(${record.id})">
                    <i class="fas fa-share-alt"></i> Share
                </button>
                <button class="btn-primary" onclick="editRecord(${record.id})">
                    <i class="fas fa-edit"></i> Edit
                </button>
            </div>
        </div>
    `;
}

// Filter records based on type and search query
function filterRecords() {
    const type = recordTypeFilter.value;
    const query = searchRecords.value.toLowerCase();
    
    const filteredRecords = healthRecords.filter(record => {
        const matchesType = type === 'all' || record.type === type;
        const matchesQuery = record.title.toLowerCase().includes(query) || 
                            record.provider.toLowerCase().includes(query) ||
                            (record.description && record.description.toLowerCase().includes(query));
        
        return matchesType && matchesQuery;
    });
    
    // Clear existing records
    recordsList.innerHTML = '';
    
    if (filteredRecords.length === 0) {
        recordsList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-search"></i>
                <h3>No records found</h3>
                <p>Try adjusting your search or filter criteria</p>
            </div>
        `;
        return;
    }
    
    // Sort records by date (newest first)
    const sortedRecords = [...filteredRecords].sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // Add filtered records to the list
    sortedRecords.forEach(record => {
        const recordElement = createRecordElement(record);
        recordsList.appendChild(recordElement);
    });
}

// Handle add record form submission
function handleAddRecord(e) {
    e.preventDefault();
    
    const type = document.getElementById('recordType').value;
    const title = document.getElementById('recordTitle').value;
    const date = document.getElementById('recordDate').value;
    const provider = document.getElementById('recordProvider').value;
    const description = document.getElementById('recordDescription').value;
    const file = document.getElementById('recordFile').files[0];
    
    // Create new record object
    const newRecord = {
        id: Date.now(), // Use timestamp as unique ID
        type: type,
        title: title,
        date: date,
        provider: provider,
        description: description,
        file: file
    };
    
    // Add to records array
    healthRecords.push(newRecord);
    
    // Save to localStorage (in a real app, this would be an API call)
    saveRecordsToStorage();
    
    // Reload records
    loadHealthRecords();
    
    // Update dashboard counts
    updateDashboardCounts();
    
    // Close modal and reset form
    addRecordModal.style.display = 'none';
    addRecordForm.reset();
    
    // Show success message
    showNotification('Health record added successfully!', 'success');
}

// Handle share records form submission
function handleShareRecords(e) {
    e.preventDefault();
    
    const email = document.getElementById('shareEmail').value;
    const message = document.getElementById('shareMessage').value;
    const expiry = document.getElementById('shareExpiry').value;
    
    // Get selected records to share
    const selectedRecords = [];
    document.querySelectorAll('#recordsToShare input:checked').forEach(checkbox => {
        selectedRecords.push(checkbox.value);
    });
    
    if (selectedRecords.length === 0) {
        showNotification('Please select at least one record to share.', 'error');
        return;
    }
    
    // In a real app, this would make an API call to share records
    console.log('Sharing records:', {
        email: email,
        message: message,
        expiry: expiry,
        records: selectedRecords
    });
    
    // Close modal and reset form
    shareRecordsModal.style.display = 'none';
    shareRecordsForm.reset();
    
    // Show success message
    showNotification('Health records shared successfully!', 'success');
}

// Populate records to share in the modal
function populateRecordsToShare() {
    recordsToShare.innerHTML = '';
    
    if (healthRecords.length === 0) {
        recordsToShare.innerHTML = '<p>No records available to share.</p>';
        return;
    }
    
    // Sort records by date (newest first)
    const sortedRecords = [...healthRecords].sort((a, b) => new Date(b.date) - new Date(a.date));
    
    sortedRecords.forEach(record => {
        const recordElement = document.createElement('div');
        recordElement.className = 'record-to-share';
        
        const date = new Date(record.date);
        const formattedDate = date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        });
        
        recordElement.innerHTML = `
            <input type="checkbox" id="share-${record.id}" value="${record.id}">
            <label for="share-${record.id}">
                <strong>${record.title}</strong> (${formattedDate}) - ${getRecordTypeLabel(record.type)}
            </label>
        `;
        
        recordsToShare.appendChild(recordElement);
    });
}

// Share a single record
function shareSingleRecord(recordId) {
    const record = healthRecords.find(r => r.id === recordId);
    
    if (!record) return;
    
    // Populate share modal with this record pre-selected
    populateRecordsToShare();
    
    // Check the specific record
    const checkbox = document.getElementById(`share-${recordId}`);
    if (checkbox) {
        checkbox.checked = true;
    }
    
    // Show the share modal
    shareRecordsModal.style.display = 'block';
}

// Edit a record
function editRecord(recordId) {
    const record = healthRecords.find(r => r.id === recordId);
    
    if (!record) return;
    
    // Populate the add record form with existing data
    document.getElementById('recordType').value = record.type;
    document.getElementById('recordTitle').value = record.title;
    document.getElementById('recordDate').value = record.date;
    document.getElementById('recordProvider').value = record.provider;
    document.getElementById('recordDescription').value = record.description || '';
    
    // Change the form to update mode
    addRecordForm.dataset.editId = recordId;
    
    // Change the modal title and button text
    document.querySelector('#addRecordModal .modal-header h3').textContent = 'Edit Health Record';
    document.querySelector('#addRecordForm button[type="submit"]').textContent = 'Update Record';
    
    // Show the modal
    addRecordModal.style.display = 'block';
}

// Update dashboard counts
function updateDashboardCounts() {
    const reportsCount = healthRecords.filter(r => r.type === 'lab').length;
    const prescriptionsCount = healthRecords.filter(r => r.type === 'prescription').length;
    const consultationsCount = healthRecords.filter(r => r.type === 'consultation').length;
    const allergiesCount = healthRecords.filter(r => r.type === 'other').length; // Assuming allergies are stored as 'other'
    
    document.getElementById('reportsCount').textContent = reportsCount;
    document.getElementById('prescriptionsCount').textContent = prescriptionsCount;
    document.getElementById('consultationsCount').textContent = consultationsCount;
    document.getElementById('allergiesCount').textContent = allergiesCount;
}

// Save records to localStorage
function saveRecordsToStorage() {
    localStorage.setItem('healthRecords', JSON.stringify(healthRecords));
}

// Load records from localStorage
function loadRecordsFromStorage() {
    const storedRecords = localStorage.getItem('healthRecords');
    if (storedRecords) {
        healthRecords = JSON.parse(storedRecords);
    }
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
    
    // Add styles if not already added
    if (!document.querySelector('#notification-styles')) {
        const styles = document.createElement('style');
        styles.id = 'notification-styles';
        styles.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 15px 20px;
                border-radius: 5px;
                color: white;
                z-index: 1000;
                opacity: 0;
                transform: translateX(100%);
                transition: all 0.3s ease;
                display: flex;
                align-items: center;
                justify-content: space-between;
                min-width: 300px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            }
            
            .notification.show {
                opacity: 1;
                transform: translateX(0);
            }
            
            .notification.success {
                background-color: #4CAF50;
            }
            
            .notification.error {
                background-color: #F44336;
            }
            
            .notification.info {
                background-color: #2196F3;
            }
            
            .close-notification {
                background: none;
                border: none;
                color: white;
                font-size: 20px;
                cursor: pointer;
                margin-left: 15px;
            }
        `;
        document.head.appendChild(styles);
    }
    
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

// Initialize the application
function initApp() {
    loadRecordsFromStorage();
    loadHealthRecords();
    updateDashboardCounts();
}

// Start the application
initApp();