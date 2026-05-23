// Jarvis AI - Comprehensive Global Medicine Database
// Contains medicines for all major diseases and conditions worldwide

class GlobalMedicineDatabase {
  constructor() {
    this.medicineDatabase = {
      // CARDIOVASCULAR DISEASES
      'hypertension': {
        name: 'Hypertension (High Blood Pressure)',
        symptoms: ['high blood pressure', 'headache', 'dizziness', 'chest pain', 'shortness of breath', 'nosebleeds'],
        medicines: [
          { name: 'Amlodipine', brand: 'Norvasc', dosage: '5-10mg once daily', price: 180, type: 'Calcium Channel Blocker', sideEffects: 'Ankle swelling, flushing' },
          { name: 'Lisinopril', brand: 'Prinivil', dosage: '10-20mg once daily', price: 150, type: 'ACE Inhibitor', sideEffects: 'Dry cough, hyperkalemia' },
          { name: 'Losartan', brand: 'Cozaar', dosage: '50-100mg once daily', price: 220, type: 'ARB', sideEffects: 'Dizziness, fatigue' },
          { name: 'Metoprolol', brand: 'Lopressor', dosage: '50-100mg twice daily', price: 160, type: 'Beta Blocker', sideEffects: 'Fatigue, cold hands' },
          { name: 'Hydrochlorothiazide', brand: 'Microzide', dosage: '25-50mg once daily', price: 90, type: 'Diuretic', sideEffects: 'Dehydration, electrolyte imbalance' }
        ]
      },

      'heart_attack': {
        name: 'Heart Attack (Myocardial Infarction)',
        symptoms: ['severe chest pain', 'shortness of breath', 'nausea', 'sweating', 'left arm pain'],
        medicines: [
          { name: 'Aspirin', brand: 'Bayer', dosage: '325mg immediately, then 81mg daily', price: 25, type: 'Antiplatelet', sideEffects: 'Stomach irritation, bleeding' },
          { name: 'Clopidogrel', brand: 'Plavix', dosage: '75mg once daily', price: 300, type: 'Antiplatelet', sideEffects: 'Bleeding, bruising' },
          { name: 'Atorvastatin', brand: 'Lipitor', dosage: '40-80mg once daily', price: 250, type: 'Statin', sideEffects: 'Muscle pain, liver issues' },
          { name: 'Carvedilol', brand: 'Coreg', dosage: '3.125-25mg twice daily', price: 180, type: 'Beta Blocker', sideEffects: 'Dizziness, fatigue' }
        ]
      },

      // DIABETES
      'diabetes_type1': {
        name: 'Type 1 Diabetes',
        symptoms: ['excessive thirst', 'frequent urination', 'extreme hunger', 'weight loss', 'fatigue', 'blurred vision'],
        medicines: [
          { name: 'Insulin Glargine', brand: 'Lantus', dosage: '10-100 units subcutaneous daily', price: 2500, type: 'Long-acting Insulin', sideEffects: 'Hypoglycemia, injection site reactions' },
          { name: 'Insulin Aspart', brand: 'NovoLog', dosage: '5-20 units before meals', price: 2200, type: 'Rapid-acting Insulin', sideEffects: 'Hypoglycemia, weight gain' },
          { name: 'Insulin Lispro', brand: 'Humalog', dosage: '5-20 units before meals', price: 2300, type: 'Rapid-acting Insulin', sideEffects: 'Hypoglycemia, allergic reactions' },
          { name: 'Glucagon', brand: 'GlucaGen', dosage: '1mg injection for severe hypoglycemia', price: 3000, type: 'Emergency Hormone', sideEffects: 'Nausea, vomiting' }
        ]
      },

      'diabetes_type2': {
        name: 'Type 2 Diabetes',
        symptoms: ['increased thirst', 'frequent urination', 'increased hunger', 'fatigue', 'blurred vision', 'slow healing wounds'],
        medicines: [
          { name: 'Metformin', brand: 'Glucophage', dosage: '500-2000mg daily with meals', price: 150, type: 'Biguanide', sideEffects: 'Nausea, diarrhea, metallic taste' },
          { name: 'Glimepiride', brand: 'Amaryl', dosage: '1-4mg once daily with breakfast', price: 200, type: 'Sulfonylurea', sideEffects: 'Hypoglycemia, weight gain' },
          { name: 'Sitagliptin', brand: 'Januvia', dosage: '100mg once daily', price: 400, type: 'DPP-4 Inhibitor', sideEffects: 'Upper respiratory infection, headache' },
          { name: 'Empagliflozin', brand: 'Jardiance', dosage: '10-25mg once daily', price: 500, type: 'SGLT2 Inhibitor', sideEffects: 'UTI, genital infections' },
          { name: 'Liraglutide', brand: 'Victoza', dosage: '0.6-1.8mg subcutaneous daily', price: 1200, type: 'GLP-1 Agonist', sideEffects: 'Nausea, vomiting' }
        ]
      },

      // RESPIRATORY DISEASES
      'asthma': {
        name: 'Asthma',
        symptoms: ['wheezing', 'shortness of breath', 'chest tightness', 'coughing', 'difficulty breathing'],
        medicines: [
          { name: 'Albuterol', brand: 'Ventolin', dosage: '2 puffs every 4-6 hours as needed', price: 250, type: 'Short-acting Beta Agonist', sideEffects: 'Tremor, rapid heart rate' },
          { name: 'Fluticasone', brand: 'Flonase', dosage: '2 puffs twice daily', price: 300, type: 'Inhaled Corticosteroid', sideEffects: 'Throat irritation, hoarse voice' },
          { name: 'Montelukast', brand: 'Singulair', dosage: '10mg once daily at bedtime', price: 180, type: 'Leukotriene Modifier', sideEffects: 'Mood changes, headache' },
          { name: 'Budesonide/Formoterol', brand: 'Symbicort', dosage: '2 puffs twice daily', price: 450, type: 'Combination Inhaler', sideEffects: 'Thrush, tremor' }
        ]
      },

      'copd': {
        name: 'COPD (Chronic Obstructive Pulmonary Disease)',
        symptoms: ['chronic cough', 'shortness of breath', 'wheezing', 'chest tightness', 'mucus production'],
        medicines: [
          { name: 'Tiotropium', brand: 'Spiriva', dosage: '18mcg once daily via inhaler', price: 400, type: 'Long-acting Anticholinergic', sideEffects: 'Dry mouth, constipation' },
          { name: 'Salmeterol', brand: 'Serevent', dosage: '50mcg twice daily', price: 350, type: 'Long-acting Beta Agonist', sideEffects: 'Tremor, headache' },
          { name: 'Prednisolone', brand: 'Prelone', dosage: '20-60mg daily for exacerbations', price: 75, type: 'Oral Corticosteroid', sideEffects: 'Weight gain, mood changes' },
          { name: 'N-Acetylcysteine', brand: 'Mucomyst', dosage: '600mg twice daily', price: 120, type: 'Mucolytic', sideEffects: 'Nausea, stomach upset' }
        ]
      },

      // INFECTIOUS DISEASES
      'pneumonia': {
        name: 'Pneumonia',
        symptoms: ['cough with phlegm', 'fever', 'chills', 'difficulty breathing', 'chest pain'],
        medicines: [
          { name: 'Azithromycin', brand: 'Zithromax', dosage: '500mg day 1, then 250mg days 2-5', price: 150, type: 'Macrolide Antibiotic', sideEffects: 'Nausea, diarrhea' },
          { name: 'Amoxicillin/Clavulanate', brand: 'Augmentin', dosage: '875mg twice daily for 7-10 days', price: 200, type: 'Penicillin Antibiotic', sideEffects: 'Diarrhea, rash' },
          { name: 'Levofloxacin', brand: 'Levaquin', dosage: '750mg once daily for 5 days', price: 300, type: 'Fluoroquinolone', sideEffects: 'Nausea, dizziness' },
          { name: 'Ceftriaxone', brand: 'Rocephin', dosage: '1-2g IV daily', price: 250, type: 'Cephalosporin', sideEffects: 'Injection site pain, diarrhea' }
        ]
      },

      'tuberculosis': {
        name: 'Tuberculosis',
        symptoms: ['persistent cough', 'coughing up blood', 'weight loss', 'fatigue', 'night sweats', 'fever'],
        medicines: [
          { name: 'Isoniazid', brand: 'INH', dosage: '300mg once daily for 6-9 months', price: 80, type: 'Anti-TB Drug', sideEffects: 'Liver toxicity, peripheral neuropathy' },
          { name: 'Rifampin', brand: 'Rifadin', dosage: '600mg once daily for 6 months', price: 120, type: 'Anti-TB Drug', sideEffects: 'Orange discoloration of urine, liver toxicity' },
          { name: 'Ethambutol', brand: 'Myambutol', dosage: '25mg/kg daily for 2 months', price: 100, type: 'Anti-TB Drug', sideEffects: 'Vision problems, confusion' },
          { name: 'Pyrazinamide', brand: 'PZA', dosage: '25mg/kg daily for 2 months', price: 90, type: 'Anti-TB Drug', sideEffects: 'Liver toxicity, joint pain' }
        ]
      },

      // GASTROINTESTINAL DISEASES
      'peptic_ulcer': {
        name: 'Peptic Ulcer Disease',
        symptoms: ['stomach pain', 'burning sensation', 'nausea', 'bloating', 'heartburn'],
        medicines: [
          { name: 'Omeprazole', brand: 'Prilosec', dosage: '20-40mg once daily before breakfast', price: 120, type: 'Proton Pump Inhibitor', sideEffects: 'Headache, nausea' },
          { name: 'Pantoprazole', brand: 'Protonix', dosage: '40mg once daily', price: 85, type: 'Proton Pump Inhibitor', sideEffects: 'Headache, dizziness' },
          { name: 'Clarithromycin', brand: 'Biaxin', dosage: '500mg twice daily (for H. pylori)', price: 180, type: 'Macrolide Antibiotic', sideEffects: 'Nausea, metallic taste' },
          { name: 'Bismuth Subsalicylate', brand: 'Pepto-Bismol', dosage: '525mg four times daily', price: 45, type: 'Antacid', sideEffects: 'Black stool, constipation' }
        ]
      },

      'ibs': {
        name: 'Irritable Bowel Syndrome',
        symptoms: ['abdominal pain', 'bloating', 'gas', 'diarrhea', 'constipation', 'mucus in stool'],
        medicines: [
          { name: 'Loperamide', brand: 'Imodium', dosage: '2-4mg after each loose stool', price: 60, type: 'Antidiarrheal', sideEffects: 'Constipation, dizziness' },
          { name: 'Dicyclomine', brand: 'Bentyl', dosage: '20mg four times daily', price: 80, type: 'Antispasmodic', sideEffects: 'Dry mouth, drowsiness' },
          { name: 'Polyethylene Glycol', brand: 'MiraLAX', dosage: '17g once daily in water', price: 70, type: 'Laxative', sideEffects: 'Bloating, cramping' },
          { name: 'Rifaximin', brand: 'Xifaxan', dosage: '550mg twice daily', price: 800, type: 'Antibiotic', sideEffects: 'Nausea, fatigue' }
        ]
      },

      // NEUROLOGICAL DISEASES
      'alzheimers': {
        name: "Alzheimer's Disease",
        symptoms: ['memory loss', 'confusion', 'difficulty thinking', 'behavioral changes', 'trouble speaking'],
        medicines: [
          { name: 'Donepezil', brand: 'Aricept', dosage: '5-10mg once daily', price: 350, type: 'Cholinesterase Inhibitor', sideEffects: 'Nausea, diarrhea, insomnia' },
          { name: 'Memantine', brand: 'Namenda', dosage: '10mg twice daily', price: 400, type: 'NMDA Antagonist', sideEffects: 'Dizziness, headache' },
          { name: 'Galantamine', brand: 'Razadyne', dosage: '8-12mg twice daily', price: 300, type: 'Cholinesterase Inhibitor', sideEffects: 'Nausea, vomiting' },
          { name: 'Rivastigmine', brand: 'Exelon', dosage: '3-6mg twice daily', price: 280, type: 'Cholinesterase Inhibitor', sideEffects: 'Nausea, loss of appetite' }
        ]
      },

      'epilepsy': {
        name: 'Epilepsy',
        symptoms: ['seizures', 'temporary confusion', 'staring spells', 'uncontrollable jerking movements'],
        medicines: [
          { name: 'Phenytoin', brand: 'Dilantin', dosage: '300-400mg daily', price: 150, type: 'Anticonvulsant', sideEffects: 'Drowsiness, gum overgrowth' },
          { name: 'Carbamazepine', brand: 'Tegretol', dosage: '200-400mg twice daily', price: 120, type: 'Anticonvulsant', sideEffects: 'Dizziness, nausea' },
          { name: 'Valproic Acid', brand: 'Depakote', dosage: '250-500mg twice daily', price: 180, type: 'Anticonvulsant', sideEffects: 'Weight gain, hair loss' },
          { name: 'Levetiracetam', brand: 'Keppra', dosage: '500-1500mg twice daily', price: 250, type: 'Anticonvulsant', sideEffects: 'Drowsiness, mood changes' }
        ]
      },

      'parkinsons': {
        name: "Parkinson's Disease",
        symptoms: ['tremor', 'slowness of movement', 'rigid muscles', 'impaired posture', 'loss of automatic movements'],
        medicines: [
          { name: 'Carbidopa/Levodopa', brand: 'Sinemet', dosage: '25/100mg three times daily', price: 200, type: 'Dopamine Precursor', sideEffects: 'Nausea, dyskinesia' },
          { name: 'Pramipexole', brand: 'Mirapex', dosage: '0.5-1.5mg three times daily', price: 300, type: 'Dopamine Agonist', sideEffects: 'Nausea, drowsiness' },
          { name: 'Rasagiline', brand: 'Azilect', dosage: '1mg once daily', price: 400, type: 'MAO-B Inhibitor', sideEffects: 'Headache, joint pain' },
          { name: 'Amantadine', brand: 'Symmetrel', dosage: '100mg twice daily', price: 150, type: 'Antiviral/Antiparkinsonian', sideEffects: 'Dizziness, insomnia' }
        ]
      },

      // MENTAL HEALTH CONDITIONS
      'depression': {
        name: 'Major Depressive Disorder',
        symptoms: ['persistent sadness', 'loss of interest', 'fatigue', 'sleep disturbances', 'appetite changes'],
        medicines: [
          { name: 'Sertraline', brand: 'Zoloft', dosage: '50-200mg once daily', price: 180, type: 'SSRI Antidepressant', sideEffects: 'Nausea, sexual dysfunction' },
          { name: 'Fluoxetine', brand: 'Prozac', dosage: '20-80mg once daily', price: 160, type: 'SSRI Antidepressant', sideEffects: 'Insomnia, anxiety' },
          { name: 'Venlafaxine', brand: 'Effexor XR', dosage: '75-225mg once daily', price: 220, type: 'SNRI Antidepressant', sideEffects: 'Nausea, dizziness' },
          { name: 'Bupropion', brand: 'Wellbutrin', dosage: '150-300mg daily', price: 200, type: 'Atypical Antidepressant', sideEffects: 'Dry mouth, insomnia' }
        ]
      },

      'anxiety': {
        name: 'Anxiety Disorders',
        symptoms: ['excessive worry', 'restlessness', 'fatigue', 'difficulty concentrating', 'muscle tension'],
        medicines: [
          { name: 'Alprazolam', brand: 'Xanax', dosage: '0.25-0.5mg three times daily', price: 120, type: 'Benzodiazepine', sideEffects: 'Drowsiness, dependence risk' },
          { name: 'Lorazepam', brand: 'Ativan', dosage: '1-2mg twice daily', price: 100, type: 'Benzodiazepine', sideEffects: 'Drowsiness, confusion' },
          { name: 'Buspirone', brand: 'BuSpar', dosage: '15-30mg daily in divided doses', price: 90, type: 'Anxiolytic', sideEffects: 'Dizziness, nausea' },
          { name: 'Escitalopram', brand: 'Lexapro', dosage: '10-20mg once daily', price: 190, type: 'SSRI Antidepressant', sideEffects: 'Nausea, fatigue' }
        ]
      },

      // CANCER (SUPPORTIVE CARE)
      'chemotherapy_nausea': {
        name: 'Chemotherapy-Induced Nausea',
        symptoms: ['nausea', 'vomiting', 'loss of appetite', 'fatigue'],
        medicines: [
          { name: 'Ondansetron', brand: 'Zofran', dosage: '8mg every 12 hours', price: 250, type: '5-HT3 Antagonist', sideEffects: 'Headache, constipation' },
          { name: 'Metoclopramide', brand: 'Reglan', dosage: '10mg four times daily', price: 80, type: 'Dopamine Antagonist', sideEffects: 'Drowsiness, tardive dyskinesia' },
          { name: 'Dexamethasone', brand: 'Decadron', dosage: '12mg IV before chemo', price: 60, type: 'Corticosteroid', sideEffects: 'Increased blood sugar, mood changes' },
          { name: 'Aprepitant', brand: 'Emend', dosage: '125mg day 1, 80mg days 2-3', price: 500, type: 'NK1 Antagonist', sideEffects: 'Fatigue, hiccups' }
        ]
      },

      // AUTOIMMUNE DISEASES
      'rheumatoid_arthritis': {
        name: 'Rheumatoid Arthritis',
        symptoms: ['joint pain', 'swelling', 'morning stiffness', 'fatigue', 'fever'],
        medicines: [
          { name: 'Methotrexate', brand: 'Rheumatrex', dosage: '7.5-25mg once weekly', price: 150, type: 'DMARD', sideEffects: 'Nausea, liver toxicity' },
          { name: 'Adalimumab', brand: 'Humira', dosage: '40mg subcutaneous every other week', price: 3000, type: 'TNF Inhibitor', sideEffects: 'Injection site reactions, infections' },
          { name: 'Sulfasalazine', brand: 'Azulfidine', dosage: '2-3g daily in divided doses', price: 120, type: 'DMARD', sideEffects: 'Nausea, headache' },
          { name: 'Hydroxychloroquine', brand: 'Plaquenil', dosage: '200-400mg daily', price: 100, type: 'Antimalarial DMARD', sideEffects: 'Eye toxicity, nausea' }
        ]
      },

      'lupus': {
        name: 'Systemic Lupus Erythematosus',
        symptoms: ['butterfly rash', 'joint pain', 'fatigue', 'fever', 'kidney problems'],
        medicines: [
          { name: 'Hydroxychloroquine', brand: 'Plaquenil', dosage: '200-400mg daily', price: 100, type: 'Antimalarial', sideEffects: 'Eye toxicity, nausea' },
          { name: 'Prednisone', brand: 'Deltasone', dosage: '5-60mg daily', price: 50, type: 'Corticosteroid', sideEffects: 'Weight gain, bone loss' },
          { name: 'Methotrexate', brand: 'Rheumatrex', dosage: '7.5-25mg once weekly', price: 150, type: 'Immunosuppressant', sideEffects: 'Nausea, liver toxicity' },
          { name: 'Belimumab', brand: 'Benlysta', dosage: '10mg/kg IV every 4 weeks', price: 4000, type: 'Monoclonal Antibody', sideEffects: 'Infusion reactions, infections' }
        ]
      },

      // KIDNEY DISEASES
      'chronic_kidney_disease': {
        name: 'Chronic Kidney Disease',
        symptoms: ['fatigue', 'swelling', 'shortness of breath', 'nausea', 'changes in urination'],
        medicines: [
          { name: 'Furosemide', brand: 'Lasix', dosage: '20-80mg daily', price: 60, type: 'Loop Diuretic', sideEffects: 'Dehydration, electrolyte imbalance' },
          { name: 'Erythropoietin', brand: 'Epogen', dosage: '50-100 units/kg 3x weekly', price: 800, type: 'Hormone', sideEffects: 'Hypertension, clots' },
          { name: 'Calcitriol', brand: 'Rocaltrol', dosage: '0.25-0.5mcg twice daily', price: 120, type: 'Vitamin D Analog', sideEffects: 'Hypercalcemia, nausea' },
          { name: 'Sevelamer', brand: 'Renagel', dosage: '800-1600mg with meals', price: 300, type: 'Phosphate Binder', sideEffects: 'Nausea, constipation' }
        ]
      },

      // LIVER DISEASES
      'hepatitis_b': {
        name: 'Hepatitis B',
        symptoms: ['fatigue', 'abdominal pain', 'dark urine', 'jaundice', 'joint pain'],
        medicines: [
          { name: 'Tenofovir', brand: 'Viread', dosage: '300mg once daily', price: 400, type: 'Antiviral', sideEffects: 'Kidney toxicity, bone loss' },
          { name: 'Entecavir', brand: 'Baraclude', dosage: '0.5-1mg once daily', price: 500, type: 'Antiviral', sideEffects: 'Headache, fatigue' },
          { name: 'Peginterferon alfa-2a', brand: 'Pegasys', dosage: '180mcg weekly subcutaneous', price: 2000, type: 'Interferon', sideEffects: 'Flu-like symptoms, depression' },
          { name: 'Lamivudine', brand: 'Epivir-HBV', dosage: '100mg once daily', price: 200, type: 'Antiviral', sideEffects: 'Headache, nausea' }
        ]
      },

      // SKIN CONDITIONS
      'eczema': {
        name: 'Atopic Dermatitis (Eczema)',
        symptoms: ['itchy skin', 'red patches', 'dry skin', 'cracked skin', 'thickened skin'],
        medicines: [
          { name: 'Hydrocortisone', brand: 'Cortaid', dosage: 'Apply thin layer twice daily', price: 50, type: 'Topical Corticosteroid', sideEffects: 'Skin thinning, stretch marks' },
          { name: 'Tacrolimus', brand: 'Protopic', dosage: 'Apply thin layer twice daily', price: 200, type: 'Topical Immunosuppressant', sideEffects: 'Burning, skin cancer risk' },
          { name: 'Dupilumab', brand: 'Dupixent', dosage: '300mg subcutaneous every other week', price: 3500, type: 'Monoclonal Antibody', sideEffects: 'Injection site reactions, eye problems' },
          { name: 'Cetirizine', brand: 'Zyrtec', dosage: '10mg once daily', price: 40, type: 'Antihistamine', sideEffects: 'Drowsiness, dry mouth' }
        ]
      },

      'psoriasis': {
        name: 'Psoriasis',
        symptoms: ['red patches with scales', 'itching', 'burning', 'soreness', 'thick nails'],
        medicines: [
          { name: 'Methotrexate', brand: 'Rheumatrex', dosage: '10-25mg once weekly', price: 150, type: 'Immunosuppressant', sideEffects: 'Nausea, liver toxicity' },
          { name: 'Adalimumab', brand: 'Humira', dosage: '40mg subcutaneous every other week', price: 3000, type: 'TNF Inhibitor', sideEffects: 'Injection site reactions, infections' },
          { name: 'Betamethasone', brand: 'Diprolene', dosage: 'Apply thin layer twice daily', price: 95, type: 'Topical Corticosteroid', sideEffects: 'Skin thinning, irritation' },
          { name: 'Calcipotriene', brand: 'Dovonex', dosage: 'Apply twice daily', price: 150, type: 'Vitamin D Analog', sideEffects: 'Skin irritation, hypercalcemia' }
        ]
      },

      // EYE CONDITIONS
      'glaucoma': {
        name: 'Glaucoma',
        symptoms: ['gradual loss of peripheral vision', 'tunnel vision', 'eye pain', 'nausea', 'blurred vision'],
        medicines: [
          { name: 'Latanoprost', brand: 'Xalatan', dosage: '1 drop in affected eye daily', price: 180, type: 'Prostaglandin Analog', sideEffects: 'Eye irritation, darkening of iris' },
          { name: 'Timolol', brand: 'Timoptic', dosage: '1 drop in affected eye twice daily', price: 120, type: 'Beta Blocker', sideEffects: 'Eye irritation, systemic effects' },
          { name: 'Brimonidine', brand: 'Alphagan', dosage: '1 drop in affected eye twice daily', price: 150, type: 'Alpha Agonist', sideEffects: 'Eye redness, drowsiness' },
          { name: 'Acetazolamide', brand: 'Diamox', dosage: '250mg twice daily', price: 100, type: 'Carbonic Anhydrase Inhibitor', sideEffects: 'Tingling, kidney stones' }
        ]
      },

      // COMMON CONDITIONS
      'common_cold': {
        name: 'Common Cold',
        symptoms: ['runny nose', 'sneezing', 'cough', 'sore throat', 'headache', 'mild fever'],
        medicines: [
          { name: 'Paracetamol', brand: 'Tylenol', dosage: '500-1000mg every 4-6 hours', price: 45, type: 'Analgesic/Antipyretic', sideEffects: 'Liver toxicity (overdose)' },
          { name: 'Phenylephrine', brand: 'Sudafed PE', dosage: '10mg every 4 hours', price: 60, type: 'Decongestant', sideEffects: 'Increased blood pressure, insomnia' },
          { name: 'Dextromethorphan', brand: 'Robitussin DM', dosage: '15-30mg every 4 hours', price: 70, type: 'Cough Suppressant', sideEffects: 'Drowsiness, nausea' },
          { name: 'Cetirizine', brand: 'Zyrtec', dosage: '10mg once daily', price: 40, type: 'Antihistamine', sideEffects: 'Drowsiness, dry mouth' }
        ]
      },

      'fever': {
        name: 'Fever',
        symptoms: ['elevated body temperature', 'chills', 'sweating', 'headache', 'muscle aches'],
        medicines: [
          { name: 'Ibuprofen', brand: 'Advil', dosage: '400-800mg every 6-8 hours', price: 60, type: 'NSAID', sideEffects: 'Stomach irritation, kidney problems' },
          { name: 'Aspirin', brand: 'Bayer', dosage: '325-650mg every 4 hours', price: 25, type: 'NSAID', sideEffects: 'Stomach bleeding, Reye syndrome' },
          { name: 'Paracetamol', brand: 'Tylenol', dosage: '500-1000mg every 4-6 hours', price: 45, type: 'Analgesic/Antipyretic', sideEffects: 'Liver toxicity (overdose)' }
        ]
      },

      'headache': {
        name: 'Headache',
        symptoms: ['head pain', 'pressure', 'throbbing', 'sensitivity to light', 'nausea'],
        medicines: [
          { name: 'Ibuprofen', brand: 'Advil', dosage: '200-400mg every 4-6 hours', price: 60, type: 'NSAID', sideEffects: 'Stomach irritation' },
          { name: 'Sumatriptan', brand: 'Imitrex', dosage: '25-100mg at onset of migraine', price: 300, type: 'Triptan', sideEffects: 'Chest tightness, dizziness' },
          { name: 'Rizatriptan', brand: 'Maxalt', dosage: '5-10mg at onset of migraine', price: 350, type: 'Triptan', sideEffects: 'Dizziness, fatigue' },
          { name: 'Propranolol', brand: 'Inderal', dosage: '40-120mg daily for prevention', price: 80, type: 'Beta Blocker', sideEffects: 'Fatigue, cold hands' }
        ]
      }
    };

    // Dynamically assign stock availability to medicines (index 1 and 4 are out-of-stock, others in-stock)
    for (const disease of Object.values(this.medicineDatabase)) {
      disease.medicines.forEach((med, index) => {
        if (index === 1 || index === 4) {
          med.availability = false;
        } else {
          med.availability = true;
        }
      });
    }

    // Comprehensive symptom keywords for better matching
    this.symptomKeywords = {
      'chest pain': ['chest pain', 'chest discomfort', 'heart pain', 'chest pressure', 'chest tightness'],
      'shortness of breath': ['shortness of breath', 'difficulty breathing', 'breathless', 'dyspnea', 'cant breathe'],
      'abdominal pain': ['stomach pain', 'belly pain', 'abdominal pain', 'stomach ache', 'tummy ache'],
      'headache': ['headache', 'head pain', 'migraine', 'head ache', 'skull pain'],
      'fever': ['fever', 'high temperature', 'hot', 'feverish', 'pyrexia'],
      'cough': ['cough', 'coughing', 'hacking', 'dry cough', 'wet cough', 'productive cough'],
      'nausea': ['nausea', 'feeling sick', 'queasy', 'sick to stomach', 'want to vomit'],
      'fatigue': ['fatigue', 'tired', 'exhausted', 'weakness', 'lack of energy', 'worn out'],
      'dizziness': ['dizzy', 'lightheaded', 'vertigo', 'spinning', 'balance problems'],
      'joint pain': ['joint pain', 'arthritis', 'stiff joints', 'aching joints', 'swollen joints']
    };
  }

  // Search for medicines based on symptoms or disease names
  searchBySymptoms(symptoms) {
    const results = [];
    const searchTerms = symptoms.toLowerCase().split(/[\s,]+/);

    for (const [diseaseId, disease] of Object.entries(this.medicineDatabase)) {
      let matchScore = 0;
      let matchedSymptoms = [];

      // Check direct symptom matches
      for (const symptom of disease.symptoms) {
        for (const searchTerm of searchTerms) {
          if (searchTerm.length < 3) {
            // For short terms (like 'hi', 'he'), check exact word match only
            const words = symptom.toLowerCase().split(/[\s,.-]+/);
            if (words.includes(searchTerm)) {
              matchScore += 2;
              if (!matchedSymptoms.includes(symptom)) {
                matchedSymptoms.push(symptom);
              }
            }
          } else {
            // For terms >= 3 characters, perform standard substring match
            if (symptom.toLowerCase().includes(searchTerm) || searchTerm.includes(symptom.toLowerCase())) {
              matchScore += 2;
              if (!matchedSymptoms.includes(symptom)) {
                matchedSymptoms.push(symptom);
              }
            }
          }
        }
      }

      // Check keyword synonyms
      for (const [keyword, synonyms] of Object.entries(this.symptomKeywords)) {
        for (const synonym of synonyms) {
          for (const searchTerm of searchTerms) {
            if (searchTerm.length < 3) {
              const words = synonym.toLowerCase().split(/[\s,.-]+/);
              if (words.includes(searchTerm)) {
                if (disease.symptoms.some(s => s.toLowerCase().includes(keyword))) {
                  matchScore += 1;
                  if (!matchedSymptoms.includes(keyword)) {
                    matchedSymptoms.push(keyword);
                  }
                }
              }
            } else {
              if (synonym.toLowerCase().includes(searchTerm) || searchTerm.includes(synonym.toLowerCase())) {
                // Check if this keyword matches any disease symptoms
                if (disease.symptoms.some(s => s.toLowerCase().includes(keyword))) {
                  matchScore += 1;
                  if (!matchedSymptoms.includes(keyword)) {
                    matchedSymptoms.push(keyword);
                  }
                }
              }
            }
          }
        }
      }

      // Check disease name match
      if (symptoms.toLowerCase().length >= 3) {
        if (disease.name.toLowerCase().includes(symptoms.toLowerCase()) || 
            symptoms.toLowerCase().includes(disease.name.toLowerCase())) {
          matchScore += 5;
        }
      } else {
        const words = disease.name.toLowerCase().split(/[\s,.-]+/);
        if (words.includes(symptoms.toLowerCase())) {
          matchScore += 5;
        }
      }

      if (matchScore > 0) {
        results.push({
          disease: disease,
          matchScore: matchScore,
          matchedSymptoms: matchedSymptoms,
          confidence: Math.min(matchScore * 10, 95) // Cap at 95%
        });
      }
    }

    // Sort by match score and return top results
    return results.sort((a, b) => b.matchScore - a.matchScore).slice(0, 5);
  }

  // Get medicine details by name
  getMedicineByName(medicineName) {
    const query = medicineName.toLowerCase().trim();
    if (query.length < 3) {
      // For very short queries, only allow exact matches (name or brand)
      for (const disease of Object.values(this.medicineDatabase)) {
        const medicine = disease.medicines.find(med => 
          med.name.toLowerCase() === query ||
          med.brand.toLowerCase() === query
        );
        if (medicine) {
          return { ...medicine, diseaseContext: disease.name };
        }
      }
      return null;
    }

    // For queries >= 3 characters, allow substring includes matching
    for (const disease of Object.values(this.medicineDatabase)) {
      const medicine = disease.medicines.find(med => 
        med.name.toLowerCase().includes(query) ||
        med.brand.toLowerCase().includes(query)
      );
      if (medicine) {
        return { ...medicine, diseaseContext: disease.name };
      }
    }
    return null;
  }

  // Get all medicines for a specific disease
  getMedicinesForDisease(diseaseId) {
    return this.medicineDatabase[diseaseId] || null;
  }

  // Get emergency medicines
  getEmergencyMedicines() {
    return {
      'heart_attack': this.medicineDatabase.heart_attack?.medicines || [],
      'severe_asthma': this.medicineDatabase.asthma?.medicines || [],
      'severe_allergic_reaction': [
        { name: 'Epinephrine', brand: 'EpiPen', dosage: '0.3mg intramuscular', price: 600, type: 'Emergency Epinephrine', sideEffects: 'Rapid heart rate, anxiety' }
      ]
    };
  }

  // Get all disease categories
  getAllDiseaseCategories() {
    const categories = {
      'Cardiovascular': ['hypertension', 'heart_attack'],
      'Diabetes': ['diabetes_type1', 'diabetes_type2'],
      'Respiratory': ['asthma', 'copd', 'pneumonia'],
      'Infectious Diseases': ['tuberculosis', 'hepatitis_b'],
      'Neurological': ['alzheimers', 'epilepsy', 'parkinsons'],
      'Mental Health': ['depression', 'anxiety'],
      'Autoimmune': ['rheumatoid_arthritis', 'lupus'],
      'Kidney Disease': ['chronic_kidney_disease'],
      'Skin Conditions': ['eczema', 'psoriasis'],
      'Eye Conditions': ['glaucoma'],
      'Common Conditions': ['common_cold', 'fever', 'headache', 'peptic_ulcer', 'ibs'],
      'Cancer Support': ['chemotherapy_nausea']
    };
    return categories;
  }
}

// Export for global use
if (typeof window !== 'undefined') {
  window.GlobalMedicineDatabase = GlobalMedicineDatabase;
} else if (typeof module !== 'undefined' && module.exports) {
  module.exports = GlobalMedicineDatabase;
}