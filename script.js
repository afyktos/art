const filters = document.querySelectorAll('.filter');
const projects = document.querySelectorAll('.project');
const modal = document.querySelector('.project-modal');
const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('#main-nav');
const modalMain = modal.querySelector('.modal-main');
const modalThumbs = modal.querySelector('.modal-thumbs');
const modalCount = modal.querySelector('.modal-count');
let currentGallery = [];
let currentIndex = 0;

document.querySelector('#year').textContent = new Date().getFullYear();

filters.forEach(button => button.addEventListener('click', () => {
  filters.forEach(item => item.classList.remove('active'));
  button.classList.add('active');
  const selected = button.dataset.filter;
  projects.forEach(project => {
    const categories = project.dataset.category.split(' ');
    project.classList.toggle('hidden', selected !== 'all' && !categories.includes(selected));
  });
}));

document.querySelectorAll('[data-hover]').forEach(project => {
  const image = project.querySelector('.art img');
  const frames = project.dataset.hover.split('|');
  let frame = 0;
  let timer;
  frames.forEach(source => { const preload = new Image(); preload.src = source; });

  const showFrame = index => {
    image.classList.add('switching');
    window.setTimeout(() => {
      image.src = frames[index];
      image.classList.remove('switching');
    }, 130);
  };

  project.addEventListener('mouseenter', () => {
    timer = window.setInterval(() => {
      frame = (frame + 1) % frames.length;
      showFrame(frame);
    }, 1050);
  });
  project.addEventListener('mouseleave', () => {
    window.clearInterval(timer);
    frame = 0;
    showFrame(0);
  });
});

function showGalleryImage(index) {
  if (!currentGallery.length) return;
  currentIndex = (index + currentGallery.length) % currentGallery.length;
  modalMain.classList.add('switching');
  window.setTimeout(() => {
    modalMain.src = currentGallery[currentIndex];
    modalMain.alt = `${modal.querySelector('#modal-title').textContent} — image ${currentIndex + 1}`;
    modalMain.classList.remove('switching');
  }, 100);
  modalCount.textContent = `${String(currentIndex + 1).padStart(2, '0')} / ${String(currentGallery.length).padStart(2, '0')}`;
  modalThumbs.querySelectorAll('button').forEach((button, buttonIndex) => {
    button.classList.toggle('active', buttonIndex === currentIndex);
  });
}

function openProject(project) {
  modal.querySelector('#modal-title').textContent = project.dataset.title;
  modal.querySelector('.modal-meta').textContent = project.dataset.meta;
  modal.querySelector('.modal-description').textContent = project.dataset.description || '';
  currentGallery = project.dataset.gallery
    ? project.dataset.gallery.split('|')
    : [project.querySelector('.art img').getAttribute('src')];
  modalThumbs.replaceChildren(...currentGallery.map((source, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.setAttribute('aria-label', `View image ${index + 1}`);
    const thumb = document.createElement('img');
    thumb.src = source;
    thumb.alt = '';
    button.append(thumb);
    button.addEventListener('click', () => showGalleryImage(index));
    return button;
  }));
  modal.showModal();
  showGalleryImage(0);
}

projects.forEach(project => {
  project.addEventListener('click', () => openProject(project));
  project.addEventListener('keydown', event => {
    if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); openProject(project); }
  });
});

modal.querySelector('.modal-close').addEventListener('click', () => modal.close());
modal.querySelector('.modal-prev').addEventListener('click', () => showGalleryImage(currentIndex - 1));
modal.querySelector('.modal-next').addEventListener('click', () => showGalleryImage(currentIndex + 1));
modal.addEventListener('click', event => { if (event.target === modal) modal.close(); });
modal.addEventListener('keydown', event => {
  if (event.key === 'ArrowLeft') showGalleryImage(currentIndex - 1);
  if (event.key === 'ArrowRight') showGalleryImage(currentIndex + 1);
});

menuButton.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(isOpen));
});
nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  nav.classList.remove('open');
  menuButton.setAttribute('aria-expanded', 'false');
}));
