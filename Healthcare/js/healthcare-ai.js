// Healthcare AI module for hospital finding and appointment booking
const healthcareAI = {
    // Mock hospital data - in a real app, this would come from an API
    hospitals: [
        {
            id: 1,
            name: "City General Hospital",
            address: "123 Medical Drive, Cityville",
            specialties: ["Emergency", "Cardiology", "General Medicine"],
            distance: "1.2 miles",
            coordinates: { lat: 40.7128, lng: -74.0060 },
            doctors: [
                { id: 101, name: "Dr. Sarah Johnson", specialty: "General Medicine", available: true },
                { id: 102, name: "Dr. Michael Chen", specialty: "Cardiology", available: false },
                { id: 103, name: "Dr. Emily Wilson", specialty: "General Medicine", available: true }
            ]
        },
        {
            id: 2,
            name: "University Medical Center",
            address: "456 Health Avenue, Townsville",
            specialties: ["Pediatrics", "Neurology", "Oncology"],
            distance: "2.5 miles",
            coordinates: { lat: 40.7308, lng: -73.9973 },
            doctors: [
                { id: 201, name: "Dr. Robert Brown", specialty: "Neurology", available: true },
                { id: 202, name: "Dr. Lisa Martinez", specialty: "Pediatrics", available: true }
            ]
        },
        {
            id: 3,
            name: "Community Health Clinic",
            address: "789 Wellness Street, Villagetown",
            specialties: ["Family Medicine", "Dermatology", "Endocrinology"],
            distance: "3.1 miles",
            coordinates: { lat: 40.7580, lng: -73.9855 },
            doctors: [
                { id: 301, name: "Dr. James Wilson", specialty: "Family Medicine", available: true },
                { id: 302, name: "Dr. Patricia Lee", specialty: "Dermatology", available: false }
            ]
        }
    ],
    
    // Initialize the map
    initMap: function() {
        // Default to New York coordinates
        const defaultLocation = { lat: 40.7128, lng: -74.0060 };
        
        // Create map
        const map = new google.maps.Map(document.getElementById('map'), {
            center: defaultLocation,
            zoom: 13
        });
        
        // Add markers for hospitals
        this.hospitals.forEach(hospital => {
            new google.maps.Marker({
                position: hospital.coordinates,
                map: map,
                title: hospital.name
            });
        });
        
        // Store map reference
        this.map = map;
        
        // Try to get user's current location
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                position => {
                    const userLocation = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };
                    
                    // Center map on user's location
                    map.setCenter(userLocation);
                    
                    // Add marker for user's location
                    new google.maps.Marker({
                        position: userLocation,
                        map: map,
                        title: "Your Location",
                        icon: {
                            url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
                        }
                    });
                    
                    // Update hospital distances based on user's location
                    this.updateHospitalDistances(userLocation);
                },
                error => {
                    console.error("Error getting location:", error);
                    // Use default location if geolocation fails
                    this.updateHospitalDistances(defaultLocation);
                }
            );
        } else {
            console.log("Geolocation is not supported by this browser.");
            // Use default location if geolocation not supported
            this.updateHospitalDistances(defaultLocation);
        }
    },
    
    // Calculate distances from user to hospitals (simplified for demo)
    updateHospitalDistances: function(userLocation) {
        this.hospitals.forEach(hospital => {
            // In a real app, you would use the Distance Matrix API for accurate distances
            const dx = hospital.coordinates.lat - userLocation.lat;
            const dy = hospital.coordinates.lng - userLocation.lng;
            const distance = Math.sqrt(dx*dx + dy*dy) * 70; // Approximate miles
            
            hospital.distance = distance < 1 ? 
                `${(distance * 5280).toFixed(0)} feet` : 
                `${distance.toFixed(1)} miles`;
        });
    },
    
    // Find hospitals by specialty or all if no specialty given
    findHospitals: function(specialty) {
        if (!specialty) {
            return this.hospitals.sort((a, b) => 
                parseFloat(a.distance) - parseFloat(b.distance)
            );
        }
        
        return this.hospitals
            .filter(hospital => 
                hospital.specialties.some(s => 
                    s.toLowerCase().includes(specialty.toLowerCase())
            ))
            .sort((a, b) => 
                parseFloat(a.distance) - parseFloat(b.distance)
            );
    },
    
    // Book appointment - in a real app, this would connect to a backend
    bookAppointment: function(hospitalId, doctorId, date, time, patientInfo) {
        return new Promise((resolve, reject) => {
            // Simulate API call delay
            setTimeout(() => {
                const hospital = this.hospitals.find(h => h.id === hospitalId);
                if (!hospital) {
                    reject("Hospital not found");
                    return;
                }
                
                const doctor = hospital.doctors.find(d => d.id === doctorId);
                if (!doctor) {
                    reject("Doctor not found");
                    return;
                }
                
                if (!doctor.available) {
                    reject("Doctor is not available");
                    return;
                }
                
                // Generate a fake confirmation number
                const confirmationNumber = `APP-${Math.floor(100000 + Math.random() * 900000)}`;
                
                resolve({
                    success: true,
                    confirmationNumber,
                    appointmentDetails: {
                        hospital: hospital.name,
                        doctor: doctor.name,
                        specialty: doctor.specialty,
                        date,
                        time,
                        patientName: patientInfo.name,
                        address: hospital.address
                    }
                });
            }, 1500);
        });
    },
    
    // Process payment - in a real app, this would connect to a payment gateway
    processPayment: function(amount, paymentMethod) {
        return new Promise((resolve, reject) => {
            // Simulate payment processing delay
            setTimeout(() => {
                // 10% chance of failure for demo purposes
                if (Math.random() < 0.1) {
                    reject("Payment failed: Insufficient funds");
                } else {
                    // Generate a fake transaction ID
                    const transactionId = `TXN-${Math.floor(100000000 + Math.random() * 900000000)}`;
                    
                    resolve({
                        success: true,
                        transactionId,
                        amount,
                        paymentMethod,
                        timestamp: new Date().toISOString()
                    });
                }
            }, 2000);
        });
    }
};

// Initialize the map when Google Maps API is loaded
function initMap() {
    healthcareAI.initMap();
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = healthcareAI;
}