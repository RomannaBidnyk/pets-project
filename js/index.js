const apiKey = "DEMO-API-KEY";
const baseUrl = "https://api.thecatapi.com";
const userId = "my-user-123456";

let currentImageId;

const catImageElement = document.getElementById("catImage");
const addFavoriteButton = document.getElementById("addFavoriteBtn");
const favoritesList = document.getElementById("favoritesList");

async function getCat() {
  try {
    const response = await fetch(
      `${baseUrl}/v1/images/search?has_breeds=true&order=RANDOM`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
        },
      }
    );

    const catData = await response.json();
    currentImageId = catData[0].id;
    const imageUrl = catData[0].url;

    catImageElement.src = imageUrl;
    catImageElement.style.display = "block";
    console.log("Selected Image ID:", currentImageId);

    await getAllFavorites();
  } catch (error) {
    console.error("Error fetching cat:", error);
  }
}

async function addToFavorites() {
  try {
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
      },
      body: JSON.stringify({
        image_id: currentImageId,
        sub_id: userId,
      }),
    };

    const response = await fetch(`${baseUrl}/v1/favourites`, requestOptions);
    const data = await response.json();
    console.log("Added to Favourites Success:", data);

    await getCat();

    await getAllFavorites();
  } catch (error) {
    console.error("Error adding to favourites:", error);
  }
}

async function getAllFavorites() {
  try {
    const response = await fetch(`${baseUrl}/v1/favourites?sub_id=${userId}`, {
      method: "GET",
      headers: {
        "x-api-key": apiKey,
      },
    });

    const data = await response.json();
    favoritesList.innerHTML = "";

    data.forEach((favorite) => {
      const favoriteItem = document.createElement("div");
      favoriteItem.className = "favorite-item";

      const img = document.createElement("img");
      img.src = favorite.image.url;
      img.alt = "Favorite Cat Image";

      const deleteBtn = document.createElement("button");
      deleteBtn.innerText = "Delete from Favorites";
      deleteBtn.className = "delete-btn";
      deleteBtn.addEventListener("click", async () => {
        await deleteFromFavorites(favorite.id);
      });

      favoriteItem.appendChild(img);
      favoriteItem.appendChild(deleteBtn);
      favoritesList.appendChild(favoriteItem);
    });
  } catch (error) {
    console.error("Error fetching favorites:", error);
  }
}

async function deleteFromFavorites(favoriteId) {
  try {
    const response = await fetch(`${baseUrl}/v1/favourites/${favoriteId}`, {
      method: "DELETE",
      headers: {
        "x-api-key": apiKey,
      },
    });

    if (response.ok) {
      console.log(`Deleted Favorite ID ${favoriteId} Successfully`);
      await getAllFavorites();
    } else {
      console.error(`Failed to delete Favorite ID ${favoriteId}`);
    }
  } catch (error) {
    console.error("Error deleting from favourites:", error);
  }
}

addFavoriteButton.addEventListener("click", async () => {
  try {
    await addToFavorites();
  } catch (error) {
    console.error("Error adding cat to favorites:", error);
  }
});

window.onload = getCat;
