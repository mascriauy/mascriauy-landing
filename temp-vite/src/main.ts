import './style.css'

// Initialize Lucide icons
document.addEventListener('DOMContentLoaded', () => {
  // @ts-ignore
  if (window.lucide) {
    // @ts-ignore
    window.lucide.createIcons();
  }

  // Initialize animations
  initScrollAnimations();
  initSmoothScroll();
  initContactForm();
  initNavbarScroll();
});

// Intersection Observer for fade-in animations
function initScrollAnimations() {
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe all fade-in-up elements
  document.querySelectorAll('.fade-in-up').forEach(el => {
    observer.observe(el);
  });
}

// Smooth scroll for navigation links
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const href = anchor.getAttribute('href');
      if (href) {
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      }
    });
  });
}

// Contact form handling
function initContactForm() {
  const form = document.getElementById('contactForm') as HTMLFormElement;

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const formData = new FormData(form);
      const data = {
        nombre: formData.get('nombre'),
        telefono: formData.get('telefono'),
        email: formData.get('email'),
        mensaje: formData.get('mensaje')
      };

      // Get submit button
      const submitBtn = form.querySelector('button[type="submit"]') as HTMLButtonElement;
      const originalContent = submitBtn.innerHTML;

      // Show loading state
      submitBtn.innerHTML = `
        <svg class="animate-spin w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Enviando...
      `;
      submitBtn.disabled = true;

      // Simulate form submission (replace with actual API call)
      try {
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Success state
        submitBtn.innerHTML = `
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
          </svg>
          ¡Mensaje Enviado!
        `;
        submitBtn.classList.remove('bg-brand-500', 'hover:bg-brand-400');
        submitBtn.classList.add('bg-green-500');

        // Reset form
        form.reset();

        // Reset button after 3 seconds
        setTimeout(() => {
          submitBtn.innerHTML = originalContent;
          submitBtn.disabled = false;
          submitBtn.classList.remove('bg-green-500');
          submitBtn.classList.add('bg-brand-500', 'hover:bg-brand-400');
        }, 3000);

        console.log('Form submitted:', data);
      } catch (error) {
        // Error state
        submitBtn.innerHTML = `
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
          Error al enviar
        `;
        submitBtn.classList.remove('bg-brand-500', 'hover:bg-brand-400');
        submitBtn.classList.add('bg-red-500');

        setTimeout(() => {
          submitBtn.innerHTML = originalContent;
          submitBtn.disabled = false;
          submitBtn.classList.remove('bg-red-500');
          submitBtn.classList.add('bg-brand-500', 'hover:bg-brand-400');
        }, 3000);
      }
    });
  }
}

// Navbar scroll effect
function initNavbarScroll() {
  const navbar = document.querySelector('nav');

  if (navbar) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        navbar.classList.add('bg-brand-950/95', 'shadow-lg');
      } else {
        navbar.classList.remove('bg-brand-950/95', 'shadow-lg');
      }
    });
  }
}

// Add parallax effect to hero blobs
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  const blobs = document.querySelectorAll('.blob');

  blobs.forEach((blob, index) => {
    const speed = (index + 1) * 0.1;
    (blob as HTMLElement).style.transform = `translateY(${scrollY * speed}px)`;
  });
});
