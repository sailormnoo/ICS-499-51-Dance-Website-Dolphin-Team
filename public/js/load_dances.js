function escapeHtml(str) {
    if (!str) return "";
    return str.replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

document.addEventListener("DOMContentLoaded", function() {
    fetch("../src/api/fetch_dances.php")
        .then(response => response.json())
        .then(data => {
            const danceContainer = document.getElementById("danceContainer");
            danceContainer.innerHTML = ""; // Clear existing content

            if (data.length) {
                data.forEach(dance => {
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

                    let danceCard = `
                        <div class="dance">
                            <h3 class="danceName">${escapeHtml(dance.dance_name)}</h3>
                            ${imageHtml}
                            ${descriptionHtml}
                            ${regionHtml}
                            ${categoryHtml}
                        </div>
                    `;
                    danceContainer.insertAdjacentHTML("beforeend", danceCard);
                });
            } else {
                danceContainer.innerHTML = "<p>No dances found.</p>";
            }
        })
        .catch(() => {
            document.getElementById("danceContainer").innerHTML = "<p>Error loading data.</p>";
        });
});

