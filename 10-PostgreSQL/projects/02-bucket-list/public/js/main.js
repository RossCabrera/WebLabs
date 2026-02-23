// Bucket List — Client JS

// Shuffle inspiration ideas
const inspirations = [
  '🏔️ Hike a 14,000ft mountain',
  '🌊 Learn to surf',
  '🌍 Visit 10 countries',
  '🎸 Learn an instrument',
  '🍜 Take a cooking class abroad',
  '🚀 See a rocket launch',
  '🦋 Go skydiving',
  '📖 Write a book',
  '🏊 Swim in the Dead Sea',
  '🎭 Attend a Broadway show',
  '🌅 Watch the sunrise from a mountain top',
  '🎪 Volunteer abroad for a month',
  '🏕️ Camp under the Northern Lights',
  '🐠 Go scuba diving in the Great Barrier Reef',
  '🎨 Take a painting class in Italy',
  '🌸 See the Cherry Blossoms in Japan',
  '🏄 Ride a hot air balloon',
  '🎯 Learn archery',
  '🦁 Do an African Safari',
  '🍷 Do a wine tour in Tuscany',
  '🎻 Attend a live opera',
  '🏰 Visit all 7 Wonders of the World',
  '🚴 Cycle through the countryside of France',
  '🌋 See an active volcano',
  '🎲 Visit a country on a whim',
];

function shuffleInspiration() {
  const list = document.getElementById('inspirationList');
  if (!list) return;
  const items = list.querySelectorAll('li');

  // Shuffle pool
  const shuffled = [...inspirations].sort(() => Math.random() - 0.5).slice(0, items.length);

  items.forEach((li, i) => {
    li.style.opacity = '0';
    li.style.transform = 'translateY(4px)';
    setTimeout(() => {
      li.textContent = shuffled[i];
      li.style.transition = 'all 0.3s ease';
      li.style.opacity = '1';
      li.style.transform = 'translateY(0)';
    }, i * 50 + 100);
  });
}

// Animate progress bar on load
document.addEventListener('DOMContentLoaded', () => {
  const fill = document.querySelector('.progress-fill');
  if (fill) {
    const target = fill.style.width;
    fill.style.width = '0';
    requestAnimationFrame(() => {
      setTimeout(() => {
        fill.style.width = target;
      }, 200);
    });
  }

  // Auto-focus first input
  const firstInput = document.querySelector('input[type="text"]');
  if (firstInput && window.innerWidth > 768) {
    firstInput.focus();
  }
});
