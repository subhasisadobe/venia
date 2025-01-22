import { createOptimizedPicture } from '../../scripts/aem.js';

export default async function decorate(block) {
  const response = await fetch("/query-index.json");
  const json = await response.json();
  const carouselData = json.data.filter(item => item.path.includes("/card-carousel"));
  console.log(block);
  console.log(carouselData);

  /* change to ul, li */
  const ul = document.createElement('ul');
  // [...block.children].forEach((row) => {
  //   const li = document.createElement('li');
  //   while (row.firstElementChild) li.append(row.firstElementChild);
  //   [...li.children].forEach((div) => {
  //     if (div.children.length === 1 && div.querySelector('picture')) div.className = 'cards-card-image';
  //     else div.className = 'cards-card-body';
  //   });
  //   ul.append(li);
  // });
  // ul.querySelectorAll('picture > img').forEach((img) => img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }])));
  // block.textContent = '';
  // 2. Loop over each item to construct <li> and its children
  carouselData.forEach(item => {
    // Create <li>
    const li = document.createElement('li');

    // --- Create the "cards-card-image" div ---
    const divCardImage = document.createElement('div');
    divCardImage.classList.add('cards-card-image');

    // picture > source + img
    const picture = document.createElement('picture');

    const source = document.createElement('source');
    source.type = 'image/jpg';
    source.srcset = item.image;
    picture.appendChild(source);

    const img = document.createElement('img');
    img.loading = 'lazy';
    img.alt = '';          // or put a meaningful alt text
    img.src = item.image;
    picture.appendChild(img);

    divCardImage.appendChild(picture);

    // --- Create the "cards-card-body" div ---
    const divCardBody = document.createElement('div');
    divCardBody.classList.add('cards-card-body');

    // p containing "title<br>price"
    const pText = document.createElement('p');
    // Use innerHTML for the <br/> or build separate elements
    pText.innerHTML = `${item.title}<br>${item.price}`;

    // p containing link button
    const pButton = document.createElement('p');
    pButton.classList.add('button-container');

    const a = document.createElement('a');
    a.href = item.url;
    a.title = 'Add To Cart';
    a.classList.add('button');
    a.textContent = 'Add To Cart';

    pButton.appendChild(a);

    // Append all children into the card body
    divCardBody.appendChild(pText);
    divCardBody.appendChild(pButton);

    // Put the image div and body div into the <li>
    li.appendChild(divCardImage);
    li.appendChild(divCardBody);

    // Finally, append <li> to <ul>
    ul.appendChild(li);
  });
  block.append(ul);
  addCardSliderButtons(block);
}


function addCardSliderButtons(block) {
  setTimeout(() => {
    const computedMarginRight = getComputedStyle(block.children[0].children[0]).marginRight;
    const computedMinWidth = getComputedStyle(block.children[0].children[0]).minWidth;
    const totalItems = block.children[0].children.length;
    const itemShowPerSlide = 100 / parseInt(computedMinWidth, 10);
    const totalSlides = Math.ceil(totalItems / itemShowPerSlide);
    const slideLength = parseInt(computedMinWidth, 10) * itemShowPerSlide;

    // 2. CREATE THE DOT LABELS
    // -------------------------
    // Optional: a container div for the dot labels
    const dotsContainer = document.createElement("div");
    dotsContainer.id = "dotsContainer";
    dotsContainer.classList.add("dots"); // example class if you want to style them

    for (let i = 1; i <= totalSlides; i++) {
      const dotLabel = document.createElement("label");
      if (i === 1) dotLabel.style.backgroundColor = "#333";
      dotLabel.addEventListener("click", () => {
        let activeIndex = i;

        document.querySelector(".card-slider>ul").style.transform = `translateX(-${(slideLength * (i - 1))}%)`;
        document.querySelectorAll(".dots label").forEach(elem => elem.style.backgroundColor = "#ddd");
        dotLabel.style.backgroundColor = i === activeIndex ? "#333" : "";
      })
      // Link each label to the corresponding radio input
      dotLabel.setAttribute("for", `slide${i}`);
      dotsContainer.appendChild(dotLabel);
    }

    // Append the container (with the 3 radio inputs) to the body
    return block.appendChild(dotsContainer);
  }, 1000);
}