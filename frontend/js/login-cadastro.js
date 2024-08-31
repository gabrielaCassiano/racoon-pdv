const loginBtn = document.getElementById('loginBtn');
const cadastroBtn = document.getElementById('cadastroBtn');
const slideWindow = document.querySelector('.slideWindow');
const toggleSlider = document.querySelector('.toggle-slider');

loginBtn.addEventListener('click', () => {
    slideWindow.style.transform = 'translateX(0)';
    toggleSlider.style.transform = 'translateX(0)';
});

cadastroBtn.addEventListener('click', () => {
    slideWindow.style.transform = 'translateX(-50%)';
    toggleSlider.style.transform = 'translateX(100%)';
});