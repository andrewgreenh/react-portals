import bindAll from 'lodash/bindAll';

export default class PortalConnector {
  constructor() {
    this.nextId = 1;
    this.targetsByName = {};
    this.targetsById = {};

    bindAll(this, ['registerTarget', 'removeTarget', 'addChild', 'updateChild', 'removeChild']);
  }

  registerTarget(name, portalTarget) {
    if (this.targetsByName[name]) {
      throw Error(`Portal with name ${name} already existing.`);
    }
    this.targetsByName[name] = portalTarget;
  }

  removeTarget(name) {
    delete this.targetsByName[name];
  }

  addChild(targetName, child) {
    const id = this.nextId++;
    const target = this.targetsByName[targetName];
    if (!target) throw new Error(`No target with name ${targetName} found.`);
    this.targetsById[id] = target;
    target.updateChild(id, child);
    return id;
  }

  updateChild(id, child) {
    const target = this.targetsById[id];
    if (!target) throw new Error(`No target with id ${id} found.`);
    target.updateChild(id, child);
  }

  removeChild(id) {
    const target = this.targetsById[id];
    if (!target) throw new Error(`No target with id ${id} found.`);
    target.updateChild(id, null);
  }
}
