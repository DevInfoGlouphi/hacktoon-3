// Manejo del menú móvil
document.addEventListener('DOMContentLoaded', () => {
    const toggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('nav');
    toggle.addEventListener('click', () => {
        nav.classList.toggle('nav-open');
    });
}); 