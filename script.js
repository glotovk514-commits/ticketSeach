// Аккордеон для FAQ
document.addEventListener('DOMContentLoaded', function() {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const toggle = item.querySelector('.faq-toggle');

        question.addEventListener('click', () => {
            // Закрываем все открытые элементы
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                }
            });

            // Переключаем текущий элемент
            item.classList.toggle('active');
        });

        // Обработчик для кнопки тоже
        toggle.addEventListener('click', (e) => {
            e.stopPropagation(); // Предотвращаем срабатывание родительского обработчика
            question.click();
        });
    });
});