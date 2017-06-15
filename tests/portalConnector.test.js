import _ from 'lodash';
import PortalConnector from '../src/PortalConnector';

let portalConnector;

beforeEach(() => {
  portalConnector = new PortalConnector();
});

describe('PortalConnector', () => {
  describe('registerTarget', () => {
    it('should throw when adding a target with the same name twice', () => {
      // arrange
      portalConnector.registerTarget('name', {});

      // act + assert
      expect(() => portalConnector.registerTarget('name', {})).toThrow();
    });

    it('should add the given target to targetsByName', () => {
      // arrange
      const targetInstance = {};

      // act
      portalConnector.registerTarget('name', targetInstance);

      // assert
      expect(portalConnector.targetsByName.name.targetInstance).toBe(targetInstance);
      expect(portalConnector.targetsByName.name.childrenById).toEqual({});
    });
  });

  describe('removeTarget', () => {
    it('should not fail when removing non existent target', () => {
      // act
      portalConnector.removeTarget('name');
    });

    it('should remove target by name', () => {
      // arrange
      const target = {};
      portalConnector.registerTarget('name', target);

      // act
      portalConnector.removeTarget('name');

      // assert
      expect(portalConnector.targetsByName.name).toBeUndefined();
    });
  });

  describe('addChild', () => {
    it('should create unique ids', () => {
      // arrange
      const target = { updateChildren: jest.fn() };
      portalConnector.registerTarget('name', target);
      const ids = new Set();

      // act
      _.times(10000, () => ids.add(portalConnector.addChild('name', {})));

      // assert
      expect(ids.size).toBe(10000);
    });

    it('should throw when no target with name exists', () => {
      // act + assert
      expect(() => portalConnector.addChild('name', {})).toThrow();
    });

    it('should call updateChild on the correct target', () => {
      // arrange
      const target = { updateChildren: jest.fn() };
      portalConnector.registerTarget('name', target);
      const child = { id: 'first' };

      // act
      portalConnector.addChild('name', child);

      // assert
      expect(target.updateChildren).toHaveBeenCalledWith([child]);
    });

    it('should add new children after old ones', () => {
      // arrange
      const target = { updateChildren: jest.fn() };
      portalConnector.registerTarget('name', target);
      const children = [{ id: 1 }, { id: 2 }, { id: 3 }];

      // act
      children.forEach(child => portalConnector.addChild('name', child));

      // assert
      expect(target.updateChildren).toHaveBeenCalledWith(children);
    });

    it('should not change order on update', () => {
      // arrange
      const target = { updateChildren: jest.fn() };
      portalConnector.registerTarget('name', target);
      const children = [{ id: 1 }, { id: 2 }, { id: 3 }];
      const ids = children.map(child => portalConnector.addChild('name', child));

      // act
      portalConnector.updateChild(ids[0], { id: 1 });
      // assert
      expect(target.updateChildren).toHaveBeenCalledWith(children);
    });
  });

  describe('updateChild', () => {
    it('should throw if an incorrect id is passed', () => {
      // act + assert
      expect(() => portalConnector.updateChild('id', {})).toThrow();
    });

    it('should call updateChild on the correct target', () => {
      // arrange
      const target = { updateChildren: jest.fn() };
      portalConnector.registerTarget('name', target);
      const child = { id: 'first' };
      const id = portalConnector.addChild('name', child);
      const updatedChild = { id: 'updated' };

      // act
      portalConnector.updateChild(id, updatedChild);

      // assert
      expect(target.updateChildren).toHaveBeenCalledTimes(2);
      expect(target.updateChildren).toHaveBeenCalledWith([updatedChild]);
    });
  });

  describe('removeChild', () => {
    it('should throw if an incorrect id is passed', () => {
      // act + assert
      expect(() => portalConnector.updateChild('id')).toThrow();
    });

    it('should call updateChildren on the correct target with null', () => {
      // arrange
      const target = { updateChildren: jest.fn() };
      portalConnector.registerTarget('name', target);
      const child = {};
      const id = portalConnector.addChild('name', child);

      // act
      portalConnector.removeChild(id);

      // assert
      expect(target.updateChildren).toHaveBeenCalledTimes(2);
      expect(target.updateChildren).toHaveBeenCalledWith([]);
    });
  });
});
