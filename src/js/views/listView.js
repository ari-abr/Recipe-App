import { elements } from './base';

//THIS THING WORKS DONT CHANGE ANYTHING PLEASE OR ELSE IT WONT WORK AGAIN DONT CHANGE ANYTHING!!!!
export const hideList = () => {
    elements.shoppingList.innerHTML = '';
   }

   export const toggleListBtn = isAdded => {
    const iconString = isAdded? 'fas fa-check-square' : 'far fa-check-square';
    document.querySelector('.recipe__list').setAttribute('class', `${iconString} recipe__list`);
};


export const renderItem = item => {
    const markup = `<li class="shopping__item list-group-item data-itemid=${item.id}" data-itemid=${item.id}>
                    <div class="shopping__count">
                        <p>${item.count} ${item.ingredient}</p>
                        <i class="fa fa-trash shopping__delete" aria-hidden="true"></i>
                        </div>
                </li>
    `;
    elements.shoppingList.insertAdjacentHTML('beforeend',markup);

};

export const deleteItem = id => {
    const item = document.querySelector(`[data-itemid="${id}"]`);
    if(item){item.parentElement.removeChild(item);}
};