const serializeCursor = data =>
  Buffer.from(JSON.stringify(data)).toString('base64');

const parseCursor = cursor => {
  try {
    return JSON.parse(Buffer.from(cursor, 'base64').toString('ascii'));
  } catch {
    return undefined;
  }
};

const getComparator = orderDirection => (orderDirection === 'asc' ? '>' : '<');

const createPaginatedQuery = async (getQuery, options = {}) => {
  const {
    first = 40,
    after,
    orderDirection = 'asc',
    orderColumn,
    idColumn = 'id',
  } = options;

  const parsedCursor = after ? parseCursor(after) : undefined;

  let paginatedQuery = getQuery();

  if (parsedCursor) {
    const [idValue, orderColumnValue] = parsedCursor;

    paginatedQuery = paginatedQuery
      .where(orderColumn, getComparator(orderDirection), orderColumnValue)
      .orWhere(qb =>
        qb
          .where(orderColumn, '=', orderColumnValue)
          .andWhere(idColumn, getComparator(orderDirection), idValue),
      );
  }

  paginatedQuery = paginatedQuery
    .orderBy([
      { column: orderColumn, order: orderDirection },
      { column: idColumn, order: orderDirection },
    ])
    .limit(first + 1);

  const totalCount = await getQuery().count('*', { as: 'count' });
  const data = await paginatedQuery;

  const edges = data.slice(0, first).map(d => ({
    node: d,
    cursor: serializeCursor([d[idColumn], d[orderColumn]]),
  }));

  return {
    pageInfo: {
      totalCount: totalCount[0]['count'],
      hasNextPage: data.length > first,
    },
    edges,
  };
};

export default createPaginatedQuery;
