// Weapon carousel - vertical snap to center logic
window.addEventListener('DOMContentLoaded', () => {
    const radios = [
        ...document.querySelectorAll('input[type="radio"][name="weapon"]')
    ];

    const cards = [
        ...document.querySelectorAll('.carousel-cards .card')
    ];

    const carousel = document.querySelector('.carousel-scroll-wrapper');

    if (!carousel || !radios.length || !cards.length) return;

    // Map radio ids to cards
    const cardMap = Object.fromEntries(
        cards
            .filter(card => card.htmlFor)
            .map(card => [card.htmlFor, card])
    );

    // First usable card
    const firstCard = cards.find(
        card => !card.classList.contains('placeholder')
    );

    const firstRadio = firstCard
        ? document.getElementById(firstCard.htmlFor)
        : null;

    function scrollToCard(radioId) {
        const card = cardMap[radioId];

        if (!card) return;

        card.scrollIntoView({
            behavior: 'smooth',
            inline: 'center',
            block: 'nearest'
        });
    }

    function selectCard(radio) {
        if (!radio) return;

        radio.checked = true;
        scrollToCard(radio.id);
    }

    // Radio change
    radios.forEach(radio => {
        radio.addEventListener('change', () => {
            if (radio.checked) {
                scrollToCard(radio.id);
            }
        });
    });

    // Card click
    cards.forEach(card => {
        if (!card.htmlFor) return;

        card.addEventListener('click', () => {
            selectCard(document.getElementById(card.htmlFor));
        });
    });

    // Initial selection
    if (firstRadio) {
        setTimeout(() => {
            selectCard(firstRadio);
        }, 100);
    }
});
