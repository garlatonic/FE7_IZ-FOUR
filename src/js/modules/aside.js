document.addEventListener("DOMContentLoaded", () => {
  // +버튼 클릭 시 하위에 새 페이지 추가
  document.querySelectorAll('.page-item .util [role="button"]').forEach(btn => {
    btn.addEventListener('click', function (e) {
      e.stopPropagation();

      // 부모 page-item 찾기
      const parentItem = btn.closest('.page-item');
      if (!parentItem) return;

      // 하위 페이지 리스트(ul) 찾기 또는 생성
      let childList = parentItem.parentElement.querySelector('ul');
      if (!childList) {
        childList = document.createElement('ul');
        parentItem.parentElement.appendChild(childList);
      }

      // 새 페이지 li 생성
      const newLi = document.createElement('li');
      newLi.innerHTML = `
        <a href="#none" class="page-item pl-6">
          <div class="icon"><i data-lucide="file-text"></i></div>
          <div class="title flex-1">새 페이지</div>
          <div class="util"></div>
        </a>
      `;
      childList.appendChild(newLi);

      // 새 페이지 클릭 시 브래드크럼에 경로 추가
      const newPageLink = newLi.querySelector('.page-item');
      newPageLink.addEventListener('click', function(ev) {
        ev.stopPropagation();
        const breadcrumb = document.querySelector('.breadcrumb ol');
        if (breadcrumb) {
          const li = document.createElement('li');
          li.innerHTML = `<a href="#none">새 페이지</a>`;
          breadcrumb.appendChild(li);
        }
      });
    });
  });
});