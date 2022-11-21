import {PostAPI} from '../../api';

export const postUser = async({username, password}) => {
    const respone = await PostAPI({params: `/api/user/login`, data: {username: username, password: password}});
    return respone;
}