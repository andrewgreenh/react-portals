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

    it('should add the given argument behind the name', () => {
      // arrange
      const target = {};

      // act
      portalConnector.registerTarget('name', target);

      // assert
      expect(portalConnector.targetsByName.name).toBe(target);
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
      const target = { updateChild: jest.fn() };
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
      const target = { updateChild: jest.fn() };
      portalConnector.registerTarget('name', target);
      const child = {};

      // act
      const id = portalConnector.addChild('name', child);

      // assert
      expect(target.updateChild).toHaveBeenCalledWith(id, child);
    });
  });

  describe('updateChild', () => {
    it('should throw if an incorrect id is passed', () => {
      // act + assert
      expect(() => portalConnector.updateChild('id', {})).toThrow();
    });

    it('should call updateChild on the correct target', () => {
      // arrange
      const target = { updateChild: jest.fn() };
      portalConnector.registerTarget('name', target);
      const child = {};
      const id = portalConnector.addChild('name', child);
      const secondChild = {};

      // act
      portalConnector.updateChild(id, secondChild);

      // assert
      expect(target.updateChild).toHaveBeenCalledTimes(2);
      expect(target.updateChild).toHaveBeenCalledWith(id, secondChild);
    });
  });

  describe('removeChild', () => {
    it('should throw if an incorrect id is passed', () => {
      // act + assert
      expect(() => portalConnector.updateChild('id')).toThrow();
    });

    it('should call updateChild on the correct target with null', () => {
      // arrange
      const target = { updateChild: jest.fn() };
      portalConnector.registerTarget('name', target);
      const child = {};
      const id = portalConnector.addChild('name', child);

      // act
      portalConnector.removeChild(id);

      // assert
      expect(target.updateChild).toHaveBeenCalledTimes(2);
      expect(target.updateChild).toHaveBeenCalledWith(id, null);
    });
  });
});
