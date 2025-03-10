import React from 'react';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle
} from '@material-ui/core';
import PropTypes from 'prop-types';

const ConfirmationDialog = ({ open, onClose, onConfirm, title, message }) => {
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
                <DialogContentText>{message}</DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary">
                    No
                </Button>
                <Button onClick={onConfirm} color="secondary" autoFocus>
                    Yes
                </Button>
            </DialogActions>
        </Dialog>
    );
};

ConfirmationDialog.propTypes = {
    open: PropTypes.bool,
    onClose: PropTypes.func,
    onConfirm: PropTypes.func,
    title: PropTypes.string,
    message: PropTypes.string
};

export default ConfirmationDialog;
