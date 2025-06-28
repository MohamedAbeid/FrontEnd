import { BASE_URL } from "./base_url.js";

const usersTableBody = document.querySelector("#usersTable tbody");
const token = localStorage.getItem("token");

async function fetchUsers() {
  try {
    const res = await fetch(`${BASE_URL}/users`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();

    if (data.data) {
      displayUsers(data.data);
    }
  } catch (err) {
    console.error(err);
  }
}

function displayUsers(users) {
  usersTableBody.innerHTML = "";
  users.forEach((user, index) => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${index + 1}</td>
      <td>${user.name}</td>
      <td>${user.email}</td>
      <td>${user.role}</td>
      <td>
        <button style="background-color: #db4444;
    padding: 8px;
    border-radius: 7px;
    border: none;
    margin: 10px 0;
    color: white;
    cursor: pointer;"; class="delete-btn" data-id="${user._id}">Delete</button>
        <button style="background-color: #0045ff;
    padding: 8px;
    border-radius: 7px;
    border: none;
    margin: 10px 0;
    color: white;
    cursor: pointer;" class="role-btn" data-id="${user._id}" data-role="${
      user.role
    }">Update Role</button>
      </td>
    `;

    usersTableBody.appendChild(row);
  });
}

usersTableBody.addEventListener("click", async (e) => {
  if (e.target.classList.contains("delete-btn")) {
    const userId = e.target.dataset.id;
    if (confirm("Are you sure you want to delete this user?")) {
      await deleteUser(userId);
    }
  }

  if (e.target.classList.contains("role-btn")) {
    const userId = e.target.dataset.id;
    const currentRole = e.target.dataset.role;

    let newRole = prompt(
      "Enter the new role (user/admin/manager):",
      currentRole
    );

    if (
      newRole &&
      ["user", "admin", "manager"].includes(newRole.toLowerCase())
    ) {
      await updateUserRole(userId, newRole.toLowerCase());
    } else {
      alert("Invalid role, allowed values: user, admin, manager");
    }
  }
});

async function deleteUser(userId) {
  try {
    const res = await fetch(`${BASE_URL}/users/${userId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.ok) {
      alert("User deleted successfully");
      fetchUsers();
    }
  } catch (err) {
    console.error(err);
  }
}

async function updateUserRole(userId, newRole) {
  try {
    const res = await fetch(`${BASE_URL}/users/${userId}/role`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ role: newRole }),
    });

    if (res.ok) {
      alert("Role updated successfully");
      fetchUsers();
    }
  } catch (err) {
    console.error(err);
  }
}

fetchUsers();
