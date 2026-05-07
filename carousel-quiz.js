// Quiz carousel - horizontal scroll-to-center logic
window.addEventListener('DOMContentLoaded', () => {
    const SCALE = 1.22;
    const TOTAL_QUESTIONS = 5;

    const radios = [...document.querySelectorAll('input[type="radio"][name="quiz"]')];
    const cards = [...document.querySelectorAll('.carousel-cards .card')];
    const carousel = document.querySelector('.carousel-cards');
    const placeholders = [...document.querySelectorAll('.carousel-cards .card.placeholder')];

    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const submitBtn = document.getElementById('submit-btn');
    const resultDiv = document.getElementById('result');

    const correctAnswers = {
        q1: 'a',
        q2: 'b',
        q3: 'a',
        q4: 'a',
        q5: 'a'
    };

    // Map radio ids to cards
    const cardMap = Object.fromEntries(
        cards
            .filter(card => card.htmlFor)
            .map(card => [card.htmlFor, card])
    );

    const realCard = cards.find(card => !card.classList.contains('placeholder'));

    function setPlaceholderWidth() {
        if (!carousel || !realCard || placeholders.length !== 2) return;

        const style = getComputedStyle(realCard);
        const cardWidth =
            realCard.offsetWidth +
            parseFloat(style.marginLeft) +
            parseFloat(style.marginRight);

        const scaledWidth = cardWidth * SCALE;
        const placeholderWidth = (carousel.offsetWidth - scaledWidth) / 2;

        placeholders.forEach(placeholder => {
            placeholder.style.flex = `0 0 ${placeholderWidth}px`;
            placeholder.style.width = `${placeholderWidth}px`;
        });
    }

    function scrollToCard(radioId) {
        const card = cardMap[radioId];
        if (!card || !carousel) return;

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

    function showAnswers(questionId) {
        document.querySelectorAll('.answers').forEach(answer => {
            answer.style.display = 'none';
        });

        const selected = document.querySelector(`.${questionId}-answers`);

        if (selected) {
            selected.style.display = 'block';
        }
    }

    function updateActiveCard(radioId) {
        cards.forEach(card => card.classList.remove('active'));

        const selectedCard = cardMap[radioId];

        if (selectedCard) {
            selectedCard.classList.add('active');
        }
    }

    function selectQuestion(radio) {
        if (!radio) return;

        radio.checked = true;

        updateActiveCard(radio.id);
        scrollToCard(radio.id);
        showAnswers(radio.id);
    }

    function getCurrentIndex() {
        const checked = document.querySelector('input[name="quiz"]:checked');

        return checked
            ? parseInt(checked.id.replace('q', ''), 10) - 1
            : -1;
    }

    function calculateScore() {
        return Object.entries(correctAnswers).reduce((score, [question, answer]) => {
            const selected = document.querySelector(
                `input[name="${question}"]:checked`
            );

            return score + (selected?.value === answer ? 1 : 0);
        }, 0);
    }

    function showResult(score) {
        const percentage = ((score / TOTAL_QUESTIONS) * 100).toFixed(1);

        let message = `
            <h2>Quiz Complete!</h2>
            <p>Your Score: <strong>${score} / ${TOTAL_QUESTIONS}</strong></p>
            <p>Percentage: <strong>${percentage}%</strong></p>
        `;

        if (score === TOTAL_QUESTIONS) {
            message += `
                <p style="color: gold; font-weight: bold;">
                    Perfect Score! Amazing! 
                </p>
            `;
        } else if (score >= 4) {
            message += `<p style="color: gold;">Great job! </p>`;
        } else if (score >= 3) {
            message += `
                <p style="color: orange;">
                    Good effort! Keep learning! 
                </p>
            `;
        } else {
            message += `
                <p style="color: #ff6b6b;">
                    Try again and learn more! 
                </p>
            `;
        }

        resultDiv.innerHTML = message;
        resultDiv.classList.remove('hidden');
        resultDiv.classList.add('show');

        setTimeout(() => {
            resultDiv.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
        }, 100);
    }

    // Radio changes
    radios.forEach(radio => {
        radio.addEventListener('change', () => {
            if (radio.checked) {
                selectQuestion(radio);
            }
        });
    });

    // Card clicks
    cards.forEach(card => {
        if (!card.htmlFor) return;

        card.addEventListener('click', () => {
            selectQuestion(document.getElementById(card.htmlFor));
        });
    });

    // Navigation
    prevBtn?.addEventListener('click', () => {
        const current = getCurrentIndex();

        if (current > 0) {
            selectQuestion(document.getElementById(`q${current}`));
        }
    });

    nextBtn?.addEventListener('click', () => {
        const current = getCurrentIndex();

        if (current < radios.length - 1) {
            selectQuestion(document.getElementById(`q${current + 2}`));
        }
    });

    // Submit
    submitBtn?.addEventListener('click', e => {
        e.preventDefault();
        showResult(calculateScore());
    });

    // Init
    setPlaceholderWidth();
    window.addEventListener('resize', setPlaceholderWidth);

    if (radios.length) {
        setTimeout(() => {
            selectQuestion(radios[0]);
        }, 100);
    }
});
