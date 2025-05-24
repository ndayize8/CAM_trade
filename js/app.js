// Mobile Menu Toggle
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const nav = document.getElementById('nav');

mobileMenuBtn.addEventListener('click', () => {
    nav.classList.toggle('active');
    mobileMenuBtn.innerHTML = nav.classList.contains('active') ?
        '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
});

// Close mobile menu when clicking a link
document.querySelectorAll('#nav a').forEach(link => {
    link.addEventListener('click', () => {
        nav.classList.remove('active');
        mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
    });
});

// Header scroll effect
const header = document.getElementById('header');

window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);

        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 70,
                behavior: 'smooth'
            });
        }
    });
});

// Calendar Functionality
const currentMonthElement = document.getElementById('currentMonth');
const calendarGrid = document.getElementById('calendarGrid');
const prevMonthBtn = document.getElementById('prevMonth');
const nextMonthBtn = document.getElementById('nextMonth');
const selectedDateElement = document.getElementById('selectedDate');
const eventsList = document.getElementById('eventsList');

let currentDate = new Date();
let currentMonth = currentDate.getMonth();
let currentYear = currentDate.getFullYear();

// Sample events data
const eventsData = {
    '2025-6-15': [
        { time: '6:00 PM', title: 'Contemporary Art Exhibition' },
        { time: '8:00 PM', title: 'Artist Talk: Sarah Johnson' }
    ],
    '2025-6-22': [
        { time: '12:00 PM', title: 'Summer Beats Music Festival' }
    ],
    '2025-6-8': [
        { time: '7:30 PM', title: 'Gallery Opening Night' }
    ],
    '2025-7-5': [
        { time: '7:30 PM', title: 'Independent Film Night' }
    ],
    '2025-9-5': [
        { time: '8:30 PM', title: 'Celebrate my Birthday' }
    ]
};

function renderCalendar() {
    // Update month/year display
    currentMonthElement.textContent = new Date(currentYear, currentMonth).toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric'
    });

    // Clear previous calendar
    calendarGrid.innerHTML = '';

    // Add day headers
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    days.forEach(day => {
        const dayElement = document.createElement('div');
        dayElement.classList.add('calendar-day-header');
        dayElement.textContent = day;
        calendarGrid.appendChild(dayElement);
    });

    // Get first day of month and total days
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const daysInLastMonth = new Date(currentYear, currentMonth, 0).getDate();

    // Add days from previous month
    for (let i = firstDay - 1; i >= 0; i--) {
        const dayElement = document.createElement('div');
        dayElement.classList.add('calendar-day', 'other-month');
        dayElement.textContent = daysInLastMonth - i;
        calendarGrid.appendChild(dayElement);
    }

    // Add days of current month
    for (let i = 1; i <= daysInMonth; i++) {
        const dayElement = document.createElement('div');
        dayElement.classList.add('calendar-day');
        dayElement.textContent = i;

        const dateKey = `${currentYear}-${currentMonth + 1}-${i}`;
        if (eventsData[dateKey]) {
            dayElement.classList.add('has-event');
        }

        // Highlight today
        if (i === currentDate.getDate() && currentMonth === currentDate.getMonth() && currentYear === currentDate.getFullYear()) {
            dayElement.classList.add('selected');
            showEventsForDate(i);
        }

        dayElement.addEventListener('click', () => {
            document.querySelectorAll('.calendar-day').forEach(day => day.classList.remove('selected'));
            dayElement.classList.add('selected');
            showEventsForDate(i);
        });

        calendarGrid.appendChild(dayElement);
    }

    // Add days from next month to fill grid
    const totalDays = firstDay + daysInMonth;
    const remainingDays = totalDays % 7 === 0 ? 0 : 7 - (totalDays % 7);

    for (let i = 1; i <= remainingDays; i++) {
        const dayElement = document.createElement('div');
        dayElement.classList.add('calendar-day', 'other-month');
        dayElement.textContent = i;
        calendarGrid.appendChild(dayElement);
    }
}

function showEventsForDate(day) {
    const date = new Date(currentYear, currentMonth, day);
    const dateKey = `${currentYear}-${currentMonth + 1}-${day}`;

    selectedDateElement.textContent = date.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
    });

    eventsList.innerHTML = '';

    if (eventsData[dateKey]) {
        eventsData[dateKey].forEach(event => {
            const eventElement = document.createElement('div');
            eventElement.classList.add('event-calendar-item');
            eventElement.innerHTML = `
                 <div class="event-calendar-time">${event.time}</div>
                 <div class="event-calendar-title">${event.title}</div>
             `;
            eventsList.appendChild(eventElement);
        });
    } else {
        eventsList.innerHTML = '<p>No events scheduled for this date.</p>';
    }
}

prevMonthBtn.addEventListener('click', () => {
    currentMonth--;
    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    }
    renderCalendar();
});

nextMonthBtn.addEventListener('click', () => {
    currentMonth++;
    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }
    renderCalendar();
});

// Store Filter Functionality
const filterBtns = document.querySelectorAll('.filter-btn');
const storeItems = document.querySelectorAll('.store-item');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Update active button
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.dataset.filter;

        // Filter items
        storeItems.forEach(item => {
            if (filter === 'all' || item.dataset.category === filter) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
    });
});

// Membership Form Toggle
const signupForm = document.getElementById('signupForm');
const loginForm = document.getElementById('loginForm');
const signupToggle = document.getElementById('signupToggle');
const loginToggle = document.getElementById('loginToggle');

signupToggle.addEventListener('click', (e) => {
    e.preventDefault();
    loginForm.style.display = 'none';
    signupForm.style.display = 'block';
});

loginToggle.addEventListener('click', (e) => {
    e.preventDefault();
    signupForm.style.display = 'none';
    loginForm.style.display = 'block';
});

// Modal Functionality
const quickViewModal = document.getElementById('quickViewModal');
const closeModal = document.getElementById('closeModal');
const modalBody = document.getElementById('modalBody');
const quickViewBtns = document.querySelectorAll('.quick-view');

quickViewBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        const item = btn.closest('.store-item');
        const title = item.querySelector('h3').textContent;
        const artist = item.querySelector('.artist').textContent;
        const price = item.querySelector('.price').textContent;
        const imageSrc = item.querySelector('img').src;

        modalBody.innerHTML = `
             <div class="modal-product">
                 <div class="modal-product-image">
                     <img src="${imageSrc}" alt="${title}">
                 </div>
                 <div class="modal-product-info">
                     <h2>${title}</h2>
                     <p class="artist">${artist}</p>
                     <div class="price">${price}</div>
                     <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                     <div class="quantity-selector" style="margin: 1.5rem 0;">
                         <label for="quantity">Quantity:</label>
                         <input type="number" id="quantity" name="quantity" min="1" value="1" style="width: 60px; padding: 0.5rem; margin-left: 1rem;">
                     </div>
                     <button class="btn" style="width: 100%; padding: 1rem; font-size: 1rem;">Add to Cart</button>
                 </div>
             </div>
         `;

        quickViewModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    });
});

closeModal.addEventListener('click', () => {
    quickViewModal.style.display = 'none';
    document.body.style.overflow = 'auto';
});

window.addEventListener('click', (e) => {
    if (e.target === quickViewModal) {
        quickViewModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
});

// Image Upload Functionality
const uploadContainer = document.getElementById('uploadContainer');
const fileInput = document.getElementById('fileInput');
const uploadPreview = document.getElementById('uploadPreview');

// Handle drag and drop
['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    uploadContainer.addEventListener(eventName, preventDefaults, false);
});

function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
}

['dragenter', 'dragover'].forEach(eventName => {
    uploadContainer.addEventListener(eventName, highlight, false);
});

['dragleave', 'drop'].forEach(eventName => {
    uploadContainer.addEventListener(eventName, unhighlight, false);
});

function highlight() {
    uploadContainer.classList.add('dragover');
}

function unhighlight() {
    uploadContainer.classList.remove('dragover');
}

// Handle dropped files
uploadContainer.addEventListener('drop', handleDrop, false);

function handleDrop(e) {
    const dt = e.dataTransfer;
    const files = dt.files;
    handleFiles(files);
}

// Handle selected files
fileInput.addEventListener('change', function () {
    handleFiles(this.files);
});

function handleFiles(files) {
    [...files].forEach(uploadFile);
}

function uploadFile(file) {
    if (!file.type.match('image.*')) {
        alert('Please upload only image files.');
        return;
    }

    const reader = new FileReader();

    reader.onload = function (e) {
        const previewItem = document.createElement('div');
        previewItem.classList.add('upload-preview-item');

        previewItem.innerHTML = `
             <img src="${e.target.result}" alt="${file.name}">
             <button class="remove-btn"><i class="fas fa-times"></i></button>
         `;

        // Add remove functionality
        const removeBtn = previewItem.querySelector('.remove-btn');
        removeBtn.addEventListener('click', () => {
            previewItem.remove();
        });

        uploadPreview.appendChild(previewItem);
    };

    reader.readAsDataURL(file);
}

// Initialize calendar
renderCalendar();

// Animate elements on scroll
const animateOnScroll = () => {
    const elements = document.querySelectorAll('.section-title, .gallery-item, .event-card, .artist-card, .blog-card, .store-item');

    elements.forEach(element => {
        const elementPosition = element.getBoundingClientRect().top;
        const screenPosition = window.innerHeight / 1.2;

        if (elementPosition < screenPosition) {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }
    });
};

// Set initial state for animation
document.querySelectorAll('.section-title, .gallery-item, .event-card, .artist-card, .blog-card, .store-item').forEach(element => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(20px)';
    element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
});

window.addEventListener('scroll', animateOnScroll);
window.addEventListener('load', animateOnScroll);