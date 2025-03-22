function escapeHtml(text) {
    if (typeof text !== 'string') return text;
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function createDanceCard(dance) {
    const imageHtml = dance.media_url
        ? `<img src="${escapeHtml(dance.media_url)}" alt="${escapeHtml(dance.alttext)}">`
        : "<p>No Image Available</p>";

    const descriptionHtml = dance.description
        ? `<p class="danceDescription">${escapeHtml(dance.description)}</p>`
        : "<p class='danceDescription'>No description available</p>";

    const regionHtml = dance.region
        ? `<p class="danceRegion"><strong>Region:</strong> ${escapeHtml(dance.region)}</p>`
        : "<p class='danceRegion'><strong>Region:</strong> Unknown</p>";

    const categoryHtml = dance.category
        ? `<p class="danceCategory"><strong>Category:</strong> ${escapeHtml(dance.category)}</p>`
        : "<p class='danceCategory'><strong>Category:</strong> Uncategorized</p>";

    return `
    <div class="dance">
      <h3 class="danceName">${escapeHtml(dance.dance_name)}</h3>
      ${imageHtml}
      ${descriptionHtml}
      ${regionHtml}
      ${categoryHtml}
    </div>
  `;
}

function loadDances(region = null, category = null) {
    const danceContainer = document.getElementById("danceContainer");
    danceContainer.innerHTML = "<p>Loading dances...</p>"; // Show loading message

    const requestBody = JSON.stringify({ region, category });

    fetch("../src/api/fetch_dances.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: requestBody
    })
        .then(response => response.json())
        .then(data => {
            if (danceContainer.classList.contains("scrolling")) {
                // Create a wrapper for the dance cards if scrolling is enabled
                danceContainer.innerHTML = "<div class='dance-wrapper'></div>";
                const wrapper = danceContainer.querySelector(".dance-wrapper");

                if (data.length) {
                    data.forEach(dance => {
                        // Only show the dance name and image for scrolling cards
                        const danceCard = `
              <div class="dance">
                <h3 class="danceName">${escapeHtml(dance.dance_name)}</h3>
                ${
                            dance.media_url
                                ? `<img src="${escapeHtml(dance.media_url)}" alt="${escapeHtml(dance.alttext)}">`
                                : "<p>No Image Available</p>"
                        }
              </div>
            `;
                        wrapper.insertAdjacentHTML("beforeend", danceCard);
                    });
                } else {
                    wrapper.innerHTML = "<p>No dances found.</p>";
                }
            } else {
                // For non-scrolling pages, you can use the full dance card as needed
                danceContainer.innerHTML = "";
                if (data.length) {
                    data.forEach(dance => {
                        const danceCard = `
              <div class="dance">
                <h3 class="danceName">${escapeHtml(dance.dance_name)}</h3>
                ${
                            dance.media_url
                                ? `<img src="${escapeHtml(dance.media_url)}" alt="${escapeHtml(dance.alttext)}">`
                                : "<p>No Image Available</p>"
                        }
                ${dance.description ? `<p class="danceDescription">${escapeHtml(dance.description)}</p>` : "<p class='danceDescription'>No description available</p>"}
                ${dance.region ? `<p class="danceRegion"><strong>Region:</strong> ${escapeHtml(dance.region)}</p>` : "<p class='danceRegion'><strong>Region:</strong> Unknown</p>"}
                ${dance.category ? `<p class="danceCategory"><strong>Category:</strong> ${escapeHtml(dance.category)}</p>` : "<p class='danceCategory'><strong>Category:</strong> Uncategorized</p>"}
              </div>
            `;
                        danceContainer.insertAdjacentHTML("beforeend", danceCard);
                    });
                } else {
                    danceContainer.innerHTML = "<p>No dances found.</p>";
                }
            }
        })
        .catch(error => {
            console.error("Error fetching dances:", error);
            danceContainer.innerHTML = "<p>Error loading data.</p>";
        });
}

