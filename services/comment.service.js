const httpStatus = require('http-status');
const { Comment } = require('../../../Materials/back-end/src/models');
const ApiError = require('../../../Materials/back-end/src/utils/ApiError');

/**
 * Create a comment
 * @param {Object} commentBody
 * @returns {Promise<Comment>}
**/
const createComment = async (commentBody) => {
  const comment = await Comment.create(commentBody);
  return comment;
};

/**
 * Query for comments
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryComments = async (filter, options) => {
  const comments = await Comment.paginate(filter, options);
  return comments;
};

/**
 * Get comment by id
 * @param {ObjectId} id
 * @returns {Promise<Comment>}
 */
const getCommentById = async (id) => {
  return Comment.findById(id);
};

/**
 * Update comment by id
 * @param {ObjectId} commentId
 * @param {Object} updateBody
 * @returns {Promise<Comment>}
**/
const updateCommentById = async (commentId, updateBody) => {
  const options = {
    new: true,
    omitUndefined: true
  }
  return await Comment.findByIdAndUpdate(mongoose.Types.ObjectId(commentId), updateBody, options);
};

// /**
//  * Delete comment by id
//  * @param {ObjectId} commentId
//  * @returns {Promise<Comment>}
//  */
// const deleteCommentById = async (commentId) => {
// };

module.exports = {
  createComment,
  queryComments,
  getCommentById,
  updateCommentById,
  // deleteCommentById,
};
