import { getAllDocuments } from "../modules/document.js";

const aside = {
  data: [],
  async init() {
    try {
      const data = await getAllDocuments(); // ← await
      this.data = data ?? [];
      console.log("docs:", this.data);
      this.render(this.data);
    } catch (e) {
      console.error("aside.init 실패:", e);
    }
  },
  render(data) {
    const $aside = document.querySelector("nav.aside-menu");
    const $btn = $aside.querySelector(".heading .util [role='button']");
    const $rootList = $aside.querySelector(".body > .list");
    
    function treeBuild(nodes, depth = 0) {
      const paddingLeft = (depth) => `pl-${2 + depth * 2}`;
      
      if (nodes.length === 0) return ""; // 페이지 아예 없을 때

      return nodes.map((doc) => {
        const children = treeBuild(doc.documents || [], depth + 1);
        return `
          <li data-id="${doc.id}">
            <a href="#none" class="page-item pl-${paddingLeft}">
              <div class="icon">
                <i data-lucide="file"></i>
              </div>
              <div class="title flex-1">새 페이지</div>
              <div class="util">
                <div
                  role="button"
                  aria-label="새 페이지 만들기"
                  data-tooltip="새 페이지 만들기"
                >
                  <i data-lucide="plus"></i>
                </div>
              </div>
            </a>
            ${children ? `<ul>${children}</ul>` : ""}
          </li>
        `;
      }).join("");
    }

    treeBuild(data);

    $rootList.innerHTML = treeBuild(data, 0);
  },

};

aside.init();
