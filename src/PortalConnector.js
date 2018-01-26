import omit from './omit';

export default class PortalConnector {
  constructor() {
    this.nextId = 1;
    this.targetsByName = {};
    this.targetsByChildId = {};

    const methodNames = [
      'registerTarget',
      'removeTarget',
      'addChild',
      'updateChild',
      'removeChild'
    ];
    methodNames.forEach(name => {
      this[name] = this[name].bind(this);
    });
  }

  registerTarget(name, portalTarget) {
    if (this.targetsByName[name]) {
      throw Error(`Portal with name ${name} already existing.`);
    }
    this.targetsByName[name] = {
      targetInstance: portalTarget,
      childrenById: {}
    };
  }

  removeTarget(name) {
    delete this.targetsByName[name];
  }

  addChild(targetName, child) {
    const id = `portalId${this.nextId++}`;
    const target = this.targetsByName[targetName];
    if (!target) throw new Error(`No target with name ${targetName} found.`);
    this.targetsByChildId[id] = target;
    if (!child) return id;
    target.childrenById[id] = child;
    target.targetInstance.updateChildren(Object.values(target.childrenById));
    return id;
  }

  updateChild(id, child) {
    const target = this.targetsByChildId[id];
    if (!target) throw new Error(`No target with id ${id} found.`);
    if (!child && !target.childrenById[id]) return;
    if (!child) {
      target.childrenById = omit(target.childrenById, id);
    } else {
      target.childrenById[id] = child;
    }
    target.targetInstance.updateChildren(Object.values(target.childrenById));
  }

  removeChild(id) {
    const target = this.targetsByChildId[id];
    if (!target) throw new Error(`No target with id ${id} found.`);
    delete this.targetsByChildId[id];
    if (!target.childrenById[id]) return;
    target.childrenById = omit(target.childrenById, id);
    target.targetInstance.updateChildren(Object.values(target.childrenById));
  }
}
