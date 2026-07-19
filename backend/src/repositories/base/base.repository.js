class BaseRepository {
  constructor(model) {
    this.model = model;
  }

  async create(data) {
    return this.model.create(data);
  }

  async findById(id) {
    return this.model.findById(id);
  }

  async findOne(filter = {}) {
    return this.model.findOne(filter);
  }

  async find(filter = {}, options = {}) {
    return this.model.find(filter, null, options);
  }

  async update(id, data) {
    return this.model.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
  }

  async delete(id) {
    return this.model.findByIdAndDelete(id);
  }

  async softDelete(id) {
    return this.model.findByIdAndUpdate(
      id,
      { isDeleted: true },
      {
        new: true,
      }
    );
  }

  async restore(id) {
    return this.model.findByIdAndUpdate(
      id,
      { isDeleted: false },
      {
        new: true,
      }
    );
  }

  async exists(filter) {
    return this.model.exists(filter);
  }

  async count(filter = {}) {
    return this.model.countDocuments(filter);
  }

  async paginate(
    filter = {},
    page = 1,
    limit = 10,
    sort = { createdAt: -1 }
  ) {
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.model
        .find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit),

      this.model.countDocuments(filter),
    ]);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
}

export default BaseRepository;