import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { connect } from 'react-redux';
import { useToasts } from 'react-toast-notifications';

const ErrorNotificationController = ({ loadingError }) => {
  const { addToast } = useToasts();

  useEffect(() => {
    if (loadingError) {
      addToast(loadingError, { appearance: 'error' });
    }
  }, [addToast, loadingError]);

  return null;
};

ErrorNotificationController.propTypes = {
  loadingError: PropTypes.string
};

export default connect(
  // mapStateToProps
  state => ({
    loadingError: state.show.error
  })
)(ErrorNotificationController);
