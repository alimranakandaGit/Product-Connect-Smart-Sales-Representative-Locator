// Fetch data from JSON file
fetch('data.json')
  .then(response => response.json())
  .then(data => {
    window.csvData = data;  // Store data globally
  })
  .catch(error => console.error('Error loading JSON data:', error));

// Display suggestions
const searchInput = document.getElementById('searchInput');
searchInput.addEventListener('input', function () {
  const query = this.value.toLowerCase();
  const suggestions = document.getElementById('suggestions');
  suggestions.innerHTML = '';

  if (query) {
    const matches = window.csvData.filter(row =>
      row.some(cell => cell.toLowerCase().includes(query))
    );
    matches.slice(0, 10).forEach(match => {
      const suggestion = document.createElement('div');
      suggestion.className = 'suggestion';
      suggestion.textContent = `${match[1]} (${match[0]}) - ${match[3]}`;
      suggestion.onclick = () => {
        searchInput.value = match[3];
        suggestions.innerHTML = '';
      };
      suggestions.appendChild(suggestion);
    });
  }
});

// Enable "Enter" key to trigger search
searchInput.addEventListener('keydown', function (event) {
  if (event.key === 'Enter') {
    searchData();
  }
});

// Search and display results
function searchData() {
  const query = searchInput.value.toLowerCase();
  const results = window.csvData.filter(row =>
    row.some(cell =>
      cell.split(',').some(part => part.toLowerCase().includes(query))
    )
  );

  const resultsContainer = document.getElementById('results');
  resultsContainer.innerHTML = '';
  if (results.length) {
    results.forEach(row => {
      const area = formatArea(row[0]);

      const resultItem = document.createElement('div');
      resultItem.className = 'result-item';
      resultItem.innerHTML = `
        <strong>${row[1]}</strong>
        <span>${row[2]}</span>
        <span>${area} Zone</span>
        <span>MEWL, MEL Group</span>
        <span>+88${row[3]}</span>
        <button onclick="copyText(event, this)">Copy</button>
      `;
      resultsContainer.appendChild(resultItem);
    });
  } else {
    resultsContainer.innerHTML = '<div class="no-results">No results found.</div>';
  }
}

// Format area names with spaces and '&'
function formatArea(areaString) {
  const areas = areaString.split(',');
  
  if (areas.length === 2) {
    return areas.join(' & ');
  } else if (areas.length > 2) {
    const lastArea = areas.pop();
    return areas.join(', ') + ' & ' + lastArea;
  }
  
  return areas[0];
}

// Copy text to clipboard
function copyText(event, button) {
  const resultItem = button.parentElement;
  const textToCopy = resultItem.innerText.replace("Copy", "").trim();
  
  const textArea = document.createElement('textarea');
  textArea.value = textToCopy;
  document.body.appendChild(textArea);
  textArea.select();
  document.execCommand('copy');
  document.body.removeChild(textArea);
  alert('Copied to clipboard!');
}
