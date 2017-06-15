import PropTypes from 'prop-types';
import withContext from 'recompose';
import PortalConnector from './PortalConnector';

export const portalConnector = new PortalConnector();

const PortalProvider = withContext(
  { portalConnector: PropTypes.instanceOf(PortalConnector) },
  () => ({ portalConnector }),
)(x => x.children);

export default PortalProvider;
