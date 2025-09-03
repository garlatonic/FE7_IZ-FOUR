import home from "./components/recent.js";
import aside from "./components/aside.js";

lucide.createIcons();

document.addEventListener("DOMContentLoaded", () => {
  // 최근 문서 목록
  home.init();

  // 어사이드
  aside.init().then(() => {
    /* History API로 SPA 구현 */
    history.replaceState(
      //처음 로드 됐을 때 state 추가
      { isHome: true },
      "",
      ""
    );

    window.addEventListener("popstate", (event) => {
      if (event.state !== null) {
        // 이전 페이지 기록 있으면
        const state = { event: event.type, ...event.state };
        navigateFn(state);
      } else {
        // 없으면 같은 페이지에 머무르게
        history.replaceState(event.state, "", location.href);
      }
    });
  });
});
