import PropTypes from 'prop-types';
import _ from 'lodash';
import { withContext } from 'recompose';
import PortalConnector from './PortalConnector';

export const portalConnector = new PortalConnector();

const PortalProvider = withContext(
  { portalConnector: PropTypes.instanceOf(PortalConnector) },
  () => ({ portalConnector })
)(_.property('children'));

export default PortalProvider;
