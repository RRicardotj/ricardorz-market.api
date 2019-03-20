const Handler = require('../Handler');
const Department = require('../../models/Deparment');
const Category = require('../../models/Category');

class DepartmentController extends Handler {
  constructor(model = Department, language) {
    super(model, language);

    this.getAllDeparmentsWithCategories = this.getAllDeparmentsWithCategories.bind(this);
  }

  async getAllDeparmentsWithCategories() {
    this.model.hasMany(Category, { as: 'categories', foreignKey: 'department_id' });
    const deparments = await this.model.findAll({
      include: [{ model: Category, as: 'categories' }],
    });

    return deparments;
  }
}

module.exports = DepartmentController;
