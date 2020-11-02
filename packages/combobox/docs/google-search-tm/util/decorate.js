const map = new Map();

export class GlobalDecorator {
  /**
   * @param { CssResult[] } styles
   * @param { boolean } override
   */
  static decorateStyles(styles, { override = false }) {
    if (!override) {
      this.globalDecoratedStyles.push(styles);
    } else {
      this.globalDecoratedStylesOverrides.push(styles);
    }
  }

  /**
   * @param {HTMLElement} id a constructor id like 'my-button'
   * @param {function[]} mixins array of mixins that will be applied dynamically when the class
   * that uses the DecorateMixin is created. Please make sure mixins will be depuped beforehand
   */
  static addMixins(id, mixins) {
    map.set(id, mixins);
  }
}
GlobalDecorator.globalDecoratedStyles = [];
GlobalDecorator.globalDecoratedStylesOverrides = [];

function extendWithMixins(id, superClass) {
  const overrideMixins = map.get(id);
  if (Array.isArray(overrideMixins)) {
    const applyMixins = klass => {
      if (!overrideMixins.length) {
        return klass;
      }
      const nextMixin = overrideMixins.pop();
      return applyMixins(nextMixin(klass));
    };
    return applyMixins(superClass);
  }
  return superClass;
}

// TODO: dedupe
export const DecorateMixin = (id, superClass) => {
  // eslint-disable-next-line no-shadow
  class DecorateMixin extends extendWithMixins(id, superClass) {
    static decorateMembers(methodsMap) {
      Object.entries(methodsMap.members || []).forEach(([name, memberFactory]) => {
        this.__decorate.members.add([name, memberFactory]);
      });
      Object.entries(methodsMap.staticMembers || []).forEach(([name, memberFactory]) => {
        this.__decorate.staticMembers.add([name, memberFactory]);
      });
    }

    /**
     * Adds global styles
     * @param {CSSResult[]} originalStyles
     */
    static __addDecoratedStyles(originalStyles) {
      return [
        // Global reset/normalize css etc.
        // Base styling of a Design System that applies to every single component
        ...GlobalDecorator.globalDecoratedStyles,
        // Parent styles plus those handled via decorateStaticMembers
        ...(originalStyles || []),
        // Caution: use very wisely!
        // This is the equivalent of using "!important" in a global stylesheet in a page without
        // shadow dom. Only meant for 'power users' in control of a full application, who
        // understand the impact of using this.
        // Practical examples:
        // - production incident that should be solved timely
        // - developing a proof of concept and see the impact in a bigger scope
        // This section should always be considered a temporary solution: its usage should be
        // considered technical debt.
        ...GlobalDecorator.globalDecoratedStylesOverrides,
      ];
    }

    __initDecorations() {
      const ctor = this.constructor;
      const ns = ctor.__decorate;

      // Needed to retrigger LitElement
      delete ctor._styles;
      if (ns.restorableMembers.length) {
        ns.restorableMembers.forEach(({ name, descriptor, isTopProto, isStatic }) => {
          const proto = isStatic ? ctor : ctor.prototype;
          if (isTopProto) {
            Object.defineProperty(proto, name, descriptor);
          } else {
            delete proto[name];
          }
        });
        ns.restorableMembers = [];
      }

      // Everything that would normally be placed in the constructor:
      // setting configuration flags, enums etc.
      if (ns.init) {
        ns.init(this);
      }

      // Enhance members
      this.__decorateMembers(ns.members);
      // Static members will be added here (including styles)
      this.__decorateMembers(ns.staticMembers, true);

      // // Now add global styles as well
      // const originalStyles = ctor.styles;
      // Object.defineProperty(ctor, 'styles', {
      //   get: () => ctor.__addDecoratedStyles(originalStyles),
      //   configurable: true,
      // });
    }

    __decorateMembers(membersSet, isStatic) {
      const ns = this.constructor.__decorate;
      const self = isStatic ? this.constructor : this;
      const topProto = isStatic ? this.constructor : this.constructor.prototype;
      let proto = topProto;

      while (proto && membersSet.size) {
        const membersHandled = [];
        // eslint-disable-next-line no-loop-func
        membersSet.forEach(member => {
          const [name, factory] = member;
          const memberFactory = factory.bind(self);
          let superMember = self[name];
          if (superMember.bind) {
            superMember = superMember.bind(self);
          }
          const descriptor = Object.getOwnPropertyDescriptor(proto, name);
          if (descriptor) {
            if (descriptor.value) {
              topProto[name] = memberFactory({ superMember, self });
            } else {
              Object.defineProperty(topProto, name, {
                ...descriptor,
                get: () => memberFactory({ superMember, self }),
              });
              if (name === 'styles') {
                console.log('styles', self.styles);
              }
            }
            const isTopProto = proto === topProto;
            ns.restorableMembers.push({ name, descriptor, isTopProto, isStatic });
            membersHandled.push(member);
          }
        });
        // prevent searching for members already handled
        membersHandled.forEach(member => membersSet.delete(member));
        proto = Object.getPrototypeOf(proto);
      }
    }

    /**
     * @enhance UpdatingElement - add style and member decorations
     */
    initialize() {
      this.__initDecorations();

      super.initialize();
    }
  }
  DecorateMixin.__decorate = {
    members: new Set(),
    staticMembers: new Set(),
    restorableMembers: [],
  };
  return DecorateMixin;
};
