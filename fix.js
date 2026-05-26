const fs = require('fs');
let c = fs.readFileSync('c:/Users/ADITYA/Downloads/Aditya Medical Web 1 - Copy/Aditya Medical Web/index.html', 'utf8');
const hook = "                l.classList.remove('hn-ghost');";
const missing = `
                l.classList.add('hn-account');
              });
            }
          }
        }, 20);
      })();
    </script>
  </header>

  <!-- ══ NEW MEDICO HERO SPLIT ══ -->
  <section class="hero-split" id="home">
    <div class="hero-left">
      <div class="hero-badge-medico">Health Care Services</div>
      <h1 class="hero-title-medico">Treatment With a Best <span class="hero-title-accent">Doctors.</span></h1>
      <p class="hero-sub-medico">For a better today & tomorrow stay with us. Order genuine medicines online and get them delivered to your doorstep.</p>
      
      <div class="medico-quote-box">
        <div class="mq-input-group">
          <label>Email address</label>
          <input type="email" placeholder="info.aditya@gmail.com" />
        </div>
        <div class="mq-input-group">
          <label>Date</label>
          <input type="date" value="2023-09-06" />
        </div>
        <a href="order.html" class="btn-hero-primary-medico">Book an Appointment</a>
      </div>

      <div class="hero-trust-medico">
        <p>Trusted and loved by the best doctors</p>
      </div>
    </div>

    <div class="hero-right">
      <div class="hero-slider-container">
        <!-- CONTINUOUSLY SCROLLING medicine background (never stops) -->
        <div class="hero-bg-strip">
          <div class="hero-bg-track">
            <!-- The 4 remaining user-provided medicine images -->
            <div class="hero-bg-img" style="background-image: url('assets/hero_bg/media__1774902175002.jpg');"></div>
            <div class="hero-bg-img" style="background-image: url('assets/hero_bg/media__1774902175029.jpg');"></div>
            <div class="hero-bg-img" style="background-image: url('assets/hero_bg/media__1774902175068.jpg');"></div>
            <div class="hero-bg-img" style="background-image: url('assets/hero_bg/media__1774902175397.jpg');"></div>
            
            <div class="hero-bg-img" style="background-image: url('assets/hero_bg/media__1774902175002.jpg');"></div>
            <div class="hero-bg-img" style="background-image: url('assets/hero_bg/media__1774902175029.jpg');"></div>
            <div class="hero-bg-img" style="background-image: url('assets/hero_bg/media__1774902175068.jpg');"></div>
            <div class="hero-bg-img" style="background-image: url('assets/hero_bg/media__1774902175397.jpg');"></div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- ══ TRUST LOGOS (MEDICO STYLE) ══ -->
  <section class="trust-logos-section">
    <div class="container">
      <div class="logo-grid">
        <div class="trust-logo tl-primary">
          <div class="tl-icon">✚</div>
          <div class="tl-text">Aditya Medical</div>
        </div>
        <div class="trust-logo tl-white">
          <div class="tl-icon" style="color:var(--primary)">✚</div>
          <div class="tl-text" style="color:var(--primary)">Aditya Medical</div>
        </div>
        <div class="trust-logo tl-darkblue">
          <div class="tl-icon">✚</div>
          <div class="tl-text">Aditya Medical</div>
        </div>
        <div class="trust-logo tl-green">
          <div class="tl-icon">✚</div>
          <div class="tl-text">Aditya Medical</div>
        </div>
      </div>
    </div>
  </section>

`;
c = c.replace(hook, hook + missing);
fs.writeFileSync('c:/Users/ADITYA/Downloads/Aditya Medical Web 1 - Copy/Aditya Medical Web/index.html', c);
console.log('Fixed index.html structure!');
