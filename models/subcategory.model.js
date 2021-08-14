const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const SubCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      index: true,
    },
    category: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Category',
      required: [true, 'Parent Category Is Required'],
    },
    courses: {
      type: [{ type: mongoose.SchemaTypes.ObjectId, ref: 'Course' }],
      default: [],
    },
    thumbnailImageUrl: {
      type: String,
      default: '',
    }
  },
  {
    timestamps: true,
    collection: 'subcategories',
  }
);

// CategorySchema.statics.getAllCategory = async function () {
//   const categories = await this.find();
//   return categories;
// }

// CategorySchema.statics.getCategoryById = async function (categoryID) {
//   /* return this.findOne({_id: categoryID })
//     .then((value) => {
//       return value;
//     })
//     .catch((err) => {
//       throw err;
//     }); */

//     const category = await this.findOne({_id: categoryID});
//     return category;
// };

// CategorySchema.statics.updateCategory = async function (id, categoryName) {
//   const result = await this.findByIdAndUpdate({_id: id}, {name: categoryName}, {new: true});
//   return result;
// }

// CategorySchema.statics.deleteCategory = async function (id) {
//   const result = await this.findByIdAndDelete(id);
//   return result;
// }

SubCategorySchema.set('toObject', { getters: true });
SubCategorySchema.set('toJSON', { getters: true });
SubCategorySchema.plugin(mongoosePaginate);


const SubCategory = mongoose.model('SubCategory', SubCategorySchema);

module.exports = SubCategory;