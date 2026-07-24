class BaseRepository {
  constructor(model) {
    this.model = model;
  }

  /*
  |--------------------------------------------------------------------------
  | Create
  |--------------------------------------------------------------------------
  */

  async create(data) {
    return this.model.create(data);
  }

  /*
  |--------------------------------------------------------------------------
  | Find By Id
  |--------------------------------------------------------------------------
  */

  async findById(id, populate = "", select = "") {
    return this.model
      .findById(id)
      .select(select)
      .populate(populate);
  }

  /*
  |--------------------------------------------------------------------------
  | Find By Id With Populate
  |--------------------------------------------------------------------------
  */

  async findByIdWithPopulate(
    id,
    populate = [],
    select = ""
  ) {
    return this.model
      .findById(id)
      .select(select)
      .populate(populate);
  }

  /*
  |--------------------------------------------------------------------------
  | Find Active By Id
  |--------------------------------------------------------------------------
  */

  async findActiveById(
    id,
    populate = "",
    select = ""
  ) {
    return this.model
      .findOne({
        _id: id,
        isDeleted: false,
      })
      .select(select)
      .populate(populate);
  }

  /*
  |--------------------------------------------------------------------------
  | Find Active By Id With Populate
  |--------------------------------------------------------------------------
  */

  async findActiveByIdWithPopulate(
    id,
    populate = [],
    select = ""
  ) {
    return this.model
      .findOne({
        _id: id,
        isDeleted: false,
      })
      .select(select)
      .populate(populate);
  }

  /*
  |--------------------------------------------------------------------------
  | Find One
  |--------------------------------------------------------------------------
  */

  async findOne(
    filter = {},
    populate = "",
    select = ""
  ) {
    return this.model
      .findOne(filter)
      .select(select)
      .populate(populate);
  }

  /*
  |--------------------------------------------------------------------------
  | Find One With Populate
  |--------------------------------------------------------------------------
  */

  async findOneWithPopulate(
    filter = {},
    populate = [],
    select = ""
  ) {
    return this.model
      .findOne(filter)
      .select(select)
      .populate(populate);
  }

  /*
  |--------------------------------------------------------------------------
  | Find
  |--------------------------------------------------------------------------
  */

  async find(
    filter = {},
    populate = "",
    select = ""
  ) {
    return this.model
      .find(filter)
      .select(select)
      .populate(populate);
  }

  /*
  |--------------------------------------------------------------------------
  | Find With Populate
  |--------------------------------------------------------------------------
  */

  async findWithPopulate(
    filter = {},
    populate = [],
    select = ""
  ) {
    return this.model
      .find(filter)
      .select(select)
      .populate(populate);
  }

  /*
  |--------------------------------------------------------------------------
  | Find Active
  |--------------------------------------------------------------------------
  */

  async findActive(
    filter = {},
    populate = "",
    select = ""
  ) {
    return this.model
      .find({
        ...filter,
        isDeleted: false,
      })
      .select(select)
      .populate(populate);
  }

  /*
  |--------------------------------------------------------------------------
  | Update
  |--------------------------------------------------------------------------
  */

  async update(
    id,
    data,
    options = {}
  ) {
    return this.model.findByIdAndUpdate(
      id,
      data,
      {
        new: true,
        runValidators: true,
        ...options,
      }
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Soft Delete
  |--------------------------------------------------------------------------
  */

  async softDelete(
    id,
    updatedBy = null
  ) {
    const updateData = {
      isDeleted: true,
    };

    if (updatedBy) {
      updateData.updatedBy = updatedBy;
    }

    return this.model.findByIdAndUpdate(
      id,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Restore
  |--------------------------------------------------------------------------
  */

  async restore(
    id,
    updatedBy = null
  ) {
    const updateData = {
      isDeleted: false,
    };

    if (updatedBy) {
      updateData.updatedBy = updatedBy;
    }

    return this.model.findByIdAndUpdate(
      id,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Exists
  |--------------------------------------------------------------------------
  */

  async exists(filter = {}) {
    return this.model.exists(filter);
  }

  /*
  |--------------------------------------------------------------------------
  | Count
  |--------------------------------------------------------------------------
  */

  async count(filter = {}) {
    return this.model.countDocuments(filter);
  }

  /*
  |--------------------------------------------------------------------------
  | Paginate
  |--------------------------------------------------------------------------
  */

  async paginate({
    filter = {},
    page = 1,
    limit = 10,
    sort = { createdAt: -1 },
    populate = "",
    select = "",
  }) {
    page = Number(page);
    limit = Number(limit);

    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.model
        .find(filter)
        .select(select)
        .populate(populate)
        .sort(sort)
        .skip(skip)
        .limit(limit),

      this.model.countDocuments(filter),
    ]);

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1,
      },
    };
  }

  /*
  |--------------------------------------------------------------------------
  | Paginate Active
  |--------------------------------------------------------------------------
  */

  async paginateActive({
    filter = {},
    page = 1,
    limit = 10,
    sort = { createdAt: -1 },
    populate = "",
    select = "",
  }) {
    return this.paginate({
      filter: {
        ...filter,
        isDeleted: false,
      },
      page,
      limit,
      sort,
      populate,
      select,
    });
  }
}

export default BaseRepository;