const searchBox = document.getElementById('search-box');
const resultsList = document.getElementById('results-list');
const searchContainer = document.getElementById('search-container');
const contentContainer = document.getElementById('content-container');
const articleTitle = document.getElementById('article-title');
const articleContent = document.getElementById('article-content');
const reviewAllBtn = document.getElementById('review-all-btn');
const reviewContainer = document.getElementById('review-container');

let selectedIndex = -1;

/**
 * @function displayResults
 * @description Displays the search results in the results list.
 * @param {Array} results - The search results to display.
 */
function displayResults(results) {
    resultsList.innerHTML = '';
    results.forEach((result, index) => {
        const li = document.createElement('li');
        li.textContent = result.title;
        li.addEventListener('click', () => {
            showArticle(result);
        });
        resultsList.appendChild(li);
    });
    selectedIndex = -1;
}

/**
 * @function showAllArticles
 * @description Displays all articles for review.
 */
function showAllArticles() {
    searchContainer.classList.add('hidden');
    reviewContainer.classList.remove('hidden');
    reviewContainer.innerHTML = '';

    const shuffledArticles = [...articles].sort(() => Math.random() - 0.5);

    shuffledArticles.forEach(article => {
        const articleDiv = document.createElement('div');
        articleDiv.classList.add('article');

        const title = document.createElement('h1');
        title.textContent = article.title;

        const content = document.createElement('div');
        content.textContent = article.content;

        articleDiv.appendChild(title);
        articleDiv.appendChild(content);
        reviewContainer.appendChild(articleDiv);
    });
}

/**
 * @function showArticle
 * @description Shows the selected article.
 * @param {object} article - The article to show.
 */
function showArticle(article) {
    searchContainer.classList.add('hidden');
    contentContainer.classList.remove('hidden');
    articleTitle.textContent = article.title;
    articleContent.textContent = article.content;
}

/**
 * @function hideArticle
 * @description Hides the article and shows the search container.
 */
function hideArticle() {
    contentContainer.classList.add('hidden');
    reviewContainer.classList.add('hidden');
    searchContainer.classList.remove('hidden');
    // Ensure the search box is focusable before setting focus.
    requestAnimationFrame(() => {
        searchBox.focus();
    });
}

/**
 * @function updateSelection
 * @description Updates the selected item in the results list.
 */
function updateSelection() {
    const items = resultsList.getElementsByTagName('li');
    for (let i = 0; i < items.length; i++) {
        if (i === selectedIndex) {
            items[i].classList.add('selected');
        } else {
            items[i].classList.remove('selected');
        }
    }
}

reviewAllBtn.addEventListener('click', showAllArticles);

searchBox.addEventListener('input', () => {
    const searchTerm = searchBox.value.toLowerCase();
    if (searchTerm === '') {
        resultsList.innerHTML = '';
        return;
    }
    const results = articles.filter(article => article.title.toLowerCase().includes(searchTerm));
    displayResults(results);
});

searchBox.addEventListener('keydown', (e) => {
    const items = resultsList.getElementsByTagName('li');
    if (e.key === 'ArrowDown') {
        if (selectedIndex < items.length - 1) {
            selectedIndex++;
            updateSelection();
        }
    } else if (e.key === 'ArrowUp') {
        if (selectedIndex > 0) {
            selectedIndex--;
            updateSelection();
        }
    } else if (e.key === 'Enter') {
        if (selectedIndex > -1) {
            const searchTerm = searchBox.value.toLowerCase();
            const results = articles.filter(article => article.title.toLowerCase().includes(searchTerm));
            showArticle(results[selectedIndex]);
        }
    }
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Backspace' && (!contentContainer.classList.contains('hidden') || !reviewContainer.classList.contains('hidden'))) {
        hideArticle();
    }
});

searchBox.addEventListener('blur', () => {
    // If the search box loses focus while on the search page (e.g., by clicking the background),
    // this will refocus it. The timeout prevents an infinite loop and allows clicks
    // on search results to be processed correctly before the check.
    setTimeout(() => {
        if (contentContainer.classList.contains('hidden') && reviewContainer.classList.contains('hidden')) {
            searchBox.focus();
        }
    }, 0);
});

// Set focus to the search box on initial load
searchBox.focus();