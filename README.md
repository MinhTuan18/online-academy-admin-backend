# OnlineAcademy
## API Docs

### Categories
GET: /api/categories/ : get all categories
GET: /api/categories/:id : get category with ID
POST: /api/categories/ : add new category
POST: /api/categories/:id : update category
DELETE: /api/categories/:id : delete category

### Courses
GET: /api/courses/ : get all courses
GET: /api/courses/:id : get course with ID
POST: /api/courses/ : add new course
POST: /api/courses/:id : update course
DELETE: /api/courses/:id : delete course
GET: /api/courses/category/:id : get list course by categoryID
GET: /api/courses/search/:courseTitle : get list course by title with full-text-search
