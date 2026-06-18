      (() => {
        const nav = document.querySelector(".nav-links");
        if (!nav) return;

        const header = document.querySelector("header");
        const getHeaderOffset = () => (header ? header.offsetHeight + 12 : 84);

        const navLinks = Array.from(nav.querySelectorAll('a[href^="#"]'));
        const linkById = new Map(
          navLinks
            .map((link) => {
              const id = (link.getAttribute("href") || "").slice(1);
              return id ? [id, link] : null;
            })
            .filter(Boolean),
        );

        const normalizeIdForMenu = (id) => (id === "como-funciona" ? "home" : id);

        const setCurrentById = (id) => {
          const normalizedId = normalizeIdForMenu(id);
          const link = linkById.get(normalizedId) || linkById.get("home");
          if (!link) return;

          navLinks.forEach((a) => a.removeAttribute("aria-current"));
          link.setAttribute("aria-current", "page");
        };

        const sectionIds = ["home", "como-funciona", "impacto", "empresas", "contacto"];
        const sections = sectionIds
          .map((id) => document.getElementById(id))
          .filter((el) => el && el instanceof HTMLElement);

        const getActiveSectionId = () => {
          const y = window.scrollY + getHeaderOffset() + 1;
          let activeId = "home";
          for (const section of sections) {
            if (section.offsetTop <= y) activeId = section.id;
          }
          return activeId;
        };

        const setFromHash = () => {
          const id = (location.hash || "#home").slice(1);
          setCurrentById(id);
        };

        let ticking = false;
        const onScroll = () => {
          if (ticking) return;
          ticking = true;
          requestAnimationFrame(() => {
            setCurrentById(getActiveSectionId());
            ticking = false;
          });
        };

        navLinks.forEach((a) => {
          a.addEventListener("click", () => {
            const id = (a.getAttribute("href") || "#home").slice(1);
            setCurrentById(id);
          });
        });

        window.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener(
          "hashchange",
          () => {
            setFromHash();
            onScroll();
          },
          { passive: true },
        );

        setFromHash();
        onScroll();
      })();
