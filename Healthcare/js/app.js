// Main application script
document.addEventListener('DOMContentLoaded', function() {
    // Initialize modules
    const diseaseDB = diseaseDatabase;
    const healthAI = healthcareAI;
    const user = userData;
    
    // DOM Elements
    const sections = document.querySelectorAll('.section');
    const navLinks = document.querySelectorAll('.nav-link');
    const symptomInput = document.getElementById('symptom-input');
    const analyzeBtn = document.getElementById('analyze-btn');
    const diseaseResults = document.getElementById('disease-results');
    const precautionResults = document.getElementById('precaution-results');
    const findHospitalBtn = document.getElementById('find-hospital-btn');
    const bookAppointmentBtn = document.getElementById('book-appointment-btn');
    const emergencyBtn = document.getElementById('emergency-btn');
    const emergencyModal = document.getElementById('emergency-modal');
    const closeModalBtns = document.querySelectorAll('.close-modal');
    const metricsForm = document.getElementById('metrics-form');
    const currentBmi = document.getElementById('current-bmi');
    const currentBp = document.getElementById('current-bp');
    const currentGlucose = document.getElementById('current-glucose');
    const reminderForm = document.getElementById('reminder-form');
    const remindersList = document.getElementById('reminders-list');
    const paymentModal = document.getElementById('payment-modal');
    const paymentStatus = document.getElementById('payment-status');
    const paymentSuccess = document.getElementById('payment-success');
    const currentLocationBtn = document.getElementById('current-location-btn');
    const searchHospitalsBtn = document.getElementById('search-hospitals-btn');
    const hospitalResults = document.getElementById('hospital-results');
    const appointmentForm = document.getElementById('appointment-form');
    
    // Show dashboard by default
    showSection('dashboard');
    
    // Update current metrics display
    updateMetricsDisplay();
    
    // Load reminders
    loadReminders();
    
    // Navigation
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const sectionId = this.getAttribute('href').substring(1);
            showSection(sectionId);
            
            // Update active nav link
            navLinks.forEach(navLink => navLink.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Show section function
    function showSection(sectionId) {
        sections.forEach(section => {
            if (section.id === sectionId) {
                section.classList.add('active');
                section.classList.remove('hidden');
            } else {
                section.classList.remove('active');
                setTimeout(() => {
                    section.classList.add('hidden');
                }, 300);
            }
        });
    }
    
    // Symptom analysis
    analyzeBtn.addEventListener('click', function() {
        const symptoms = symptomInput.value.trim();
        
        if (symptoms === '') {
            alert('Please describe your symptoms');
            return;
        }
        
        // Show loading state
        diseaseResults.innerHTML = '<div class="loader"></div>';
        precautionResults.innerHTML = '';
        
        // Simulate analysis delay
        setTimeout(() => {
            const analysis = diseaseDB.analyzeSymptoms(symptoms);
            
            if (analysis.isEmergency) {
                // Show emergency modal
                emergencyModal.classList.add('active');
                return;
            }
            
            // Display results
            if (analysis.conditions.length === 0) {
                diseaseResults.innerHTML = '<p>No matching conditions found. Please consult a doctor if symptoms persist.</p>';
            } else {
                let html = '';
                analysis.conditions.forEach(condition => {
                    html += `
                        <div class="disease-item">
                            <span class="disease-name">${condition.name}</span>
                            <span class="disease-probability">${condition.probability.toFixed(0)}% match</span>
                            <p>Matching symptoms: ${condition.matchedSymptoms.join(', ')}</p>
                        </div>
                    `;
                });
                diseaseResults.innerHTML = html;
                
                // Show precautions for top match
                const topCondition = analysis.conditions[0];
                let precautionsHtml = `
                    <h4>Precautions for ${topCondition.name}</h4>
                    <ul>
                `;
                
                topCondition.precautions.forEach(precaution => {
                    precautionsHtml += `<li>${precaution}</li>`;
                });
                
                precautionsHtml += '</ul>';
                precautionResults.innerHTML = precautionsHtml;
                
                // Show result section
                document.querySelector('.result-section').classList.remove('hidden');
            }
        }, 1500);
    });
    
    // Find hospitals button
    findHospitalBtn.addEventListener('click', function() {
        showSection('hospital-finder');
    });
    
    // Book appointment button
    bookAppointmentBtn.addEventListener('click', function() {
        // In a real app, we would pass the condition info to pre-fill the appointment
        const appointmentSection = document.getElementById('appointment-section');
        appointmentSection.classList.remove('hidden');
    });
    
    // Emergency button
    emergencyBtn.addEventListener('click', function() {
        emergencyModal.classList.add('active');
    });
    
    // Close modals
    closeModalBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            this.closest('.modal').classList.remove('active');
        });
    });
    
    // Click outside modal to close
    window.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            e.target.classList.remove('active');
        }
    });
    
    // Save health metrics
    metricsForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = {
            weight: document.getElementById('weight').value,
            height: document.getElementById('height').value,
            systolic: document.getElementById('systolic').value,
            diastolic: document.getElementById('diastolic').value,
            glucose: document.getElementById('glucose').value
        };
        
        user.addHealthMetrics(formData);
        updateMetricsDisplay();
        this.reset();
        
        // Show success message
        alert('Health metrics saved successfully!');
    });
    
    // Update metrics display
    function updateMetricsDisplay() {
        const latest = user.getLatestMetrics();
        
        if (latest) {
            currentBmi.textContent = latest.bmi;
            currentBp.textContent = `${latest.systolic}/${latest.diastolic}`;
            currentGlucose.textContent = latest.glucose;
            
            // Update BMI status indicator
            const statusIndicator = document.querySelector('.status-indicator');
            const pulseDot = document.querySelector('.pulse-dot');
            let statusText = '';
            let dotColor = '';
            
            if (latest.bmi < 18.5) {
                statusText = 'Underweight';
                dotColor = 'var(--warning-color)';
            } else if (latest.bmi >= 18.5 && latest.bmi < 25) {
                statusText = 'Normal weight';
                dotColor = 'var(--success-color)';
            } else if (latest.bmi >= 25 && latest.bmi < 30) {
                statusText = 'Overweight';
                dotColor = 'var(--warning-color)';
            } else {
                statusText = 'Obese';
                dotColor = 'var(--danger-color)';
            }
            
            statusIndicator.querySelector('span').textContent = statusText;
            pulseDot.style.backgroundColor = dotColor;
        }
    }
    
    // Add reminder
    reminderForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = {
            title: document.getElementById('reminder-title').value,
            description: document.getElementById('reminder-desc').value,
            date: document.getElementById('reminder-date').value,
            repeat: document.getElementById('reminder-repeat').value
        };
        
        user.addReminder(formData);
        loadReminders();
        this.reset();
    });
    
    // Load reminders
    function loadReminders() {
        remindersList.innerHTML = '';
        
        if (user.reminders.length === 0) {
            remindersList.innerHTML = '<p>No reminders set yet.</p>';
            return;
        }
        
        // Sort reminders by date
        const sortedReminders = [...user.reminders].sort((a, b) => 
            new Date(a.date) - new Date(b.date)
        );
        
        sortedReminders.forEach(reminder => {
            const reminderDate = new Date(reminder.date);
            const now = new Date();
            
            const reminderElement = document.createElement('div');
            reminderElement.className = `reminder-item ${reminderDate < now ? 'past' : ''}`;
            reminderElement.innerHTML = `
                <div class="reminder-title">${reminder.title}</div>
                <div class="reminder-desc">${reminder.description}</div>
                <div class="reminder-time">${formatDateTime(reminder.date)}</div>
                <div class="reminder-actions">
                    <button class="complete-btn" data-id="${reminder.id}">
                        <i class="fas fa-check"></i>
                    </button>
                    <button class="delete-btn" data-id="${reminder.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            
            remindersList.appendChild(reminderElement);
        });
        
        // Add event listeners to action buttons
        document.querySelectorAll('.complete-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const id = parseInt(this.getAttribute('data-id'));
                user.completeReminder(id);
                loadReminders();
            });
        });
        
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const id = parseInt(this.getAttribute('data-id'));
                user.deleteReminder(id);
                loadReminders();
            });
        });
    }
    
    // Format date and time
    function formatDateTime(dateTimeString) {
        const date = new Date(dateTimeString);
        return date.toLocaleString();
    }
    
    // Hospital finder functionality
    currentLocationBtn.addEventListener('click', function() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                position => {
                    const userLocation = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };
                    
                    healthAI.map.setCenter(userLocation);
                    healthAI.updateHospitalDistances(userLocation);
                    displayHospitals();
                },
                error => {
                    alert('Error getting your location: ' + error.message);
                }
            );
        } else {
            alert('Geolocation is not supported by your browser.');
        }
    });
    
    searchHospitalsBtn.addEventListener('click', function() {
        const locationInput = document.getElementById('location-input').value;
        
        if (locationInput) {
            // In a real app, we would use the Geocoding API to convert address to coordinates
            alert('Location search would be implemented with Google Geocoding API');
        } else {
            displayHospitals();
        }
    });
    
    function displayHospitals() {
        hospitalResults.innerHTML = '';
        
        const hospitals = healthAI.findHospitals();
        
        if (hospitals.length === 0) {
            hospitalResults.innerHTML = '<p>No hospitals found nearby.</p>';
            return;
        }
        
        hospitals.forEach(hospital => {
            const hospitalElement = document.createElement('div');
            hospitalElement.className = 'hospital-item';
            hospitalElement.innerHTML = `
                <div class="hospital-name">${hospital.name}</div>
                <div class="hospital-distance">${hospital.distance} away</div>
                <div class="hospital-address">${hospital.address}</div>
                <div class="hospital-actions">
                    <button class="btn secondary view-doctors-btn" data-id="${hospital.id}">
                        View Doctors
                    </button>
                    <button class="btn book-btn" data-id="${hospital.id}">
                        Book Appointment
                    </button>
                </div>
                <div class="doctors-list hidden" id="doctors-${hospital.id}"></div>
            `;
            
            hospitalResults.appendChild(hospitalElement);
        });
        
        // Add event listeners to hospital buttons
        document.querySelectorAll('.view-doctors-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const hospitalId = parseInt(this.getAttribute('data-id'));
                const doctorsList = document.getElementById(`doctors-${hospitalId}`);
                
                if (doctorsList.classList.contains('hidden')) {
                    // Show doctors
                    const hospital = healthAI.hospitals.find(h => h.id === hospitalId);
                    let doctorsHtml = '<h4>Available Doctors</h4>';
                    
                    hospital.doctors.forEach(doctor => {
                        doctorsHtml += `
                            <div class="doctor-item ${doctor.available ? '' : 'unavailable'}">
                                <div class="doctor-name">${doctor.name}</div>
                                <div class="doctor-specialty">${doctor.specialty}</div>
                                <div class="doctor-status">
                                    ${doctor.available ? 'Available' : 'Not Available'}
                                </div>
                            </div>
                        `;
                    });
                    
                    doctorsList.innerHTML = doctorsHtml;
                    doctorsList.classList.remove('hidden');
                } else {
                    // Hide doctors
                    doctorsList.classList.add('hidden');
                }
            });
        });
        
        document.querySelectorAll('.book-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const hospitalId = parseInt(this.getAttribute('data-id'));
                const appointmentSection = document.getElementById('appointment-section');
                
                // Set hospital ID in a hidden field or data attribute
                appointmentForm.setAttribute('data-hospital-id', hospitalId);
                appointmentSection.classList.remove('hidden');
                
                // Scroll to appointment section
                appointmentSection.scrollIntoView({ behavior: 'smooth' });
            });
        });
    }
    
    // Appointment booking
    appointmentForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const hospitalId = parseInt(this.getAttribute('data-hospital-id'));
        const date = document.getElementById('appointment-date').value;
        const time = document.getElementById('appointment-time').value;
        const patientName = document.getElementById('patient-name').value;
        const paymentMethod = document.querySelector('input[name="payment"]:checked').value;
        
        // In a real app, we would have doctor selection
        const hospital = healthAI.hospitals.find(h => h.id === hospitalId);
        const availableDoctor = hospital.doctors.find(d => d.available);
        
        if (!availableDoctor) {
            alert('No doctors available at this hospital. Please try another.');
            return;
        }
        
        // Show payment modal
        paymentModal.classList.add('active');
        paymentStatus.textContent = 'Processing your payment...';
        paymentSuccess.classList.add('hidden');
        
        // Process payment
        healthAI.processPayment(50, paymentMethod)
            .then(paymentResult => {
                // If payment successful, book appointment
                return healthAI.bookAppointment(
                    hospitalId,
                    availableDoctor.id,
                    date,
                    time,
                    { name: patientName }
                );
            })
            .then(appointmentResult => {
                // Show success
                paymentStatus.textContent = 'Appointment booked successfully!';
                paymentSuccess.classList.remove('hidden');
                
                // You could display appointment details here
            })
            .catch(error => {
                paymentStatus.textContent = `Error: ${error}`;
            });
    });
    
    
    // Initialize hospital display
    displayHospitals();
});