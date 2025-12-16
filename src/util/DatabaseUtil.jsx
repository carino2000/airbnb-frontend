const serverAddr = "http://192.168.0.17:8080";

// 아이디
function idCheck(id) {
  return fetch(serverAddr + "/validate/id?id=" + id, {
    method: "get",
  }).then(function (response) {
    return response.json();
  });
}
// 이메일
function emailCheck(email) {
  return fetch(serverAddr + "/validate/email?email=" + email, {
    method: "get",
  }).then(function (response) {
    return response.json();
  });
}

function emailCodeCheck(email) {
  const data = { email };
  return fetch(serverAddr + "/validate/code", {
    method: "post",
    body: JSON.stringify(data),
    headers: {
      "Content-type": "application/json",
    },
  }).then(function (response) {
    return response.json();
  });
}

function insertAccount(data) {
  return fetch(serverAddr + "/accounts/register", {
    method: "post",
    body: JSON.stringify(data),
    headers: {
      "Content-type": "application/json",
    },
  }).then(function (response) {
    return response.json();
  });
}

function loginCheck(accountId, pw) {
  return fetch(serverAddr + "/accounts/login", {
    method: "post",
    body: JSON.stringify({
      accountId: accountId,
      pw: pw,
    }),
    headers: {
      "Content-type": "application/json",
    },
  }).then((res) => res.json());
}

function searchAccommodation(data) {
  const addr = `${serverAddr}/accommodations?destination=${data.destination}&checkInDate=${data.checkInDate}&checkOutDate=${data.checkOutDate}&guests=${data.guests}`;
  return fetch(addr, {
    method: "get",
    headers: {
      "Content-type": "application/json",
    },
  }).then((response) => response.json());
}

function createAccommodation(data) {
  return fetch(serverAddr + "/accommodations", {
    method: "post",
    body: JSON.stringify(data),
    headers: {
      Token: token,
      "Content-type": "application/json",
    },
  }).then((response) => response.json());
}

function createimages(data, accommodationId) {
  const formData = new FormData();
  data.map((item) => {
    formData.append("uri", item);
  });

  fetch(`${serverAddr}/${accommodationId}/images`, {
    method: "post",
    body: formData,
    headers: {
      Token: token,
    },
  }).then((response) => response.json());
}

function createTags(data) {}

function createAmenities(data) {}

export {
  idCheck,
  emailCheck,
  emailCodeCheck,
  loginCheck,
  insertAccount,
  createAccommodation,
  searchAccommodation,
};
