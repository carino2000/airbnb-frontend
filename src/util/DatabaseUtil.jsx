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

function loginCheck(id, pw) {
  const data = { id, pw };
  return fetch(serverAddr + "/account/log-in", {
    method: "post",
    body: JSON.stringify(data),
    headers: {
      "Content-type": "application/json",
    },
  }).then(function (response) {
    return response.json();
  });
}

function addBulkExpense(data) {
  const value = {
    accountId: data.accountId,
    items: [...data.payment],
  };

  return fetch(serverAddr + "/expense/insert/bulk", {
    method: "post",
    body: JSON.stringify(value),
    headers: {
      Token: data.token,
      "Content-type": "application/json",
    },
  }).then((response) => response.json());
}

function addExpense(data) {
  return fetch(serverAddr + "/expense/insert/one", {
    method: "post",
    body: JSON.stringify(data),
    headers: {
      Token: token,
      "Content-type": "application/json",
    },
  }).then((response) => response.json());
}

export {
  idCheck,
  emailCheck,
  emailCodeCheck,
  loginCheck,
  insertAccount,
  addExpense,
  addBulkExpense,
};
