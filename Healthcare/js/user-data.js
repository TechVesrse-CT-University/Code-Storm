// User data and health metrics management
const userData = {
    currentUser: {
        id: 1,
        name: "John Doe",
        email: "john.doe@example.com",
        age: 35,
        gender: "male",
        phone: "+1 (555) 123-4567"
    },
    
    healthMetrics: [
        {
            date: "2023-05-01",
            weight: 75,
            height: 175,
            bmi: 24.5,
            systolic: 120,
            diastolic: 80,
            glucose: 95
        },
        {
            date: "2023-05-08",
            weight: 74.5,
            height: 175,
            bmi: 24.3,
            systolic: 118,
            diastolic: 78,
            glucose: 92
        },
        {
            date: "2023-05-15",
            weight: 74,
            height: 175,
            bmi: 24.2,
            systolic: 122,
            diastolic: 82,
            glucose: 98
        },
        {
            date: "2023-05-22",
            weight: 73.5,
            height: 175,
            bmi: 24.0,
            systolic: 119,
            diastolic: 79,
            glucose: 94
        }
    ],
    
    reminders: [
        {
            id: 1,
            title: "Take multivitamin",
            description: "Take daily multivitamin after breakfast",
            date: "2023-05-25T08:00:00",
            completed: false,
            repeat: "daily"
        },
        {
            id: 2,
            title: "Doctor appointment",
            description: "Annual checkup with Dr. Smith",
            date: "2023-06-10T14:30:00",
            completed: false,
            repeat: "none"
        },
        {
            id: 3,
            title: "Exercise",
            description: "30 minutes of cardio",
            date: "2023-05-25T18:00:00",
            completed: false,
            repeat: "daily"
        }
    ],
    
    // Calculate BMI from weight and height
    calculateBMI: function(weight, height) {
        // Convert height from cm to meters
        const heightInMeters = height / 100;
        return (weight / (heightInMeters * heightInMeters)).toFixed(1);
    },
    
    // Add new health metrics
    addHealthMetrics: function(data) {
        const newEntry = {
            date: new Date().toISOString().split('T')[0], // YYYY-MM-DD
            weight: parseFloat(data.weight),
            height: parseFloat(data.height),
            bmi: parseFloat(this.calculateBMI(data.weight, data.height)),
            systolic: parseInt(data.systolic),
            diastolic: parseInt(data.diastolic),
            glucose: parseInt(data.glucose)
        };
        
        this.healthMetrics.push(newEntry);
        return newEntry;
    },
    
    // Get latest health metrics
    getLatestMetrics: function() {
        if (this.healthMetrics.length === 0) return null;
        return this.healthMetrics[this.healthMetrics.length - 1];
    },
    
    // Add new reminder
    addReminder: function(data) {
        const newReminder = {
            id: this.reminders.length + 1,
            title: data.title,
            description: data.description,
            date: data.date,
            completed: false,
            repeat: data.repeat
        };
        
        this.reminders.push(newReminder);
        return newReminder;
    },

    
    
    // Mark reminder as completed
    completeReminder: function(id) {
        const reminder = this.reminders.find(r => r.id === id);
        if (reminder) {
            reminder.completed = true;
            
            // Handle repeating reminders
            if (reminder.repeat !== "none") {
                const newDate = new Date(reminder.date);
                
                if (reminder.repeat === "daily") {
                    newDate.setDate(newDate.getDate() + 1);
                } else if (reminder.repeat === "weekly") {
                    newDate.setDate(newDate.getDate() + 7);
                } else if (reminder.repeat === "monthly") {
                    newDate.setMonth(newDate.getMonth() + 1);
                }
                
                this.addReminder({
                    title: reminder.title,
                    description: reminder.description,
                    date: newDate.toISOString(),
                    repeat: reminder.repeat
                });
            }
            
            return true;
        }
        return false;
    },

    
    
    // Delete reminder
    deleteReminder: function(id) {
        const index = this.reminders.findIndex(r => r.id === id);
        if (index !== -1) {
            this.reminders.splice(index, 1);
            return true;
        }
        return false;
    }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = userData;
}

// Load billing data
function loadBillingData() {
    const paymentHistory = user.getPaymentHistory();
    const paymentHistoryElement = document.getElementById('payment-history');
    
    if (paymentHistory.length === 0) {
        paymentHistoryElement.innerHTML = '<p>No payment history found.</p>';
        return;
    }
    
    let html = `
        <table class="payment-history-table">
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Description</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Method</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    paymentHistory.forEach(payment => {
        html += `
            <tr>
                <td>${payment.date}</td>
                <td>${payment.description}</td>
                <td>$${payment.amount.toFixed(2)}</td>
                <td><span class="payment-status ${payment.status}">${payment.status}</span></td>
                <td>${payment.method}</td>
            </tr>
        `;
    });
    
    html += `</tbody></table>`;
    paymentHistoryElement.innerHTML = html;
}

// Add payment method modal
function showAddPaymentMethodModal() {
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.innerHTML = `
        <div class="modal-content scale-in">
            <span class="close-modal">&times;</span>
            <h2>Add Payment Method</h2>
            <form id="payment-method-form">
                <div class="form-group">
                    <label for="card-number">Card Number</label>
                    <input type="text" id="card-number" placeholder="1234 5678 9012 3456" required>
                </div>
                <div class="form-group">
                    <label for="card-name">Name on Card</label>
                    <input type="text" id="card-name" required>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="card-expiry">Expiry Date</label>
                        <input type="text" id="card-expiry" placeholder="MM/YY" required>
                    </div>
                    <div class="form-group">
                        <label for="card-cvv">CVV</label>
                        <input type="text" id="card-cvv" required>
                    </div>
                </div>
                <button type="submit" class="btn">Save Payment Method</button>
            </form>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Close modal
    modal.querySelector('.close-modal').addEventListener('click', () => {
        modal.remove();
    });
    
    // Form submission
    modal.querySelector('#payment-method-form').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const cardNumber = document.getElementById('card-number').value;
        const last4 = cardNumber.slice(-4);
        
        const newMethod = {
            type: "credit_card",
            last4: last4,
            brand: "visa", // In real app, detect from card number
            expiry: document.getElementById('card-expiry').value
        };
        
        user.addPaymentMethod(newMethod);
        modal.remove();
        loadBillingData();
    });
}

// Add to DOMContentLoaded event listener
document.addEventListener('DOMContentLoaded', function() {
    // ... existing code ...
    
    // Add billing page to navigation
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        if (link.getAttribute('href') === '#billing') {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                showSection('billing');
                loadBillingData();
                
                // Update active nav link
                navLinks.forEach(navLink => navLink.classList.remove('active'));
                this.classList.add('active');
            });
        }
    });
    
    // Add payment method button
    document.getElementById('add-payment-method-btn')?.addEventListener('click', showAddPaymentMethodModal);
    
    // Pay now buttons
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('pay-now-btn')) {
            const paymentItem = e.target.closest('.payment-item');
            const amount = parseFloat(paymentItem.querySelector('.payment-amount').textContent.replace('$', ''));
            
            // Show payment modal
            paymentModal.classList.add('active');
            paymentStatus.textContent = 'Processing your payment...';
            paymentSuccess.classList.add('hidden');
            
            // Process payment
            const paymentMethod = user.paymentMethods[0]; // Default to first method
            
            healthAI.processPayment(amount, 'card')
                .then(paymentResult => {
                    // Record payment
                    user.recordPayment({
                        description: paymentItem.querySelector('.payment-title').textContent,
                        amount: amount,
                        status: "paid",
                        method: `${paymentMethod.brand.toUpperCase()} ****${paymentMethod.last4}`
                    });
                    
                    // Show success
                    paymentStatus.textContent = 'Payment processed successfully!';
                    paymentSuccess.classList.remove('hidden');
                    
                    // Update billing page
                    loadBillingData();
                })
                .catch(error => {
                    // Record failed payment
                    user.recordPayment({
                        description: paymentItem.querySelector('.payment-title').textContent,
                        amount: amount,
                        status: "failed",
                        method: `${paymentMethod.brand.toUpperCase()} ****${paymentMethod.last4}`
                    });
                    
                    paymentStatus.textContent = `Payment failed: ${error}`;
                });
        }
    });
});