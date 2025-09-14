document.addEventListener('DOMContentLoaded', function() {
    // Toggle between patient and doctor forms
    const viewToggle = document.getElementById('viewToggle');
    const patientOption = document.querySelector('.patient-option');
    const doctorOption = document.querySelector('.doctor-option');
    const patientForm = document.getElementById('patientForm');
    const doctorForm = document.getElementById('doctorForm');
    
    // Toggle form view based on switch
    viewToggle.addEventListener('change', function() {
        if (this.checked) {
            patientForm.classList.remove('active');
            doctorForm.classList.add('active');
            patientOption.classList.remove('active');
            doctorOption.classList.add('active');
        } else {
            doctorForm.classList.remove('active');
            patientForm.classList.add('active');
            doctorOption.classList.remove('active');
            patientOption.classList.add('active');
        }
    });
    
    // Also allow clicking on the options to toggle
    patientOption.addEventListener('click', function() {
        viewToggle.checked = false;
        viewToggle.dispatchEvent(new Event('change'));
    });
    
    doctorOption.addEventListener('click', function() {
        viewToggle.checked = true;
        viewToggle.dispatchEvent(new Event('change'));
    });
    
    // Password visibility toggles
    setupPasswordToggle('togglePassword', 'password');
    setupPasswordToggle('toggleConfirmPassword', 'confirmPassword');
    setupPasswordToggle('toggleDoctorPassword', 'doctorPassword');
    setupPasswordToggle('toggleConfirmDoctorPassword', 'confirmDoctorPassword');
    
    // Password strength indicator
    setupPasswordStrengthMeter('password', 'passwordStrength');
    setupPasswordStrengthMeter('doctorPassword', 'doctorPasswordStrength');
    
    // Form validation
    setupFormValidation('patientForm', validatePatientForm);
    setupFormValidation('doctorForm', validateDoctorForm);
    
    // Input formatting
    setupInputFormatting();
});

// Function to setup password visibility toggle
function setupPasswordToggle(toggleId, inputId) {
    const toggle = document.getElementById(toggleId);
    if (toggle) {
        toggle.addEventListener('click', function() {
            const passwordInput = document.getElementById(inputId);
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                this.classList.remove('fa-eye');
                this.classList.add('fa-eye-slash');
            } else {
                passwordInput.type = 'password';
                this.classList.remove('fa-eye-slash');
                this.classList.add('fa-eye');
            }
        });
    }
}

// Function to setup password strength meter
function setupPasswordStrengthMeter(passwordId, strengthMeterId) {
    const passwordInput = document.getElementById(passwordId);
    const strengthMeter = document.getElementById(strengthMeterId);
    
    if (passwordInput && strengthMeter) {
        passwordInput.addEventListener('input', function() {
            const password = this.value;
            const strengthBar = strengthMeter.querySelector('.strength-bar');
            const strengthText = strengthMeter.querySelector('.strength-text');
            
            // Calculate password strength
            let strength = 0;
            let remarks = '';
            
            if (password.length >= 8) strength += 20;
            if (/[A-Z]/.test(password)) strength += 20;
            if (/[a-z]/.test(password)) strength += 20;
            if (/[0-9]/.test(password)) strength += 20;
            if (/[^A-Za-z0-9]/.test(password)) strength += 20;
            
            // Update strength bar and text
            strengthBar.style.width = strength + '%';
            
            if (strength < 40) {
                strengthBar.style.backgroundColor = '#e03131';
                remarks = 'Weak';
            } else if (strength < 80) {
                strengthBar.style.backgroundColor = '#fcc419';
                remarks = 'Medium';
            } else {
                strengthBar.style.backgroundColor = '#2f9e44';
                remarks = 'Strong';
            }
            
            strengthText.textContent = password.length > 0 ? remarks : 'Password strength';
        });
    }
}

// Function to setup form validation
function setupFormValidation(formId, validationFunction) {
    const form = document.getElementById(formId);
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            validationFunction();
        });
    }
}

// Function to validate patient form
function validatePatientForm() {
    let isValid = true;
    
    // Reset error messages
    const errorElements = document.querySelectorAll('#patientForm .error-message');
    errorElements.forEach(el => el.textContent = '');
    
    // Validate full name
    const fullName = document.getElementById('fullName');
    if (!fullName.value.trim()) {
        document.getElementById('nameError').textContent = 'Full name is required';
        isValid = false;
    }
    
    // Validate email
    const email = document.getElementById('email');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.value.trim()) {
        document.getElementById('emailError').textContent = 'Email is required';
        isValid = false;
    } else if (!emailRegex.test(email.value)) {
        document.getElementById('emailError').textContent = 'Please enter a valid email address';
        isValid = false;
    }
    
    // Validate mobile
    const mobile = document.getElementById('mobile');
    const mobileRegex = /^[0-9]{10}$/;
    if (!mobile.value.trim()) {
        document.getElementById('mobileError').textContent = 'Mobile number is required';
        isValid = false;
    } else if (!mobileRegex.test(mobile.value)) {
        document.getElementById('mobileError').textContent = 'Please enter a valid 10-digit mobile number';
        isValid = false;
    }
    
    // Validate date of birth
    const dob = document.getElementById('dob');
    if (!dob.value) {
        document.getElementById('dobError').textContent = 'Date of birth is required';
        isValid = false;
    } else {
        const birthDate = new Date(dob.value);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        
        if (age < 0) {
            document.getElementById('dobError').textContent = 'Date of birth cannot be in the future';
            isValid = false;
        } else if (age < 5) {
            document.getElementById('dobError').textContent = 'You must be at least 5 years old';
            isValid = false;
        }
    }
    
    // Validate gender
    const gender = document.getElementById('gender');
    if (!gender.value) {
        document.getElementById('genderError').textContent = 'Please select your gender';
        isValid = false;
    }
    
    // Validate password
    const password = document.getElementById('password');
    if (!password.value) {
        document.getElementById('passwordError').textContent = 'Password is required';
        isValid = false;
    } else if (password.value.length < 8) {
        document.getElementById('passwordError').textContent = 'Password must be at least 8 characters long';
        isValid = false;
    }
    
    // Validate confirm password
    const confirmPassword = document.getElementById('confirmPassword');
    if (!confirmPassword.value) {
        document.getElementById('confirmPasswordError').textContent = 'Please confirm your password';
        isValid = false;
    } else if (confirmPassword.value !== password.value) {
        document.getElementById('confirmPasswordError').textContent = 'Passwords do not match';
        isValid = false;
    }
    
    // Validate terms
    const terms = document.getElementById('patientTerms');
    if (!terms.checked) {
        document.getElementById('termsError').textContent = 'You must agree to the terms and conditions';
        isValid = false;
    }
    
    // If form is valid, show success message (in a real app, you would submit the form)
    if (isValid) {
        alert('Patient account created successfully!');
        // In a real application, you would submit the form to a server here
        // patientForm.submit();
    }
    
    return isValid;
}

// Function to validate doctor form
function validateDoctorForm() {
    let isValid = true;
    
    // Reset error messages
    const errorElements = document.querySelectorAll('#doctorForm .error-message');
    errorElements.forEach(el => el.textContent = '');
    
    // Validate doctor name
    const doctorName = document.getElementById('doctorName');
    if (!doctorName.value.trim()) {
        document.getElementById('doctorNameError').textContent = 'Full name is required';
        isValid = false;
    }
    
    // Validate doctor email
    const doctorEmail = document.getElementById('doctorEmail');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!doctorEmail.value.trim()) {
        document.getElementById('doctorEmailError').textContent = 'Email is required';
        isValid = false;
    } else if (!emailRegex.test(doctorEmail.value)) {
        document.getElementById('doctorEmailError').textContent = 'Please enter a valid email address';
        isValid = false;
    }
    
    // Validate doctor mobile
    const doctorMobile = document.getElementById('doctorMobile');
    const mobileRegex = /^[0-9]{10}$/;
    if (!doctorMobile.value.trim()) {
        document.getElementById('doctorMobileError').textContent = 'Mobile number is required';
        isValid = false;
    } else if (!mobileRegex.test(doctorMobile.value)) {
        document.getElementById('doctorMobileError').textContent = 'Please enter a valid 10-digit mobile number';
        isValid = false;
    }
    
    // Validate specialization
    const specialization = document.getElementById('specialization');
    if (!specialization.value) {
        document.getElementById('specializationError').textContent = 'Please select your specialization';
        isValid = false;
    }
    
    // Validate qualification
    const qualification = document.getElementById('qualification');
    if (!qualification.value.trim()) {
        document.getElementById('qualificationError').textContent = 'Qualification is required';
        isValid = false;
    }
    
    // Validate license
    const license = document.getElementById('license');
    if (!license.value.trim()) {
        document.getElementById('licenseError').textContent = 'Medical license number is required';
        isValid = false;
    }
    
    // Validate password
    const doctorPassword = document.getElementById('doctorPassword');
    if (!doctorPassword.value) {
        document.getElementById('doctorPasswordError').textContent = 'Password is required';
        isValid = false;
    } else if (doctorPassword.value.length < 8) {
        document.getElementById('doctorPasswordError').textContent = 'Password must be at least 8 characters long';
        isValid = false;
    }
    
    // Validate confirm password
    const confirmDoctorPassword = document.getElementById('confirmDoctorPassword');
    if (!confirmDoctorPassword.value) {
        document.getElementById('confirmDoctorPasswordError').textContent = 'Please confirm your password';
        isValid = false;
    } else if (confirmDoctorPassword.value !== doctorPassword.value) {
        document.getElementById('confirmDoctorPasswordError').textContent = 'Passwords do not match';
        isValid = false;
    }
    
    // Validate terms
    const doctorTerms = document.getElementById('doctorTerms');
    if (!doctorTerms.checked) {
        document.getElementById('doctorTermsError').textContent = 'You must agree to the terms and conditions';
        isValid = false;
    }
    
    // If form is valid, show success message (in a real app, you would submit the form)
    if (isValid) {
        alert('Doctor account created successfully!');
        // In a real application, you would submit the form to a server here
        // doctorForm.submit();
    }
    
    return isValid;
}

// Function to setup input formatting
function setupInputFormatting() {
    // Format mobile numbers to only allow digits
    const mobileInputs = document.querySelectorAll('input[type="tel"]');
    mobileInputs.forEach(input => {
        input.addEventListener('input', function() {
            this.value = this.value.replace(/[^0-9]/g, '');
        });
    });
    
    // Format pincode to only allow digits
    const pincodeInput = document.getElementById('pincode');
    if (pincodeInput) {
        pincodeInput.addEventListener('input', function() {
            this.value = this.value.replace(/[^0-9]/g, '');
        });
    }
    
    // Prevent negative values in experience field
    const experienceInput = document.getElementById('experience');
    if (experienceInput) {
        experienceInput.addEventListener('input', function() {
            if (this.value < 0) this.value = 0;
            if (this.value > 50) this.value = 50;
        });
    }
}