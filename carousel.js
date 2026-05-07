// Character carousel scroll-to-center logic
window.addEventListener('DOMContentLoaded', () => {
    const SCALE = 1.22;

    const radios = [
        ...document.querySelectorAll('input[type="radio"][name="char"]')
    ];

    const cards = [
        ...document.querySelectorAll('.carousel-cards .card')
    ];

    const carousel = document.querySelector('.carousel-cards');

    const placeholders = [
        ...document.querySelectorAll('.carousel-cards .card.placeholder')
    ];

    if (!carousel || !cards.length) return;

    // Map radio ids to cards
    const cardMap = Object.fromEntries(
        cards
            .filter(card => card.htmlFor)
            .map(card => [card.htmlFor, card])
    );

    // First real card
    const realCard = cards.find(
        card => !card.classList.contains('placeholder')
    );

    function setPlaceholderWidth() {
        if (!realCard || placeholders.length !== 2) return;

        const style = getComputedStyle(realCard);

        const cardWidth =
            realCard.offsetWidth +
            parseFloat(style.marginLeft) +
            parseFloat(style.marginRight);

        const scaledWidth = cardWidth * SCALE;

        const placeholderWidth =
            (carousel.offsetWidth - scaledWidth) / 2;

        placeholders.forEach(placeholder => {
            placeholder.style.flex = `0 0 ${placeholderWidth}px`;
            placeholder.style.width = `${placeholderWidth}px`;
        });
    }

    function scrollToCard(radioId) {
        const card = cardMap[radioId];

        if (!card) return;

        const cardWidth = card.offsetWidth;
        const scaledWidth = cardWidth * SCALE;

        const offset =
            card.offsetLeft -
            (carousel.offsetWidth - cardWidth) / 2 -
            (scaledWidth - cardWidth) / 2;

        carousel.scrollTo({
            left: offset,
            behavior: 'smooth'
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

        // Initial checked radio
        if (radio.checked) {
            setTimeout(() => {
                scrollToCard(radio.id);
            }, 100);
        }
    });

    // Card click
    cards.forEach(card => {
        if (!card.htmlFor) return;

        card.addEventListener('click', () => {
            selectCard(document.getElementById(card.htmlFor));
        });
    });

    // Init
    setPlaceholderWidth();
    window.addEventListener('resize', setPlaceholderWidth);
});