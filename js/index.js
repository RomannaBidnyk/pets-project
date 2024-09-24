fetch("https://api.thecatapi.com/v1/images/search")
  .then((response) => response.json())
  .then((data) => {
    let imagesData = JSON.parse(JSON.stringify(data));
    console.log(imagesData);
  })
  .catch((error) => {
    console.error("There was a problem with the fetch operation:", error);
  });
