// Disease database with symptoms, diseases, and precautions
const diseaseDatabase = {
    diseases: [
        {
            name: "Common Cold",
            symptoms: ["cough", "sore throat", "runny nose", "sneezing", "congestion", "mild headache"],
            precautions: [
                "Drink plenty of fluids",
                "Get adequate rest",
                "Use over-the-counter cold medications",
                "Gargle with warm salt water for sore throat",
                "Use a humidifier to ease congestion"
            ]
        },
        {
            name: "Influenza (Flu)",
            symptoms: ["fever", "chills", "muscle aches", "fatigue", "headache", "cough", "sore throat"],
            precautions: [
                "Get annual flu vaccine",
                "Stay home and rest",
                "Drink plenty of fluids",
                "Use antiviral medications if prescribed",
                "Practice good hygiene to prevent spread"
            ]
        },
        {
            name: "Allergic Rhinitis",
            symptoms: ["sneezing", "itchy eyes", "runny nose", "nasal congestion", "postnasal drip"],
            precautions: [
                "Identify and avoid allergens",
                "Use antihistamines",
                "Try nasal corticosteroid sprays",
                "Use saline nasal rinses",
                "Keep windows closed during high pollen seasons"
            ]
        },
        {
            name: "Migraine",
            symptoms: ["severe headache", "nausea", "vomiting", "sensitivity to light", "sensitivity to sound"],
            precautions: [
                "Identify and avoid triggers",
                "Maintain regular sleep schedule",
                "Stay hydrated",
                "Practice stress management techniques",
                "Use prescribed migraine medications"
            ]
        },
        {
            name: "Gastroenteritis",
            symptoms: ["diarrhea", "nausea", "vomiting", "abdominal cramps", "fever"],
            precautions: [
                "Stay hydrated with oral rehydration solutions",
                "Avoid dairy, caffeine, and fatty foods",
                "Wash hands frequently",
                "Get plenty of rest",
                "Gradually reintroduce bland foods"
            ]
        },
        {
            name: "Urinary Tract Infection",
            symptoms: ["burning sensation when urinating", "frequent urination", "cloudy urine", "pelvic pain"],
            precautions: [
                "Drink plenty of water",
                "Urinate frequently and completely",
                "Wipe from front to back",
                "Avoid irritating feminine products",
                "Empty bladder after sexual intercourse"
            ]
        },
        {
            name: "Hypertension",
            symptoms: ["headache", "shortness of breath", "nosebleeds", "dizziness", "flushing"],
            precautions: [
                "Reduce sodium intake",
                "Exercise regularly",
                "Maintain healthy weight",
                "Limit alcohol consumption",
                "Take prescribed medications as directed"
            ]
        },
        {
            name: "Type 2 Diabetes",
            symptoms: ["increased thirst", "frequent urination", "hunger", "fatigue", "blurred vision"],
            precautions: [
                "Monitor blood sugar levels",
                "Follow a healthy diet",
                "Exercise regularly",
                "Maintain healthy weight",
                "Take medications as prescribed"
            ]
        }
    ],
    
    // Emergency conditions that require immediate attention
    emergencies: [
        {
            name: "Heart Attack",
            symptoms: ["chest pain", "shortness of breath", "pain in arm", "nausea", "cold sweat"],
            action: "Call emergency services immediately"
        },
        {
            name: "Stroke",
            symptoms: ["face drooping", "arm weakness", "speech difficulty", "sudden confusion"],
            action: "Call emergency services immediately - time is critical"
        },
        {
            name: "Severe Allergic Reaction",
            symptoms: ["difficulty breathing", "swelling of face/throat", "hives", "dizziness"],
            action: "Use epinephrine if available and call emergency services"
        }
    ],
    
    // Function to analyze symptoms and return possible diseases
    analyzeSymptoms: function(symptomText) {
        const userSymptoms = symptomText.toLowerCase().split(/[,\s]+/).filter(s => s.length > 0);
        
        // First check for emergencies
        const emergencyMatches = this.emergencies.filter(emergency => 
            emergency.symptoms.some(symptom => 
                userSymptoms.some(userSymptom => 
                    userSymptom.includes(symptom) || symptom.includes(userSymptom)
            )
        ));
        
        if (emergencyMatches.length > 0) {
            return {
                isEmergency: true,
                conditions: emergencyMatches
            };
        }
        
        // If no emergencies, check for regular diseases
        const matchedDiseases = this.diseases.map(disease => {
            const matchedSymptoms = disease.symptoms.filter(symptom => 
                userSymptoms.some(userSymptom => 
                    userSymptom.includes(symptom) || symptom.includes(userSymptom)
                )
            );
            
            // Calculate match probability (simple percentage of matched symptoms)
            const probability = (matchedSymptoms.length / disease.symptoms.length) * 100;
            
            return {
                name: disease.name,
                matchedSymptoms,
                probability: Math.min(100, probability * 1.5), // Slightly inflate for better UX
                precautions: disease.precautions
            };
        })
        filter(disease => disease.probability > 10) // Changed from 30 to 10) // Only show diseases with >30% match
        .sort((a, b) => b.probability - a.probability); // Sort by probability
        
        return {
            isEmergency: false,
            conditions: matchedDiseases
        };
    }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = diseaseDatabase;
}