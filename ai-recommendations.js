// AI Medicine Recommendation Engine for Aditya Medical & General Store
// Comprehensive disease-medicine database with intelligent matching

class MedicineRecommendationEngine {
  constructor() {
    this.diseaseDatabase = {
      // Common Cold & Flu
      'common_cold': {
        name: 'Common Cold',
        symptoms: ['runny nose', 'sneezing', 'cough', 'sore throat', 'headache', 'mild fever'],
        medicines: [
          {
            name: 'Paracetamol 500mg',
            dosage: '1-2 tablets every 4-6 hours',
            duration: '3-5 days',
            price: 45,
            type: 'pain relief',
            prescription: false,
            contraindications: ['liver disease', 'alcohol abuse'],
            sideEffects: ['nausea', 'stomach upset'],
            availability: true
          },
          {
            name: 'Cetrizine 10mg',
            dosage: '1 tablet daily at bedtime',
            duration: '3-7 days',
            price: 30,
            type: 'antihistamine',
            prescription: false,
            contraindications: ['kidney disease'],
            sideEffects: ['drowsiness', 'dry mouth'],
            availability: true
          },
          {
            name: 'Cough Syrup',
            dosage: '10ml three times daily',
            duration: '5-7 days',
            price: 80,
            type: 'cough suppressant',
            prescription: false,
            contraindications: ['asthma', 'pregnancy'],
            sideEffects: ['drowsiness'],
            availability: true
          }
        ]
      },

      // Fever
      'fever': {
        name: 'Fever',
        symptoms: ['high temperature', 'chills', 'sweating', 'headache', 'body ache', 'weakness'],
        medicines: [
          {
            name: 'Dolo 650mg',
            dosage: '1 tablet every 4-6 hours',
            duration: '2-3 days',
            price: 55,
            type: 'fever reducer',
            prescription: false,
            contraindications: ['liver disease'],
            sideEffects: ['nausea'],
            availability: true
          },
          {
            name: 'Ibuprofen 400mg',
            dosage: '1 tablet every 6-8 hours',
            duration: '2-3 days',
            price: 60,
            type: 'anti-inflammatory',
            prescription: false,
            contraindications: ['stomach ulcers', 'kidney disease', 'heart disease'],
            sideEffects: ['stomach irritation', 'nausea'],
            availability: true
          }
        ]
      },

      // Headache
      'headache': {
        name: 'Headache',
        symptoms: ['head pain', 'pressure in head', 'sensitivity to light', 'nausea'],
        medicines: [
          {
            name: 'Aspirin 300mg',
            dosage: '1-2 tablets every 4 hours',
            duration: 'As needed',
            price: 25,
            type: 'pain reliever',
            prescription: false,
            contraindications: ['bleeding disorders', 'children under 16', 'pregnancy'],
            sideEffects: ['stomach irritation'],
            availability: true
          },
          {
            name: 'Paracetamol 500mg',
            dosage: '1-2 tablets every 4-6 hours',
            duration: 'As needed',
            price: 45,
            type: 'pain relief',
            prescription: false,
            contraindications: ['liver disease'],
            sideEffects: ['rare at recommended doses'],
            availability: true
          }
        ]
      },

      // Stomach Problems
      'acidity': {
        name: 'Acidity/Heartburn',
        symptoms: ['burning sensation in chest', 'sour taste', 'bloating', 'nausea', 'stomach pain'],
        medicines: [
          {
            name: 'Omeprazole 20mg',
            dosage: '1 capsule daily before breakfast',
            duration: '7-14 days',
            price: 120,
            type: 'proton pump inhibitor',
            prescription: false,
            contraindications: ['liver disease'],
            sideEffects: ['headache', 'nausea', 'diarrhea'],
            availability: true
          },
          {
            name: 'Pantoprazole 40mg',
            dosage: '1 tablet daily before meals',
            duration: '7-14 days',
            price: 85,
            type: 'proton pump inhibitor',
            prescription: false,
            contraindications: ['liver problems'],
            sideEffects: ['headache', 'dizziness'],
            availability: true
          },
          {
            name: 'Antacid Syrup',
            dosage: '10ml after meals',
            duration: 'As needed',
            price: 40,
            type: 'antacid',
            prescription: false,
            contraindications: ['kidney disease'],
            sideEffects: ['constipation', 'diarrhea'],
            availability: true
          }
        ]
      },

      // Diabetes
      'diabetes': {
        name: 'Diabetes',
        symptoms: ['increased thirst', 'frequent urination', 'fatigue', 'blurred vision', 'slow healing wounds'],
        medicines: [
          {
            name: 'Metformin 500mg',
            dosage: '1 tablet twice daily with meals',
            duration: 'Long-term as prescribed',
            price: 150,
            type: 'antidiabetic',
            prescription: true,
            contraindications: ['kidney disease', 'liver disease', 'heart failure'],
            sideEffects: ['nausea', 'diarrhea', 'metallic taste'],
            availability: true
          },
          {
            name: 'Glimepiride 2mg',
            dosage: '1 tablet daily with breakfast',
            duration: 'As prescribed by doctor',
            price: 200,
            type: 'antidiabetic',
            prescription: true,
            contraindications: ['kidney disease', 'liver disease'],
            sideEffects: ['hypoglycemia', 'weight gain'],
            availability: true
          }
        ]
      },

      // Hypertension
      'hypertension': {
        name: 'High Blood Pressure',
        symptoms: ['headache', 'dizziness', 'chest pain', 'shortness of breath', 'nosebleeds'],
        medicines: [
          {
            name: 'Amlodipine 5mg',
            dosage: '1 tablet daily',
            duration: 'Long-term as prescribed',
            price: 180,
            type: 'calcium channel blocker',
            prescription: true,
            contraindications: ['severe heart disease', 'liver disease'],
            sideEffects: ['swelling of ankles', 'flushing', 'dizziness'],
            availability: true
          },
          {
            name: 'Losartan 50mg',
            dosage: '1 tablet daily',
            duration: 'Long-term as prescribed',
            price: 220,
            type: 'ARB',
            prescription: true,
            contraindications: ['kidney disease', 'pregnancy'],
            sideEffects: ['dizziness', 'fatigue', 'hyperkalemia'],
            availability: true
          }
        ]
      },

      // Skin Problems
      'skin_infection': {
        name: 'Skin Infection',
        symptoms: ['rash', 'itching', 'redness', 'swelling', 'pain', 'pus'],
        medicines: [
          {
            name: 'Betamethasone Cream',
            dosage: 'Apply thin layer twice daily',
            duration: '7-10 days',
            price: 95,
            type: 'topical steroid',
            prescription: false,
            contraindications: ['viral infections', 'fungal infections'],
            sideEffects: ['skin thinning with prolonged use'],
            availability: true
          },
          {
            name: 'Mupirocin Ointment',
            dosage: 'Apply three times daily',
            duration: '5-7 days',
            price: 110,
            type: 'antibiotic',
            prescription: true,
            contraindications: ['kidney disease'],
            sideEffects: ['burning sensation', 'itching'],
            availability: true
          }
        ]
      },

      // Allergies
      'allergies': {
        name: 'Allergic Reactions',
        symptoms: ['sneezing', 'itchy eyes', 'runny nose', 'skin rash', 'hives', 'swelling'],
        medicines: [
          {
            name: 'Loratadine 10mg',
            dosage: '1 tablet daily',
            duration: 'As needed',
            price: 65,
            type: 'antihistamine',
            prescription: false,
            contraindications: ['liver disease'],
            sideEffects: ['minimal drowsiness'],
            availability: true
          },
          {
            name: 'Prednisolone 5mg',
            dosage: 'As prescribed by doctor',
            duration: 'Short-term only',
            price: 75,
            type: 'corticosteroid',
            prescription: true,
            contraindications: ['infections', 'diabetes', 'osteoporosis'],
            sideEffects: ['increased appetite', 'mood changes'],
            availability: true
          }
        ]
      },

      // Respiratory Issues
      'asthma': {
        name: 'Asthma',
        symptoms: ['wheezing', 'shortness of breath', 'chest tightness', 'coughing'],
        medicines: [
          {
            name: 'Salbutamol Inhaler',
            dosage: '2 puffs as needed',
            duration: 'As needed',
            price: 250,
            type: 'bronchodilator',
            prescription: true,
            contraindications: ['heart disease', 'hyperthyroidism'],
            sideEffects: ['tremor', 'palpitations'],
            availability: true
          },
          {
            name: 'Montelukast 10mg',
            dosage: '1 tablet daily at bedtime',
            duration: 'Long-term as prescribed',
            price: 180,
            type: 'leukotriene modifier',
            prescription: true,
            contraindications: ['liver disease'],
            sideEffects: ['mood changes', 'headache'],
            availability: true
          }
        ]
      }
    };

    this.patientProfile = null;
    this.recommendations = [];
  }

  // Assess patient symptoms and profile
  assessPatient(patientData) {
    this.patientProfile = {
      age: patientData.age || 25,
      weight: patientData.weight || 70,
      gender: patientData.gender || 'male',
      symptoms: patientData.symptoms || [],
      medicalHistory: patientData.medicalHistory || [],
      currentMedications: patientData.currentMedications || [],
      allergies: patientData.allergies || [],
      pregnancyStatus: patientData.pregnancyStatus || false,
      smokingStatus: patientData.smokingStatus || false,
      alcoholConsumption: patientData.alcoholConsumption || false
    };

    return this.generateRecommendations();
  }

  // Generate AI-powered recommendations
  generateRecommendations() {
    this.recommendations = [];
    const symptoms = this.patientProfile.symptoms.map(s => s.toLowerCase());
    
    // Match symptoms to diseases
    const possibleDiseases = this.matchSymptomsToDisease(symptoms);
    
    // Generate recommendations for each possible disease
    possibleDiseases.forEach(diseaseMatch => {
      const disease = this.diseaseDatabase[diseaseMatch.diseaseId];
      const suitableMedicines = this.filterMedicines(disease.medicines);
      
      if (suitableMedicines.length > 0) {
        this.recommendations.push({
          disease: disease.name,
          confidence: diseaseMatch.confidence,
          medicines: suitableMedicines,
          warnings: this.generateWarnings(suitableMedicines),
          disclaimer: this.getDisclaimer()
        });
      }
    });

    // Sort recommendations by confidence
    this.recommendations.sort((a, b) => b.confidence - a.confidence);
    
    return this.recommendations;
  }

  // Match patient symptoms to diseases using AI-like scoring
  matchSymptomsToDisease(symptoms) {
    const matches = [];
    
    Object.keys(this.diseaseDatabase).forEach(diseaseId => {
      const disease = this.diseaseDatabase[diseaseId];
      let matchedSymptoms = 0;
      let totalSymptoms = disease.symptoms.length;
      
      disease.symptoms.forEach(diseaseSymptom => {
        const symptomMatch = symptoms.some(patientSymptom => {
          return patientSymptom.includes(diseaseSymptom) || 
                 diseaseSymptom.includes(patientSymptom) ||
                 this.getSynonyms(patientSymptom).includes(diseaseSymptom) ||
                 this.getSynonyms(diseaseSymptom).includes(patientSymptom);
        });
        
        if (symptomMatch) {
          matchedSymptoms++;
        }
      });
      
      // Calculate confidence score
      const confidence = (matchedSymptoms / totalSymptoms) * 100;
      
      // Only include if confidence is above 30%
      if (confidence > 30) {
        matches.push({
          diseaseId,
          confidence: Math.round(confidence)
        });
      }
    });
    
    return matches.sort((a, b) => b.confidence - a.confidence);
  }

  // Get symptom synonyms for better matching
  getSynonyms(symptom) {
    const synonyms = {
      'headache': ['head pain', 'migraine', 'head ache'],
      'fever': ['high temperature', 'temperature', 'hot'],
      'cough': ['coughing', 'dry cough', 'wet cough'],
      'cold': ['runny nose', 'blocked nose', 'congestion'],
      'stomach pain': ['abdominal pain', 'belly ache', 'stomach ache'],
      'nausea': ['feeling sick', 'vomiting', 'queasy'],
      'diarrhea': ['loose motions', 'stomach upset', 'loose stools'],
      'weakness': ['fatigue', 'tired', 'exhaustion'],
      'dizziness': ['lightheaded', 'vertigo', 'spinning'],
      'chest pain': ['chest discomfort', 'heart pain'],
      'shortness of breath': ['difficulty breathing', 'breathlessness'],
      'skin rash': ['rash', 'skin irritation', 'red skin']
    };
    
    return synonyms[symptom.toLowerCase()] || [];
  }

  // Filter medicines based on patient profile
  filterMedicines(medicines) {
    return medicines.filter(medicine => {
      // Check age restrictions
      if (this.patientProfile.age < 18 && medicine.contraindications.includes('children under 16')) {
        return false;
      }
      
      // Check pregnancy
      if (this.patientProfile.pregnancyStatus && medicine.contraindications.includes('pregnancy')) {
        return false;
      }
      
      // Check allergies
      if (this.patientProfile.allergies.some(allergy => 
          medicine.name.toLowerCase().includes(allergy.toLowerCase()))) {
        return false;
      }
      
      // Check medical history conflicts
      const hasConflict = this.patientProfile.medicalHistory.some(condition => 
        medicine.contraindications.some(contraindication => 
          condition.toLowerCase().includes(contraindication.toLowerCase())
        )
      );
      
      if (hasConflict) {
        return false;
      }
      
      // Check current medications for interactions
      // This is a simplified check - in reality, you'd need a comprehensive drug interaction database
      
      return medicine.availability;
    });
  }

  // Generate warnings based on patient profile and medicines
  generateWarnings(medicines) {
    const warnings = [];
    
    if (this.patientProfile.age < 18) {
      warnings.push("Patient is under 18. Some medications may not be suitable for minors.");
    }
    
    if (this.patientProfile.age > 65) {
      warnings.push("Patient is elderly. Dosage adjustments may be required.");
    }
    
    if (this.patientProfile.pregnancyStatus) {
      warnings.push("Patient is pregnant. Consult healthcare provider before taking any medication.");
    }
    
    if (this.patientProfile.medicalHistory.length > 0) {
      warnings.push(`Patient has medical history: ${this.patientProfile.medicalHistory.join(', ')}. Monitor for interactions.`);
    }
    
    if (this.patientProfile.currentMedications.length > 0) {
      warnings.push("Patient is on current medications. Check for drug interactions.");
    }
    
    return warnings;
  }

  // Get medical disclaimer
  getDisclaimer() {
    return `
      ⚠️ IMPORTANT MEDICAL DISCLAIMER:
      This AI recommendation is for informational purposes only and should not replace professional medical advice. 
      Always consult with a qualified healthcare provider before starting any medication. 
      If symptoms persist or worsen, seek immediate medical attention.
      
      📞 For emergencies, call your local emergency services.
      🏥 For consultation, visit Aditya Medical & General Store or call +91-7588662926
    `;
  }

  // Get medicine interaction warnings
  getMedicineInteractions(medicineList) {
    // Simplified interaction checking
    const interactions = [];
    
    // Check for common dangerous combinations
    const hasBloodThinners = medicineList.some(m => m.name.toLowerCase().includes('aspirin'));
    const hasNSAIDs = medicineList.some(m => m.name.toLowerCase().includes('ibuprofen'));
    
    if (hasBloodThinners && hasNSAIDs) {
      interactions.push("Aspirin + NSAIDs: Increased risk of bleeding. Use with caution.");
    }
    
    return interactions;
  }

  // Calculate dosage based on patient profile
  calculatePersonalizedDosage(medicine, patientProfile) {
    let adjustedDosage = medicine.dosage;
    
    // Age-based adjustments
    if (patientProfile.age < 12) {
      adjustedDosage = "Pediatric dosing - consult healthcare provider";
    } else if (patientProfile.age > 65) {
      adjustedDosage += " (May require dose reduction for elderly)";
    }
    
    // Weight-based adjustments for certain medicines
    if (medicine.type === 'antibiotic' && patientProfile.weight) {
      if (patientProfile.weight < 50) {
        adjustedDosage += " (Consider dose reduction for low body weight)";
      }
    }
    
    return adjustedDosage;
  }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = MedicineRecommendationEngine;
} else {
  window.MedicineRecommendationEngine = MedicineRecommendationEngine;
}