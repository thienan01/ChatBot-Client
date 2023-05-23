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

const DELETE = async (_url, _body) => {
  let res = await $.ajax({
    type: "DELETE",
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

const UPLOAD = async (_url, file) => {
  return new Promise((resolve, reject) => {
    var data, xhr;

    data = new FormData();
    data.append("file", file);

    xhr = new XMLHttpRequest();
    let res;
    xhr.open("POST", _url, true);
    xhr.setRequestHeader("Authorization", "Token " + getCookie("token"));
    xhr.onreadystatechange = function (response) {
      if (response.target.readyState === 4) {
        resolve(JSON.parse(response.target.response));
      }
    };
    xhr.addEventListener("error", function (event) {
      reject(event);
    });
    xhr.send(data);
  });
};
const VOICE = async (_url, _body) => {
  let res = await $.ajax({
    type: "POST",
    url: _url,
    data: _body,
    dataType: "json",
    headers: {
      api_key: "8Q5DtBjxVwSAvgUymtivQP5e9TnRVBlU ",
      voice: "banmai",
    },
    contentType: "application/json; charset=utf-8",
  });
  return res;
};
export { GET, POST, DELETE, UPLOAD, VOICE };
