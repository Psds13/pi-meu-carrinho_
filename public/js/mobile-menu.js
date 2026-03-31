document.addEventListener('DOMContentLoaded', () => {
    const mobileMenuBtn = document.createElement('button');
    mobileMenuBtn.classList.add('mobile-menu-toggle');
    mobileMenuBtn.innerHTML = '<i class="bi bi-list"></i>';
    mobileMenuBtn.setAttribute('aria-label', 'Menu de navegação');

    const headerContainer = document.querySelector('.header-container');
    const actionsSection = document.querySelector('.actions-section');
    
    if (headerContainer && actionsSection) {
        headerContainer.insertBefore(mobileMenuBtn, actionsSection);
        
        mobileMenuBtn.addEventListener('click', () => {
            actionsSection.classList.toggle('active');
            const icon = mobileMenuBtn.querySelector('i');
            if (actionsSection.classList.contains('active')) {
                icon.classList.replace('bi-list', 'bi-x');
            } else {
                icon.classList.replace('bi-x', 'bi-list');
            }
        });
    }

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!actionsSection.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
            actionsSection.classList.remove('active');
            const icon = mobileMenuBtn.querySelector('i');
            if (icon) icon.classList.replace('bi-x', 'bi-list');
        }
    });
});
