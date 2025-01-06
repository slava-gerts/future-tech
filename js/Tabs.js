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
    this.maxTabIndex = this.buttons.length - 1

    this.state = this.getProxyState({
      activeTabIndex: [...this.buttons]
        .findIndex(button => button.classList.contains(this.stateClasses.isActive)),
    })

    this.bindEvents()
  }

  getProxyState = (initialState) => {
    return new Proxy(initialState, {
      get: (target, prop) => {
        return target[prop]
      },
      set: (target, prop, value) => {
        target[prop] = value

        this.updateUI()

        return true
      }
    })
  }

  updateUI() {
    const { activeTabIndex } = this.state

    this.buttons.forEach((button, i) => {
      const isActive = i === activeTabIndex

      button.classList.toggle(this.stateClasses.isActive, isActive)
      button.setAttribute(this.stateAttributes.ariaSelected, isActive.toString())
      button.setAttribute(this.stateAttributes.tabIndex, isActive ? '0' : '-1')

      this.contents[i].classList.toggle(this.stateClasses.isActive, isActive)
    })
  }

  activateTab(tabIndex) {
    this.state.activeTabIndex = tabIndex
    this.buttons[tabIndex].focus()
  }

  previousTab = () => {
    const newTabIndex = this.state.activeTabIndex === 0 ?
      this.maxTabIndex :
      this.state.activeTabIndex - 1

    this.activateTab(newTabIndex)
  }

  nextTab = () => {
    const newTabIndex = this.state.activeTabIndex === this.maxTabIndex ?
      0 :
      this.state.activeTabIndex + 1

    this.activateTab(newTabIndex)
  }

  firstTab = () => {
    this.activateTab(0)
  }

  lastTab = () => {
    this.activateTab(this.maxTabIndex)
  }

  onButtonClick(buttonIndex) {
    this.state.activeTabIndex = buttonIndex
  }

  onKeyDown = (event) => {
    const {code, metaKey} = event

    let actionCode = code
    if (metaKey && code === 'ArrowLeft') {
      actionCode = 'MacHome'
    }
    if (metaKey && code === 'ArrowRight') {
      actionCode = 'MacEnd'
    }

    const action = {
      ArrowLeft: this.previousTab,
      ArrowRight: this.nextTab,
      Home: this.firstTab,
      End: this.lastTab,
      MacHome: this.firstTab,
      MacEnd: this.lastTab,
    }[actionCode]

    action?.()
  }

  bindEvents() {
    this.buttons.forEach((button, i) => {
      button.addEventListener('click', () => this.onButtonClick(i))
    })
    this.rootElement.addEventListener('keydown', this.onKeyDown)
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