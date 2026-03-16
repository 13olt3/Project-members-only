const pool = require("./pool");
const bcrypt = require("bcryptjs");

async function createNewUser(userEmail, firstName, lastName, password) {
  console.log(`Queiry: ${password}`);
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const userData = [userEmail, firstName, lastName, hashedPassword, false];
    const query = `INSERT INTO user_table (email, first_name, last_name, password, member_status) VALUES ($1,$2,$3,$4,$5)`;
    await pool.query(query, userData);
  } catch (error) {
    console.error(error);
  }
}

async function updateMemberStatus(userId) {}

module.exports = { createNewUser, updateMemberStatus };
