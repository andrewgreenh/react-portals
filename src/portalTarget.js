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
      this.state = { children: [] };
    }
    componentWillMount() {
      this.props.portalConnector.registerTarget(name, this);
    }

    componentWillUnmount() {
      this.props.portalConnector.removeTarget(name);
    }

    render() {
      return <PortalTargetComponent>{this.state.children}</PortalTargetComponent>;
    }

    updateChildren(children) {
      this.setState({ children });
    }
  }

  PortalTarget.propTypes = { portalConnector: PropTypes.instanceOf(PortalConnector) };

  return compose(
    setDisplayName(wrapDisplayName(Component, 'portalTarget')),
    getContext({ portalConnector: PropTypes.instanceOf(PortalConnector) }),
  )(PortalTarget);
};

export default portalTarget;
