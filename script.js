// Smooth close other FAQ items when one opens (accordion behavior)
document.querySelectorAll('.faq-item').forEach(item => {
    item.addEventListener('toggle', () => {
      if (item.open) {
        document.querySelectorAll('.faq-item').forEach(other => {
          if (other !== item) other.open = false;
        });
      }
    });
  });
  
  // Header shadow on scroll
  const header = document.querySelector('.header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 10) {
      header.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)';
    } else {
      header.style.boxShadow = 'none';
    }
  });