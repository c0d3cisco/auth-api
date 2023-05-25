'use strict';

// // THIS IS THE STRETCH GOAL ...
// // It takes in a schema in the constructor and uses that instead of every collection
// // being the same and requiring their own schema. That's not very DRY!

class DataCollection {
  constructor(model) {
    this.model = model;
  }

  async get(id) {
    if (id) {
      return await this.model.findOne({ where: { id } });
    } else {
      return await this.model.findAll({});
    }
  }

  async create(record) {
    return await this.model.create(record);
  }

  async update(id, data) {
    const record = await this.model.findOne({ where: { id } });
    return await record.update(data);
  }

  async delete(id) {
    return await this.model.destroy({ where: { id } });
  }
}

module.exports = DataCollection;


// class DataCollection {

//   constructor(model) {
//     this.model = model;
//   }

//   get(id) {
//     if (id) {
//       return this.model.findOne({ where: { id } });
//     }
//     else {
//       return this.model.findAll({});
//     }
//   }

//   create(record) {
//     return this.model.create(record);
//   }

//   update(id, data) {
//     return this.model.findOne({ where: { id } })
//       .then(record => record.update(data));
//   }

//   delete(id) {
//     return this.model.destroy({ where: { id }});
//   }

// }

// module.exports = DataCollection;
