import React, { Component } from 'react';
import PropTypes from 'prop-types';
import compose from 'recompose/compose';
import getContext from 'recompose/getContext';
import setDisplayName from 'recompose/setDisplayName';
import wrapDisplayName from 'recompose/wrapDisplayName';
import PortalConnector from './PortalConnector';

const portalTarget = name => PortalTargetComponent => {
  class PortalTarget extends Component {
    constructor(props) {
      super(props);
      this.state = { childrenById: {} };
    }
    componentWillMount() {
      this.props.portalConnector.registerTarget(name, this);
      this._temporaryChildrenById = {};
    }

    componentWillUnmount() {
      this.props.portalConnector.removeTarget(name);
    }

    render() {
      return (
        <PortalTargetComponent>
          {Object.values(this.state.childrenById)}
        </PortalTargetComponent>
      );
    }

    updateChild(id, child) {
      if (child == null) {
        const clonedChildrenById = Object.assign({}, this._temporaryChildrenById);
        delete clonedChildrenById[id];
        this._temporaryChildrenById = clonedChildrenById;
        this.setState({
          childrenById: this._temporaryChildrenById,
        });
      } else {
        this._temporaryChildrenById = {
          ...this._temporaryChildrenById,
          [id]: child,
        };
        this.setState({
          childrenById: this._temporaryChildrenById,
        });
      }
    }
  }

  PortalTarget.propTypes = { portalConnector: PropTypes.instanceOf(PortalConnector) };

  return compose(
    setDisplayName(wrapDisplayName(Component, 'portalTarget')),
    getContext({ portalConnector: PropTypes.instanceOf(PortalConnector) }),
  )(PortalTarget);
};

export default portalTarget;
