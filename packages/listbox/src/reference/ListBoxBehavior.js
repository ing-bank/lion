/* eslint-disable */

/*
 *   This content is licensed according to the W3C Software License at
 *   https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
 */

export class ListboxBehavior {
  /**
   * @constructor
   *
   * @desc
   *  Listbox object representing the state and interactions for a listbox widget
   *
   * @param listboxNode
   *  The DOM node pointing to the listbox
   */
  constructor(listboxNode) {
    this.listboxNode = listboxNode;
    this.activeDescendant = this.listboxNode.getAttribute('aria-activedescendant');
    this.multiselectable = this.listboxNode.hasAttribute('aria-multiselectable');
    this.moveUpDownEnabled = false;
    this.siblingList = null;
    this.upButton = null;
    this.downButton = null;
    this.moveButton = null;
    this.keysSoFar = '';
    this.handleFocusChange = () => {};
    this.handleItemChange = (event, items) => {};
    this.registerEvents();
  }

  /**
   * @desc
   *  Register events for the listbox interactions
   */
  registerEvents() {
    this.listboxNode.addEventListener('focus', this.setupFocus.bind(this));
    this.listboxNode.addEventListener('keydown', this.checkKeyPress.bind(this));
    this.listboxNode.addEventListener('click', this.checkClickItem.bind(this));
  }

  /**
   * @desc
   *  If there is no activeDescendant, focus on the first option
   */
  setupFocus() {
    if (this.activeDescendant) {
      return;
    }

    this.focusFirstItem();
  }

  /**
   * @desc
   *  Focus on the first option
   */
  focusFirstItem() {
    const firstItem = this.listboxNode.querySelector('[role="option"]');

    if (firstItem) {
      this.focusItem(firstItem);
    }
  }

  /**
   * @desc
   *  Focus on the last option
   */
  focusLastItem() {
    const itemList = this.listboxNode.querySelectorAll('[role="option"]');

    if (itemList.length) {
      this.focusItem(itemList[itemList.length - 1]);
    }
  }

  /**
   * @desc
   *  Handle various keyboard controls; UP/DOWN will shift focus; SPACE selects
   *  an item.
   *
   * @param evt
   *  The keydown event object
   */
  checkKeyPress(evt) {
    const { key } = evt;
    let nextItem = this.listboxNode.querySelector(`#${this.activeDescendant}`);

    // TODO: // get info from context, no need for expensive queries every keypress
    const itemList = [].slice.call(this.listboxNode.querySelectorAll('[role="option"]'));
    const nextItemIndex = itemList.indexOf(nextItem);

    if (!nextItem) {
      return;
    }

    switch (key) {
      case 'PageUp':
      case 'PageDown':
        if (this.moveUpDownEnabled) {
          evt.preventDefault();

          if (key === 'PageUp') {
            this.moveUpItems();
          } else {
            this.moveDownItems();
          }
        }

        break;
      case 'ArrowUp':
      case 'ArrowDown':
        evt.preventDefault();

        if (this.moveUpDownEnabled && evt.altKey) {
          if (key === 'ArrowUp') {
            this.moveUpItems();
          } else {
            this.moveDownItems();
          }
          return;
        }

        if (key === 'ArrowUp') {
          nextItem = itemList[nextItemIndex - 1];
        } else {
          nextItem = itemList[nextItemIndex + 1];
        }

        if (nextItem) {
          this.focusItem(nextItem);
        }

        break;
      case 'Home':
        evt.preventDefault();
        this.focusFirstItem();
        break;
      case 'End':
        evt.preventDefault();
        this.focusLastItem();
        break;
      case ' ':
      case 'Spacebar':
        evt.preventDefault();
        this.toggleSelectItem(nextItem);
        break;
      case 'Backspace':
      case 'Delete':
      case 'Enter':
        if (!this.moveButton) {
          return;
        }

        const keyshortcuts = this.moveButton.getAttribute('aria-keyshortcuts');
        if (key === 'Enter' && keyshortcuts.indexOf('Enter') === -1) {
          return;
        }
        if ((key === 'Backspace' || key === 'Delete') && keyshortcuts.indexOf('Delete') === -1) {
          return;
        }

        evt.preventDefault();

        let nextUnselected = nextItem.nextElementSibling;
        while (nextUnselected) {
          if (nextUnselected.getAttribute('aria-selected') != 'true') {
            break;
          }
          nextUnselected = nextUnselected.nextElementSibling;
        }
        if (!nextUnselected) {
          nextUnselected = nextItem.previousElementSibling;
          while (nextUnselected) {
            if (nextUnselected.getAttribute('aria-selected') != 'true') {
              break;
            }
            nextUnselected = nextUnselected.previousElementSibling;
          }
        }

        this.moveItems();

        if (!this.activeDescendant && nextUnselected) {
          this.focusItem(nextUnselected);
        }
        break;
      default:
        const itemToFocus = this.findItemToFocus(key);
        if (itemToFocus) {
          this.focusItem(itemToFocus);
        }
        break;
    }
  }

  findItemToFocus(key) {
    const itemList = this.listboxNode.querySelectorAll('[role="option"]');
    const character = String.fromCharCode(key);

    if (!this.keysSoFar) {
      for (let i = 0; i < itemList.length; i += 1) {
        if (itemList[i].getAttribute('id') === this.activeDescendant) {
          this.searchIndex = i;
        }
      }
    }
    this.keysSoFar += character;
    this.clearKeysSoFarAfterDelay();

    let nextMatch = this.findMatchInRange(itemList, this.searchIndex + 1, itemList.length);
    if (!nextMatch) {
      nextMatch = this.findMatchInRange(itemList, 0, this.searchIndex);
    }
    return nextMatch;
  }

  clearKeysSoFarAfterDelay() {
    if (this.keyClear) {
      clearTimeout(this.keyClear);
      this.keyClear = null;
    }
    this.keyClear = setTimeout(
      function() {
        this.keysSoFar = '';
        this.keyClear = null;
      }.bind(this),
      500,
    );
  }

  findMatchInRange(list, startIndex, endIndex) {
    // Find the first item starting with the keysSoFar substring, searching in
    // the specified range of items
    for (let n = startIndex; n < endIndex; n += 1) {
      const label = list[n].innerText;
      if (label && label.toUpperCase().indexOf(this.keysSoFar) === 0) {
        return list[n];
      }
    }
    return null;
  }

  /**
   * @desc
   *  Check if an item is clicked on. If so, focus on it and select it.
   *
   * @param evt
   *  The click event object
   */
  checkClickItem(evt) {
    if (evt.target.getAttribute('role') === 'option') {
      this.focusItem(evt.target);
      this.toggleSelectItem(evt.target);
    }
  }

  /**
   * @desc
   *  Toggle the aria-selected value
   *
   * @param element
   *  The element to select
   */
  toggleSelectItem(element) {
    if (this.multiselectable) {
      element.setAttribute(
        'aria-selected',
        element.getAttribute('aria-selected') === 'true' ? 'false' : 'true',
      );

      if (this.moveButton) {
        if (this.listboxNode.querySelector('[aria-selected="true"]')) {
          this.moveButton.setAttribute('aria-disabled', 'false');
        } else {
          this.moveButton.setAttribute('aria-disabled', 'true');
        }
      }
    }
  }

  /**
   * @desc
   *  Defocus the specified item
   *
   * @param element
   *  The element to defocus
   */
  defocusItem(element) {
    if (!element) {
      return;
    }
    if (!this.multiselectable) {
      element.removeAttribute('aria-selected');
    }
    element.removeAttribute('focused');
  }

  /**
   * @desc
   *  Focus on the specified item
   *
   * @param element
   *  The element to focus
   */
  focusItem(element) {
    this.defocusItem(this.listboxNode.querySelector(`#${this.activeDescendant}`));
    if (!this.multiselectable) {
      element.setAttribute('aria-selected', 'true');
    }
    element.setAttribute('focused', '');
    this.listboxNode.setAttribute('aria-activedescendant', element.id);
    this.activeDescendant = element.id;

    if (this.listboxNode.scrollHeight > this.listboxNode.clientHeight) {
      const scrollBottom = this.listboxNode.clientHeight + this.listboxNode.scrollTop;
      const elementBottom = element.offsetTop + element.offsetHeight;
      if (elementBottom > scrollBottom) {
        this.listboxNode.scrollTop = elementBottom - this.listboxNode.clientHeight;
      } else if (element.offsetTop < this.listboxNode.scrollTop) {
        this.listboxNode.scrollTop = element.offsetTop;
      }
    }

    if (!this.multiselectable && this.moveButton) {
      this.moveButton.setAttribute('aria-disabled', false);
    }

    this.checkUpDownButtons();
    this.handleFocusChange(element);
  }

  /**
   * @desc
   *  Enable/disable the up/down arrows based on the activeDescendant.
   */
  checkUpDownButtons() {
    const activeElement = this.listboxNode.querySelector(`#${this.activeDescendant}`);

    if (!this.moveUpDownEnabled) {
      return false;
    }

    if (!activeElement) {
      this.upButton.setAttribute('aria-disabled', 'true');
      this.downButton.setAttribute('aria-disabled', 'true');
      return undefined;
    }

    if (this.upButton) {
      if (activeElement.previousElementSibling) {
        this.upButton.setAttribute('aria-disabled', false);
      } else {
        this.upButton.setAttribute('aria-disabled', 'true');
      }
    }

    if (this.downButton) {
      if (activeElement.nextElementSibling) {
        this.downButton.setAttribute('aria-disabled', false);
      } else {
        this.downButton.setAttribute('aria-disabled', 'true');
      }
    }
    return undefined;
  }

  /**
   * @desc
   *  Add the specified items to the listbox. Assumes items are valid options.
   *
   * @param items
   *  An array of items to add to the listbox
   */
  addItems(items) {
    if (!items || !items.length) {
      return false;
    }

    items.forEach(item => {
      this.defocusItem(item);
      this.toggleSelectItem(item);
      this.listboxNode.append(item);
    });

    if (!this.activeDescendant) {
      this.focusItem(items[0]);
    }

    this.handleItemChange('added', items);

    return undefined;
  }

  /**
   * @desc
   *  Remove all of the selected items from the listbox; Removes the focused items
   *  in a single select listbox and the items with aria-selected in a multi
   *  select listbox.
   *
   * @returns items
   *  An array of items that were removed from the listbox
   */
  deleteItems() {
    let itemsToDelete;

    if (this.multiselectable) {
      itemsToDelete = this.listboxNode.querySelectorAll('[aria-selected="true"]');
    } else if (this.activeDescendant) {
      itemsToDelete = [this.listboxNode.querySelector(`#${this.activeDescendant}`)];
    }

    if (!itemsToDelete || !itemsToDelete.length) {
      return [];
    }

    itemsToDelete.forEach(item => {
      item.remove();

      if (item.id === this.activeDescendant) {
        this.clearActiveDescendant();
      }
    });

    this.handleItemChange('removed', itemsToDelete);

    return itemsToDelete;
  }

  clearActiveDescendant() {
    this.activeDescendant = null;
    this.listboxNode.setAttribute('aria-activedescendant', null);

    if (this.moveButton) {
      this.moveButton.setAttribute('aria-disabled', 'true');
    }

    this.checkUpDownButtons();
  }

  /**
   * @desc
   *  Shifts the currently focused item up on the list. No shifting occurs if the
   *  item is already at the top of the list.
   */
  moveUpItems() {
    if (!this.activeDescendant) {
      return;
    }

    const currentItem = this.listboxNode.querySelector(`#${this.activeDescendant}`);
    const previousItem = currentItem.previousElementSibling;

    if (previousItem) {
      this.listboxNode.insertBefore(currentItem, previousItem);
      this.handleItemChange('moved_up', [currentItem]);
    }

    this.checkUpDownButtons();
  }

  /**
   * @desc
   *  Shifts the currently focused item down on the list. No shifting occurs if
   *  the item is already at the end of the list.
   */
  moveDownItems() {
    if (!this.activeDescendant) {
      return;
    }

    const currentItem = this.listboxNode.querySelector(`#${this.activeDescendant}`);
    const nextItem = currentItem.nextElementSibling;

    if (nextItem) {
      this.listboxNode.insertBefore(nextItem, currentItem);
      this.handleItemChange('moved_down', [currentItem]);
    }

    this.checkUpDownButtons();
  }

  /**
   * @desc
   *  Delete the currently selected items and add them to the sibling list.
   */
  moveItems() {
    if (!this.siblingList) {
      return;
    }

    const itemsToMove = this.deleteItems();
    this.siblingList.addItems(itemsToMove);
  }

  /**
   * @desc
   *  Enable Up/Down controls to shift items up and down.
   *
   * @param upButton
   *   Up button to trigger up shift
   *
   * @param downButton
   *   Down button to trigger down shift
   */
  enableMoveUpDown(upButton, downButton) {
    this.moveUpDownEnabled = true;
    this.upButton = upButton;
    this.downButton = downButton;
    upButton.addEventListener('click', this.moveUpItems.bind(this));
    downButton.addEventListener('click', this.moveDownItems.bind(this));
  }

  /**
   * @desc
   *  Enable Move controls. Moving removes selected items from the current
   *  list and adds them to the sibling list.
   *
   * @param button
   *   Move button to trigger delete
   *
   * @param siblingList
   *   Listbox to move items to
   */
  setupMove(button, siblingList) {
    this.siblingList = siblingList;
    this.moveButton = button;
    button.addEventListener('click', this.moveItems.bind(this));
  }

  setHandleItemChange(handlerFn) {
    this.handleItemChange = handlerFn;
  }

  setHandleFocusChange(focusChangeHandler) {
    this.handleFocusChange = focusChangeHandler;
  }
}
