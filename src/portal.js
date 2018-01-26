import React, { Component } from 'react';
import PropTypes from 'prop-types';
import PortalConnector from './PortalConnector';

const portal = (
  targetName,
  updaterName = 'updateChild',
  idName = 'id'
) => PortalComponent => {
  class Portal extends Component {
    constructor(props) {
      super(props);
      this.state = { portalId: null };
    }
    componentWillMount() {
      const id = this.context.portalConnector.addChild(targetName, null);
      this.setState({ portalId: id });
    }

    componentWillUnmount() {
      this.unmounted = true;
      this.context.portalConnector.removeChild(this.state.portalId);
    }

    render() {
      if (!this.state.portalId) return null;
      const props = {
        ...this.props,
        [updaterName]: child => {
          if (this.unmounted) return;
          this.context.portalConnector.updateChild(this.state.portalId, child);
        },
        [idName]: this.state.portalId
      };
      return <PortalComponent {...props} />;
    }
  }

  Portal.contextTypes = {
    portalConnector: PropTypes.instanceOf(PortalConnector).isRequired
  };
  return Portal;
};

export default portal;
