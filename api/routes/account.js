const express = require('express');
const router = express.Router();
const Account = require('../model/account'); 

router.post('/accounts', async (req, res) => {
  try {
    const { firstName, lastName, email, country, province, city, password, mobileNumber } = req.body;
    
   
    const account = new Account({
      firstName,
      lastName,
      email,
      country,
      province,
      city,
      password,
      mobileNumber
    });
    await account.save();

    
    res.status(201).json(account);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
