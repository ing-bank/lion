class DemoDesignRegistry {
  _designs = [];

  getSets() {
    return Array.from(new Set(this._designs.map(([, set]) => set)));
  }

  getSetsForCtor(ctorToLookFor) {
    return this._designs.filter(([ctor]) => ctor === ctorToLookFor).map(([, set]) => set);
  }

  /**
   * Changes look and feel of full page (note we don't suport instance level yet)
   */
  activateSetGlobally(setToLookFor) {
    const filteredCtors = this._designs.filter(([, set]) => set === setToLookFor);
    for (const [ctor, , designObj] of filteredCtors) {
      ctor.provideDesign(designObj);
    }
  }

  activateSetForInstance(setToLookFor, instance) {
    const ctor = instance.constructor;
    const designFound = this._designs.find(
      ([ctorPrev, setPrev]) => ctor === ctorPrev && setToLookFor === setPrev,
    );
    instance.provideDesign(designFound[2]);
  }

  registerDesign({ ctor, set, designObj }) {
    const designFound = this._designs.find(
      ([ctorPrev, setPrev]) => ctor === ctorPrev && set === setPrev,
    );
    if (designFound) {
      throw new Error(
        `[DemoDesignRegistry] Design for ${ctor.name} with name ${set} already registered`,
      );
    }
    this._designs.push([ctor, set, designObj]);
  }
}

export const demoDesignRegistry = new DemoDesignRegistry();
