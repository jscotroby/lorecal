import history from '../../history';
import ACTIONS from './actions';
import {get, post} from './helper';


export const verifyLoginStatus = () =>
        dispatch =>
            get('user/me')
                .then(response => {
                    dispatch({
                        type: ACTIONS.LOGIN,
                        payload: {
                            currentUserId: response.id,
                            currentUsername: response.username
                        }
                    });
                })
                .catch(() => {
                    dispatch({
                        type: ACTIONS.LOGOUT
                    });
                })
                .finally(() => {
                    dispatch({
                        type: ACTIONS.LOGIN_STATUS_CONFIRMED
                    })
                });

export const login = (username, password, to) =>
        dispatch =>
            post('login', {username, password})
                .then(user => {
                    dispatch({
                        type: ACTIONS.LOGIN,
                        payload: {
                            currentUserId: user.id,
                            currentUsername: user.username
                        }
                    });
                })
                .then(() => history.push(to || '/'))
                .catch(() => {
                    dispatch({
                        type: ACTIONS.LOGIN_FAILURE
                    });
                });

export const logout = () =>
        dispatch =>
            get('logout')
                .then(() => {
                    dispatch({
                        type: ACTIONS.LOGOUT
                    });
                })
                .then(() => history.push('/'));