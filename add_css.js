const fs = require('fs');

const css = `
/* ════════════════════════════════════════════════════
   MEDICO SPLIT HERO LAYOUT
════════════════════════════════════════════════════ */
.hero-split {
  display: flex;
  min-height: 85vh;
  background: var(--bg-primary);
  padding: 4rem 5%;
  align-items: center;
  gap: 3rem;
  overflow: hidden;
  position: relative;
}

.hero-left {
  flex: 1;
  max-width: 600px;
  z-index: 2;
}

.hero-badge-medico {
  display: inline-block;
  background: var(--primary-light);
  color: var(--primary);
  padding: 0.5rem 1.2rem;
  border-radius: 50px;
  font-size: 0.85rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
}

.hero-title-medico {
  font-size: 3.5rem;
  font-weight: 800;
  color: var(--dark);
  line-height: 1.15;
  margin-bottom: 1.2rem;
}

.hero-title-accent {
  color: var(--primary);
  position: relative;
}

.hero-title-accent::after {
  content: '';
  position: absolute;
  bottom: 5px;
  left: 0;
  width: 100%;
  height: 6px;
  background: var(--primary);
  border-radius: 4px;
  z-index: -1;
  opacity: 0.3;
}

.hero-sub-medico {
  font-size: 1.1rem;
  color: var(--gray-600);
  line-height: 1.6;
  margin-bottom: 2.5rem;
}

/* Quotation Box Form */
.medico-quote-box {
  background: var(--white);
  border-radius: 12px;
  padding: 1.2rem;
  display: flex;
  align-items: center;
  gap: 1.5rem;
  box-shadow: 0 10px 40px rgba(99, 102, 241, 0.08);
  border: 1px solid var(--gray-200);
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.mq-input-group {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  flex: 1;
}

.mq-input-group label {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--gray-400);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.mq-input-group input {
  border: none;
  border-bottom: 2px solid transparent;
  padding: 0.4rem 0;
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--dark);
  outline: none;
  font-family: inherit;
  transition: all 0.3s;
}

.mq-input-group input:focus {
  border-bottom: 2px solid var(--primary);
}

.btn-hero-primary-medico {
  background: var(--primary);
  color: var(--white);
  padding: 0.9rem 1.8rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.95rem;
  text-decoration: none;
  white-space: nowrap;
  transition: all 0.3s;
  box-shadow: var(--shadow-sm);
}

.btn-hero-primary-medico:hover {
  transform: translateY(-2px);
  background: var(--primary-dark);
  box-shadow: var(--shadow-md);
  color: var(--white);
}

.hero-trust-medico p {
  font-size: 0.85rem;
  color: var(--gray-500);
  font-weight: 500;
}

/* Right Side Image Slider Container */
.hero-right {
  flex: 1;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  position: relative;
  z-index: 1;
}

.hero-slider-container {
  width: 100%;
  max-width: 650px;
  height: 550px;
  border-radius: 24px;
  overflow: hidden;
  position: relative;
  box-shadow: 0 20px 60px rgba(99, 102, 241, 0.15);
  border: 8px solid var(--white);
}

/* We reuse the hero-bg-strip inside the container but adjust its sizing */
.hero-slider-container .hero-bg-strip {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  opacity: 1;
  z-index: 1;
}

.hero-slider-container .hero-bg-img {
  width: 100%;
  height: 100%;
  background-size: cover;
}

/* Responsive Split Hero */
@media (max-width: 1024px) {
  .hero-split {
    flex-direction: column;
    padding: 6rem 5% 4rem;
    text-align: center;
  }
  
  .hero-title-accent::after {
    left: 50%;
    transform: translateX(-50%);
  }
  
  .medico-quote-box {
    text-align: left;
  }
  
  .hero-slider-container {
    height: 400px;
  }
}

/* ════════════════════════════════════════════════════
   TRUST LOGOS (FARMACIA DE GUARDIA STYLE)
════════════════════════════════════════════════════ */
.trust-logos-section {
  padding: 3rem 0 5rem;
  background: var(--bg-primary);
}

.logo-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
}

.trust-logo {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2.5rem 1rem;
  border-radius: 0; /* Square-ish cards like Medico */
  gap: 0.8rem;
  transition: all 0.3s;
}

.trust-logo:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-md);
}

.tl-icon {
  font-size: 2.5rem;
  font-weight: 800;
  line-height: 1;
}

.tl-text {
  font-size: 1.1rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

/* Logo Color Variants */
.tl-primary { background: var(--primary); color: var(--white); }
.tl-white { background: var(--white); border: 1px solid var(--gray-200); }
.tl-darkblue { background: var(--primary-dark); color: var(--white); }
.tl-green { background: var(--secondary); color: var(--white); }

@media (max-width: 768px) {
  .logo-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
`;

fs.appendFileSync('c:/Users/ADITYA/Downloads/Aditya Medical Web 1 - Copy/Aditya Medical Web/style.css', css);
console.log('Appended Medico CSS layout!');
