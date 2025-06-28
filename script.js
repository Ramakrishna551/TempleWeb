// Basic contact and donation form validation
document.addEventListener('DOMContentLoaded', () => {
  const contactForm = document.getElementById('contact-form');
  const donationForm = document.getElementById('donation-form');

  contactForm.addEventListener('submit', e => {
    e.preventDefault();
    alert('Thank you for contacting us! We will get back to you shortly.');
    contactForm.reset();
  });

  donationForm.addEventListener('submit', e => {
    e.preventDefault();
    alert('Thank you for your donation! May you be blessed.');
    donationForm.reset();
  });
});
