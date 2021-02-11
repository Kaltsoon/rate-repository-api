const recursiveCursorWhere = (builder, comparisons, composites) => {
  const comparison = comparisons[0];
  composites = [comparison, ...composites];
  const op = comparison.order === 'asc' ? '>' : '<';

  builder.andWhere(function() {
    this.where(comparison.column, op, comparison.value);

    if (comparisons.length > 1) {
      this.orWhere(function() {
        for (const composite of composites) {
          this.andWhere(composite.column, composite.value);
        }

        this.andWhere(function() {
          recursiveCursorWhere(this, comparisons.slice(1), composites);
        });
      });
    }
  });
};

const cursorWhere = (builder, orderBy, cursor) => {
  if (!cursor) {
    return builder;
  }

  const comparisons = orderBy.map(({ column, order }, index) => ({
    column,
    order,
    value: cursor[index],
  }));

  recursiveCursorWhere(builder, comparisons, []);
};

export default cursorWhere;
