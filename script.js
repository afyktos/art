const filters = document.querySelectorAll('.filter');
const projects = document.querySelectorAll('.project');
const modal = document.querySelector('.project-modal');
const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('#main-nav');

document.querySelector('#year').textContent = new Date().getFullYear();

filters.forEach(button => button.addEventListener('click', () => {
  filters.forEach(item => item.classList.remove('active'));
  button.classList.add('active');
  const selected = button.dataset.filter;
  projects.forEach(project => project.classList.toggle('hidden', selected !== 'all' && project.dataset.category !== selected));
}));

function openProject(project) {
  const artwork = project.querySelector('.art').cloneNode(true);
  modal.querySelector('.modal-art').replaceChildren(artwork);
  modal.querySelector('#modal-title').textContent = project.dataset.title;
  modal.querySelector('.modal-meta').textContent = project.dataset.meta;
  modal.showModal();
}

projects.forEach(project => {
  project.addEventListener('click', () => openProject(project));
  project.addEventListener('keydown', event => {
    if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); openProject(project); }
  });
});

modal.querySelector('.modal-close').addEventListener('click', () => modal.close());
modal.addEventListener('click', event => { if (event.target === modal) modal.close(); });

menuButton.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(isOpen));
});
nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  nav.classList.remove('open');
  menuButton.setAttribute('aria-expanded', 'false');
}));
