document.addEventListener('DOMContentLoaded', function() {
    const viewToggle = document.getElementById('viewToggle');
    const patientOption = document.querySelector('.patient-option');
    const doctorOption = document.querySelector('.doctor-option');
    const patientForm = document.querySelector('.patient-form');
    const doctorForm = document.querySelector('.doctor-form');
    const togglePassword = document.querySelector('.toggle-password');
    const passwordField = document.getElementById('password');
    
    // Check if we have a saved preference
    const isDoctorView = localStorage.getItem('loginView') === 'doctor';
    
    // Set initial state
    if (isDoctorView) {
        viewToggle.checked = true;
        patientOption.classList.remove('active');
        doctorOption.classList.add('active');
        patientForm.classList.remove('active');
        doctorForm.classList.add('active');
    }
    
    // Toggle view when switch is clicked
    viewToggle.addEventListener('change', function() {
        if (this.checked) {
            switchToDoctorView();
        } else {
            switchToPatientView();
        }
    });
    
    // Also allow clicking on the options to toggle
    patientOption.addEventListener('click', function() {
        if (viewToggle.checked) {
            viewToggle.checked = false;
            switchToPatientView();
        }
    });
    
    doctorOption.addEventListener('click', function() {
        if (!viewToggle.checked) {
            viewToggle.checked = true;
            switchToDoctorView();
        }
    });
    
    // Toggle password visibility
    if (togglePassword && passwordField) {
        togglePassword.addEventListener('click', function() {
            const type = passwordField.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordField.setAttribute('type', type);
            this.classList.toggle('fa-eye');
            this.classList.toggle('fa-eye-slash');
        });
    }
    
    // Send OTP button functionality
    const sendOtpBtn = document.getElementById('sendOtpBtn');
    if (sendOtpBtn) {
        sendOtpBtn.addEventListener('click', function() {
            const mobileInput = document.getElementById('mobile');
            const mobileNumber = mobileInput.value.trim();
            
            if (!validateMobileNumber(mobileNumber)) {
                showError(mobileInput, 'Please enter a valid 10-digit mobile number');
                return;
            }
            
            // Simulate OTP sending
            this.textContent = 'Sending OTP...';
            this.disabled = true;
            
            setTimeout(() => {
                this.textContent = 'OTP Sent!';
                setTimeout(() => {
                    this.textContent = 'Send OTP';
                    this.disabled = false;
                    // In a real application, you would redirect to OTP verification page
                    alert('OTP has been sent to ' + mobileNumber);
                }, 2000);
            }, 1500);
        });
    }
    
    // Doctor login button functionality
    const doctorLoginBtn = document.getElementById('doctorLoginBtn');
    if (doctorLoginBtn) {
        doctorLoginBtn.addEventListener('click', function() {
            const doctorId = document.getElementById('doctorId').value.trim();
            const password = document.getElementById('password').value;
            
            if (!doctorId) {
                showError(document.getElementById('doctorId'), 'Please enter your Doctor ID');
                return;
            }
            
            if (!password) {
                showError(document.getElementById('password'), 'Please enter your password');
                return;
            }
            
            // Simulate login process
            this.textContent = 'Logging in...';
            this.disabled = true;
            
            setTimeout(() => {
                alert('Login successful! Redirecting to doctor dashboard...');
                this.textContent = 'Login';
                this.disabled = false;
                // In a real application, you would redirect to doctor dashboard
            }, 1500);
        });
    }
    
    // Input validation on typing
    const mobileInput = document.getElementById('mobile');
    if (mobileInput) {
        mobileInput.addEventListener('input', function() {
            this.value = this.value.replace(/[^0-9]/g, '');
            if (this.value.length > 10) {
                this.value = this.value.slice(0, 10);
            }
            clearError(this);
        });
    }
    
    // Clear error when typing in doctor ID field
    const doctorIdInput = document.getElementById('doctorId');
    if (doctorIdInput) {
        doctorIdInput.addEventListener('input', function() {
            clearError(this);
        });
    }
    
    // Clear error when typing in password field
    if (passwordField) {
        passwordField.addEventListener('input', function() {
            clearError(this);
        });
    }
    
    // Helper functions
    function switchToDoctorView() {
        patientOption.classList.remove('active');
        doctorOption.classList.add('active');
        patientForm.classList.remove('active');
        setTimeout(() => {
            doctorForm.classList.add('active');
        }, 50);
        localStorage.setItem('loginView', 'doctor');
    }
    
    function switchToPatientView() {
        patientOption.classList.add('active');
        doctorOption.classList.remove('active');
        doctorForm.classList.remove('active');
        setTimeout(() => {
            patientForm.classList.add('active');
        }, 50);
        localStorage.setItem('loginView', 'patient');
    }
    
    function validateMobileNumber(number) {
        return /^[0-9]{10}$/.test(number);
    }
    
    function showError(input, message) {
        clearError(input);
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.style.color = '#e74c3c';
        errorDiv.style.fontSize = '0.8rem';
        errorDiv.style.marginTop = '5px';
        errorDiv.textContent = message;
        input.parentNode.parentNode.appendChild(errorDiv);
        input.style.borderColor = '#e74c3c';
    }
    
    function clearError(input) {
        const errorDiv = input.parentNode.parentNode.querySelector('.error-message');
        if (errorDiv) {
            errorDiv.remove();
        }
        input.style.borderColor = '#e1e5eb';
    }
    
    // Add CSS for error messages
    const style = document.createElement('style');
    style.textContent = `
        .error-message {
            color: #e74c3c;
            font-size: 0.8rem;
            margin-top: 5px;
        }
        
        .shake {
            animation: shake 0.5s;
        }
        
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
            20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
    `;
    document.head.appendChild(style);
});