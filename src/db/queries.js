const pool = require("./pool");
const bcrypt = require("bcryptjs");

async function createNewUser(
  userEmail,
  firstName,
  lastName,
  password,
  isAdmin,
) {
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const userData = [
      userEmail,
      firstName,
      lastName,
      hashedPassword,
      false,
      isAdmin,
    ];
    const query = `INSERT INTO user_table (email, first_name, last_name, password, member_status, is_admin) VALUES ($1,$2,$3,$4,$5,$6)`;
    await pool.query(query, userData);
  } catch (error) {
    console.error(error);
  }
}

async function updateMemberStatus(userId) {
  try {
    const query = `UPDATE user_table SET member_status = TRUE WHERE id = ($1)`;
    await pool.query(query, [userId]);
  } catch (error) {
    console.error(error);
  }
}

async function createNewMessage(messageData) {
  // const messageData = [
  //   req.user.id,
  //   req.body.newMessage,
  //   req.user.member_status,
  // ];

  const query = `INSERT INTO message_table (user_id, message, member_status, date) VALUES ($1, $2, $3, $4)`;
  await pool.query(query, [...messageData, new Date()]);
}

async function getAllMessages() {
  const query = `SELECT * FROM full_message_data`;
  const { rows } = await pool.query(query);
  return rows;
}

async function deleteMessage(messageId) {
  const query = `DELETE FROM message_table WHERE id = $1`;
  await pool.query(query, [messageId]);
}

module.exports = {
  createNewUser,
  updateMemberStatus,
  createNewMessage,
  getAllMessages,
  deleteMessage,
};
