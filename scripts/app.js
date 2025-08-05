// WebDevIn_100Days Application

class WebDev100Days {
  constructor() {
    this.projects = [];
    this.filteredProjects = [];
    this.currentFilter = 'all';
    this.currentPage = 1;
    this.projectsPerPage = 20; // Increased for table view
    this.searchTerm = '';
    
    this.init();
  }

  async init() {
    this.setupEventListeners();
    this.setupThemeToggle();
    this.setupScrollProgress();
    this.setupScrollToTop();
    this.setupMobileMenu();
    await this.loadProjects();
    this.renderTable();
  }

  setupEventListeners() {
    // Search functionality
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    
    if (searchInput) {
      searchInput.addEventListener('input', this.debounce(() => {
        this.searchTerm = searchInput.value.toLowerCase();
        this.filterProjects();
      }, 300));
    }

    if (searchButton) {
      searchButton.addEventListener('click', () => {
        this.searchTerm = searchInput.value.toLowerCase();
        this.filterProjects();
      });
    }

    // Filter tabs
    document.addEventListener('click', (e) => {
      if (e.target.matches('.filter-tab')) {
        this.setActiveFilter(e.target.dataset.filter);
      }
    });

    // Pagination
    document.addEventListener('click', (e) => {
      if (e.target.matches('.pagination-btn')) {
        const page = parseInt(e.target.dataset.page);
        if (page && page !== this.currentPage) {
          this.currentPage = page;
          this.renderTable();
        }
      }
    });

    // Project row clicks - open demo in new tab
    document.addEventListener('click', (e) => {
      if (e.target.matches('.demo-btn') || e.target.closest('.demo-btn')) {
        e.preventDefault();
        const demoBtn = e.target.closest('.demo-btn');
        if (demoBtn && demoBtn.href) {
          window.open(demoBtn.href, '_blank');
        }
      }
    });
  }

  setupThemeToggle() {
    const themeToggle = document.querySelector('.theme-toggle');
    const currentTheme = localStorage.getItem('theme') || 'light';
    
    document.documentElement.setAttribute('data-theme', currentTheme);
    
    if (themeToggle) {
      themeToggle.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme');
        const next = current === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem('theme', next);
        
        this.updateThemeIcon(next);
      });
    }
    
    this.updateThemeIcon(currentTheme);
  }

  updateThemeIcon(theme) {
    const themeToggle = document.querySelector('.theme-toggle');
    if (themeToggle) {
      themeToggle.innerHTML = theme === 'dark' 
        ? '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>'
        : '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>';
    }
  }

  setupScrollProgress() {
    const progressBar = document.querySelector('.scroll-progress-bar');
    if (progressBar) {
      window.addEventListener('scroll', () => {
        const scrolled = (window.pageYOffset / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
        progressBar.style.width = `${scrolled}%`;
      });
    }
  }

  setupScrollToTop() {
    const scrollBtn = document.querySelector('.scroll-top');
    if (scrollBtn) {
      window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
          scrollBtn.classList.add('visible');
        } else {
          scrollBtn.classList.remove('visible');
        }
      });

      scrollBtn.addEventListener('click', () => {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      });
    }
  }

  setupMobileMenu() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mobileNav = document.querySelector('.mobile-nav');
    
    if (mobileMenuBtn && mobileNav) {
      mobileMenuBtn.addEventListener('click', () => {
        mobileMenuBtn.classList.toggle('active');
        mobileNav.classList.toggle('active');
      });

      document.addEventListener('click', (e) => {
        if (!mobileMenuBtn.contains(e.target) && !mobileNav.contains(e.target)) {
          mobileMenuBtn.classList.remove('active');
          mobileNav.classList.remove('active');
        }
      });
    }
  }

  async loadProjects() {
    // Complete list of all projects - day numbers will be assigned sequentially
    const projectsData = [
      // ... All previous projects ...
      {
        originalDay: 123,
        name: "LeetMatrix",
        description: "Check Leetcode stats ",
        demoLink: "./public/LeetMatrix/index.html",
        category: "basic",
        technologies: ["HTML", "CSS", "JavaScript"],
        features: ["LeetCode", "Stats", "Graph"]
      },
      // CONFLICT RESOLVED HERE: Added the new project from main branch first
      {
        originalDay: 150,
        name: "University Management System",
        description: "Manage university operations including courses, students, and faculty.",
        demoLink: "./public/University_managment_system/index.html",
        category: "utilities",
        technologies: ["HTML", "CSS", "JavaScript", "API"],
        features: ["Visitor Management", "History Tracking", "Search Functionality"]
      },
      // And then added your calculator project
      {
        originalDay: 125, 
        name: "Calculator",
        description: "A simple calculator for basic arithmetic operations.",
        demoLink: "./public/Calculator/index.html",
        category: "utilities",
        technologies: ["HTML", "CSS", "JavaScript"],
        features: ["Addition", "Subtraction", "Multiplication", "Division", "Clear"]
      }
    ];
 
  // Assign sequential day numbers (1, 2, 3, 4...) regardless of original day numbers
    this.projects = projectsData.map((project, index) => ({
      ...project,
      day: index + 1
    }));

    this.filteredProjects = [...this.projects];
  }

  filterProjects() {
    let filtered = [...this.projects];

    // Filter by category
    if (this.currentFilter !== 'all') {
      filtered = filtered.filter(project => project.category === this.currentFilter);
    }

    // Filter by search term
    if (this.searchTerm) {
      filtered = filtered.filter(project => 
        project.name.toLowerCase().includes(this.searchTerm) ||
        project.description.toLowerCase().includes(this.searchTerm) ||
        project.technologies.some(tech => tech.toLowerCase().includes(this.searchTerm)) ||
        project.features.some(feature => feature.toLowerCase().includes(this.searchTerm))
      );
    }

    this.filteredProjects = filtered;
    this.currentPage = 1; // Reset to first page
    this.renderTable();
  }

  setActiveFilter(filter) {
    this.currentFilter = filter;
    this.currentPage = 1;
    
    document.querySelectorAll('.filter-tab').forEach(tab => {
      tab.classList.remove('active');
    });
    document.querySelector(`[data-filter="${filter}"]`).classList.add('active');
    
    this.filterProjects();
  }

  renderTable() {
    const tableContainer = document.querySelector('.projects-table-container');
    const emptyState = document.querySelector('.empty-state');
    
    if (!tableContainer) return;

    const startIndex = (this.currentPage - 1) * this.projectsPerPage;
    const endIndex = startIndex + this.projectsPerPage;
    const projectsToShow = this.filteredProjects.slice(startIndex, endIndex);

    tableContainer.innerHTML = '';

    if (projectsToShow.length === 0) {
      if (emptyState) {
        emptyState.classList.add('show');
      }
      return;
    }

    if (emptyState) {
      emptyState.classList.remove('show');
    }

    const table = document.createElement('table');
    table.className = 'projects-table';

    table.innerHTML = `
      <thead>
        <tr>
          <th onclick="app.sortTable('day')" class="sortable">Day <span class="sort-icon">↕</span></th>
          <th onclick="app.sortTable('name')" class="sortable">Project Name <span class="sort-icon">↕</span></th>
          <th onclick="app.sortTable('category')" class="sortable">Category <span class="sort-icon">↕</span></th>
          <th>Technologies</th>
          <th>Features</th>
          <th>Demo</th>
        </tr>
      </thead>
      <tbody>
        ${projectsToShow.map(project => `
          <tr class="table-row" data-category="${project.category}">
            <td class="day-cell">Day ${project.day}</td>
            <td class="name-cell">
              <div class="project-name">${project.name}</div>
              <div class="project-desc">${project.description}</div>
            </td>
            <td class="category-cell">
              <span class="category-badge category-${project.category}">${project.category}</span>
            </td>
            <td class="tech-cell">
              <div class="tech-tags">
                ${project.technologies.map(tech => `<span class="tech-tag-small">${tech}</span>`).join('')}
              </div>
            </td>
            <td class="features-cell">
              <div class="features-preview">
                ${project.features.slice(0, 2).map(feature => `<span class="feature-tag">${feature}</span>`).join('')}
                ${project.features.length > 2 ? `<span class="feature-more">+${project.features.length - 2} more</span>` : ''}
              </div>
            </td>
            <td class="demo-cell">
              <a href="${project.demoLink}" target="_blank" class="demo-btn">


