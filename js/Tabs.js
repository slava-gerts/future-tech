const rootSelector = '[data-js-tabs]'

class Tabs {
  selectors = {
    root: rootSelector,
    button: '[data-js-tabs-button]',
    content: '[data-js-tabs-content]',
  }

  stateClasses = {
    isActive: 'is-active',
  }

  stateAttributes = {
    ariaSelected: 'aria-selected',
    tabIndex: 'tabindex',
  }

  constructor(rootElement) {
    this.rootElement = rootElement
    this.buttons = this.rootElement.querySelectorAll(this.selectors.button)
    this.contents = this.rootElement.querySelectorAll(this.selectors.content)

    this.state = {
      activeTabIndex: [...this.buttons]
        .findIndex(button => button.classList.contains(this.stateClasses.isActive)),
      maxTabIndex: this.buttons.length - 1,
    }

    this.bindEvents()
  }

  updateUI() {
    const { activeTabIndex } = this.state

    this.buttons.forEach((button, i) => {
      const isActive = i === activeTabIndex

      button.classList.toggle(this.stateClasses.isActive, isActive)
      this.contents[i].classList.toggle(this.stateClasses.isActive, isActive)
    })
  }

  onButtonClick(buttonIndex) {
    this.state.activeTabIndex = buttonIndex
    this.updateUI()
  }

  bindEvents() {
    this.buttons.forEach((button, i) => {
      button.addEventListener('click', () => this.onButtonClick(i))
    })
  }
}

class TabsCollection {
  constructor () {
    this.init()
  }

  init () {
    document.querySelectorAll(rootSelector).forEach(elem => new Tabs(elem))
  }
}

export default TabsCollection;