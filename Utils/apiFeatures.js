// This is API Features Class in which we implemented various functionilites
// like sorting,filtering ,limiting fields,paginating 

class APIFeatures {

    constructor(query, queryStr) {
        this.query = query;
        this.queryStr = queryStr;
    }

    filter() {
        const QueryObj = { ...this.queryStr };
        const excludedItems = ['sort', 'limit', 'page', 'fields'];

        excludedItems.forEach(el => delete QueryObj[el]);

        // 2). ADVANCED FILTERING
        let queryStr = JSON.stringify(QueryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

        this.query = this.query.find(JSON.parse(queryStr));
        return this;
    }

    sort() {
        if (this.queryStr.sort) {
            const sortBy = this.queryStr.sort.split(',').join(' ');
            this.query = this.query.sort(sortBy);
        }
        else {
            this.query = this.query.sort('-createdAt');
        }
        return this;
    }

    LimitingFields() {
        if (this.queryStr.fields) {
            const fields = this.queryStr.fields.split(',').join(' ');
            this.query = this.query.select(fields);
        }
        else {
            this.query = this.query.select('-__v');
        }
        return this;
    }

    Paginate() {
        const pages = this.queryStr.page * 1 || 1;
        const limit = this.queryStr.limit * 1 || 100;

        const skip = (pages - 1) * limit;

        this.query = this.query.skip(skip).limit(limit);

        return this;
    }


};

module.exports = APIFeatures;