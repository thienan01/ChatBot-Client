import $ from "jquery";

const GET = async (_url) => {
  let res = await $.get({
    url: _url,
    dataType: "json",
    headers: {
      Authorization:
        "Token eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjp7InBhc3N3b3JkIjoiMTIzNDU2Iiwic2VjcmV0S2V5IjoiQTRGQUI5RjktNjY0Qi00NDZELTgwQjUtRTlCMDg5RjNGNTAwIiwiaHR0cFN0YXR1cyI6Ik9LIiwiaWQiOm51bGwsImZ1bGxuYW1lIjoiQURNSU4iLCJleGNlcHRpb25Db2RlIjpudWxsLCJ1c2VybmFtZSI6ImFkbWluIiwidG9rZW4iOiIxNjY4NzY1MTA4OTE2In19.NZueH_vbCwHSByqalbdOosM31tkqrfJ5su03-Hwh3c4",
    },
    "Content-Type": "application/json",
  });
  return res;
};

const POST = async (_url, _body) => {
  let res = await $.ajax({
    type: "POST",
    url: _url,
    data: _body,
    headers: {
      Authorization:
        "Token eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjp7InBhc3N3b3JkIjoiMTIzNDU2Iiwic2VjcmV0S2V5IjoiQTRGQUI5RjktNjY0Qi00NDZELTgwQjUtRTlCMDg5RjNGNTAwIiwiaHR0cFN0YXR1cyI6Ik9LIiwiaWQiOm51bGwsImZ1bGxuYW1lIjoiQURNSU4iLCJleGNlcHRpb25Db2RlIjpudWxsLCJ1c2VybmFtZSI6ImFkbWluIiwidG9rZW4iOiIxNjY4NzY1MTA4OTE2In19.NZueH_vbCwHSByqalbdOosM31tkqrfJ5su03-Hwh3c4",
    },
  });
  return res;
};
export { GET, POST };
