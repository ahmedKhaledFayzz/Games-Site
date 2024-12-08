class Game {
  constructor(
    title,
    description,
    platform,
    genre,
    thumbnail,
    price,
    detailsLink
  ) {
    this.title = title;
    this.description = description;
    this.platform = platform;
    this.genre = genre;
    this.thumbnail = thumbnail;
    this.price = price;
    this.detailsLink = detailsLink; // رابط تفاصيل اللعبة
  }
}

// دالة لقص الوصف إلى 10 كلمات فقط
function truncateDescription(description) {
  const words = description.split(' ');
  if (words.length > 10) {
    return words.slice(0, 10).join(' ') + '...';  // إضافة "..." بعد أول 10 كلمات
  }
  return description;  // إذا كان الوصف أقل من 10 كلمات، يتم عرضه كاملاً
}

class GameManager {
  constructor(apiUrl, apiKey) {
    this.apiUrl = apiUrl;
    this.apiKey = apiKey;
    this.games = [];
  }

  async fetchGames() {
    const options = {
      method: "GET",
      headers: {
        "x-rapidapi-key": this.apiKey,
        "x-rapidapi-host": "free-to-play-games-database.p.rapidapi.com",
      },
    };

    try {
      const response = await fetch(this.apiUrl, options);
      const data = await response.json();

      // تحويل البيانات إلى كائنات Game
      this.games = data.map(
        (game) =>
          new Game(
            game.title,
            game.short_description,
            game.platform,
            game.genre,
            game.thumbnail,
            game.freetogame_profile_url,
            game.freetogame_profile_url // رابط تفاصيل اللعبة
          )
      );
    } catch (error) {
      console.error("Error fetching games:", error);
    }
  }

  displayGames(containerId) {
    const container = document.getElementById(containerId);
    container.innerHTML = "";

    this.games.forEach((game) => {
      const gameCard = `
        <div class="game-card">
            <img src="${game.thumbnail}" alt="${game.title}" />
            <h3>${game.title}</h3>
            <p>${truncateDescription(game.description)}</p>  <!-- عرض أول 10 كلمات فقط -->
            <span>Genre: ${game.genre}</span>
            <span>Platform: ${game.platform}</span>
            <button class="details-btn" onclick="showGameDetails('${game.title}')">View Details</button>
        </div>
      `;
      container.innerHTML += gameCard;
    });
  }

  filterByGenre(genre) {
    return this.games.filter((game) => game.genre.includes(genre));
  }
}

// متغيرات API
const apiUrl = "https://free-to-play-games-database.p.rapidapi.com/api/games";
const apiKey = "16aa39a039msh2a4fcfdb23f0112p18b9cfjsn9627fef24cbf";

const gameManager = new GameManager(apiUrl, apiKey);

async function init() {
  await gameManager.fetchGames();
  gameManager.displayGames("game-container");
}

function filterGames(genre) {
  const filteredGames = gameManager.filterByGenre(genre);
  const container = document.getElementById("game-container");
  container.innerHTML = "";
  filteredGames.forEach((game) => {
    const gameCard = `
      <div class="game-card">
          <img src="${game.thumbnail}" alt="${game.title}" />
          <h3>${game.title}</h3>
          <p>${truncateDescription(game.description)}</p>  <!-- عرض أول 10 كلمات فقط -->
          <span>Genre: ${game.genre}</span>
          <span>Platform: ${game.platform}</span>
          <button class="details-btn" onclick="showGameDetails('${game.title}')">View Details</button>
      </div>
    `;
    container.innerHTML += gameCard;
  });
}

// عرض تفاصيل اللعبة
function showGameDetails(title) {
  const game = gameManager.games.find((game) => game.title === title);
  if (game) {
    // تحديث تفاصيل اللعبة
    document.getElementById("game-image").src = game.thumbnail;
    document.getElementById("game-title").innerText = game.title;
    document.getElementById("game-description").innerText = game.description;
    document.getElementById("game-genre").innerText = `Genre: ${game.genre}`;
    document.getElementById("game-platform").innerText = `Platform: ${game.platform}`;
    document.getElementById("rating-value").innerText = game.price; //
    document.getElementById("game-link").href = game.detailsLink; //  

    // إخفاء صفحة الألعاب الرئيسية وعرض تفاصيل اللعبة
    document.getElementById("navbar").style.display = "none";
    document.getElementById("game-container").style.display = "none";
    document.getElementById("game-detail-section").style.display = "block";
  }
}

// إغلاق تفاصيل اللعبة والعودة إلى الصفحة الرئيسية
function closeGameDetails() {
  document.getElementById("game-container").style.display = "block"; // إظهار صفحة الألعاب
  document.getElementById("game-detail-section").style.display = "none"; // إخفاء تفاصيل اللعبة
  document.getElementById("navbar").style.display = "block";

  // إعادة تهيئة تخطيط صفحة الألعاب بعد إغلاق التفاصيل
  const container = document.getElementById("game-container");
  // container.innerHTML = ""; // إفراغ المحتوى القديم
  gameManager.displayGames("game-container"); // إعادة عرض الألعاب
} 

// Initialize the app
init();

// إظهار وإخفاء القائمة عند الضغط على أيقونة الهامبورغر
const menuToggle = document.getElementById("menu-toggle");
const navLinks = document.getElementById("nav-links");

menuToggle.addEventListener("click", () => {
  
  navLinks.classList.toggle("active");
});
