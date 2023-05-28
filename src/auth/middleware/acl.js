'use strict';

module.exports = (capability) => {

  return (req, res, next) => {

    try {
      if (req.user.capabilities.includes(capability)) {
        console.log(`1****************${req.user.capabilities}****************`);
        next();
      }
      else {
        console.log(`2****************${req.user.capabilities}****************`);
        next('Access Denied');
      }
    } catch (e) {
      console.error(e.message);
      next('Invalid Login');
    }

  }

}
