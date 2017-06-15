import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import PortalConnector from './PortalConnector';

const portal = (targetName, updaterName = 'updateChild', idName = 'id') => Component => {
  class Portal extends React.Component {
    constructor(props) {
      super(props);
      this.state = { portalId: null };
    }
    componentWillMount() {
      const id = this.context.portalConnector.addChild(targetName, null);
      this.setState({ portalId: id });
    }
    render() {
      if (!this.state.portalId) return null;
      const props = {
        ...this.props,
        [updaterName]: child => {
          if (_.isNil(child)) {
            this.context.portalConnector.removeChild(this.state.portalId);
            return;
          }
          this.context.portalConnector.updateChild(this.state.portalId, child);
        },
        [idName]: this.state.portalId,
      };
      return <Component {...props} />;
    }
  }

  Portal.contextTypes = {
    portalConnector: PropTypes.instanceOf(PortalConnector).isRequired,
  };
  return Portal;
};

export default portal;
