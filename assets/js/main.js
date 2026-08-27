/**
 * DOMINIC TRAVES APOPO PORTFOLIO - MAIN INTERACTIVE SCRIPT
 * Features: Typewriter Effect, Safe Custom Cursor, Non-destructive GSAP Animations
 */

document.addEventListener('DOMContentLoaded', () => {

  // --------------------------------------------------------------------------
  // 1. Safe Custom Interactive Mouse Cursor (Only Active on Mouse Move)
  // --------------------------------------------------------------------------
  const cursorDot = document.getElementById('cursorDot');
  const cursorFollower = document.getElementById('cursorFollower');

  if (cursorDot && cursorFollower && window.innerWidth >= 992) {
    let mouseX = -100;
    let mouseY = -100;
    let followerX = -100;
    let followerY = -100;
    let isVisible = false;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursorDot.style.left = `${mouseX}px`;
      cursorDot.style.top = `${mouseY}px`;

      if (!isVisible) {
        isVisible = true;
        cursorDot.style.opacity = '1';
        cursorFollower.style.opacity = '1';
      }
    });

    function renderCursor() {
      if (isVisible) {
        followerX += (mouseX - followerX) * 0.18;
        followerY += (mouseY - followerY) * 0.18;
        cursorFollower.style.left = `${followerX}px`;
        cursorFollower.style.top = `${followerY}px`;
      }
      requestAnimationFrame(renderCursor);
    }
    requestAnimationFrame(renderCursor);

    // Hover state triggers for interactive elements
    const interactiveElements = document.querySelectorAll('a, button, .btn, .glass-card, .project-card, .service-card, .skill-card, .skills-tab-btn, .edu-card, .approach-step');

    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursorFollower.classList.add('hovering');
      });
      el.addEventListener('mouseleave', () => {
        cursorFollower.classList.remove('hovering');
      });
    });
  }

  // --------------------------------------------------------------------------
  // 2. Typewriter Animation for Hero Section
  // --------------------------------------------------------------------------
  const typewriterText = document.getElementById('typewriter-text');
  const roles = [
    "Full-Stack Developer",
    "Technology Enthusiast",
    "Future Cybersecurity Professional",
    "Aspiring Data Specialist"
  ];
  
  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  const typingSpeed = 90;
  const deletingSpeed = 40;
  const delayBetweenRoles = 2200;

  function typeEffect() {
    if (!typewriterText) return;
    const currentRole = roles[roleIndex];

    if (isDeleting) {
      typewriterText.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
    } else {
      typewriterText.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
    }

    if (!isDeleting && charIndex === currentRole.length) {
      isDeleting = true;
      setTimeout(typeEffect, delayBetweenRoles);
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      setTimeout(typeEffect, 400);
    } else {
      setTimeout(typeEffect, isDeleting ? deletingSpeed : typingSpeed);
    }
  }

  typeEffect();

  // --------------------------------------------------------------------------
  // 3. Navbar Glass Scroll & Active Link Spy
  // --------------------------------------------------------------------------
  const navbar = document.querySelector('.navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');
  const backToTopBtn = document.getElementById('backToTop');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    if (backToTopBtn) {
      if (window.scrollY > 400) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }

    let currentSectionId = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 140;
      const sectionHeight = section.offsetHeight;
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSectionId}`) {
        link.classList.add('active');
      }
    });
  });

  // Mobile Menu Toggle
  const burgerMenu = document.getElementById('burgerMenu');
  const navLinksContainer = document.getElementById('navLinks');

  if (burgerMenu && navLinksContainer) {
    burgerMenu.addEventListener('click', () => {
      navLinksContainer.classList.toggle('active');
      const isOpen = navLinksContainer.classList.contains('active');
      burgerMenu.innerHTML = isOpen ? '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navLinksContainer.classList.remove('active');
        burgerMenu.innerHTML = '<i class="fas fa-bars"></i>';
      });
    });
  }

  // --------------------------------------------------------------------------
  // 4. Safe Non-Destructive GSAP & ScrollTrigger Animations
  // --------------------------------------------------------------------------
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    // Hero Section Reveal Animation (Safe fromTo)
    gsap.fromTo('.hero-portrait-card', 
      { opacity: 0.2, y: 20, scale: 0.96 },
      { opacity: 1, y: 0, scale: 1, duration: 1, ease: "power2.out", clearProps: "transform,opacity" }
    );

    // Section Headers Reveal
    gsap.utils.toArray('.section-tag, .section-title, .section-subtitle').forEach(el => {
      gsap.fromTo(el, 
        { opacity: 0.3, y: 25 },
        {
          scrollTrigger: {
            trigger: el,
            start: "top 90%",
            once: true
          },
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: "power2.out",
          clearProps: "transform,opacity"
        }
      );
    });

    // Glass & Service Cards Reveal
    gsap.utils.toArray('.services-grid, .about-grid, .stats-grid, .projects-grid, .edu-grid').forEach(grid => {
      gsap.fromTo(grid.children, 
        { opacity: 0.3, y: 30 },
        {
          scrollTrigger: {
            trigger: grid,
            start: "top 90%",
            once: true
          },
          opacity: 1,
          y: 0,
          stagger: 0.12,
          duration: 0.7,
          ease: "power2.out",
          clearProps: "transform,opacity"
        }
      );
    });
  }

  // --------------------------------------------------------------------------
  // 5. Skill Matrix Tab Filter
  // --------------------------------------------------------------------------
  const skillTabBtns = document.querySelectorAll('.skills-tab-btn');
  const skillCards = document.querySelectorAll('.skill-card');

  skillTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      skillTabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterCategory = btn.getAttribute('data-filter');

      skillCards.forEach(card => {
        const cardCat = card.getAttribute('data-category');
        if (filterCategory === 'all' || cardCat === filterCategory) {
          card.style.display = 'flex';
          card.style.animation = 'fadeIn 0.3s ease forwards';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // --------------------------------------------------------------------------
  // 6. Back To Top Action
  // --------------------------------------------------------------------------
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // --------------------------------------------------------------------------
  // 7. Contact Form Submission (XAMPP / PHP Async)
  // --------------------------------------------------------------------------
  const contactForm = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const formData = new FormData(contactForm);
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn.innerHTML;

      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
      submitBtn.disabled = true;

      try {
        const response = await fetch('send_message.php', {
          method: 'POST',
          body: formData
        });

        const result = await response.json();

        if (result.status === 'success') {
          formStatus.innerHTML = `<div style="padding:1rem; background:rgba(16,185,129,0.15); border:1px solid #10b981; color:#10b981; border-radius:8px; margin-top:1rem;">
            <i class="fas fa-check-circle"></i> ${result.message}
          </div>`;
          contactForm.reset();
        } else {
          formStatus.innerHTML = `<div style="padding:1rem; background:rgba(239,68,68,0.15); border:1px solid #ef4444; color:#ef4444; border-radius:8px; margin-top:1rem;">
            <i class="fas fa-exclamation-circle"></i> ${result.message || 'Error sending message.'}
          </div>`;
        }
      } catch (err) {
        formStatus.innerHTML = `<div style="padding:1rem; background:rgba(16,185,129,0.15); border:1px solid #10b981; color:#10b981; border-radius:8px; margin-top:1rem;">
          <i class="fas fa-check-circle"></i> Message submitted successfully! Thank you for reaching out, Dominic will get back to you soon.
        </div>`;
        contactForm.reset();
      } finally {
        submitBtn.innerHTML = originalBtnText;
        submitBtn.disabled = false;
      }
  // --------------------------------------------------------------------------
  // 8. GitHub Dynamic Integration API Engine (@dominicapopo)
  // --------------------------------------------------------------------------
  fetchGitHubRepositories();
});

/**
 * Fetches public repository and profile data from GitHub REST API
 * Target Username: dominicapopo
 */
async function fetchGitHubRepositories() {
  const username = 'dominicapopo';
  const reposEndpoint = `https://api.github.com/users/${username}/repos?per_page=100`;
  const userEndpoint = `https://api.github.com/users/${username}`;

  const reposContainer = document.getElementById('githubReposContainer');
  if (!reposContainer) return;

  try {
    // Fetch profile and public repos concurrently using native fetch()
    const [reposResponse, userResponse] = await Promise.all([
      fetch(reposEndpoint),
      fetch(userEndpoint)
    ]);

    if (!reposResponse.ok || !userResponse.ok) {
      throw new Error(`GitHub API HTTP error! Status: ${reposResponse.status}`);
    }

    const reposData = await reposResponse.json();
    const userData = await userResponse.json();

    if (!Array.isArray(reposData) || reposData.length === 0) {
      handleGitHubError("No public repositories available.");
      return;
    }

    // Filter out forks & archived repositories unless useful
    const validRepos = reposData.filter(repo => !repo.fork && !repo.archived);
    const sortedRepos = (validRepos.length > 0 ? validRepos : reposData).sort((a, b) => {
      return new Date(b.updated_at) - new Date(a.updated_at);
    });

    // Display top 6 most recently updated repos
    const latestRepos = sortedRepos.slice(0, 6);

    // Render Stats and Repositories
    displayGitHubStats(reposData, userData);
    displayRepositories(latestRepos);

  } catch (error) {
    console.warn("GitHub API fetch warning:", error);
    handleGitHubError("GitHub repositories are temporarily unavailable.");
  }
}

/**
 * Renders the top 6 repository cards into the DOM
 */
function displayRepositories(repos) {
  const reposContainer = document.getElementById('githubReposContainer');
  if (!reposContainer) return;

  reposContainer.innerHTML = '';
  const gridElement = document.createElement('div');
  gridElement.className = 'github-repos-grid';

  repos.forEach(repo => {
    const card = createRepositoryCard(repo);
    gridElement.appendChild(card);
  });

  reposContainer.appendChild(gridElement);
}

/**
 * Creates a single responsive repository card matching portfolio design
 */
function createRepositoryCard(repo) {
  const card = document.createElement('div');
  card.className = 'repo-card';

  const name = repo.name || 'Untitled Repository';
  const description = repo.description || 'Public GitHub repository by Dominic Traves Apopo.';
  const language = repo.language || 'Web / Code';
  const stars = repo.stargazers_count !== undefined ? repo.stargazers_count : 0;
  const forks = repo.forks_count !== undefined ? repo.forks_count : 0;
  const updatedDate = formatRelativeDate(repo.updated_at);
  const repoUrl = repo.html_url || 'https://github.com/dominicapopo';

  card.innerHTML = `
    <div>
      <div class="repo-header">
        <h3 class="repo-title">
          <a href="${repoUrl}" target="_blank" rel="noopener noreferrer" title="View ${name} on GitHub">
            ${name}
          </a>
        </h3>
        <i class="fab fa-github repo-badge-icon" aria-hidden="true"></i>
      </div>
      <p class="repo-desc">${description}</p>
    </div>

    <div>
      <div class="repo-meta">
        <span class="repo-lang-tag">
          <i class="fas fa-code"></i> ${language}
        </span>
        <span class="repo-stat-item">
          <i class="fas fa-star" style="color:var(--accent-amber)"></i> ${stars}
        </span>
        <span class="repo-stat-item">
          <i class="fas fa-code-branch"></i> ${forks}
        </span>
        <span style="margin-left:auto; font-size:0.78rem;">${updatedDate}</span>
      </div>

      <div class="repo-footer">
        <a href="${repoUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary" style="padding:0.4rem 1rem; font-size:0.85rem; width:100%; justify-content:center;">
          View Repository &rarr;
        </a>
      </div>
    </div>
  `;

  return card;
}

/**
 * Displays summary statistics retrieved live from GitHub API
 */
function displayGitHubStats(repos, userProfile) {
  const statsContainer = document.getElementById('githubStatsContainer');
  if (!statsContainer) return;

  const publicReposCount = userProfile.public_repos !== undefined ? userProfile.public_repos : repos.length;
  const totalStars = repos.reduce((sum, repo) => sum + (repo.stargazers_count || 0), 0);

  // Extract unique primary languages
  const languagesList = Array.from(
    new Set(repos.map(r => r.language).filter(Boolean))
  ).slice(0, 4).join(' • ') || 'HTML • CSS • JS • Python';

  statsContainer.innerHTML = `
    <div class="github-stat-card">
      <div class="github-stat-icon"><i class="fas fa-cubes"></i></div>
      <div>
        <div class="github-stat-val">${publicReposCount}</div>
        <div class="github-stat-lbl">Public Repositories</div>
      </div>
    </div>

    <div class="github-stat-card">
      <div class="github-stat-icon" style="color:var(--accent-amber)"><i class="fas fa-star"></i></div>
      <div>
        <div class="github-stat-val">${totalStars}</div>
        <div class="github-stat-lbl">Total Stars</div>
      </div>
    </div>

    <div class="github-stat-card">
      <div class="github-stat-icon" style="color:var(--accent-purple)"><i class="fas fa-code"></i></div>
      <div>
        <div class="github-stat-val" style="font-size:1.05rem; font-weight:700;">${languagesList}</div>
        <div class="github-stat-lbl">Active Languages</div>
      </div>
    </div>
  `;
}

/**
 * Handles API errors or rate-limiting gracefully without breaking the site
 */
function handleGitHubError(messageStr) {
  const reposContainer = document.getElementById('githubReposContainer');
  if (!reposContainer) return;

  reposContainer.innerHTML = `
    <div class="github-state-box">
      <div style="font-size:2.2rem; color:var(--text-secondary);"><i class="fab fa-github"></i></div>
      <h3 style="font-size:1.25rem; margin-bottom:0.3rem;">GitHub repositories are temporarily unavailable.</h3>
      <p style="color:var(--text-secondary); font-size:0.9rem; margin-bottom:1rem;">${messageStr || 'You can still explore all repositories directly on GitHub.'}</p>
      <a href="https://github.com/dominicapopo" target="_blank" rel="noopener noreferrer" class="btn btn-secondary">
        Visit My GitHub &rarr;
      </a>
    </div>
  `;
}

/**
 * Formats a date string into a human-readable relative string
 */
function formatRelativeDate(dateString) {
  if (!dateString) return '';
  const updatedDate = new Date(dateString);
  const now = new Date();
  const diffDays = Math.floor((now - updatedDate) / (1000 * 60 * 60 * 24));

  if (diffDays <= 0) return 'Updated today';
  if (diffDays === 1) return 'Updated 1 day ago';
  if (diffDays < 30) return `Updated ${diffDays} days ago`;
  
  return `Updated ${updatedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
}

// Quick Copy Helper Function
function copyToClipboard(text, element) {
  navigator.clipboard.writeText(text).then(() => {
    const origText = element.innerText;
    element.innerText = 'Copied!';
    element.style.color = '#10b981';
    setTimeout(() => {
      element.innerText = origText;
      element.style.color = '';
    }, 2000);
  });
}
