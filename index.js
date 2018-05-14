'use strict';
/* eslint-env jquery */

const STORE = {
  items: [
    {name: 'apples', checked: false},
    {name: 'oranges', checked: false},
    {name: 'milk', checked: true},
    {name: 'bread', checked: false}
  ]
};


function generateItemElement(item, itemIndex, template) {
  return `
    <li class="js-item-index-element ${item.class}" data-item-index="${itemIndex}">
      <span class="shopping-item js-shopping-item ${item.checked ? 'shopping-item__checked' : ''}" >${item.name}</span>
      <input class="shopping-item-edit-input js-shopping-item-edit-input" type="text" value="${item.name}"></input>
      <div class="shopping-item-controls js-shopping-items-controls">
        <button class="shopping-item-toggle js-item-toggle">
            <span class="button-label">check</span>
        </button>
        <button class="shopping-item-delete js-item-delete">
            <span class="button-label">delete</span>
        </button>
        <button class="shopping-item-edit js-item-edit">
            <span class="button-label">edit</span>
        </button>
      </div>
    </li>`;
}


function generateShoppingItemsString(shoppingList) {
  console.log('Generating shopping list element');
  const items = shoppingList.map((item, index) => generateItemElement(item, index));
  return items.join('');
}


function renderShoppingList() {
  // render the shopping list in the DOM
  const items = (STORE.displayItems) ? [...STORE.displayItems] : [...STORE.items] ;
  console.log('`renderShoppingList` ran');
  const shoppingListItemsString = generateShoppingItemsString(items);
  // insert that HTML into the DOM
  $('.js-shopping-list').html(shoppingListItemsString);
}


function addItemToShoppingList(itemName) {
  console.log(`Adding "${itemName}" to shopping list`);
  STORE.items.push({name: itemName, checked: false});
}


function handleNewItemSubmit() {
  $('#js-shopping-list-form').submit(function(event) {
    event.preventDefault();
    console.log('`handleNewItemSubmit` ran');
    const newItemName = $('.js-shopping-list-entry').val();
    $('.js-shopping-list-entry').val('');
    addItemToShoppingList(newItemName);
    renderShoppingList();
  });
}


function toggleCheckedForListItem(itemIndex) {
  console.log('Toggling checked property for item at index ' + itemIndex);
  STORE.items[itemIndex].checked = !STORE.items[itemIndex].checked;
}


function searchForItem(searchItem) {
  console.log(`\`searchItem ran\`,  Searching for ${searchItem}`);
  let found = {};
  for (let i=0; i < STORE.items.length; i++) {
    let match = STORE.items[i];
    if (searchItem === match.name) {
      console.log('Found '+ match.name);
      found = match;
    }
  }
  STORE.displayItems = STORE.items.filter(function(itm) {
    return itm.name === searchItem;
  });
}

function handleSearchItemSubmit() {
  console.log('`handleSearchItemSubmit` ran');
  $('#js-search-form').submit(function(event) {
    event.preventDefault();
    console.log('`handleSearchItemSubmit` ran');
    const searchItem = $('.js-search-entry').val();
    searchForItem(searchItem);
    renderShoppingList();
  });
}

// Hide checked items
function hideCheckedItems() {
  console.log('`hideCheckedItems` ran ');
  for (let i=0;i<STORE.items.length;i++) {
    // if store items are not checked 
    if (STORE.items[i].checked) {
      let checkedItems = STORE.items[i];
      console.log('Hiding: '+ checkedItems.name);
      // add class hidden to object
      STORE.items[i].class = 'hidden';
    } else {
      STORE.items[i].class = '';
    }
  }
}

// Show all items
function showAllItems() {
  console.log('`showAllItems` ran ');
  for (let i=0;i<STORE.items.length;i++) {
    // if store items are not checked 
    if (STORE.items[i].checked || !STORE.items[i].checked ) {
      let allItems = STORE.items[i];
      console.log('Showing: '+ allItems.name);
      // add class hidden to object
      STORE.items[i].class = '';
    }
  }
}


// Handle checked item view - when button is clicked get the items 
function handleCheckedItemView() {
  console.log('`handleCheckedItemView` ran');
  $('.js-show-checked-items-toggle').on('click', event => {
    let buttonText = $('.show-checked-items .button-label');
    if (buttonText.text() === 'Hide checked items') {
      hideCheckedItems();
      buttonText.text('Show all items');
    } else {
      showAllItems();
      buttonText.text('Hide checked items');
    }
    renderShoppingList();
  });
}


function handleEditItemClicked() {
  console.log('`handleEditItemClicked` ran');
  $('.js-shopping-list').on('click', '.js-item-edit', event => {
    const itemIndex = getItemIndexFromElement(event.currentTarget);
    const listIndex = $(`li[data-item-index='${itemIndex}']`);
    let buttonText = $(listIndex).find('.js-item-edit .button-label');
    //console.log(`Button text: ${buttonText.text()}` );
    if (buttonText.text() === 'edit') {
      editListItem(itemIndex);
      buttonText.text('save');
    } else if (buttonText.text() === 'save'){
      saveListItem(itemIndex, listIndex);
      buttonText.text('edit');
    }
  });
}


function editListItem(itemIndex) {
  console.log('`editListItemClicked` ran');
  console.log('Editing list item at index ' + itemIndex);
  const listIndex = $(`li[data-item-index='${itemIndex}']`);
  console.log(listIndex);

  
  //let newName = ($(listIndex).find('.js-shopping-item-edit-input').val());

  // console.log('new name: ' + newName);
  //span js-shopping-item: hidden
  $(listIndex).find('.js-shopping-item').hide();
  // input shopping-item-edit show
  $(listIndex).find('.js-shopping-item-edit-input').show();

  return listIndex;
}

function saveListItem(itemIndex, listIndex) {
  console.log(itemIndex);
  console.log('`saveListItemClicked` ran');
  let newName = $(itemIndex).find('.js-shopping-item-edit-input').val();
  console.log('Saving new name: '+ newName + ' for list item at index ' + itemIndex);
  // input shopping-item-edit hide
  $('.js-shopping-item-edit-input').hide();
  //span js-shopping-item show
  $('.js-shopping-item').show();

  //console.log('new name: ' + newName);
  // update STORE.name using Object.assign()
  // ... something like ...
  // return STORE.items[itemIndex].assign(STORE.items[itemIndex].name, newName);

}


function removeListItem(itemIndex) {
  console.log('Removing item at index ' + itemIndex);
  STORE.items.splice(itemIndex, 1);
}


function getItemIndexFromElement(item) {
  console.log('get item index from element ' +item);
  const itemIndexString = $(item)
    .closest('.js-item-index-element')
    .attr('data-item-index');
  console.log('Item index : ' +itemIndexString);
  return parseInt(itemIndexString, 10);
}


function handleItemCheckClicked() {
  $('.js-shopping-list').on('click', '.js-item-toggle', event => {
    console.log('`handleItemCheckClicked` ran');
    const itemIndex = getItemIndexFromElement(event.currentTarget);
    toggleCheckedForListItem(itemIndex);
    renderShoppingList();
  });
}


function handleDeleteItemClicked() {
  // this function will be responsible for when users want to delete a shopping list
  // item
  $('.js-shopping-list').on('click', '.js-item-delete', event => {
    console.log('`handleDeleteItemClicked` ran');
    const itemIndex = getItemIndexFromElement(event.currentTarget);
    removeListItem(itemIndex);
    renderShoppingList();
  });
}


// this function will be our callback when the page loads. it's responsible for
// initially rendering the shopping list, and activating our individual functions
// that handle new item submission and user clicks on the "check" and "delete" buttons
// for individual shopping list items.
function handleShoppingList() {
  renderShoppingList();
  handleNewItemSubmit();
  handleSearchItemSubmit();
  handleItemCheckClicked();
  handleCheckedItemView();
  handleEditItemClicked();
  handleDeleteItemClicked();
}

// when the page loads, call `handleShoppingList`
$(handleShoppingList);

