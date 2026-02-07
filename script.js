// Particle Background
function createParticles() {
  const particlesContainer = document.getElementById('particles');
  const particleCount = 100;
  
  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.style.position = 'absolute';
    particle.style.width = Math.random() * 3 + 'px';
    particle.style.height = particle.style.width;
    particle.style.background = 'rgba(255, 255, 255, 0.5)';
    particle.style.borderRadius = '50%';
    particle.style.top = Math.random() * 100 + '%';
    particle.style.left = Math.random() * 100 + '%';
    particle.style.pointerEvents = 'none';
    
    const duration = Math.random() * 20 + 10;
    particle.style.animation = `twinkle ${duration}s infinite`;
    
    particlesContainer.appendChild(particle);
  }
}

// Add twinkle animation
const style = document.createElement('style');
style.textContent = `
  @keyframes twinkle {
    0%, 100% { opacity: 0; transform: translateY(0); }
    50% { opacity: 1; }
    100% { transform: translateY(-100px); }
  }
`;
document.head.appendChild(style);

// Initialize particles
createParticles();

// Smooth scroll to section
function scrollToSection(sectionId) {
  const element = document.getElementById(sectionId);
  if (element) {
    const navHeight = 80;
    const targetPosition = element.offsetTop - navHeight;
    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth'
    });
  }
}

// Accordion functionality
document.querySelectorAll('.accordion-item').forEach(item => {
  item.addEventListener('click', () => {
    const isExpanded = item.getAttribute('data-expanded') === 'true';
    
    // Close all items
    document.querySelectorAll('.accordion-item').forEach(otherItem => {
      otherItem.setAttribute('data-expanded', 'false');
    });
    
    // Toggle clicked item
    if (!isExpanded) {
      item.setAttribute('data-expanded', 'true');
    }
  });
});

// Draggable Skills Cards with Connections
let isDragging = false;
let currentCard = null;
let offsetX = 0;
let offsetY = 0;

const skillCategories = document.querySelectorAll('.skill-category');
const hub = document.getElementById('hub');
const svg = document.getElementById('connections');

// Store initial positions
const initialPositions = {};
skillCategories.forEach(card => {
  const id = card.id;
  initialPositions[id] = {
    top: card.style.top,
    left: card.style.left,
    right: card.style.right,
    bottom: card.style.bottom
  };
});

function drawConnections() {
  // Clear existing lines
  svg.innerHTML = '';
  
  const hubRect = hub.getBoundingClientRect();
  const canvasRect = svg.getBoundingClientRect();
  
  const hubCenterX = hubRect.left + hubRect.width / 2 - canvasRect.left;
  const hubCenterY = hubRect.top + hubRect.height / 2 - canvasRect.top;
  
  skillCategories.forEach(card => {
    const cardRect = card.getBoundingClientRect();
    const cardCenterX = cardRect.left + cardRect.width / 2 - canvasRect.left;
    const cardCenterY = cardRect.top + cardRect.height / 2 - canvasRect.top;
    
    // Create SVG line
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', hubCenterX);
    line.setAttribute('y1', hubCenterY);
    line.setAttribute('x2', cardCenterX);
    line.setAttribute('y2', cardCenterY);
    line.setAttribute('stroke', 'rgba(102, 126, 234, 0.3)');
    line.setAttribute('stroke-width', '2');
    line.setAttribute('stroke-dasharray', '5,5');
    
    // Add animation
    const length = Math.sqrt(Math.pow(cardCenterX - hubCenterX, 2) + Math.pow(cardCenterY - hubCenterY, 2));
    line.style.strokeDashoffset = length;
    line.style.animation = 'dash 20s linear infinite';
    
    svg.appendChild(line);
    
    // Add dot at connection point
    const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    dot.setAttribute('cx', cardCenterX);
    dot.setAttribute('cy', cardCenterY);
    dot.setAttribute('r', '4');
    dot.setAttribute('fill', '#667eea');
    dot.style.animation = 'pulse 2s ease-in-out infinite';
    
    svg.appendChild(dot);
  });
}

// Add dash animation
const svgStyle = document.createElement('style');
svgStyle.textContent = `
  @keyframes dash {
    to { stroke-dashoffset: 0; }
  }
`;
document.head.appendChild(svgStyle);

// Initialize connections
drawConnections();
window.addEventListener('resize', drawConnections);

skillCategories.forEach(card => {
  card.addEventListener('mousedown', startDrag);
  card.addEventListener('touchstart', startDrag);
});

function startDrag(e) {
  isDragging = true;
  currentCard = e.currentTarget;
  
  const rect = currentCard.getBoundingClientRect();
  const clientX = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
  const clientY = e.type === 'touchstart' ? e.touches[0].clientY : e.clientY;
  
  offsetX = clientX - rect.left;
  offsetY = clientY - rect.top;
  
  currentCard.style.transition = 'none';
  currentCard.style.zIndex = '100';
}

document.addEventListener('mousemove', drag);
document.addEventListener('touchmove', drag);

function drag(e) {
  if (!isDragging || !currentCard) return;
  
  e.preventDefault();
  
  const clientX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
  const clientY = e.type === 'touchmove' ? e.touches[0].clientY : e.clientY;
  
  const canvas = document.querySelector('.skills-canvas');
  const canvasRect = canvas.getBoundingClientRect();
  
  let newX = clientX - canvasRect.left - offsetX;
  let newY = clientY - canvasRect.top - offsetY;
  
  // Boundaries
  newX = Math.max(0, Math.min(newX, canvasRect.width - currentCard.offsetWidth));
  newY = Math.max(0, Math.min(newY, canvasRect.height - currentCard.offsetHeight));
  
  currentCard.style.left = newX + 'px';
  currentCard.style.top = newY + 'px';
  currentCard.style.right = 'auto';
  currentCard.style.bottom = 'auto';
  
  drawConnections();
}

document.addEventListener('mouseup', stopDrag);
document.addEventListener('touchend', stopDrag);

function stopDrag() {
  if (currentCard) {
    currentCard.style.transition = '';
    currentCard.style.zIndex = '10';
  }
  isDragging = false;
  currentCard = null;
}

// Reset layout function
function resetLayout() {
  skillCategories.forEach(card => {
    const id = card.id;
    const pos = initialPositions[id];
    
    card.style.transition = 'all 0.5s ease';
    card.style.top = pos.top;
    card.style.left = pos.left;
    card.style.right = pos.right;
    card.style.bottom = pos.bottom;
  });
  
  setTimeout(() => {
    drawConnections();
    skillCategories.forEach(card => {
      card.style.transition = '';
    });
  }, 500);
}

// Contact Tabs
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const targetTab = btn.getAttribute('data-tab');
    
    // Remove active class from all buttons and contents
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    
    // Add active class to clicked button and target content
    btn.classList.add('active');
    document.getElementById(targetTab).classList.add('active');
  });
});

// Form submission
function handleSubmit(e) {
  e.preventDefault();
  
  const form = e.target;
  const email = form.querySelector('input[type="email"]').value;
  const message = form.querySelector('textarea').value;
  
  // Simulate form submission
  alert(`Thanks for reaching out! 🚀\n\nEmail: ${email}\nMessage: ${message}\n\nThis is a demo - in production, this would send a real message.`);
  
  form.reset();
}

// Scroll animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, observerOptions);

// Observe all fade-in elements
document.querySelectorAll('.fade-in, .fade-in-up').forEach(el => {
  observer.observe(el);
});

// Navbar scroll effect
let lastScroll = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
  const currentScroll = window.pageYOffset;
  
  if (currentScroll > 100) {
    navbar.style.background = 'rgba(10, 15, 20, 0.95)';
    navbar.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.3)';
  } else {
    navbar.style.background = 'rgba(10, 15, 20, 0.8)';
    navbar.style.boxShadow = 'none';
  }
  
  lastScroll = currentScroll;
});

// Add parallax effect to hero
window.addEventListener('scroll', () => {
  const scrolled = window.pageYOffset;
  const hero = document.querySelector('.hero');
  if (hero) {
    hero.style.transform = `translateY(${scrolled * 0.5}px)`;
  }
});

// Cursor trail effect (optional fancy feature)
const coords = { x: 0, y: 0 };
const circles = [];
const colors = ['rgba(102, 126, 234, 0.1)', 'rgba(118, 75, 162, 0.1)'];

for (let i = 0; i < 20; i++) {
  const circle = document.createElement('div');
  circle.style.position = 'fixed';
  circle.style.width = '10px';
  circle.style.height = '10px';
  circle.style.borderRadius = '50%';
  circle.style.pointerEvents = 'none';
  circle.style.zIndex = '9999';
  circle.style.background = colors[i % 2];
  circle.style.transition = 'all 0.1s ease';
  document.body.appendChild(circle);
  circles.push(circle);
}

document.addEventListener('mousemove', (e) => {
  coords.x = e.clientX;
  coords.y = e.clientY;
});

function animateCircles() {
  let x = coords.x;
  let y = coords.y;
  
  circles.forEach((circle, index) => {
    circle.style.left = x - 5 + 'px';
    circle.style.top = y - 5 + 'px';
    circle.style.transform = `scale(${(circles.length - index) / circles.length})`;
    
    const nextCircle = circles[index + 1] || circles[0];
    x += (parseFloat(nextCircle.style.left) - x) * 0.3;
    y += (parseFloat(nextCircle.style.top) - y) * 0.3;
  });
  
  requestAnimationFrame(animateCircles);
}

animateCircles();

console.log('🚀 Vxpour Portfolio Loaded Successfully!');
