(() => {
    'use strict'
    const forms = document.querySelectorAll('.needs-validation')
    Array.from(forms).forEach(form => {
      form.addEventListener('submit', event => {
        if (!form.checkValidity()) {
          event.preventDefault()
          event.stopPropagation()
        }
  
        form.classList.add('was-validated')
      }, false)
    })
  })()
  document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');
    form.addEventListener('submit', (event) => {
      event.preventDefault(); 
  
      const query = document.querySelector('input.search-input').value.trim();
      if (!query) {
        alert('Please enter a search query.');
        return;
      }
      window.location.href = `/listings/search?q=${encodeURIComponent(query)}`;
    });
  });
  