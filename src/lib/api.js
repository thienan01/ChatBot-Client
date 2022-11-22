import axios from "axios";

const URL = "http://localhost:8080";

export const PostAPI = ({ params, data }) => {
  // console.log('URL', URL + params);
  return axios
    .post(URL + params, {
      header: {
        "Content-Type": "application/json",
      },
      data: JSON.stringify(data),
    })
    .then((respone) => {
      console.log("respone >>>", respone);
      return respone.data;
    });
};
