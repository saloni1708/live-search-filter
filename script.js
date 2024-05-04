const searchInput = document.getElementById("searchInput");
const resultContainer = document.getElementById("resultContainer");

const API_KEY = "96e16ab1b4e648318094847a4f286235"; // Replace with your NewsAPI API key
const PAGE_SIZE = 50; // Number of articles to show

let articles = [];

// Function to fetch top news articles from NewsAPI
async function fetchTopNewsArticles() {
  const response = await fetch(
    `https://newsapi.org/v2/top-headlines?country=us&pageSize=${PAGE_SIZE}&apiKey=${API_KEY}`
  );
  const data = await response.json();
  return data.articles;
}

// Function to fetch news articles from NewsAPI
async function fetchNewsArticles(query) {
  const response = await fetch(
    `https://newsapi.org/v2/everything?q=${query}&language=en&pageSize=${PAGE_SIZE}&apiKey=${API_KEY}`
  );
  const data = await response.json();
  return data.articles;
}

// Function to filter and display search results
async function filterResults(query = "") {
  const searchTerm = query.trim().toLowerCase();
  resultContainer.innerHTML = "";

  if (searchTerm) {
    articles = await fetchNewsArticles(searchTerm);
  } else {
    articles = await fetchTopNewsArticles();
  }

  if (articles.length > 0) {
    articles.forEach((article) => {
      const cardCol = document.createElement("div");
      cardCol.classList.add("col-md-4", "mb-4");

      const card = document.createElement("div");
      card.classList.add("card", "h-100");
      card.addEventListener("click", () => {
        window.open(article.url, "_blank");
      });

      const imgContainer = document.createElement("div");
      imgContainer.classList.add("ratio", "ratio-16x9");

      const cardImg = document.createElement("img");
      cardImg.classList.add("card-img-top");
      cardImg.src =
        article.urlToImage ||
        "https://via.placeholder.com/350x200?text=No+Image";
      cardImg.alt = article.title;

      imgContainer.appendChild(cardImg);
      card.appendChild(imgContainer);

      const cardBody = document.createElement("div");
      cardBody.classList.add("card-body");

      const cardTitle = document.createElement("h5");
      cardTitle.classList.add("card-title");
      cardTitle.textContent = article.title;

      cardBody.appendChild(cardTitle);
      card.appendChild(cardBody);

      cardCol.appendChild(card);
      resultContainer.appendChild(cardCol);
    });
  } else {
    const noResultsCol = document.createElement("div");
    noResultsCol.classList.add("col-12");

    const noResultsCard = document.createElement("div");
    noResultsCard.classList.add("card", "text-center");

    const noResultsBody = document.createElement("div");
    noResultsBody.classList.add("card-body");

    const noResultsText = document.createElement("p");
    noResultsText.classList.add("card-text", "text-muted");
    noResultsText.textContent = "No news articles found.";

    noResultsBody.appendChild(noResultsText);
    noResultsCard.appendChild(noResultsBody);
    noResultsCol.appendChild(noResultsCard);
    resultContainer.appendChild(noResultsCol);
  }
}

// Event listener for input change
searchInput.addEventListener("input", () => filterResults(searchInput.value));

// Load initial top 50 news articles
filterResults();

document.addEventListener("scroll", () => {
  let box = document.querySelector(".top-box");
  if (scrollY > 50) {
    box.classList.add("scrolled");
  } else {
    box.classList.remove("scrolled");
  }
});
