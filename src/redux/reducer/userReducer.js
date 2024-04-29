import {
    USER_LOGIN,
    USER_LOGOUT,
    FETCH_USER_REQUEST,
    FETCH_USER_ERROR,
    FETCH_USER_SUCCESS,
    USER_REFRESH
} from '../actions/userAction';


const INITIAL_STATE = {
    user: {
        email: '',
        auth: null,
        token: ''
    },
    isLoading: false,
    isError: false
};

const userReducer = (state = INITIAL_STATE, action) => {

    switch (action.type) {

        case USER_LOGIN:

            return {

                ...state, count: state.count + 1,

            };
        case FETCH_USER_REQUEST:

            return {

                ...state,
                user: {
                    auth: false
                },
                isLoading: true,
                isError: false

            };
        case FETCH_USER_SUCCESS:
            return {
                ...state,
                user: {
                    email: action.data.email,
                    token: action.data.token,
                    auth: true
                },
                isLoading: false,
                isError: false
            };
        case FETCH_USER_ERROR:
            return {
                ...state,
                user: {
                    auth: false
                }
                ,
                isLoading: false,
                isError: true
            };

        case USER_LOGOUT:
            localStorage.removeItem('token')
            localStorage.removeItem('email')
            return {
                ...state,
                user: {
                    email: '',
                    token: '',
                    auth: false
                },
            };
        case USER_REFRESH:

            return {
                ...state,
                user: {
                    email: localStorage.getItem('email'),
                    token: localStorage.getItem('token'),
                    auth: true
                },
            };
        default: return state;

    }

};

export default userReducer;