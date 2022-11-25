import axios from "axios";

const URL = "https://chatbot-vapt.herokuapp.com";

export const PostAPI = ({ params, data }) => {
  // console.log('URL', URL + params);
  return axios
    .post(URL + params, {
      header: {   
        "Content-Type": "application/json",
      },
      data: data,
    })
    .then((respone) => {
      console.log("respone >>>", respone);
      return respone.data;
    });
};
