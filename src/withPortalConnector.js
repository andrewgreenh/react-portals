import PropTypes from 'prop-types';
import getContext from 'recompose/getContext';
import PortalConnector from './PortalConnector';

export default getContext({ portalConnector: PropTypes.instanceOf(PortalConnector).isRequired });
