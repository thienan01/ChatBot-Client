import $ from "jquery";
import { getCookie } from "./GetSetCookie";
const GET = async (_url) => {
  let res = await $.get({
    url: _url,
    dataType: "json",
    headers: {
      Authorization: "Token " + getCookie("token"),
    },
    contentType: "application/json",
  });
  return res;
};

const POST = async (_url, _body) => {
  let res = await $.ajax({
    type: "POST",
    url: _url,
    data: _body,
    dataType: "json",
    headers: {
      Authorization: "Token " + getCookie("token"),
    },
    contentType: "application/json; charset=utf-8",
  });
  return res;
};

const DELETE = async (_url) => {
  let res = await $.ajax({
    type: "DELETE",
    url: _url,
    dataType: "json",
    headers: {
      Authorization: "Token " + getCookie("token"),
    },
    contentType: "application/json",
  });
  return res;
};

export { GET, POST, DELETE};


