// ===== GALLERY =====
  (function() {
    const slides    = Array.from(document.querySelectorAll('.g-slide'));
    const thumbsEl  = document.getElementById('gThumbs');
    const progressEl= document.getElementById('gProgress');
    const currentEl = document.getElementById('gCurrent');
    const totalEl   = document.getElementById('gTotal');
    const INTERVAL  = 4000;
    let   current   = 0;
    let   timer     = null;
    let   progTimer = null;

    if (!slides.length) return;
    if (totalEl) totalEl.textContent = slides.length;

    // Build thumbnails
    slides.forEach((slide, i) => {
      const img   = slide.querySelector('img');
      const thumb = document.createElement('div');
      thumb.className = 'g-thumb' + (i === 0 ? ' active' : '');
      thumb.innerHTML = `<img src="${img.src}" alt="${img.alt}">`;
      thumb.addEventListener('click', e => { e.stopPropagation(); gGoTo(i); resetTimer(); });
      thumbsEl.appendChild(thumb);
    });

    function gGoTo(index) {
      slides[current].classList.remove('active');
      slides[current].classList.add('prev');
      setTimeout(() => slides[index < current ? current : (current + slides.length - 1) % slides.length]
        ?.classList.remove('prev'), 900);

      // clear all prev cleanly
      slides.forEach(s => { s.classList.remove('active'); });
      setTimeout(() => slides.forEach(s => s.classList.remove('prev')), 900);

      current = (index + slides.length) % slides.length;
      slides[current].classList.add('active');

      // Update thumbs
      document.querySelectorAll('.g-thumb').forEach((t, i) =>
        t.classList.toggle('active', i === current));
      // Scroll thumb into view
      const activeThumb = thumbsEl.children[current];
      // thumb scroll removed — was pulling page back to gallery
      if (activeThumb) thumbsEl.scrollLeft = activeThumb.offsetLeft - thumbsEl.offsetWidth / 2 + activeThumb.offsetWidth / 2;

      if (currentEl) currentEl.textContent = current + 1;
      startProgress();
    }

    function startProgress() {
      clearInterval(progTimer);
      if (!progressEl) return;
      progressEl.style.transition = 'none';
      progressEl.style.width = '0%';
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          progressEl.style.transition = `width ${INTERVAL}ms linear`;
          progressEl.style.width = '100%';
        });
      });
    }

    function resetTimer() {
      clearInterval(timer);
      timer = setInterval(() => gGoTo(current + 1), INTERVAL);
      startProgress();
    }

    window.gMove = function(dir) { gGoTo(current + dir); resetTimer(); };

    // Keyboard nav
    document.addEventListener('keydown', e => {
      if (e.key === 'ArrowLeft')  { gMove(-1); }
      if (e.key === 'ArrowRight') { gMove(1);  }
      if (e.key === 'Escape')     { closeLightbox(); }
    });

    // Lightbox
    window.openLightbox = function() {
      const img     = slides[current].querySelector('img');
      const caption = slides[current].querySelector('h4');
      document.getElementById('gLightboxImg').src = img.src;
      document.getElementById('gLightboxImg').alt = img.alt;
      document.getElementById('gLightboxCaption').textContent = caption ? caption.textContent : '';
      document.getElementById('gLightbox').classList.add('open');
      document.body.style.overflow = 'hidden';
      clearInterval(timer);
    };
    window.closeLightbox = function() {
      document.getElementById('gLightbox').classList.remove('open');
      document.body.style.overflow = '';
      resetTimer();
    };

    // Init
    resetTimer();
  })();

// ===== VIDEO SECTION =====

  // Play a YouTube/Vimeo embed — injects iframe and hides poster
  function playVideo(containerId, posterId, embedUrl) {
    const container = document.getElementById(containerId);
    const poster    = document.getElementById(posterId);
    const iframe    = document.createElement('iframe');
    iframe.src = embedUrl;
    iframe.allow = 'autoplay; encrypted-media; picture-in-picture';
    iframe.allowFullscreen = true;
    iframe.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;border:none;';
    container.appendChild(iframe);
    poster.classList.add('hidden');
    setTimeout(() => poster.remove(), 500);
  }

  // Play a local MP4 — injects <video> and hides poster
  function playLocalVideo(containerId, posterId, videoSrc) {
    const container = document.getElementById(containerId);
    const poster    = document.getElementById(posterId);
    const vid       = document.createElement('video');
    vid.src = videoSrc;
    vid.controls = true;
    vid.autoplay = true;
    vid.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;object-fit:cover;background:#000;';
    container.appendChild(vid);
    poster.classList.add('hidden');
    setTimeout(() => poster.remove(), 500);
  }

  // Add a new tile from a local file picked by the user
  function addLocalVideo(input) {
    if (!input.files || !input.files[0]) return;
    const file = input.files[0];
    const url  = URL.createObjectURL(file);
    const grid = document.getElementById('videoGrid');
    const cta  = document.getElementById('uploadCta');

    const id       = 'vidUser' + Date.now();
    const posterId = 'posterUser' + Date.now();

    const tile = document.createElement('div');
    tile.className = 'video-thumb';
    tile.id = id;
    // ✅ CORRECT
    tile.innerHTML = `
      <div class="vid-poster" id="${posterId}">
        <div class="play-btn" onclick="playLocalVideo('${id}','${posterId}','${url}')">
          <i class="fa-solid fa-play"></i>
        </div>
        <div class="vid-label">
          <span class="vid-title">${file.name.replace(/\.mp4$/i,'')}</span>
          <span class="vid-badge badge-mp4">Video</span>
        </div>
      </div>`;       

    grid.insertBefore(tile, cta);
    input.value = ''; // reset so same file can be re-added
  }

// ===== PHOTO STACK =====
  const PHOTOS = [
    // Replace these src values with your actual image paths or URLs
    // e.g. "images/students-building.jpg" or a full URL
    { src: "Images/Robo 1.JPG", tag: "Build" },
    { src: "Images/Robo 2.JPG", tag: "Code" },
    { src: "Images/Robo 3.JPG", tag: "Create" },
    { src: "Images/Robo 4.JPG", tag: "Learn" },
    { src: "Images/Robo 5.JPG", tag: "Invent" },
    { src: "Images/Robo 6.JPG", tag: "Explore" },
    { src: "Images/Robo 7.JPG", tag: "Design" },
    { src: "Images/Robo 8.jpg", tag: "Inspire" },
    { src: "Images/Robo 9.JPG", tag: "Build" },
    { src: "Images/Robo 10.png", tag: "Code" },
    { src: "Images/Robo 11.JPG", tag: "Create" },
    { src: "Images/Robo 12.JPG", tag: "Learn" },
    { src: "Images/Robo 13.JPG", tag: "Invent" },
    { src: "Images/Robo 14.JPG", tag: "Explore" },
    { src: "Images/Robo 15.JPG", tag: "Design" },
    { src: "Images/Robo 16.JPG", tag: "Inspire" },
    { src: "Images/Robo 17.JPG", tag: "Build" },
    { src: "Images/Robo 18.JPG", tag: "Code" },
    { src: "Images/Robo 19.JPG", tag: "Create" },
    { src: "Images/Robo 20.JPG", tag: "Learn" },
    { src: "Images/Robo 21.JPG", tag: "Invent" },
    { src: "Images/Robo 22.jpg", tag: "Explore" },
    { src: "Images/Robo 23.jpg", tag: "Design" },
    { src: "Images/Robo 24.jpg", tag: "Inspire" },
    { src: "Images/Robo 25.jpg", tag: "Build" },
    { src: "Images/Robo 26.JPG", tag: "Code" },
  ];

  const slots   = document.querySelectorAll('.photo-slot');
  const dotsEl  = document.getElementById('photoDots');
  const tags    = document.querySelectorAll('.photo-tag');
  let   current = []; // indices currently shown

  // Build dot indicators
  const totalSets = Math.floor(PHOTOS.length / 3);
  let   dotSet    = 0;
  for (let i = 0; i < Math.ceil(PHOTOS.length / 3); i++) {
    const d = document.createElement('div');
    d.className = 'photo-dot' + (i === 0 ? ' active' : '');
    dotsEl.appendChild(d);
  }

  function pickThree() {
    // Pick 3 unique random indices different from current set
    let pool = Array.from({length: PHOTOS.length}, (_, i) => i)
                    .filter(i => !current.includes(i));
    if (pool.length < 3) pool = Array.from({length: PHOTOS.length}, (_, i) => i);
    const chosen = [];
    while (chosen.length < 3) {
      const r = pool.splice(Math.floor(Math.random() * pool.length), 1)[0];
      chosen.push(r);
    }
    return chosen;
  }

  function loadSet(indices) {
    slots.forEach((slot, i) => {
      const img = slot.querySelector('img');
      img.src = PHOTOS[indices[i]].src;
      tags[i].textContent = PHOTOS[indices[i]].tag;
    });
    current = indices;
  }

  function rotateDot() {
    const dots = document.querySelectorAll('.photo-dot');
    dotSet = (dotSet + 1) % dots.length;
    dots.forEach((d, i) => d.classList.toggle('active', i === dotSet));
  }

  function rotatePhotos() {
    // Fade out
    slots.forEach(s => s.classList.add('fading'));

    setTimeout(() => {
      loadSet(pickThree());
      slots.forEach(s => s.classList.remove('fading'));
      rotateDot();
    }, 800);
  }

  // Init
  loadSet(pickThree());
  setInterval(rotatePhotos, 4500);

  // FAQ accordion
  document.querySelectorAll('.faq-q').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(i => {
        i.classList.remove('open');
        i.querySelector('.faq-q').setAttribute('aria-expanded', 'false');
      });
      if (!isOpen) {
        item.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // Form submit handler
  function handleFormSubmit(e) {
    e.preventDefault();
    const name    = document.getElementById('parent-name').value.trim();
    const phone   = document.getElementById('phone').value.trim();
    const age     = document.getElementById('child-age').value.trim();
    const program = document.getElementById('program').value;
    const message = document.getElementById('message').value.trim();

    if (!name || !phone) {
      alert('Please fill in your name and phone number.');
      return;
    }

    const text = [
      `Hello ROBO CLUB! I'd like to enquire about enrolling my child.`,
      `Parent name: ${name}`,
      phone ? `Contact: ${phone}` : '',
      age ? `Child's age: ${age}` : '',
      program ? `Program interest: ${program}` : '',
      message ? `Message: ${message}` : ''
    ].filter(Boolean).join('\n');

    const wa = `https://wa.me/233555776007?text=${encodeURIComponent(text)}`;
    window.open(wa, '_blank');
  }

  // Smooth nav active states
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(l => l.style.color = '');
        const active = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
        if (active) active.style.color = 'rgba(255,255,255,1)';
      }
    });
  }, { threshold: 0.4 });
  sections.forEach(s => observer.observe(s));
