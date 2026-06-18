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

      (() => {
        const form = document.getElementById("form-contacto");
        if (!form) return;

        const btn = document.getElementById("form-submit");
        const msg = document.getElementById("form-msg");

        const mostrarMensaje = (texto, exito) => {
          msg.textContent = texto;
          msg.hidden = false;
          msg.classList.toggle("form-msg--ok", !!exito);
          msg.classList.toggle("form-msg--error", !exito);
        };

        form.addEventListener("submit", async (event) => {
          event.preventDefault();
          if (!form.reportValidity()) return;

          msg.hidden = true;
          btn.disabled = true;
          const textoOriginal = btn.textContent;
          btn.textContent = "Enviando...";

          try {
            const datos = new FormData(form);
            const res = await fetch(form.action, {
              method: "POST",
              body: datos,
              headers: { Accept: "application/json" },
            });
            const json = await res.json().catch(() => ({}));

            if (res.ok && json.success) {
              form.reset();
              mostrarMensaje("Mensaje enviado. Te contactaremos pronto.", true);
            } else {
              const detalle = json.message || "No pudimos enviar tu mensaje. Inténtalo de nuevo.";
              mostrarMensaje(detalle, false);
            }
          } catch (err) {
            mostrarMensaje("Hubo un problema de conexión. Inténtalo en unos minutos.", false);
          } finally {
            btn.disabled = false;
            btn.textContent = textoOriginal;
          }
        });
      })();
