const rssFeedUrl = 'https://script.google.com/macros/s/AKfycbx6k0-G1Uv6YHdMg2RP3uuFgrNVt1OgzWzchIKC53dXFut7EXNw4VlpWxN9M9_YSEM/exec';

function getLocalData() {
  const data = localStorage.getItem('rssData');
  return data ? JSON.parse(data) : [];
}

function setLocalData(data) {
  localStorage.setItem('rssData', JSON.stringify(data));
}

function openYouTubePopup(url) {
  const videoId = new URL(url).searchParams.get('v');
  if (videoId) {
    const popupUrl = `https://www.youtube.com/embed/${videoId}`;
    const width = 560;
    const height = 315;
    const left = (screen.width - width) / 2;
    const top = (screen.height - height) / 2;
    window.open(popupUrl, 'YouTube Video', `width=${width},height=${height},left=${left},top=${top}`);
  }
}

function displayRSSItems(data) {
  const container = document.getElementById('rss-feed');
  container.innerHTML = ''; // Clear existing content

  // Mobile: Use Swiper
  if (window.innerWidth <= 768) {
    container.className = 'swiper-container';
    const swiperWrapper = document.createElement('div');
    swiperWrapper.className = 'swiper-wrapper';
    container.appendChild(swiperWrapper);

    data.forEach(item => {
      const itemDiv = document.createElement('div');
      itemDiv.className = 'swiper-slide grid-item';
      itemDiv.innerHTML = `
        <a href="${item.link}" data-is-youtube="${item.link.includes('youtube.com')}" target="_blank">
          <img src="${item.imageUrl}" alt="${item.title}" loading="lazy">
          <h3>${item.title}</h3>
          <p>${item.content}</p>
        </a>
      `;
      swiperWrapper.appendChild(itemDiv);
    });

    // Add navigation buttons
    const nextButton = document.createElement('div');
    nextButton.className = 'swiper-button-next';
    container.appendChild(nextButton);

    const prevButton = document.createElement('div');
    prevButton.className = 'swiper-button-prev';
    container.appendChild(prevButton);

    new Swiper('.swiper-container', {
      slidesPerView: 1,
      spaceBetween: 20,
      loop: true,
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      speed: 500, // 슬라이드 전환 속도
      effect: 'slide', // 전환 효과
    });
  } else {
    // Desktop: Use Masonry
    const fragment = document.createDocumentFragment();

    data.forEach(item => {
      const itemDiv = document.createElement('div');
      itemDiv.className = 'grid-item';
      itemDiv.innerHTML = `
        <a href="${item.link}" data-is-youtube="${item.link.includes('youtube.com')}" target="_blank">
          <img src="${item.imageUrl}" alt="${item.title}" loading="lazy">
          <h3>${item.title}</h3>
          <p>${item.content}</p>
        </a>
      `;
      fragment.appendChild(itemDiv);
    });

    container.appendChild(fragment);

    // 이미지가 모두 로드된 후 Masonry 초기화
    imagesLoaded(container, function() {
      new Masonry(container, {
        itemSelector: '.grid-item',
        columnWidth: '.grid-item',
        percentPosition: true,
        gutter: 20
      });
    });
  }

  // 모든 링크에 클릭 이벤트 리스너 추가
  const links = container.querySelectorAll('a[data-is-youtube="true"]');
  links.forEach(link => {
    link.addEventListener('click', function(event) {
      event.preventDefault();
      openYouTubePopup(this.href);
    });
  });
}

async function fetchRSSFeed() {
  try {
    const response = await fetch(rssFeedUrl, { cache: 'no-store' });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    displayRSSItems(data);
    setLocalData(data); // Update local storage with new data
  } catch (error) {
    console.error('Error fetching the RSS feed:', error);
  }
}

// Initial load from local storage
const localData = getLocalData();
if (localData.length > 0) {
  displayRSSItems(localData);
}

// Fetch and update from network
fetchRSSFeed();
