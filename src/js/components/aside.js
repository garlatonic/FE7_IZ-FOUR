import { getAllDocuments, viewDocument } from "../modules/document.js";

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

      return nodes
        .map((doc) => {
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
        })
        .join("");
    }

    treeBuild(data);

    $rootList.innerHTML = treeBuild(data, 0);
  },
};

aside.init().then(() => {
  // history API 사용 SPA

  //처음 로드 됐을 때 state 추가
  history.replaceState(
    { isHome: true, title: "홈", content: "콘텐츠" },
    "",
    "home"
  );

  // 페이지 간 동작
  const pageItems = document.querySelectorAll("li");

  function navigator(state) {
    const pageArea = document.querySelector("#contents");
    if (state.isHome) {
      // 홈 화면
      const p = document.createElement("p");
      p.textContent = `제목: ${state.title} | 내용: ${state.content}`;
      pageArea.replaceChildren(p);
    } else {
      // 페이지 이동할 때마다 바꿀 콘텐츠
      const div_inner = document.createElement("div");
      div_inner.classList.add("inner", "flex", "flex-col", "gap-4", "w-2/4");

      const div_title = document.createElement("div");
      div_title.className = "title";

      const h1 = document.createElement("h1");
      h1.classList.add("text-5xl", "font-bold");
      const h1_input = document.createElement("input");
      h1_input.type = "text";
      h1_input.placeholder = "새 페이지";
      h1_input.setAttribute(
        "aria-label",
        "해당 페이지의 제목을 편집하려면 입력하세요."
      );
      h1_input.classList.add("w-full", "outline-0");
      h1_input.value = state.title;

      h1.appendChild(h1_input);
      div_title.appendChild(h1);

      const div_content = document.createElement("div");
      div_content.classList.add("content", "flex-1");

      const textarea = document.createElement("textarea");
      textarea.rows = 1;
      textarea.placeholder = "내용을 입력하세요.";
      textarea.setAttribute(
        "aria-label",
        "해당 게시물의 내용을 편집하려면 입력하세요."
      );
      textarea.classList.add(
        "min-w-full",
        "min-h-full",
        "outline-0",
        "resize-none"
      );
      textarea.value = state.content;

      div_content.appendChild(textarea);

      div_inner.append(div_title, div_content);

      pageArea.replaceChildren(div_inner);
    }
  }

  pageItems.forEach((item) => {
    item.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();

      const id = item.dataset.id;

      // id에 해당하는 페이지 내용 불러옴
      const pagePromise = viewDocument(id);

      pagePromise.then((page) => {
        // history API로 주소값 변경하고 편집기 영역 교체하기
        const state = page;
        history.pushState(state, "", state.id);
        console.log(state);
        navigator(state);
      });
    });
  });

  window.addEventListener("popstate", (event) => {
    if (event.state !== null) {
      // 이전 페이지 기록 있으면
      navigator(event.state);
    } else {
      // 없으면 같은 페이지에 머무르게
      history.replaceState(event.state, "", location.href);
    }
  });
});
