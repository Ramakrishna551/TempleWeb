// Database storage utility using localStorage
// Handle sending data to real SQLite DB Backend
async function saveToDatabase(collection, data) {
  try {
    const response = await fetch('http://127.0.0.1:5000/api/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: collection,
        data: data
      })
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    console.log(`Successfully saved to DB (${collection}):`, result);
  } catch (error) {
    console.error('Error saving to database:', error);
    // You could fallback to localStorage here if needed, but for now we simply log the error.
  }
}

// Handle generic form submission
function handleFormSubmit(formId, collectionName, successMessage, specialTitleId = null) {
  const form = document.getElementById(formId);
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    
    // For seva forms, extract the dynamically set title
    if (specialTitleId) {
       const titleEl = document.getElementById(specialTitleId);
       if (titleEl) {
         data.sevaName = titleEl.textContent.replace('Booking ', '').trim();
       }
    }

    saveToDatabase(collectionName, data);
    alert(successMessage);
    form.reset();
    
    // Hide the form again if it is a seva booking form
    if (specialTitleId) {
      form.classList.add('hidden');
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  // Contact and Donate
  handleFormSubmit('contact-form', 'Contacts', 'Thank you for contacting us! We will get back to you shortly.');
  handleFormSubmit('donation-form', 'Donations', 'Thank you for your donation! May you be blessed.');
  
  // All Sevas
  handleFormSubmit('darshan-form', 'BookSevas', 'Thank you for booking your Seva! May you be blessed.', 'seva-title');
  handleFormSubmit('seva-form', 'DailySevas', 'Thank you for booking your Daily Seva!', 'daily-seva-title');
  handleFormSubmit('weekly-seva-form', 'WeeklySevas', 'Thank you for booking your Weekly Seva!', 'weekly-seva-title');
  handleFormSubmit('periodical-seva-form', 'PeriodicalSevas', 'Thank you for booking your Periodical Seva!', 'periodical-seva-title');
});

    document.getElementById('menu-toggle').addEventListener('click', () => {
      document.getElementById('menu').classList.toggle('hidden');
    });

    // Lightbox functionality
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-image');
    const closeBtn = document.querySelector('.lightbox-close');
    const galleryImages = document.querySelectorAll('.lightbox-img');

    galleryImages.forEach(img => {
      img.addEventListener('click', () => {
        lightboxImg.src = img.src;
        lightbox.style.display = 'flex';
      });
    });

    closeBtn.addEventListener('click', () => {
      lightbox.style.display = 'none';
      lightboxImg.src = '';
    });

    lightbox.addEventListener('click', e => {
      if (e.target === lightbox) {
        lightbox.style.display = 'none';
        lightboxImg.src = '';
      }
    });








// gallery code 
// Wait for DOM to load
document.addEventListener("DOMContentLoaded", () => {
  const tabs = document.querySelectorAll(".gallery-tab");
  const sections = document.querySelectorAll(".gallery-section");

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const target = tab.getAttribute("data-target");

      // Hide all sections
      sections.forEach((section) => {
        section.classList.add("hidden");
      });

      // Show selected section
      const selectedSection = document.getElementById(target);
      selectedSection.classList.remove("hidden");

      // Optional: update button active styling
      tabs.forEach((btn) => btn.classList.remove("bg-orange-800"));
      tab.classList.add("bg-orange-800");
    });
  });

  // Lightbox Logic
  const lightbox = document.getElementById("lightbox");
  const lightboxImage = document.getElementById("lightbox-image");
  const closeBtn = document.querySelector(".lightbox-close");

  document.querySelectorAll(".lightbox-img").forEach((img) => {
    img.addEventListener("click", () => {
      lightboxImage.src = img.src;
      lightbox.classList.add("fixed", "inset-0", "bg-black", "bg-opacity-75", "flex", "items-center", "justify-center", "z-50");
      lightbox.classList.remove("hidden");
    });
  });

  closeBtn.addEventListener("click", () => {
    lightbox.classList.add("hidden");
    lightbox.classList.remove("fixed", "inset-0", "bg-black", "bg-opacity-75", "flex", "items-center", "justify-center", "z-50");
    lightboxImage.src = "";
  });

  // Hide lightbox when clicking outside the image
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) {
      closeBtn.click();
    }
  });
});

// Book Seva's Script code 
  const sevaButtons = document.querySelectorAll(".seva-btn");
  const form = document.getElementById("darshan-form");
  const sevaTitle = document.getElementById("seva-title");

  sevaButtons.forEach(button => {
    button.addEventListener("click", () => {
      const sevaName = button.getAttribute("data-seva");
      sevaTitle.textContent = `Booking  ${sevaName}`;
      form.classList.remove("hidden");
      form.scrollIntoView({ behavior: "smooth" });
    });
  });

  // Daily sevas Script code 

  document.addEventListener("DOMContentLoaded", function () {
    const sevaButtons = document.querySelectorAll(".seva-btn"); // All seva buttons
    const form = document.getElementById("seva-form");           // The hidden form
    const sevaTitle = document.getElementById("daily-seva-title"); // The title in the form

    if (!form || !sevaTitle) {
      console.warn("Form or title element is missing!");
      return;
    }

    sevaButtons.forEach(button => {
      button.addEventListener("click", () => {
        const sevaName = button.getAttribute("data-seva");
        sevaTitle.textContent = sevaName; // Update form title
        form.classList.remove("hidden");  // Show form
        form.scrollIntoView({ behavior: "smooth" }); // Scroll into view
      });
    });
  });





// Weekly sevas script code 

  document.addEventListener("DOMContentLoaded", function () {
    const weeklySevaButtons = document.querySelectorAll(".weekly-seva-btn");
    const weeklyForm = document.getElementById("weekly-seva-form");
    const weeklyTitle = document.getElementById("weekly-seva-title");

    if (!weeklyForm || !weeklyTitle) {
      console.warn("Weekly Seva form or title element is missing!");
      return;
    }

    weeklySevaButtons.forEach(button => {
      button.addEventListener("click", () => {
        const sevaName = button.getAttribute("data-seva");
        weeklyTitle.textContent = sevaName;
        weeklyForm.classList.remove("hidden");
        weeklyForm.scrollIntoView({ behavior: "smooth" });
      });
    });
  });

// Periodic or seva's of Brahmostavam script code 

  document.addEventListener("DOMContentLoaded", function () {
    const sevaButtons = document.querySelectorAll(".periodical-seva-btn");
    const form = document.getElementById("periodical-seva-form");
    const title = document.getElementById("periodical-seva-title");

    if (!form || !title) {
      console.warn("Form or title element for Periodical Sevas is missing!");
      return;
    }

    sevaButtons.forEach(button => {
      button.addEventListener("click", () => {
        const sevaName = button.getAttribute("data-seva");
        title.textContent = sevaName;
        form.classList.remove("hidden");
        form.scrollIntoView({ behavior: "smooth" });
      });
    });
  });


  