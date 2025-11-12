
  document.addEventListener('DOMContentLoaded', () => {
    // Lightbox setup
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const closeBtn = document.querySelector('.close-btn');
    const nextBtn = document.querySelector('.next-btn');
    const prevBtn = document.querySelector('.prev-btn');

    function getImages() {
      return Array.from(document.querySelectorAll('.gallery-item[data-category="image"] img'));
    }
    let images = getImages();
    let currentIndex = 0;

    function openLightbox(index) {
      images = getImages();
      currentIndex = index % images.length;
      lightboxImg.src = images[currentIndex].src;
      lightboxCaption.textContent = images[currentIndex].closest('.gallery-item').dataset.caption || '';
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
    }

    function nextImage() {
      currentIndex = (currentIndex + 1) % images.length;
      openLightbox(currentIndex);
    }

    function prevImage() {
      currentIndex = (currentIndex - 1 + images.length) % images.length;
      openLightbox(currentIndex);
    }

    // Clicks
    document.querySelectorAll('.gallery-item[data-category="image"] .gallery-card').forEach((card, i) => {
      card.addEventListener('click', () => openLightbox(i));
      card.setAttribute('role', 'button');
      card.setAttribute('tabindex', '0');
      card.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') openLightbox(i); });
    });

    closeBtn.addEventListener('click', closeLightbox);
    nextBtn.addEventListener('click', nextImage);
    prevBtn.addEventListener('click', prevImage);
    lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });

    document.addEventListener('keydown', e => {
      if (!lightbox.classList.contains('active')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'ArrowLeft') prevImage();
    });

    // swipe
    let startX = 0;
    lightbox.addEventListener('touchstart', e => startX = e.touches[0].clientX, {passive:true});
    lightbox.addEventListener('touchend', e => {
      const endX = e.changedTouches[0].clientX;
      if (endX - startX > 60) prevImage();
      if (startX - endX > 60) nextImage();
    }, {passive:true});

    // Filtrage
    const filterLinks = document.querySelectorAll('#galleryFilter .nav-link');
    const galleryItems = document.querySelectorAll('.gallery-item');
    filterLinks.forEach(link => {
      link.addEventListener('click', e => {
        e.preventDefault();
        filterLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
        const filter = link.dataset.filter;
        galleryItems.forEach(item => {
          item.style.display = (filter === 'all' || item.dataset.category === filter) ? 'block' : 'none';
        });
        images = getImages();
      });
    });
  });
