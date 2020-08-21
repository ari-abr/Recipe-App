import { elements } from './base';

export const toggleLikeBtn = (isLiked) => {
  const iconString = isLiked ? 'fa fa-heart' : 'fa fa-heart-o';
  document
    .querySelector('.recipe__love')
    .setAttribute('class', `${iconString} recipe__love`);
};

export const toggleLikeMenu = (numLikes) => {
  elements.likesMenu.style.visibility = numLikes > 0 ? 'visible' : 'hidden';
};

export const hideLikes = () => {
  elements.likesList.innerHTML = '';
};

export const renderLike = (like) => {
  const markup = `
    <li class="list-group-item likes__item" data-likeid=${like.id}>
    <div>
                        <a class="likes__link" href="#${like.id}">
                            <figure class="likes__fig">
                                <img src="${like.img}" alt="${like.title}">
                            </figure>
                            <div class="likes__data">
                                <h6 class="likes__name h6">${like.title}</h6>
                                <p class="likes__author">${like.author}</p>
                            </div>
                        </a>
                        <i class="fa fa-trash likes__delete" aria-hidden="true"></i>
                        </div>
                    </li>
    `;
  elements.likesList.insertAdjacentHTML('beforeend', markup);
};

export const deleteLike = (id) => {
  var id = id;
  const item = document.querySelector(`[data-likeid="${id}"]`);
  if (item) {
    item.parentElement.removeChild(item);
  }
};
