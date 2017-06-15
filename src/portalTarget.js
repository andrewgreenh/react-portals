import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { getContext, compose, wrapDisplayName, setDisplayName } from 'recompose';
import PortalConnector from './PortalConnector';

const portalTarget = name => Component => {
  class PortalTarget extends React.Component {
    constructor(props) {
      super(props);
      this.state = { childrenById: null };
    }
    componentWillMount() {
      this.props.portalConnector.registerTarget(name, this);
      this._temporaryChildrenById = {};
    }

    componentWillUnmount() {
      this.props.portalConnector.removeTarget(name);
    }

    render() {
      return <Component>{_.values(this.state.childrenById)}</Component>;
    }

    updateChild(id, child) {
      if (_.isNil(child)) {
        this._temporaryChildrenById = _.omit(this._temporaryChildrenById, [id]);
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
