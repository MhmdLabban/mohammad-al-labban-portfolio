document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.querySelector(".menu-toggle");
  const sidebar = document.querySelector(".sidebar");
  const modal = document.getElementById("cert-modal");
  const pdfContainer = document.getElementById("cert-pdf-container");
  const closeBtn = document.querySelector(".close-btn");
  const themeToggle = document.getElementById("theme-toggle");

  const getStoredTheme = () => {
    try {
      return localStorage.getItem("theme");
    } catch (error) {
      return null;
    }
  };

  const setTheme = isDark => {
    document.body.classList.toggle("dark", isDark);
    if (themeToggle) {
      themeToggle.textContent = isDark ? "☀️ Light Mode" : "🌙 Dark Mode";
      themeToggle.setAttribute("aria-pressed", String(isDark));
    }
    try {
      localStorage.setItem("theme", isDark ? "dark" : "light");
    } catch (error) {
      // Ignore storage failures. The UI still works in the current session.
    }
  };

  const closeModal = () => {
    if (!modal) return;
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
  };

  // Sidebar toggle (mobile)
  if (menuToggle && sidebar) {
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.addEventListener("click", () => {
      const isActive = sidebar.classList.toggle("active");
      menuToggle.setAttribute("aria-expanded", String(isActive));
    });

    // Close sidebar when a link is clicked (mobile only)
    sidebar.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        if (window.innerWidth <= 768) {
          sidebar.classList.remove("active");
          menuToggle.setAttribute("aria-expanded", "false");
        }
      });
    });

    document.addEventListener("click", event => {
      const target = event.target;
      if (window.innerWidth > 768) return;
      if (!sidebar.contains(target) && !menuToggle.contains(target)) {
        sidebar.classList.remove("active");
        menuToggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  // Modal functionality for certifications
  if (modal && pdfContainer) {
    document.querySelectorAll(".cert-link").forEach(link => {
      link.addEventListener("click", e => {
        e.preventDefault();
        const pdfs = link.dataset.certPdfs?.split(",") || [];
        pdfContainer.innerHTML = pdfs
          .map(pdf => `<iframe src="${pdf.trim()}" title="Certificate PDF"></iframe>`)
          .join("");
        modal.classList.add("open");
        modal.setAttribute("aria-hidden", "false");
        document.body.classList.add("modal-open");
      });
    });

    if (closeBtn) {
      closeBtn.addEventListener("click", closeModal);
    }

    // Close modal when clicking outside content
    modal.addEventListener("click", e => {
      if (e.target === modal) {
        closeModal();
      }
    });

    document.addEventListener("keydown", e => {
      if (e.key === "Escape" && modal.classList.contains("open")) {
        closeModal();
      }
    });
  }

  // Dark/Light Mode Toggle
  if (themeToggle) {
    const savedTheme = getStoredTheme();
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initialDark = savedTheme ? savedTheme === "dark" : prefersDark;
    setTheme(initialDark);

    themeToggle.addEventListener("click", () => {
      setTheme(!document.body.classList.contains("dark"));
    });
  }
});
